var builder = require('botbuilder');

var DialogLabels = {
    BestNearby: 'Best Nearby',
    FindByType: 'Nearby by Type',
    FindByName: 'Find by Name'
};

module.exports = [
    function (session) {
        var welcomeMessage = "Let's find you a place to eat.";
        // has the user been welcomed to the conversation?
        if (!session.privateConversationData[global.UserWelcomedKey]) {
            session.privateConversationData[global.UserWelcomedKey] = true;
            var welcomeMessage = "Hi, I\'m Hungry! Hope you are too. I can help you find some open places nearby.";
        }
        // prompt for search option
        builder.Prompts.choice(
            session,
            welcomeMessage + ' Here\s how I can help:',
            [DialogLabels.BestNearby, DialogLabels.FindByType, DialogLabels.FindByName],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Sorry... Don\'t seem to understand which option you want. Let\'s again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.BestNearby:
                return session.beginDialog('bestnearby');
            case DialogLabels.FindByType:
                return session.beginDialog('findbytype');
            case DialogLabels.FindByName:
                return session.beginDialog('findbyname');
        }
    }
]