var S3_KEY = 'KIAJ45OASDNMYW3CDSQ';
var S3_SECRET = 'YtyX4/2zSRRibTqOOIp1WG07Uw3Zy5mm31U3isWR';
var S3_BUCKET = 'pterodactyl';
var knox = require('knox').createClient({
    key: S3_KEY,
    secret: S3_SECRET,
    bucket: S3_BUCKET
});


var casper = require('casper').create();

casper.start('http://www.zappos.com/shoes', function() {
    this.captureSelector('whatever.png', '.sideColumn');
});

knox.putFile('weather.png', 'weather.png', {'Content-Type': 'image/png'}, function(err, result) {
    if (200 == result.statusCode) { console.log('Uploaded to Amazon S3'); }
    else { console.log('Failed to upload file to Amazon S3'); }
});
casper.run();
