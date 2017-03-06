var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        //check if asked for location more than 5 minutes ago
        //if (!session.userData.lastAskedForLocation 
        //   || ((new Date) - session.userData.lastAskedForLocation) > 300000) {
                 session.beginDialog("location");
        //} else {
        //     next();
        //}
    },
    function (session, results) {
                if (session.userData.lat & session.userData.long)
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