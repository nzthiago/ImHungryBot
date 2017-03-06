module.exports = 
     function (session) {
        // reset data
        session.conversationData = {}; 
        session.dialogData = {};
        session.privateConversationData = {};
        session.userData = {};
        session.send('Alright! Let\'s try it again.');
        session.replaceDialog('/');
    };