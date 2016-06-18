var restify = require('restify');
var builder = require('botbuilder');

// Get secrets from server environment
var botConnectorOptions = {
    appId: process.env.BOTFRAMEWORK_APPID,
    appSecret: process.env.BOTFRAMEWORK_APPSECRET
};

// Create bot
var bot = new builder.BotConnectorBot(botConnectorOptions);
var dialog = new builder.CommandDialog();
bot.add('/', dialog
    .matches('^hello', function (session) {
        session.send("Hey I'm dinnerbot!");
    })
    .matches('^menupdf', function (session) {
        session.send("http://pressedcafe.com/wp-content/uploads/2015/11/Take-out-menu-08_15.pdf");
    })
    .matches('^menu', function (session) {
        session.send("http://pressedcafe.com/menu/");
    })
    .matches('^specials', function (session) {
        session.send("http://pressedcafe.com/specials/");
    })
    .matches('^name', function (session) {
        session.send(session.message.from.name);
    })
    .matches('^address', function (session) {
        session.send(session.message.from.address);
    })
    .onDefault(function (session) {
        session.send("I didn't understand. Say hello to me!");
}));

dialog.matches('^version', builder.DialogAction.send('Bot version 0.1'));


// bot.add('/menu', [
//   function (session){
//     session.send("http://pressedcafe.com/menu/")
//   }
// ])

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
