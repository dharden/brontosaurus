var util = require('util'),
    exec = require('child_process').exec,
    child;

casperScreenshot('http:/www.zappos.com/clothing', '.pageHeader', 'oh/shit/yea/header.png', function (screenshotPath) {
  console.log('localScreenshot:' + screenshotPath);
  uploadScreenshot(screenshotPath, screenshotPath);
})


/**
 * Takes a screenshot of a webpage area given a selector and saves it to local
 * disk.
 */
function casperScreenshot(url, selector, imageDestination, callback) {

  argumentData = {
    url: url,
    selector: selector,
    imageDestination: imageDestination
  };

  encodedArgumentData = new Buffer(JSON.stringify(argumentData)).toString('base64')

  // Execute the casper binary to run the casper script
  child = exec('casperjs casperScriptToTakeScreenshot.js ' + encodedArgumentData, // command line argument directly in string
    function (error, stdout, stderr) {      // one easy function to capture data/errors

      // We will know when casper has taken the screenshot when we see a
      // specific keyword from sdout 'done'
      if (stdout.indexOf('done:') !== -1) {
        var fileSaved = stdout.split(':')[1].replace(/\n+/g, '');
        //console.log('Casper is done taking a screenshot: ' + fileSaved);
        callback(fileSaved);
      }
      // Or everything goes to shit...
      else {
        console.log('Dont know whats going on with casper...' + stdout);
      }

      if (error !== null) {
        console.log('exec error: ' + error);
      }

  });


}

function uploadScreenshot(src, dest) {

  var s3 = require('s3');
  // createClient allows any options that knox does.
  var client = s3.createClient({
    key: "AKIAJ45OASDNMYW3CDSQ",
    secret: "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",
    bucket: "pterodactyl"
  });

  // upload a file to s3
  var uploader = client.upload(src, dest);

  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
  });

  uploader.on('end', function() {
    console.log("done");
  });


}
