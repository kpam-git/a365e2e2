import 'jasmine';
import { WorkspacePage } from './selectArcadia.po';

const aadName = 'Microsoft';
const subscriptionName = 'A365 Workspace Dev';
const workspaceName = 'mandywtest0619';

describe('workspace setting', () => {
    var workspaceinstance = new WorkspacePage();

    it('Select Arcadia Instance', async () => {
        await workspaceinstance.selectAAD(aadName);
        await workspaceinstance.selectSubscription(subscriptionName);
        await workspaceinstance.selectWorkspace(workspaceName);
        await workspaceinstance.clickContinueButton();
        expect(await workspaceinstance.getWorkspaceName()).toContain(workspaceName);
    });
});
