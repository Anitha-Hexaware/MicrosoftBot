//Bot function Editing by anitha
var request = require("request");
var rp = require('request-promise');
// var parseString = require('xml2js').parseString;
const XmlReader = require('xml-reader');
const xmlQuery = require('xml-query');
let UpdateMeetingKey = 620373909;

// -------------------------------------------------------------
var header = {
  'Postman-Token': '3c47290a-2141-ae22-5744-16d21de134c3',
  'Cache-Control': 'no-cache'
}

sendUpdateMember = function (a,arrList) {
  var options = {
    method: 'POST',
    uri: 'https://apidemoeu.webex.com/WBXService/XMLService',
    body: `<serv:message xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <header>
      <securityContext>
        <webExID>test_user</webExID>
        <password>cisco!123</password>
        <siteName>apidemoeu</siteName>
      </securityContext>
    </header>
    <body>
      <bodyContent
        xsi:type="java:com.webex.service.binding.meeting.SetMeeting">
        <meetingkey>${a}</meetingkey>
        <participants>
          <attendees>
            ${arrList}
          </attendees>
        </participants>
        <attendeeOptions>
          <emailInvitations>true</emailInvitations>
        </attendeeOptions>
        <schedule>
          <openTime>300</openTime>
        </schedule>
      </bodyContent>
    </body>
  </serv:message>`,
    headers: header
  };
  rp(options).then(function (body,request) {
    // console.log(request);
      console.log("-----------------boddy xml");
      console.log(body);
      var xmlSend = body;

      const astSend = XmlReader.parseSync(xmlSend);
      const xqSend = xmlQuery(astSend);

      var meetingResultX = xmlQuery(astSend).find('serv:result').text();
      console.log(`The meeting is created successfull ${meetingResultX}`);

    })
    .catch(function (err) {
      console.log(err);

      return err;
    });
}
// -------------------------------------------------
getUpdateMember = function (a) {
  var options = {
    method: 'POST',
    uri: 'https://apidemoeu.webex.com/WBXService/XMLService',
    body: `<serv:message xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <header>
      <securityContext>
        <webExID>test_user</webExID>
        <password>cisco!123</password>
        <siteName>apidemoeu</siteName>
      </securityContext>
    </header>
    <body>
      <bodyContent
        xsi:type="java:com.webex.service.binding.meeting.LstsummaryMeeting">
          <meetingKey>${a}</meetingKey>
        <order>
          <orderBy>STARTTIME</orderBy>
        
        </order>
      </bodyContent>
    </body>
  </serv:message>`,
    headers: {
      'postman-token': '87544b87-0ab3-cfe6-cf86-ef2bab10e900',
      'cache-control': 'no-cache'
    }
  };
  rp(options).then(function (body) {
      console.log("-----------------boddy xml");
      console.log(body);
      var xml = body;

      const ast = XmlReader.parseSync(xml);
      const xq = xmlQuery(ast);

      var meetingKeyX = xmlQuery(ast).find('meet:meetingKey').text();
      var confNameX = xmlQuery(ast).find('meet:confName').text();
      var startDateN = xmlQuery(ast).find('meet:startDate').text();
      // var meetingKeyX = xmlQuery(ast).find('meet:meetingKey').text();

    })
    .catch(function (err) {
      console.log(err);
      session.send(err);
      return err;
    });
}

module.exports.getUpdateMember = getUpdateMember;
module.exports.sendUpdateMember = sendUpdateMember;