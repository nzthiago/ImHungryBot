var builder = require('botbuilder');
var yelpsearch = require('../util/yelpsearch');

module.exports = [
    function (session) {
        session.beginDialog("location");
    },
    function (session, results) {
        if (results)
        {
            session.send("Thanks, got it! Here's 10 recommendations from Yelp close to you that are open now:");
            yelpsearch.getYelpRecommendations(results.response.geo.latitude, results.response.geo.longitude)
            .then(places => {
                var cards = [];
                places.forEach(place => {
                    var display_address = place.location.display_address.join(','); //combine address lines
                    var maps_url = 'http://maps.google.com/?daddr=' + display_address.split(' ').join('+');
                    cards.push(
                        new builder.HeroCard(session)
                        .title(place.name)
                        .subtitle(display_address + '\r\n' + place.display_phone)
                        .text('Rating: ' + place.rating + '. Reviews: ' + place.review_count)
                        .images([
                            builder.CardImage.create(session, place.image_url)
                        ])
                        .buttons([
                            builder.CardAction.openUrl(session, place.url, 'Learn More'),
                            builder.CardAction.openUrl(session, maps_url, 'Directions')
                        ])
                    )
                });
                var reply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);
                session.send(reply);
            })
        }
        else
        {
            session.send('Couldn\'t find your location... Better luck next time!');
            session.replaceDialog('/');
        }
    }
]