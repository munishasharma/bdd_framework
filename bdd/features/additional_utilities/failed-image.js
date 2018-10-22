var ErrorScreenshot = function () {

  this.After(function (scenario, callback) {
    if (scenario.isFailed()) {
      return browser.saveScreenshot().then(function (stream) {

        var Screenshot = new Buffer(stream, 'base64').toString('binary');
        scenario.attach(Screenshot, 'image/png', callback);
        browser.deleteCookie();

      }, function(err) {
        callback(err);
      });
    }
    else {
      callback();
    }
  });

};

module.exports = ErrorScreenshot;
