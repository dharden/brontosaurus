
var Spooky = require('./node_modules/spooky/lib/spooky');

function s3ify() {
          // upload a file to s3
var s3 = require('s3');
// createClient allows any options that knox does.
var client = s3.createClient({
  key: "AKIAJ45OASDNMYW3CDSQ",
  secret: "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",
  bucket: "pterodactyl"
});
          var uploader = client.upload("spooky.png", "spooky.png");
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

        spooky.start('http://www.zappos.com/shoes', function() {
            this.captureSelector('spooky.png', '.sideColumn');
        });
        spooky.then(function () {
          s3ify();
        });
        spooky.run();
    });
