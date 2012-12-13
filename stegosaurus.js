var util = require('util'),
    exec = require('child_process').exec,
    child;
    express = require('express');
    app = express();

function diffScreenshots(file1, file2) {
  // Stealing puts, can use Deshawn's method tomorrow
  var sys = require('sys');
  function puts(error, stdout, stderr) { sys.puts(stdout) };
  // Execute the imagediff binary to generate a diffed screenshot on the local disk
  exec("node_modules/imagediff/bin/imagediff -d " + file1 + " " + file2 + " " + "diff.png", puts);
}

diffScreenshots(screenshotPath, 'header2.png');


app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);
