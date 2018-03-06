/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var CreateMeeting = require('./createmeeting');
var RSMeetingIm = require('./RescheduleMeeting');
var deleteMeet = require('./deleteMeeting');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
 console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
 appId: process.env.MicrosoftAppId,
 appPassword: process.env.MicrosoftAppPassword,
 openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());



server.get('/meeting', (req, res, next) => {
 var a = 622599639;
 var arrEmail = "hani@gmail.com;eii@gmail.com";
 var arrEmailForm = Array.from(arrEmail.split(';'));
 var arrList ='';
 arrEmailForm.forEach(function (membersEmail) {
 arrList += `<attendee>
 <person>
 <email>${membersEmail}</email>
 </person>
 </attendee>`;
 // console.log(arrList);

 });
 console.log('The value is ' + arrList);
 // console.log(arrEmailForm[0]);
 var resul = res.send(RSMeetingIm.sendUpdateMember(a,arrList));

 // var resul = res.send(RSMeetingIm.getUpdateMember(a));
 // console.log(resul);
});


/*----------------------------------------------------------------------------------------
 * Bot Storage: This is a great spot to register the private state storage for your bot. 
 * We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
 * For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
 * ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({
 gzipData: false
}, azureTableClient);



// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';


const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f91dd71e-8a47-4378-87a6-6b61eb64661a?subscription-key=633cb50cee194bc4b500689a53b268f5&staging=true&verbose=true&timezoneOffset=330&q=';

String.prototype.capitalize = function () {
 return this.charAt(0).toUpperCase() + this.slice(1);
}

// Main dialog with LUIS
// ---------edit by anitha
var KeySession = '';
var mySession = '';
var validator = require("email-validator");
// ----------------------------------------------------------------


var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({
 recognizers: [recognizer]
})
 .matches('Greeting', (session) => {
 session.send('Hi, I am your WebEx Assistant. I can help you create, reschedule and cancel meetings. I can also show you your upcoming events.');

 const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f91dd71e-8a47-4378-87a6-6b61eb64661a?subscription-key=633cb50cee194bc4b500689a53b268f5&staging=true&verbose=true&timezoneOffset=330&q=';

 var recognizer = new builder.LuisRecognizer(LuisModelUrl);
 var intents = new builder.IntentDialog({
 recognizers: [recognizer]
 })
 var welcomeCard = new builder.HeroCard(session)
 .title('CISCO WEBEX')
 .subtitle('Hi, I am your WebEx Assistant. I can help you create, reschedule and cancel meetings.')
 .images([
 new builder.CardImage(session)
 .url('https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2017-07-24/216982531396_f9249cce8e2f14329466_512.png')
 .alt('Cisco WebEx')
 ])
 .buttons([
 builder.CardAction.imBack(session, "Create Meeting", "Create Meeting"),
 builder.CardAction.imBack(session, "Update Meeting", "Update Meeting"),
 builder.CardAction.imBack(session, "Cancel Meeting", "Cancel Meeting")
 ]);

 session.send(new builder.Message(session)
 .addAttachment(welcomeCard));
 })
 .matches('Help', (session) => {
 session.send('You reached Help intent, you said \'%s\'.', session.message.text);
 })
 .matches('Cancel', (session) => {
 session.send('You reached Cancel intent, you said \'%s\'.', session.message.text);
 })
 .matches('DeleteMeeting', (session) => {

 session.send('Sure ! I can help you with that. Can you give me your 9 digit meeting ID.', session.message.text);
 })
 .matches('MeetingID', (session) => {
 mySession.session = session.message.text;
 session.userData.session = session.message.text;
 session.beginDialog('MeetingValid');
 })
 .matches('DateScheduling', (session, args, next) => {

 var dateScheduling = builder.EntityRecognizer.findEntity(args.entities, 'builtin.datetimeV2.datetimerange');
 var startdate = dateScheduling.resolution.values[0].start;
 var enddate = dateScheduling.resolution.values[0].end;
 session.userData.dateScheduling = dateScheduling;
 session.send(`Meeting is Scheduled. Please enter the email id of particpants.`);
 })
 .matches('EmailID', (session, args, next) => {
 var EmailID = builder.EntityRecognizer.findEntity(args.entities, 'builtin.email').entity;
 if (session.userData.hasOwnProperty('participantStatus')) {
 var emaillist = session.userData.emailarray;
 var emailind = emaillist.indexOf(EmailID);
 if (emailind == -1) {
 if (session.userData.participantStatus == "Add") {
 session.userData.emailarray.push(EmailID);
 }
 }
 if (emailind > -1) {
 if (session.userData.participantStatus == "Remove") {
 session.userData.emailarray.splice(emailind, 1);
 }
 }
 }
 else if (session.userData.hasOwnProperty('emailarray')) {
 session.userData.emailarray.push(EmailID);
 }
 else {
 session.userData.emailarray = [];
 session.userData.emailarray.push(EmailID);
 }

 var msg = new builder.HeroCard(session)
 .text(`${session.userData.emailarray} \n\nSelect your options`)
 .buttons([
 builder.CardAction.imBack(session, "Add Participant", "Add Participant"),
 builder.CardAction.imBack(session, "Remove Participant", "Remove Participant"),
 builder.CardAction.imBack(session, "Ignore", "Ignore")
 ]);
 session.send(new builder.Message(session)
 .addAttachment(msg));
 })
 .matches('AddParticipant', (session) => {
 session.userData.participantStatus = "Add";
 session.send(`Please provide email id of the participant to be added for the meeting`);
 })
 .matches('RemoveParticipant', (session) => {
 session.userData.participantStatus = "Remove";
 session.send(`Please provide email id of the participant to be removed from this meeting`);
 })
 .matches('SendMeeting', (session) => {
 var emaillist = JSON.stringify(session.userData.emailarray);
 var subjectMeeting = session.userData.subjectMeeting;
 var meetingPlace = session.userData.meetingPlace;
 var dateScheduling = session.userData.dateScheduling;
 var startdate = dateScheduling.resolution.values[0].start;
 var enddate = dateScheduling.resolution.values[0].end;
 CreateMeeting.SendMeeting(subjectMeeting, meetingPlace, dateScheduling, emaillist, startdate, enddate).then(function (result) {
 res.end("success");
 }).catch(function (errdata) {
 res.end(errdata);
 console.log(errdata)
 })
 })
 .matches('Exit', (session) => {
 var emaillist = JSON.stringify(session.userData.emailarray);
 var subjectMeeting = session.userData.subjectMeeting;
 var meetingPlace = session.userData.meetingPlace;
 var dateScheduling = session.userData.dateScheduling;
 var startdate = dateScheduling.resolution.values[0].start;
 var enddate = dateScheduling.resolution.values[0].end;
 var newdate=startdate.split(' ');
 var enddate=startdate.split(' ');
 var ExitCard = new builder.HeroCard(session)
 .title(`${subjectMeeting}`)
 .subtitle(`${meetingPlace} \n Date:${newdate[0]} \n Time: ${newdate} - ${enddate}`)
 .buttons([
 builder.CardAction.imBack(session, "Send Meeting", "Send Meeting")
 ]);

 session.send(new builder.Message(session)
 .addAttachment(ExitCard));
 })
 .matches('Createmeeting', (session) => {
 session.send(`Okay, what is the subject of your meeting?. If your subject is Nuance meeting type as 'subject is Nuance meeting'`);
 })
 .matches('Subjectmeeting', (session, args, next) => {
 var subjectMeeting = builder.EntityRecognizer.findEntity(args.entities, 'SubjectMessage');
 session.userData.subjectMeeting = subjectMeeting;
 session.send(`Meeting subject is ${subjectMeeting.entity.capitalize()}. Where would the meeting be?`);
 })
 .matches('Meetingplace', (session, args, next) => {
 var meetingPlace = builder.EntityRecognizer.findEntity(args.entities, 'MeetingPlace');
 session.userData.meetingPlace=meetingPlace;
 session.send(`what is your preferred meeting schedule? Awesome example (If you’re stuck!!) “tomorrow 5 to 5.30 pm”`);
 })
 // .matches('EditMeeting', (session) => {
 // session.send('You reached Edit intent, you said \'%s\'.', session.message.text);
 // })


 // ---------------------------------------------------------------------------------

 .matches('UpdateMeet', (session) => {
 console.log('hai');

 var EditButtons = new builder.HeroCard(session)
 .text('Please select to edit the meeting')
 .buttons([
 builder.CardAction.imBack(session, "Edit Member", "Member"),
 builder.CardAction.imBack(session, "Edit Timing", "Timing"),
 builder.CardAction.imBack(session, "Edit Content", "Content")
 ]);

 session.send(new builder.Message(session)
 .addAttachment(EditButtons));
 })

 .matches('MemberEdit', (session) => {

 KeySession.session = session.message.text;
 session.userData.session = session.message.text;
 session.beginDialog('ValidateMeetingKey');
 //var getList = RSMeetingIm.GetUpdateMember(a, session);
 //session.send(getList);
 })
 .matches('EditTiming', (session) => {
 session.send('You reached Edit timing intent, you said \'%s\'.', session.message.text);
 })

 .matches('ExitIntent', (session) => {
 session.send('ok bye have a nice day \'%s\'.', session.message.text);
 })

 // -------------------------------------------------------------------------
 /*
 .matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
 */
 .onDefault((session) => {
 session.send('Sorry, I did not understand \'%s\'.', session.message.text);
 });






// =========================================================================
bot.dialog('ValidateMeetingKey', [
 function (session) {
 builder.Prompts.number(session, "Kindly give me your 9 digit meeting ID.");
 },
 function (session, results) {
 session.userData.meetingLength = results.response;
 console.log(session.userData);
 var meetinglen = session.userData.meetingLength;
 var a = meetinglen.toString();

 if (a.length == 9) {
 // var getList = RSMeetingIm.GetUpdateMember(session);
 // session.send(getList);

 var getUpdate = RSMeetingIm.sendUpdateMember(a, session);
 session.send(getUpdate);


 // session.beginDialog('ValidateEmail');
 // validator.validate("test@email.com");
 // RSMeetingIm.sendUpdateMember(a);

 } else {
 session.endDialog(`Sorry, Invalid meeting ID, Please give me your correct meeting ID`);
 }
 }
]);

bot.dialog('ValidateEmail', [
 function (session) {
 builder.Prompts.number(session, `Thanks, Now please add the member with semicolon seperated. 
 Ex: The email Id are : xyz@gmail.com; zyx@gmail.com`);
 },
 function (session, results) {
 session.userData.addEmail = results.response;
 console.log(session.userData);
 var meetingEmail = session.userData.addEmail;
 validator.validate(meetingEmail);
 // var a = meetingEmail.toString();

 if (validator.validate(meetingEmail) === true) {

 var getUpdate = RSMeetingIm.sendUpdateMember(a, session);
 session.send(getUpdate);
 // session.endDialog(`Thanks, Now please add the member with semicolon seperated. 
 // Ex: The email Id are : xyz@gmail.com; zyx@gmail.com`);

 } else {
 session.endDialog(`Sorry, Invalid Email ID, Please give me your correct Email ID`);
 }
 }
]);
// =====================
// meeting ID validation
bot.dialog('MeetingValid', [
 function (session) {
 builder.Prompts.number(session, "Please give your 9 digit meeting ID");
 },
 function (session, results) {
 session.userData.meetingLength = results.response;
 console.log(session.userData);
 var meetinglen = session.userData.meetingLength;
 var meeting_id = meetinglen.toString();

 if (meeting_id.length == 9) {
 // session.endDialog(' your meeting has been cancelled ! ');
 session.endDialog(' valid meeting ID ');
 deleteMeet.deleteMeeting(meeting_id).then(function (result) {
 session.send("success");
 }).catch(function (errdata) {
 session.send(errdata);
 })

 } else {

 session.endDialog(`invalid meeting ID`);
 //session.beginDialog('policyNumber');

 }
 //session.beginDialog('policyNumber'); 
 }
]);


bot.dialog('/', intents);
