import { browser } from 'protractor';
import { Helper } from '../Share/helper';

export class SqlScript {
    public async navigateToSqlScripts(): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'analyze_button'));
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'expand_sql_scripts'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async getText(selector: string): Promise<string> {
        let text = await Helper.locateElementsWithXpath(selector).getText();
        return text;
    }

    public async getScriptNames(): Promise<string> {
        let text = await Helper.locateElementsWithXpath(await Helper.readJson('sql_scripts', 'sql_scripts_list')).getText();
        return text;
    }

    public async getRunResult(): Promise<string> {
        let result = await Helper.locateElementWithXpath(await Helper.readJson('sql_scripts', 'run_result')).getText();
        return result;
    }

    public async getMenuItem(): Promise<string> {
        let menuitem = await Helper.locateElementsWithXpath(await Helper.readJson('sql_scripts', 'menu_list')).getAttribute('title');
        return menuitem;
    }

    public async deleteSqlScriptIfExists(sqlScriptName: string): Promise<void> {
        let sqlScripts = await this.getText(await Helper.readJson('sql_scripts', 'sql_scripts_list'));
        if (sqlScripts.indexOf(sqlScriptName) !== -1) {
            await this.deleteSqlScript(sqlScriptName);
        }
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async refreshSqlscripts(): Promise<void> {
        await Helper.clickHoverButtonOf(
            await Helper.readJson('sql_scripts', 'sql_scripts'),
            await Helper.readJson('sql_scripts', 'sql_scripts_more')
        );
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'refresh_button'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async createSqlScript(): Promise<void> {
        await Helper.clickHoverButtonOf(
            await Helper.readJson('sql_scripts', 'sql_scripts'),
            await Helper.readJson('sql_scripts', 'sql_scripts_more')
        );
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'create_button'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async fillInSqlScriptName(sqlScriptName: string): Promise<void> {
        let divname = await Helper.locateElementWithXpath(await Helper.readJson('sql_scripts', 'name_input'));
        await browser.actions().doubleClick(divname).perform();
        await browser.actions().sendKeys(sqlScriptName).perform();
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async openSqlScript(scriptName: string): Promise<void> {
        await Helper.clickHoverButtonOf(
            await Helper.readJson('sql_scripts', 'sql_script', scriptName),
            await Helper.readJson('sql_scripts', 'sql_script_more', scriptName)
        );
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'open_button'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async renameSqlScript(newName: string): Promise<void> {
        await Helper.clickHoverButtonOf(
            await Helper.readJson('sql_scripts', 'sql_scripts_list'),
            await Helper.readJson('sql_scripts', 'sql_scripts_list_more')
        );
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'rename_button'));
        await browser.sleep(Helper.domStablizationTimeout);
        let elementItem = await Helper.locateElementWithXpath(await Helper.readJson('sql_scripts', 'first_sql_script'));
        await browser.actions().doubleClick(elementItem).sendKeys(newName).perform();
        await Helper.pressEnter();
    }

    public async saveSqlScript(text: string, selector: string, saveButtonSelector: string): Promise<void> {
        await this.fillEditor(text, selector);
        await browser.sleep(Helper.domStablizationTimeout);
        await Helper.clickElementWhenClickable('xpath', saveButtonSelector);
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async closeSqlScript(selector: string): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', selector);
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async fillEditor(text: string, selector: string): Promise<void> {
        let elementItem = await Helper.locateElementWithXpath(selector);
        await browser.actions().click(elementItem).perform();
        await Helper.pressEnter();
        await browser.actions().sendKeys(text).perform();
    }

    public async runSqlScript(scriptName: string, connnectToName: string): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'tab_close_button', scriptName));
        await this.openSqlScript(scriptName);
        await browser.sleep(3000);
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'connect_to'));
        await browser.sleep(Helper.domStablizationTimeout);
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'connnect_list', connnectToName));
        await browser.sleep(Helper.domStablizationTimeout);
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'run_button'));
        await browser.sleep(3000);
    }

    public async switchTab(tablocator: string): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', tablocator);
    }

    public async closeAllTabs(): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'tab_container_more_btn'));
        await Helper.clickButton('Close all tabs');
    }

    public async deleteSqlScript(scriptName: string): Promise<void> {
        await Helper.clickHoverButtonOf(
            await Helper.readJson('sql_scripts', 'sql_script', scriptName),
            await Helper.readJson('sql_scripts', 'sql_script_more', scriptName)
        );
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_scripts', 'delete_button'));
        await browser.sleep(Helper.domStablizationTimeout);
    }
}
