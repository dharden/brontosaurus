var util = require('util'),
    exec = require('child_process').exec,
    child;
    sys = require('sys');
    express = require('express');
    app = express();

function diffScreenshots(id, file1, file2, callback) {

  // We're going to return whether or not the images were equal.
  var isEqual;

  var file1 = downloadFile(file1);

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
        var fileName = id + ".png";
        var fileLocation = "diff/" + fileName;
        exec("node_modules/imagediff/bin/imagediff -d " + file1 + " " + file2 + " " + fileName); 
        uploadScreenshot(fileName, fileLocation);
      }
      else if (stdout.indexOf('true') !== -1) {
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

app.get('/diff/:id/:file1/:file2', function(req, res){
  var file1 = encodeURIComponent(req.params['file1']);
  var file2 = encodeURIComponent(req.params['file2']);
  var id = req.params['id'];
  diffScreenshots(id, file1, file2, function(isEqual) {
    if (isEqual === false) {
      res.send(201, 'yeah boyee');
    }
    else {
      res.send("nah dawg they're the same");
    }
  });
});

app.listen(3000);


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




function downloadFile(file) {
  
  // Dependencies
  var fs = require('fs');
  var url = require('url');
  var http = require('http');
  var exec = require('child_process').exec;

  // App variables
  var file_url = decodeURIComponent(file);
  var DOWNLOAD_DIR = './';
  
  var file_name = url.parse(file_url).pathname.split('/').pop();

  // We will be downloading the files to a directory, so make sure it's there
  // This step is not required if you have manually created the directory
  var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
  var child = exec(mkdir, function(err, stdout, stderr) {
      if (err) throw err;
      else download_file_httpget(file_url);
  });

  // Function to download file using HTTP.get
  var download_file_httpget = function(file_url) {
  var options = {
      host: url.parse(file_url).host,
      port: 80,
      path: url.parse(file_url).pathname
  };

  var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

  http.get(options, function(res) {
      res.on('data', function(data) {
              file.write(data);
          }).on('end', function() {
              file.end();
              console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
          });
      });
  };

  return file_name;
}

