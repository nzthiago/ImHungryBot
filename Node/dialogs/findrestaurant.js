var builder = require('botbuilder');

module.exports = [
    function (session) {
        session.beginDialog("location");
    },
    function (session, results) {
        session.send('Hello from lat %s long %s', results.response.geo.latitude, results.response.geo.longitude);
    }
]