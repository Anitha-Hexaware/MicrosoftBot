var request = require('request');
const xmlQuery = require('xml-query');
const XmlReader = require('xml-reader');
var Promise = require('promise');
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
var deleteMeeting = function (meeting_id) {
    return new Promise(function (resolve, reject) {
            console.log(result)
            let rawbody = `<serv:message xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <header>
        <securityContext>
            <webExID>NuanceWebex</webExID>
            <password>#23_Srini</password>
            <siteName>apidemoeu</siteName>
        </securityContext>
    </header>
    <body>
        <bodyContent
            xsi:type="java:com.webex.service.binding.meeting.DelMeeting">
            <meetingKey>${result.meeting_id}</meetingKey>
        </bodyContent>
    </body>
</serv:message>`;
            request.post({
                headers: { 'content-type': 'application/xml' },
                url: 'https://apidemoeu.webex.com/WBXService/XMLService',
                body: rawbody
            }, function (error, response, body) {
                const ast = XmlReader.parseSync(body);
                const result = xmlQuery(ast).find('serv:result').text();
                console.log(body);
                resolve(result);
            });

     
    })

}

module.exports.deleteMeeting = deleteMeeting;









