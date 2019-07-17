import { browser, ExpectedConditions } from 'protractor';
import { Helper } from '../Share/helper';

export class WorkspacePage {
    public async selectAAD(aadName: string): Promise<void> {
        await Helper.clickElementWhenClickable('css', await Helper.readJson('arcadia', 'aad_frame'));
        await Helper.clickElementWhenClickable('css', '.option-text', aadName);
    }

    public async selectSubscription(subscription: string): Promise<void> {
        await Helper.clickElementWhenClickable('css', await Helper.readJson('arcadia', 'subscription_frame'));
        await Helper.clickElementWhenClickable('css', '.option-text', subscription);
    }

    public async selectWorkspace(workspace: string): Promise<void> {
        await Helper.clickElementWhenClickable('css', await Helper.readJson('arcadia', 'workspace_frame'));
        await Helper.clickElementWhenClickable('css', '.option-text', workspace);
    }

    public async clickContinueButton(): Promise<void> {
        await Helper.clickElementWhenClickable('xpath', await Helper.readJson('arcadia', 'continue_btn'));
    }

    public async getWorkspaceName(): Promise<string> {
        let azureLabel = await Helper.locateElementWithXpath(await Helper.readJson('arcadia', 'azure_label'));
        await browser.wait(
            ExpectedConditions.visibilityOf(azureLabel),
            Helper.elementWaitTimeout,
            'loading page not finish');
        let curName = await Helper.locateElementWithXpath(await Helper.readJson('arcadia', 'current_name')).getText();
        return curName;
    }
}
