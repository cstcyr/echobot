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
    .matches('^order', function (session) {
        session.beginDialog('/order');
    })
    .matches('^profile', function (session) {
        session.beginDialog('/profile');
    })
    .onDefault(function (session) {
        session.send("I didn't understand. Say hello to me!");
}));


bot.add('/order', [
  function (session) {
    builder.Prompts.text(session, "What would you like to order for dinner?");
  },
  function (session, results){
    session.userData.order = results.response;
    //session.send("Ok I'll put your order in for " + session.userData.order)
    session.endDialog();
  }
 ]);

 // bot.add('/', function (session) {
 //     if (!session.userData.order) {
 //         session.beginDialog('/order');
 //     } else {
 //         session.send("Ok I'll put your order in for " + session.userData.order)
 //     }
 // });

 bot.add('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

dialog.matches('^version', builder.DialogAction.send('dinnerBot version 0.1'));


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
