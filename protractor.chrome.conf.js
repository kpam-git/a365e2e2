const {
    SpecReporter
} = require('jasmine-spec-reporter');

exports.config = {
    allScriptsTimeout: 10 * 1000,
    specs: [ //selectArcadia  must be in the first ,because other specs always depend on it
        './e2e/SelectArcadiaInstance/selectArcadia.spec.ts',
        './e2e/Notebook/notebook.spec.ts',
        './e2e/SqlScripts/sqlScripts.spec.ts',
        './e2e/SqlCompute/sqlCompute.spec.ts'
    ],

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['--disable-web-security', 'user-agent=Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion', '--start-maximized']
        }
    },
    directConnect: true,

    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        // DO NOT change default timeout. Overriding timeout at it-level if your case really need to take more than 60s.
        defaultTimeoutInterval: 60 * 1000,
        print: function () { }
    },
    params: {
        login: {
            email: 'a365-e2e@microsoft.com',
            password: ''
        }
    },
    plugins: [{
        package: 'jasmine2-protractor-utils',
        disableHTMLReport: false,
        htmlReportDir: './e2e/testResult/htmlReports/',
        disableScreenshot: false,
        screenshotOnExpectFailure: true,
        screenshotOnSpecFailure: true,
        screenshotPath: './e2e/testResult/screenshots/'
    }],

    onPrepare() {
        // import sub-config
        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
        });
        //real time console spec reporter for jasmine testing framework.
        jasmine.getEnv().addReporter(new SpecReporter({
            spec: {
                displayStacktrace: true
            }
        }));

        //xml reporter
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: './e2e/testResult/xmlReports',
            filePrefix: 'e2e-xmloutput-chrome'
        }));

        browser.ignoreSynchronization = true;
        browser.driver.get(browser.baseUrl);
        browser.driver.wait(() => {
            return browser.isElementPresent(by.id('i0116'));
        }).then(() => {
            browser.driver.findElement(by.id('i0116')).sendKeys(browser.params.login.email).then(() => {
                browser.driver.sleep(1000);
                // click sign in button
                browser.driver.findElement(by.id('idSIButton9')).click();

                // wait until finished loading next page
                browser.driver.wait(() => {
                    return browser.isElementPresent(by.className('actionLink'));
                }).then(() => {
                    const loginUrl = browser.driver.getCurrentUrl();

                    // have to ensure synchronization isn't on yet or protractor may fail
                    browser.ignoreSynchronization = true;

                    // click "use password to log in"
                    browser.driver.findElement(by.css('#loginMessage > a')).click();

                    // send password
                    browser.driver.findElement(by.id('passwordInput')).sendKeys(browser.params.login.password);

                    // click submit
                    browser.driver.findElement(by.id('submitButton')).click();

                    browser.driver.wait(() => {
                        return browser.driver.getCurrentUrl() != loginUrl;
                    }).then(() => {
                        // After login, navigate to the landing page explicitly in case AAD redirects us to some other page.
                        browser.driver.get(browser.baseUrl);
                    });
                });
            }, () => {
                // User is already logged in. Do nothing.
                console.log("success");
            });
        })
    },

    onComplete() {
        browser.driver.quit();
    }
};