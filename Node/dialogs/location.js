var builder = require('botbuilder');

exports.beginDialog = function(session, options) {
    session.beginDialog('location', options || {})
}

exports.create = function (bot) {
    var prompt = new builder.IntentDialog()
        .onBegin(function (session, args) {
            if (session.message.address.channelId === 'facebook') {
                var replyMessage = new builder.Message(session).text('Alright let\'s find some food for you! Please send me your current location so I can search closeby.');
                replyMessage.sourceEvent({
                facebook: {
                    quick_replies: [{
                        content_type:"location"
                        }]
                    }
                });
                session.send(replyMessage);
            } else {
                //Simulate a location for emulator and other channels for now. 
                //TODO: Investigate contributing to 'botbuilder-location' npm package for easy sharing of current location
                session.send('Simulating your location!');
                session.userData.lat = 47.6393261;
                session.userData.long = -122.130572;
                session.userData.lastAskedForLocation = new Date();
                session.endDialog();
            }
        })
        .onDefault(function (session) {
            // Validate users reply.
            console.log(session.message);
            session.endDialog();
        });
    bot.dialog('location', prompt);
}

/*
module.exports = [
    function (session, args, next) {
        if (session.message.address.channelId === 'facebook') {
            var replyMessage = new builder.Message(session).text('Alright let\'s find some food for you! Please send me your current location so I can search closeby.');
            replyMessage.sourceEvent({
            facebook: {
                quick_replies: [{
                    content_type:"location"
                    }]
                }
            });
            session.send(replyMessage);
        } else {
            //Simulate a location for emulator and other channels for now. 
            //TODO: Investigate contributing to 'botbuilder-location' npm package for easy sharing of current location
            session.send('Simulating your location!');
            session.userData.lat = 47.6393261;
            session.userData.long = -122.130572;
            session.userData.lastAskedForLocation = new Date();
            session.endDialog();
        }
    },
    function (session, results) {
        console.log(session.message);
        if (results && results.response) {
            console.log(results);
            console.log(results.response);
            if (session.message.address.channelId === 'facebook') {
                session.userData.lat = results.response.coordinates.lat;
                session.userData.long = results.response.coordinates.long;
            }
            session.userData.lastAskedForLocation = new Date();
        }
        session.endDialog();
    }
]
*/