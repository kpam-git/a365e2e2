import { browser, ExpectedConditions } from 'protractor';
import { Helper } from '../Share/helper';

export class NoteBook {
    public async openAnalyzePage(): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'analyze_button'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async refreshNotebook(): Promise<void> {
        await Helper.clickHoverButtonOf(await Helper.readJson('notebook', 'notebook_menu'), await Helper.readJson('notebook', 'more_btn'));
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'refresh_btn'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async createNotebook(): Promise<void> {
        await Helper.clickHoverButtonOf(await Helper.readJson('notebook', 'notebook_menu'), await Helper.readJson('notebook', 'more_btn'));
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'create_btn'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async fillInNotebookName(nbookName: string): Promise<void> {
        let divname = await Helper.locateElementWithXpath(await Helper.readJson('notebook', 'name_input'));
        await browser.actions().doubleClick(divname).perform();
        await browser.actions().sendKeys(nbookName).perform();
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async openNotebook(notebookName: string): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'notebook_item', notebookName));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async renameNotebook(oldName: string, newName: string): Promise<void> {
        await Helper.clickHoverButtonOf(
            await Helper.readJson('notebook', 'notebook_item_parent', oldName),
            await Helper.readJson('notebook', 'notebook_item_more_btn', oldName)
        );
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'rename_btn'));
        await browser.sleep(Helper.domStablizationTimeout);
        await this.fillInNotebookName(newName);
        await Helper.pressEnter();
    }

    public async addCodeCell(): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'addcell_btn'));
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'code'));
    }

    public async addMarkdownCell(): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'addcell_btn'));
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'markdown'));
    }

    public async inputContentIntoMarkdown(content: string): Promise<void> {
        let markdownEditor = await Helper.locateElementWithXpath(await Helper.readJson('notebook', 'markdown_editor'));
        await browser.actions().click(markdownEditor).perform();
        await browser.actions().sendKeys(content).perform();
    }

    public async clickSave(): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'save_btn'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async closeNotebook(notebookName: string): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'close_notebook_item', notebookName));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async expandNotebooks(): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'expand_notebooks'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async deleteNotebook(notebookName: string): Promise<void> {
        const nbookNameList = await Helper.locateElementsWithXpath(await Helper.readJson('notebook', 'notebook_list')).getAttribute('innerHTML');
        if (Array.from(nbookNameList).some(name => name.indexOf(notebookName) !== -1)) {
            await Helper.clickHoverButtonOf(
                await Helper.readJson('notebook', 'notebook_item_parent', notebookName),
                await Helper.readJson('notebook', 'notebook_item_more_btn', notebookName)
            );
            await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'delete_btn'));
            await browser.sleep(Helper.domStablizationTimeout);
        }
    }

    public async closeAllTabs(): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'tab_container_more_btn'));
        await Helper.clickButton('Close all tabs');
    }

    public async switchTabs(tablocator: string): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', tablocator);
    }

    public async importNotebook(): Promise<void> {
        await Helper.clickHoverButtonOf(await Helper.readJson('notebook', 'notebook_menu'), await Helper.readJson('notebook', 'more_btn'));
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('notebook', 'import_notebook_btn'));
        await browser.sleep(Helper.domStablizationTimeout);
    }

    public async uploadFileFromLocal(): Promise<void> {
        var path = require('path');
        var fileToUpload = './notebooks_testing.ipynb';
        var absolutePath = path.resolve(__dirname, fileToUpload);
        var fileElem = await Helper.locateElementWithinScope('input[type="file"]');
        // Unhide file input
        await browser.executeScript("arguments[0].style.visibility = 'visible'; arguments[0].style.height = '1px'; arguments[0].style.width = '1px';  arguments[0].style.opacity = 1", fileElem.getWebElement());
        await fileElem.sendKeys(absolutePath);
        // take a breath 
        await browser.sleep(Helper.domStablizationTimeout);
    }

}
