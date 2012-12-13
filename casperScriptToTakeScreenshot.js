var casper = require('casper').create();

// Un-base64 decode arguments, and unstringify the json of the arguments

var args = JSON.parse(window.atob(casper.cli.args[0]));

var url = args['url'];
var selector = args['selector'];
var imageDestination = args['imageDestination'];

casper.start(url, function() {
    this.captureSelector(imageDestination, selector);
    this.clear(); // javascript execution in this page has been stopped
});

casper.then(function() {
  this.echo('done:' + imageDestination);
});

casper.run();
