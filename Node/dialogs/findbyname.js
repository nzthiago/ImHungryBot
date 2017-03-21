var builder = require('botbuilder');
var yelputil = require('../util/yelp');
var location = require('./location');

module.exports = [
    function (session, args, next) {
        //Only ask again if it's been more than 5 mins
        if (yelputil.ShouldAskForLocation(session.userData.lastAskedForLocation)) {
            location.beginDialog(session);
        } else {
            next();
        }
    },
    function (session) {
        if (session.userData && (session.userData.lat & session.userData.long))
        {
            builder.Prompts.text(session, 'So, what is the place called?');
        }
        else
        {
            session.send('Couldn\'t get your location... Better luck next time!');
            session.replaceDialog('/');
        }
    },
    function (session, results) {
        if (results.response) {
            session.send('Got it! Here\'s top recommendations from Yelp close to you that *are open now* that match \'' + results.response + '\':');
            yelputil.getYelpRecommendations(results.response, session.userData.lat, session.userData.long, 40000)
            .then(places => {
                var cards = yelputil.getCardsFromPlaces(session, places);
                var reply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);
                session.send(reply);
                session.replaceDialog('/');
            })
        } else {
            session.replaceDialog('/');
        }
    }
]