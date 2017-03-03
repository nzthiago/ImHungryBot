var builder = require('botbuilder');
var yelp = require('yelp-fusion');
const clientId = process.env.YELP_APP_ID;
const clientSecret = process.env.YELP_APP_TOKEN;

module.exports = {
    getYelpRecommendations: function(term, lat, long) {
        return yelp.accessToken(clientId, clientSecret).then(response => {
            var client = yelp.client(response.jsonBody.access_token);
            var searchRequest = {
                latitude: lat,
                longitude: long,
                open_now: true,
                limit:10,
                categories:'food'
            };
            if (term) 
            {
                searchRequest.term = term;
            }
            return client.search(searchRequest).then(response => {
                var businesses = response.jsonBody.businesses;
                return businesses;
            });
        });
    },
    getCardsFromPlaces: function(session, places) {
        var cards = [];
        places.forEach(place => {
            var display_address = place.location.display_address.join(','); //combine address lines
            var maps_url = 'http://maps.google.com/?daddr=' + display_address.split(' ').join('+');
            cards.push(
                new builder.HeroCard(session)
                .title(place.name)
                .subtitle(display_address + '\r\n' + place.display_phone)
                .text('Rating: ' + place.rating + '. Reviews: ' + place.review_count + '. Price: ' + place.price)
                .images([
                    builder.CardImage.create(session, place.image_url)
                ])
                .buttons([
                    builder.CardAction.openUrl(session, place.url, 'Learn More'),
                    builder.CardAction.openUrl(session, maps_url, 'Directions')
                ])
            )
        });
        return cards;
    }
}