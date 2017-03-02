var yelp = require('yelp-fusion');
const clientId = process.env.YELP_APP_ID;
const clientSecret = process.env.YELP_APP_TOKEN;

module.exports = {
    getYelpRecommendations: function(lat, long) {
        return yelp.accessToken(clientId, clientSecret).then(response => {
            var client = yelp.client(response.jsonBody.access_token);
            var searchRequest = {
                latitude: lat,
                longitude: long,
                radius: 8046, //5 miles
                sort_by: "rating",
                open_now: true,
                limit:10,
                categories:'food'
            };
            return client.search(searchRequest).then(response => {
                var businesses = response.jsonBody.businesses;
                return businesses;
            });
        });
    }
}