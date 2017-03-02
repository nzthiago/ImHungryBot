var builder = require('botbuilder');
var app = require('../app');
module.exports = [
    function (session) {
        var options = {
            prompt: "'Alright let\'s find some food for you!  Please confirm your location so I can search closeby.'",
            useNativeControl: true,
            skipConfirmationAsk: true
        };
        app.locationDialog.getLocation(session, options);
    },
    function (session, results) {
        if (results.response) {
            var place = results.response;
            session.endDialogWithResult({
                response: place
            });
        }
    }
]
