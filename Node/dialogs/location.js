var builder = require('botbuilder');
module.exports = [
    function (session) {
        if (session.message.address.channelId === 'facebook') {
            var replyMessage = new builder.Message(session).text('Alright let\'s find some food for you! Please send me your  curret location so I can search closeby.');
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
        if (results && results.response) {
            if (session.message.address.channelId === 'facebook') {
                session.userData.lat = results.response.coordinates.lat;
                session.userData.long = results.response.coordinates.long;
            }
            session.userData.lastAskedForLocation = new Date();
        }
        session.endDialog();
    }
]