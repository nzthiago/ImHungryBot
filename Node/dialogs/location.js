var builder = require('botbuilder');

exports.beginDialog = function(session, options) {
    session.beginDialog('location', options || {})
}

exports.create = function (bot) {
    var prompt = new builder.IntentDialog()
        .onBegin(function (session, args) {
            session.userData.lastAskedForLocation = new Date();
            if (session.message && session.message.address.channelId === 'facebook') {
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
                session.send('You\'re using the emulator I guess, simulating your location to be in Redmond!');
                session.userData.lat = 47.6393261;
                session.userData.long = -122.130572;
                session.endDialog();
            }
        })
        .onDefault(function (session) {
            // Validate users reply.
            var entities = session.message.entities;
            for (var i = 0; i < entities.length; i++) {
                if (entities[i].type == "Place" && entities[i].geo && entities[i].geo.latitude && entities[i].geo.longitude) {
                    session.userData.lat = entities[i].geo.latitude;
                    session.userData.long = entities[i].geo.longitude;
                }
            }
            session.endDialog();
        });
    bot.dialog('location', prompt);
}