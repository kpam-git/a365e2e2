import 'jasmine';
import { browser, by, element } from 'protractor';
import { Helper } from '../Share/helper';
import { SqlCompute } from './sqlCompute.po';

describe('Sql Compute test', () => {
    var sqlCompute = new SqlCompute();

    beforeAll(async () => {
        await sqlCompute.openDataPage();
    });

    it('get sql-compute-table-columns', async () => {
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute'));
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute_list'));
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute_tables'));
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute_tables_person'));
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute_tables_column'));
        await browser.sleep(5000);
        let tableColumnsName = await element(by.xpath(await Helper.readJson('sql_compute', 'sqlcompute_table_columnlist')));
        expect(tableColumnsName.getAttribute('textContent')).toContain('Id_P (int, null)');
    });

    it('get sql-compute-view-columns', async () => {
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute_views'));
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute_views_systemview'));
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute_views_systemview_information'));
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute_views_systemview_column'));
        await browser.sleep(5000);
        let viewColumnsName = await element(by.xpath(await Helper.readJson('sql_compute', 'sqlcompute_view_columnlist')));
        expect(viewColumnsName.getAttribute('textContent')).toContain('Id_P (int, null)');
    }); 

    it('new sql compute script to select top 1000', async () => {
        await sqlCompute.newEmptyScript();
        await browser.sleep(5000);
        let selectResult = await element(by.xpath(await Helper.readJson('sql_compute', 'select_result')));
        expect(selectResult.getAttribute('textContent')).toContain('Id_P');
    });

    it('filter for select result', async () => {
        await sqlCompute.getFilterInput();
        let selectResult = await element(by.xpath(await Helper.readJson('sql_compute', 'filter_result')));
        expect(selectResult.getAttribute('textContent')).toContain('1');
    });

    it('message for select result', async () => {
        await sqlCompute.clickButton(await Helper.readJson('sql_compute', 'sqlcompute_message'));
        let selectResult = await element(by.xpath(await Helper.readJson('sql_compute', 'sqlcompute_message_result')));
        expect(selectResult.getAttribute('textContent')).not.toContain("'()'");
    });
});
