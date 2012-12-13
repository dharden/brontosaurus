var querystring = require('querystring');
var http = require('http');

var data = querystring.stringify({
  json: ' { "id":"1", "runCountForDay":"55", "url":"http://zappos.com/shoes", "date":"01012012", "task": { "id":"2", "actions":"hover#something.else", "selector":".sideColumn" } } ',
});

var options = {
    host: 'localhost',
    port: 3000,
    path: '/storeSnapShot',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
    }
};

var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log("body: " + chunk);
    });
});

req.write(data);
req.end();
