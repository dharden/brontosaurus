var util = require('util'),
    exec = require('child_process').exec,
    child;

casperScreenshot('http://www.zappos.com/clothing', '.pageHeader', 'header.png', function (localScreenshot) {
  //uploadScreenshot(screenshotPath, screenshotPath);
})


/**
 * Takes a screenshot of a webpage area given a selector and saves it to local
 * disk.
 */
function casperScreenshot(url, selector, imageDestination) {

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
        var fileSaved = stdout.split(':')[1];
        console.log('Casper is done taking a screenshot: ' + fileSaved);
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

}
