import { Given } from '@cucumber/cucumber';
import { pageFixture } from '../../hooks/pageFixture';
import { LoginPage } from '../pages/LoginPage';
import { SprintListPage } from '../pages/SprintListPage';

const getLoginPage = () => new LoginPage(pageFixture.page);
const getSprintListPage = () => new SprintListPage(pageFixture.page);

Given('the user is authenticated and on the Sprint List page', async function () {
  await getLoginPage().goto();
  await getLoginPage().loginWithEnvCredentials();
  await getLoginPage().selectClient('TEST');

  await getSprintListPage().goto();
  await getSprintListPage().ensureOnSprintListPage();
});
