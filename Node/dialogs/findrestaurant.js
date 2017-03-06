var builder = require('botbuilder');
var location = require('./location');

module.exports = [
    function (session, args, next) {
        //Only ask again if it's been more than 5 mins
        if (!session.userData.lastAskedForLocation 
          || ((new Date) - session.userData.lastAskedForLocation) > 300000) {
        location.beginDialog(session);
        } else {
            next();
        }
    },
    function (session, results) {
                if (session.userData && (session.userData.lat & session.userData.long))
        {
            session.send('Hello from lat %s long %s', session.userData.lat, session.userData.long);
            session.replaceDialog('/');
        }
        else
        {
            session.send('Couldn\'t get your location... Better luck next time!');
            session.replaceDialog('/');
        }

    }
]