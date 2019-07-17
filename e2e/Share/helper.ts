import { browser, by, element, ElementArrayFinder, ElementFinder, ExpectedConditions, Locator, protractor } from 'protractor';
const fs = require('fs');

export class Helper {
    public static readonly domStablizationTimeout: number = 1000;
    public static readonly elementWaitTimeout: number = 60000;
    static jsonlocator: { pageObject: { [pageObject: string]: { [key: string]: string } } };
    static jsonlocatoronlocal: { pageObject: { [pageObject: string]: { [key: string]: string } } };

    public static locateElementWithinScope(
        selector: string,
        text?: string,
        scope?: string
    ): ElementFinder {
        let item: ElementFinder;
        if (scope) {
            const scopeItem = element.all(<Locator>by.css(scope)).first();
            item = text
                ? scopeItem.all(by.cssContainingText(selector, text)).first()
                : scopeItem.all(<Locator>by.css(selector)).first();
        } else {
            item = text
                ? element.all(by.cssContainingText(selector, text)).first()
                : element.all(<Locator>by.css(selector)).first();
        }
        return item;
    }

    public static locateElementWithXpath(
        selector: string
    ): ElementFinder {
        let item: ElementFinder;
        item = element.all(by.xpath(selector)).first();
        return item;
    }

    public static locateElementsWithXpath(
        selector: string
    ): ElementArrayFinder {
        let item: ElementArrayFinder;
        item = element.all(by.xpath(selector));
        return item;
    }

    public static async clickElementIfPresent(
        selector: string,
        text?: string,
        scope?: string
    ): Promise<void> {
        const item = Helper.locateElementWithinScope(selector, text, scope);
        if (await item.isPresent()) {
            await Helper.scrollToElementWhenPresent(item);
            await browser.wait(
                ExpectedConditions.visibilityOf(item),
                Helper.elementWaitTimeout,
                'Element not visible.\n' + item.locator().toString()
            );
            await item.click();
        }
    }

    public static async clickElementIfVisible(
        selector: string,
        text?: string,
        scope?: string
    ): Promise<void> {
        const item = Helper.locateElementWithinScope(selector, text, scope);
        if (await item.isDisplayed()) {
            await item.click();
        }
    }

    public static async clickElementWhenClickable(
        selectortype: string, selector: string, text?: string,
        scope?: string
    ): Promise<void> {
        let item;
        if (selectortype === 'xpath') {
            item = await Helper.locateElementWithXpath(selector);
        } else if (selectortype === 'css') {
            item = await Helper.locateElementWithinScope(selector, text, scope);
        }
        await Helper.scrollToElementWhenPresent(item);
        await browser.wait(
            ExpectedConditions.elementToBeClickable(item),
            Helper.elementWaitTimeout,
            'Element not clickable.\n' + item.locator().toString()
        );
        await item.click();
    }

    public static async clickButton(buttonText: string): Promise<void> {
        const btn = element(by.buttonText(buttonText));
        await browser.wait(
            ExpectedConditions.visibilityOf(btn),
            Helper.elementWaitTimeout,
            'Element not visible.\n' + btn.locator().toString()
        );
        await browser.sleep(Helper.domStablizationTimeout);
        await btn.click();
    }

    public static async clickIcon(iconClass: string): Promise<void> {
        const icon = element(<Locator>by.css('img[src*=' + iconClass + ']'));
        await browser.wait(
            ExpectedConditions.visibilityOf(icon),
            Helper.elementWaitTimeout,
            'Element not visible.\n' + icon.locator().toString()
        );
        await browser.sleep(Helper.domStablizationTimeout);
        await icon.click();
    }

    public static async selectDropdown(
        css: string,
        value: string
    ): Promise<void> {
        const dropdown = element(<Locator>by.css(css));
        await browser.wait(
            ExpectedConditions.elementToBeClickable(dropdown),
            Helper.elementWaitTimeout,
            'Element not clickable.\n' + dropdown.locator().toString()
        );
        await dropdown.click();
        const option = element(by.cssContainingText('span[class^="ms-Dropdown-optionText dropdown"]', value));
        await Helper.scrollToElementWhenPresent(option);
        await browser.wait(
            ExpectedConditions.elementToBeClickable(option),
            Helper.elementWaitTimeout,
            'Element not clickable.\n' + option.locator().toString()
        );
        await option.click();
    }

    public static async clickHoverButtonOf(element: string, morebtn: string): Promise<void> {
        await browser.sleep(Helper.domStablizationTimeout);
        const elementItem: ElementFinder = await Helper.locateElementWithXpath(element);
        await Helper.scrollToElementWhenPresent(elementItem);
        await browser.wait(
            ExpectedConditions.presenceOf(elementItem),
            Helper.elementWaitTimeout,
            'Element not clickable.\n' + elementItem.locator().toString()
        );
        await browser.actions().mouseMove(elementItem).perform();
        await browser.sleep(Helper.domStablizationTimeout);
        await Helper.clickElementWhenClickable('xpath', morebtn);
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public static async fillInputWithinScope(
        selectortype: string,
        value: string,
        selector: string
    ): Promise<void> {
        let input: ElementFinder;
        if (selectortype === 'xpath') {
            input = await Helper.locateElementWithXpath(selector);
        } else if (selectortype === 'css') {
            input = await Helper.locateElementWithinScope(selector);
        }
        await browser.actions().doubleClick(input).perform().then(() => {
            input.sendKeys(value);
        });
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public static async scrollToElementWhenPresent(
        selector: ElementFinder
    ): Promise<void> {
        await browser.wait(
            ExpectedConditions.presenceOf(selector),
            Helper.elementWaitTimeout,
            'Element not present.\n' + selector.locator().toString()
        );
        await browser.executeScript(
            'arguments[0].scrollIntoView()',
            selector.getWebElement()
        );
    }

    public static async navigateFromEntryPage(catalog: string): Promise<void> {
        await Helper.selectDropdown(
            '#AppCatalogLandingPageCatalogNameSelector',
            catalog
        );
        await Helper.clickButton('Continue');
        const homePageIdentifier = element(
            by.cssContainingText('span', 'Get started by browsing')
        );
        await browser.wait(
            ExpectedConditions.visibilityOf(homePageIdentifier),
            Helper.elementWaitTimeout,
            'Element not present.\n' + homePageIdentifier.locator().toString()
        );
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public static async pressEnter(): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public static writeScreenShot(data, filename): void {
        let path: string = './SparkUIScreenshot';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        var stream = fs.createWriteStream('./SparkUIScreenshot/' + filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
    }

    public static async readJson(pageObject: string, key: string, ...args: string[]): Promise<string> {
        if (!this.jsonlocator) {
            this.jsonlocator = JSON.parse(fs.readFileSync(__dirname + '/locator.json', 'utf8'));
        }
        let expression: string = this.jsonlocator['page_object'][pageObject][key];
        if (!!expression) {
            for (const arg of args) {
                expression = expression.replace('{}', arg);
            }
        }
        return expression;
    }
}
