var builder = require('botbuilder');

module.exports = [
    function (session) {
        session.beginDialog("location");
    },
    function (session, results) {
        session.send('Hello from this location %s!', results.response);
    }
]