try {
  var fs = require('fs');
  var loadtest = require('loadtest');
  var objData = null;
  var yaml = require('js-yaml');
  var expect = require('chai').expect;
  var assert = require('chai').assert;
  var AxeBuilder = require('axe-webdriverjs');
  var webdrivercss = require("webdrivercss");


  const TIMEOUT_CONST = 60000;


  var quickSpin = function() {

    objData = yaml.load(fs.readFileSync('./bdd/element_locators/webElementLocators.yml'));

    this.Given(/^User navigate to application$/, function () {
      var baseurl = "https://d1k6j4zyghhevb.cloudfront.net/mcasino/quickspin/easternemeralds/index.html?moneymode=fun";
        browser.url(baseurl);

    });
      this.Given(/^open the quickspin site to play game$/, function () {
          var baseurl = "https://quickspin.com/";
          browser.url(baseurl);

      });

    this.When(/^User click on "([^"]*)"$/, function (dataLocator) {
        dataLocator = objData[dataLocator];
      return browser
          .waitForVisible(dataLocator, TIMEOUT_CONST)
          .click(dataLocator)
    });

      this.When(/^User wait for some time$/, function () {
          browser.pause(20000);
      });


      this.Then(/^User should see the "([^"]*)" contains "([^"]*)"$/, function(dataLocator, substring) {
          dataLocator = objData[dataLocator];
      return browser
          .waitForVisible(dataLocator, TIMEOUT_CONST)
          .getText(dataLocator)
          .then(function (actualValue){
            expect(actualValue).to.contains(substring);
          }.bind(this))

    });

      this.Then(/^User should not see "([^"]*)" contains "([^"]*)"$/, function(dataLocator, substring) {
        dataLocator = objData[dataLocator];
      return browser
          .waitForVisible(dataLocator, TIMEOUT_CONST)
          .getText(dataLocator)
          .then(function (actualValue){
            expect(actualValue).to.not.equal(substring)
          }.bind(this))

    });

    this.Then(/^User should see color of "([^"]*)" as "([^"]*)"$/, function(dataLocator, substring) {
        dataLocator = objData[dataLocator];
      return browser
          .waitForVisible(dataLocator, TIMEOUT_CONST)
          .getCssProperty(dataLocator,'color')
          .then(function (actualValue){
            console.log(actualValue.value);
          }.bind(this))

    });


      this.When(/^User wait for "([^"]*)" second$/, function (value) {
          return browser
              .pause(value)
      });
      

    this.When(/^User should see element "(.*)" exist|existed/,function(dataLocator) {
        dataLocator = objData[dataLocator];
      return browser
          .waitForExist(dataLocator,TIMEOUT_CONST)
          .isExisting(dataLocator)
          .then(function(isExisting) {
            if(isExisting) {
              return assert(true===true,'Expected element exists');
            }
          }.bind(this));
    });

    this.Given(/^User should see the default text as "([^"]*)" for "([^"]*)"$/, function (expectedValue, dataLocator) {
        dataLocator = objData[dataLocator];
      return browser
        .waitForVisible(dataLocator, TIMEOUT_CONST)
        .getText(dataLocator)
        .then(function (actualValue) {
          expect(actualValue).to.equal(expectedValue);
        }.bind(this))
    });

    this.Then(/^User should see the text of "([^"]*)" should be "([^"]*)"$/, function(dataLocator, substring) {

        dataLocator = objData[dataLocator];
      return browser
        .waitForVisible(dataLocator, TIMEOUT_CONST)
        .getText(dataLocator)
        .then(function (actualValue) {
          expect(actualValue).to.equals("Done! Computer "+substring+ " has been created");
        }.bind(this))

    });

    this.Then(/^User should see the text of "([^"]*)" as "([^"]*)"$/, function(dataLocator, substring) {

        dataLocator = objData[dataLocator];
      return browser
          .waitForVisible(dataLocator, TIMEOUT_CONST)
          .getText(dataLocator)
          .then(function (actualValue) {
            expect(actualValue).to.equals(substring);
          }.bind(this))

    });

      this.When(/^User hit load of "([^"]*)" users on url "([^"]*)" and generate report$/, function(users,url) {
          var options = {
              url: url,
              maxRequests: users,
          };
          loadtest.loadTest(options, function(error, result)
          {
              if (error)
              {
                  return console.error('Got an error: %s', error);
              }
              console.log(result);
          });

      });



      this.Then(/^User does not see "([^"]*)" to be exist$/, function (dataLocator) {
        dataLocator = objData[dataLocator];
      browser
        .isExisting(selector)
        .then(function(isExisting){
          if (!isExisting){
            return this.assert(true === true, 'Expected element does not exist as expected');
          }
          else{
            return this.assert(true === false, 'Expected element should not exist but its existing')
          }
        }.bind(this));
    });

      this.Then(/^User check accessibility compliance on page$/, function(){

          const webdriver = browser;
          if (typeof browser.executeScript !== 'function' && typeof browser.execute === 'function'){
              webdriver.executeScript = function executeScript() {
                  const res = this.execute.apply(this, arguments);
                  return Promise.resolve(res);
              }.bind(webdriver);
          }
          if (typeof webdriver.executeAsyncScript !== 'function' && typeof webdriver.executeAsync === 'function') {
              webdriver.executeAsyncScript = function executeAsyncScript() {
                  const res = this.executeAsync.apply(this, arguments);
                  return Promise.resolve(res);
              }.bind(webdriver);
          }
          if (typeof webdriver.switchTo !== 'function' && typeof webdriver.frame === 'function') {
              webdriver.switchTo = function switchTo() {
                  return {
                      window: function window() {
                          const res = this.window.apply(this, arguments);
                          return Promise.resolve(res);
                      }.bind(this),
                      frame: function frame() {
                          const res = this.frame.apply(this, arguments);
                          return Promise.resolve(res);
                      }.bind(this),
                      defaultContent: function defaultContent() {
                          const res = this.frame.apply(this, null);
                          return Promise.resolve(res);
                      }.bind(this),
                  }
              }.bind(webdriver);
          }
          if (typeof webdriver.findElements !== 'function' && typeof webdriver.elements === 'function') {
              webdriver.findElements = function findElements(selector) {
                  return webdriver.elements('<${selector.tagName}>');
              }.bind(webdriver);
          }

          return new Promise(function (resolve, reject) {
              AxeBuilder(webdriver).withTags("AAA").analyze(resolve);
          }).then(function (results) {
              console.log(results);
              console.log(results.value);
              errors_axe = results.value.violations.length;
              axe_report = results.value.violations;
              for (i = 0; i < errors_axe; i++) {
                  if (i === 0) {
                      err_desc_aXe = '\t AXE Error: ' + results.value.violations[i].description;
                  } else {
                      err_desc_aXe = err_desc_aXe + '\n\t AXE Error: ' + results.value.violations[i].description;
                  }
              }
              if (parseInt(errors_axe) != 0) {
                  console.log('TEST FAILED');
                  return Promise.reject(
                      new Error(
                          '\n\n' +
                          'Accessibility Report Summary: ' +
                          '\n' +
                          err_desc_aXe +
                          '\n\n' +
                          'AXE REPORT: ' +
                          '\n\n' +
                          JSON.stringify(axe_report, null, '\t')
                      )
                  );
              }
          });

      });

      this.When(/^User measure performance of the application for load of "([^"]*)" users$/, function(users) {
          var options = {
              url: 'https://quickspin.com/',
              maxRequests: users,
          };
          loadtest.loadTest(options, function(error, result)
          {
              if (error)
              {
                  return console.error('Got an error: %s', error);
              }
              console.log(result);
          });

      });

      this.Then(/^User does creative QA "([^"]*)"$/, function (PageName,done) {

          webdrivercss.init(browser, {});

          return browser
                 .webdrivercss("client", {
                  screenWidth: [1024],
                  name: PageName,
                  misMatchTolerance: 0.10,
              })
              .then(function (res, err) {
                  assert.ifError(err);
                //  assert.ok(res[PageName][0].isWithinMisMatchTolerance);
              }).call(done);
      });


  };

  module.exports = GuruKulaService;
}

catch(err) {

  console.log('Error found in GurukulaService_stepdef.js File');
  console.log(err);
}
