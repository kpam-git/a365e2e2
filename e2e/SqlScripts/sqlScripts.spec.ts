import 'jasmine';
import { browser } from 'protractor';
import { Helper } from '../Share/helper';
import { SqlScript} from './sqlScripts.po';

const sqlScriptName1 = 'a_qionwu';
const sqlScriptName2 = 'a_second_test_tab';
const connnectToName = 'mandyw0621';

describe('Sql Scripts test', () => {
    var sqlScript = new SqlScript();

    beforeAll(async () => {
        await sqlScript.navigateToSqlScripts();
        await browser.sleep(Helper.domStablizationTimeout);
        await sqlScript.deleteSqlScriptIfExists(sqlScriptName1);
        await sqlScript.deleteSqlScriptIfExists(sqlScriptName2);
    });

    it('Refresh Sql Scripts', async () => {
        await sqlScript.refreshSqlscripts();
        // TODO:need to add assertion
    });

    it('Create Sql Script', async () => {
        await browser.sleep(Helper.domStablizationTimeout);
        let sqlScriptNames = await sqlScript.getScriptNames();
        await browser.sleep(Helper.domStablizationTimeout);
        await sqlScript.createSqlScript();
        let newSqlScriptNames = await sqlScript.getScriptNames();
        expect(newSqlScriptNames.length - sqlScriptNames.length).toEqual(1);
    });

    it('Rename Sql Script', async () => {
        await sqlScript.renameSqlScript(sqlScriptName1);
        let sqlScriptNames = await sqlScript.getScriptNames();
        expect(sqlScriptNames).toContain(sqlScriptName1);
    });

    it('Save Sql Script', async () => {
        await sqlScript.saveSqlScript(
            'Select * from Persons',
            await Helper.readJson('sql_scripts', 'editor'),
            await Helper.readJson('sql_scripts', 'save_button')
        );
        await browser.sleep(5000);
        await sqlScript.closeSqlScript(await Helper.readJson('sql_scripts', 'tab_close_button', sqlScriptName1));
        await sqlScript.openSqlScript(sqlScriptName1);
        let sqlScriptContent = await sqlScript.getText(await Helper.readJson('sql_scripts', 'first_tab_editor_content'));
        expect(sqlScriptContent).toContain('Select * from Persons');
    });

    it('Open Sql Script', async () => {
        await sqlScript.closeSqlScript(await Helper.readJson('sql_scripts', 'tab_close_button', sqlScriptName1));
        await sqlScript.openSqlScript(sqlScriptName1);
        expect(await sqlScript.getMenuItem()).toContain(sqlScriptName1);
    });

    it('Run Sql Script', async () => {
        await browser.sleep(5000);
        await sqlScript.runSqlScript(sqlScriptName1, connnectToName);
        await browser.sleep(5000);
        expect(await sqlScript.getRunResult()).not.toBeNull();
    });

    it('Open more tabs on the same time', async () => {
        await sqlScript.closeAllTabs();
        await sqlScript.openSqlScript(sqlScriptName1);
        await sqlScript.createSqlScript();
        await sqlScript.renameSqlScript(sqlScriptName2);
        await sqlScript.switchTab(await Helper.readJson('sql_scripts', 'second_tab'));
        await sqlScript.saveSqlScript(
            'Sql Script in second tabs',
            await Helper.readJson('sql_scripts', 'editor_second_tab'),
            await Helper.readJson('sql_scripts', 'save_button_second_tab')
        );
        await sqlScript.switchTab(await Helper.readJson('sql_scripts', 'first_tab'));
        let fisrtSqlscriptDisplay = await Helper.locateElementWithXpath(await Helper.readJson('sql_scripts', 'first_tab_editor_content')).isDisplayed();
        expect(fisrtSqlscriptDisplay).toEqual(true);
        await sqlScript.switchTab(await Helper.readJson('sql_scripts', 'second_tab'));
        let secondSqlScriptDisplay = await Helper.locateElementWithXpath(await Helper.readJson('sql_scripts', 'second_tab_editor_content')).isDisplayed();
        expect(secondSqlScriptDisplay).toEqual(true);
    });

    it('Delete Sql Script', async () => {
        await sqlScript.deleteSqlScript(sqlScriptName1);
        await sqlScript.deleteSqlScript(sqlScriptName2);
        let sqlScriptNames = await sqlScript.getScriptNames();
        expect(sqlScriptNames).not.toContain(sqlScriptName1);
        expect(sqlScriptNames).not.toContain(sqlScriptName2);
    });
});
