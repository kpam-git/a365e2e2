import { browser, ElementFinder, protractor } from 'protractor';
import { Helper } from '../Share/helper';

export class SqlCompute {

    public async openDataPage(): Promise<void> {
        await browser.sleep(Helper.domStablizationTimeout);
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_compute', 'data_button'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async clickButton(locator: string): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', locator);
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async refreshSqlCompute(): Promise<void> {
        await Helper.clickHoverButtonOf(await Helper.readJson('sql_compute', 'sql_queries'), await Helper.readJson('sql_compute', 'sql_queries_more'));
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('sql_compute', 'refresh_button'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async newEmptyScript(): Promise<void> {
        await Helper.clickHoverButtonOf(await Helper.readJson('sql_compute', 'sqlcompute_tables_person'), await Helper.readJson('sql_compute', 'app-folder-menu'));
        await Helper.clickHoverButtonOf(await Helper.readJson('sql_compute', 'new_sql_script'), await Helper.readJson('sql_compute', 'sql_select_top_1000'));
    }

    public async getFilterInput(): Promise<void> {
        await browser.sleep(Helper.domStablizationTimeout);
        await Helper.fillInputWithinScope('xpath', '1', await Helper.readJson('sql_compute', 'filter_input'));
        await browser.sleep(Helper.domStablizationTimeout);
    }
}
