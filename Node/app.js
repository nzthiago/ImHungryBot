// This loads the environment variables from the .env file
require('dotenv-extended').load();
var location = require('./dialogs/location')
var builder = require('botbuilder');
var restify = require('restify');
global.UserWelcomedKey = 'UserWelcomed';

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot((connector));

bot.dialog('/', require('./dialogs/root'));
bot.dialog('bestnearby', require('./dialogs/bestnearby'));
bot.dialog('findbytype', require('./dialogs/findbytype'));
bot.dialog('findbyname', require('./dialogs/findbyname'));
location.create(bot);
bot.dialog('reset', require('./dialogs/reset'))
    .triggerAction({ 
        matches: [/reset/i, /cancel/i, /return/i, /start again/i, /nevermind/i]
    });
bot.use(builder.Middleware.sendTyping());
// log any bot errors into the console
bot.on('error', function (e) {
    console.error('An error ocurred', e);
});