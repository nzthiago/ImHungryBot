var builder = require('botbuilder');
var yelputil = require('../util/yelp');
var util = require('../util/util');

module.exports = [
    function (session) {
        var greeting = util.timeBasedGreeting();
        session.send(greeting.message);
        // prompt for search option
        builder.Prompts.text(
            session,
            'So, what kind of place are you looking for? Tell me something like ' + greeting.categories.join(', ') + ', or other words:');
    },
    function (session, results){
        if (results.response.entity){
            session.dialogData.answer = results.response.entity;
        }
        session.beginDialog("location");
    },
    function (session, results) {
        if (results)
        {
            session.send("Thanks, got it! Here's recommendations from Yelp close to you that are open now that match your choice:");
            yelputil.getYelpRecommendations(session.dialogData.answer, results.response.geo.latitude, results.response.geo.longitude)
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