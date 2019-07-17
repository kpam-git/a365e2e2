param
(
    [parameter(Mandatory = $false)] [String] $baseUrl='https://web-ci.projectarcadia.net/',
    [parameter(Mandatory = $false)] [String] $email='a365-e2e@microsoft.com',
    [parameter(Mandatory = $false)] [String] $password
)

# .\node_modules\.bin\protractor.cmd protractor.chrome.conf.js --baseUrl=$baseUrl --params.login.email=$email --params.login.password=$password
# Start-Process cmd.exe -ArgumentList "/C webdriver-manager start --edge <Path of MicrosoftWebDriver.exe>"
.\node_modules\.bin\protractor.cmd protractor.edge.conf.js --baseUrl=$baseUrl --params.login.email=$email --params.login.password=$password
