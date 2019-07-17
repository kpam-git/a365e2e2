import { browser, ExpectedConditions } from 'protractor';
import { Helper } from '../Share/helper';
import { NoteBook } from './notebook.po';

const notebookName1 = 'yyangNbook1';
const notebookName2 = 'Renametest';

describe('notebook test', () => {
    const nbookpo = new NoteBook();

    beforeAll(async () => {
        await nbookpo.openAnalyzePage();
        await browser.sleep(5000);
    });

    afterAll(async () => {
        await nbookpo.closeAllTabs();
        await nbookpo.deleteNotebook(notebookName1);
        await nbookpo.deleteNotebook(notebookName2);
    });
    
    it('Refresh notebook', async () => {
        await nbookpo.refreshNotebook();
        // TODO:need to add assertion
    });

    it('Create Notebook', async () => {
        await nbookpo.expandNotebooks();
        await nbookpo.deleteNotebook(notebookName1);
        await nbookpo.deleteNotebook(notebookName2);
        await nbookpo.createNotebook();
        await nbookpo.fillInNotebookName(notebookName1);
        await Helper.pressEnter();
        await nbookpo.clickSave();
        let notebookList = await Helper.locateElementWithXpath(await Helper.readJson('notebook', 'notebook_list')).getAttribute('innerHTML');
        expect(notebookList).toContain(notebookName1);
    });

    it('Open Notebook', async () => {
        await nbookpo.openNotebook(notebookName1);
        let menuitem = await Helper.locateElementWithXpath(await Helper.readJson('notebook', 'editing_area')).getAttribute('title');
        expect(menuitem).toContain(notebookName1);
    });

    it('Add Code Cell', async () => {
        await nbookpo.addCodeCell();
        let cellNum = await Helper.locateElementsWithXpath(await Helper.readJson('notebook', 'cell_num'));
        expect(cellNum.length).toEqual(2);
    });

    it('Add Markdown Cell', async () => {
        await nbookpo.addMarkdownCell();
        let cellNum = await Helper.locateElementsWithXpath(await Helper.readJson('notebook', 'markdown_num'));
        expect(cellNum.length).toEqual(1);
    });

    it('Save Current Notebook', async () => {
        const markdownContent = 'e2etest';
        await nbookpo.inputContentIntoMarkdown(markdownContent);
        await nbookpo.clickSave();
        await browser.sleep(3000);
        await nbookpo.closeNotebook(notebookName1);
        await nbookpo.openNotebook(notebookName1);
        let markdownOutput = await Helper.locateElementWithXpath(await Helper.readJson('notebook', 'markdown_output')).getText();
        expect(markdownOutput).toEqual(markdownContent);
    });

    xit('Rename Notebook', async () => {
        await nbookpo.renameNotebook(notebookName1, notebookName2);
        await browser.sleep(3000);
        await nbookpo.clickSave();
        await nbookpo.closeNotebook(notebookName2);
        let sparkclusterName = await Helper.locateElementWithXpath(await Helper.readJson('notebook', 'notebook_list')).getText();
        expect(sparkclusterName).toContain(notebookName2);
    });

    it('Import Notebook from local', async () => {
        await nbookpo.closeNotebook(notebookName1);
        await nbookpo.importNotebook();
        await nbookpo.uploadFileFromLocal();
        await browser.sleep(5000);
        await nbookpo.clickSave();
        let markdownOutput = await Helper.locateElementWithXpath(await Helper.readJson('notebook', 'markdown_output')).getAttribute('innerHTML');
        expect(markdownOutput).toEqual('notebook import test ing');
    });

});
