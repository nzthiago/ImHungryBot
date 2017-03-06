var builder = require('botbuilder');
var yelputil = require('../util/yelp');

module.exports = [
    function (session, args, next) {
        //check if asked for location more than 5 minutes ago
        if (!session.userData.lastAskedForLocation 
           || ((new Date) - session.userData.lastAskedForLocation) > 300000) {
                 session.beginDialog("location");
        } else {
             next();
        }
    },
    function (session){
        if (session.userData.lat & session.userData.long) {
            // prompt for search option
            builder.Prompts.choice(
                session,
                'So, what kind of place are you looking for? Just write me your preference, or choose from one of these popular ones:',
                ['Diner', 'Pub', 'Hotel Bar', 'Breakfast', 'Café', 'Brunch', 'Italian', 'Chinese', 'Japanese'],
                {
                    maxRetries: 0
                });
        }
        else
        {
            session.send('Couldn\'t get your location... Better luck next time!');
            session.replaceDialog('/');
        }
    },
    function (session, results) {
        if (results.response.entity) {
            session.dialogData.answer = results.response.entity;
        } 
        else if (session.message.text)
        {
            session.dialogData.answer = session.message.text;
        }
        if (session.dialogData.answer)
        {
            session.send('Got it! Here\'s top recommendations from Yelp close to you that are open now that have \'' + session.dialogData.answer + '\' in the categories or comments:');
            yelputil.getYelpRecommendations(session.dialogData.answer, session.userData.lat, session.userData.long)
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
            session.send('Couldn\'t understand your answer... Better luck next time!');
            session.replaceDialog('/');
        }
    }
]