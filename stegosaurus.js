var util = require('util'),
    exec = require('child_process').exec,
    child;
    sys = require('sys');
    express = require('express');
    app = express();

function diffScreenshots(id, file1, file2, callback) {

  // We're going to return whether or not the images were equal.
  var isEqual;

  /* come back to this 
  var imagediff = require('imagediff');
  var isImage = imagediff.isImage(file1);
  console.log(isImage);
  var isEqual = imagediff.equal(file1, file2, 0);
  console.log(isEqual); */

  // Stealing puts, can use Deshawn's method tomorrow
  function puts(error, stdout, stderr) { sys.puts(stdout) };
  // Execute the imagediff binary to generate a diffed screenshot on the local disk

  exec("node_modules/imagediff/bin/imagediff -e " + file1 + " " + file2,

    function (error, stdout, stderr) {      // one easy function to capture data/errors
      sys.puts(stdout);
      // We will know if the images are equal or not when we see true or false in stdout
      if (stdout.indexOf('false') !== -1) {
        isEqual = false;
        exec("node_modules/imagediff/bin/imagediff -d " + file1 + " " + file2 + " " + id + ".png"); 
      }
      else if (stdout.indexof('true') !== -1) {
        isEqual = true;
      }
      // Or everything goes to shit...
      else {
        console.log('Dont know whats going on with imagediff...' + stdout);
      }

      if (error !== null) {
        console.log('exec error: ' + error);
      }
      
      console.log('We made it out alive!');
      console.log(isEqual); 
      callback(isEqual);
  });


  // exec("node_modules/imagediff/bin/imagediff -d " + file1 + " " + file2 + " " + "diff.png", puts);
}

app.get('/test/:id/:file1/:file2', function(req, res){
  var file1 = encodeURIComponent(req.params['file1']);
  var file2 = encodeURIComponent(req.params['file2']);
  var id = req.params['id'];
  diffScreenshots(id, file1, file2, function(isEqual) {
    res.send('Images were equal: ' + isEqual);
  });
});

app.listen(3000);
