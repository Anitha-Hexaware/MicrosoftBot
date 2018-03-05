//Bot function Editing by anitha
var request = require("request");
var rp = require('request-promise');
var parseString = require('xml2js').parseString;
let UpdateMeetingKey = 625204197;
// -------------------------------------------------------------
var header = {
  'Postman-Token': '3c47290a-2141-ae22-5744-16d21de134c3',
  'Cache-Control': 'no-cache'
}

sendUpdateMember = function (a, session) {
  var options = {
    method: 'POST',
    uri: 'https://apidemoeu.webex.com/WBXService/XMLService',
    body: `<serv:message xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\r\n
      <header>\r\n
        <securityContext>\r\n
          <webExID>NuanceWebex</webExID>\r\n
          <password>nuance123</password>\r\n
          <siteName>apidemoeu</siteName>\r\n
        </securityContext>\r\n </header>\r\n
      <body>\r\n
        <bodyContent\r\n xsi:type="java:com.webex.service.binding.meeting.SetMeeting">\r\n
          <meetingkey>${a}</meetingkey>\r\n
          <participants>\r\n
            <attendees>\r\n
              <attendee>\r\n
                <person>\r\n
                  <email>hani10.zenith@gmail.com</email>\r\n
                </person>\r\n </attendee>\r\n
              <attendee>\r\n
                <person>\r\n
                  <email>sandeepkumarboda444@gmail.com</email>\r\n
                </person>\r\n </attendee>\r\n </attendees>\r\n </participants>\r\n
          <attendeeOptions>\r\n
            <emailInvitations>true</emailInvitations>\r\n </attendeeOptions>\r\n
          <schedule>\r\n
            <openTime>300</openTime>\r\n 
            </schedule>\r\n 
            </bodyContent>\r\n </body>\r\n
            </serv:message>`,
    json: true, // Automatically stringifies the body to JSON
    headers: header
  };
  rp(options).then(function (body) {
      // console.log(body);


      var xml = body;
      parseString(xml, function (err, result) {
        console.log("-----Edit");
        console.dir(JSON.stringify(result));
        return JSON.stringify(result);

      });

    })
    .catch(function (err) {
      console.log(err);

      return err;
    });
}

GetUpdateMember = function (session) {
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
        <order>
          <orderBy>STARTTIME</orderBy>
        </order>
      </bodyContent>
    </body>
  </serv:message>`,
    json: true, // Automatically stringifies the body to JSON
    headers: {
      'postman-token': '87544b87-0ab3-cfe6-cf86-ef2bab10e900',
      'cache-control': 'no-cache'
    }
  };
  rp(options).then(function (body) {
      var getxml = body;
      parseString(getxml, function (err, result) {
        console.log("-----get");
        session.send(JSON.stringify(result));
        return JSON.stringify(result);
      });
    })
    .catch(function (err) {
      console.log(err);
      session.send(err);
      return err;
    });
}

module.exports.GetUpdateMember = GetUpdateMember;
module.exports.sendUpdateMember = sendUpdateMember;

// function getUpdateResults(searchString) {
//   var options = {
//     method: 'GET',
//     uri: 'https://api.giphy.com/v1/gifs/translate',
//     qs: {
//       s: searchString,
//       api_key: '9n8AIaWULVu37sA1k8eE38IwnCCjmXP9'
//     }
//   }
//   return rp(options);
// }

// ----------------------------------------------------------