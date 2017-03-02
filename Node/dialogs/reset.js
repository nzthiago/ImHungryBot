module.exports = 
     function (session) {
        // reset data
         if (session.privateConversationData[global.UserWelcomedKey]) {
            delete session.privateConversationData[global.UserWelcomedKey];
        }
        session.send('Alright! Let\'s try it again.');
        session.replaceDialog('/');
    };