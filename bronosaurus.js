var exec = require('child_process').exec,
    child;

// example using express.js:
var express = require('express')
  , app = express();

app.use(express.bodyParser());

app.post('/storeSnapShot', function(req, res) {
  var json = req.body.json;  // second parameter is default

  requestData = JSON.parse(json);

  /*
  { "id":"1",
     "runCountForDay":"55",
     "url":"http://zappos.com/shoes",
     "date":"01012012",
     "task":
        {
           "id":"2",
           "actions":"hover#something.else",
           "selector":"#thisthing .thatthing"
        }
  }
  */

  var id = requestData.id;
  var taskId = requestData.task.id;
  var date = requestData.date;
  var selector = requestData.task.selector;
  var runCountForDay = requestData.runCountForDay;
  var url = requestData.url;
  var forPage = requestData.for_page;

  casperScreenshot(url, selector,  'archived/' + taskId + '/' + id + '/' + date + '/' + runCountForDay + '/' + forPage + '/screenshot.png', function (screenshotpath) {
    uploadScreenshot(screenshotpath, screenshotpath);
    diffScreenshots(screenshotpath, 'header2.png');
  });

});

app.listen(3000);

/*
 Takes a screenshot of a webpage area given a selector and saves it to local
 disk.
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

function diffScreenshots(file1, file2) {
  // Stealing puts, can use Deshawn's method tomorrow
  var sys = require('util');
  function puts(error, stdout, stderr) { sys.puts(stdout) };
  // Execute the imagediff binary to generate a diffed screenshot on the local disk
  exec("node_modules/imagediff/bin/imagediff -d " + file1 + " " + file2 + " " + "diff.png", puts);
}
