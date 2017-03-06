var builder = require('botbuilder');
var yelputil = require('../util/yelp');
var location = require('./location');

module.exports = [
    function (session, args, next) {
        //if (!session.userData.lastAskedForLocation 
          // || ((new Date) - session.userData.lastAskedForLocation) > 300000) {
        location.beginDialog(session);
        //} else {
        //     next();
        //}
    },
    function (session) {
        if (session.userData.lat & session.userData.long)
        {
            session.send("Thanks, got it! Here's the top recommendations from Yelp close to you that are open now:");
            yelputil.getYelpRecommendations(null, session.userData.lat, session.userData.long)
            .then(places => {
                var cards = yelputil.getCardsFromPlaces(session, places);
                var reply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);
                session.send(reply);
                session.replaceDialog('/');
            })
        }
        else
        {
            session.send('Couldn\'t get your location... Better luck next time!');
            session.replaceDialog('/');
        }
    }
]