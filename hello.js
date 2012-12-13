
console.log('2heresdupsj');
var Spooky = require('./node_modules/spooky/lib/spooky');
console.log('1heresdupsj');

var express = require('express');
var app = express();

console.log('heresdupsj');

app.get('/', function(req, res){
  console.log('here2');
});

app.get('/screenshotComplete/:name', function(req, res){
  var name = req.params['name'];

  upload_to_s3(name);

  res.send('hello world' + name);
});

app.listen(3000);


function upload_to_s3(filepath) {
    // upload a file to s3
    var s3 = require('s3');
    // createClient allows any options that knox does.
    var client = s3.createClient({
      key: "AKIAJ45OASDNMYW3CDSQ",
      secret: "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",
      bucket: "pterodactyl"
    });
    var uploader = client.upload(filepath, filepath);
    uploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);
    });
    uploader.on('progress', function(amountDone, amountTotal) {
      console.log("progress", amountDone, amountTotal);
    });
    uploader.on('end', function() {
      console.log("done");
    });
}


var spooky = new Spooky({
        child: {
            port: 8081,
            script: './node_modules/spooky/lib/bootstrap.js',
            spooky_lib: './node_modules/spooky/node_modules'
        }
    }, function (err, error) {
        spooky.on('console', function (line) {
            console.log(line);
        });
        

        spooky.tryit = 'spooky.png';

        spooky.start('http://www.zappos.com/shoes', function() {
          console.log(this.hello, 'AAAAAAAAAAAAAAAAAAAAAA');
            this.captureSelector('spooky.png', '.sideColumn');
        });

        spooky.then(function () {

          this.open('http://localhost:3000/screenshotComplete/' + 'spooky.png', {
            method: 'get'
          });

        });
        spooky.run();
    });

