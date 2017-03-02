var builder = require('botbuilder');
var yelputil = require('../util/yelp');

module.exports = [
    function (session) {
        session.beginDialog("location");
    },
    function (session, results) {
        if (results)
        {
            session.send("Thanks, got it! Here's 10 recommendations from Yelp close to you that are open now:");
            yelputil.getYelpRecommendations(results.response.geo.latitude, results.response.geo.longitude)
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