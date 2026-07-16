import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pageFixture } from '../../../hooks/pageFixture';
import { SprintListPage } from '../../pages/SprintListPage';
import { SprintViewPage } from '../../pages/SprintViewPage';

const getSprintListPage = () => new SprintListPage(pageFixture.page);
const getSprintViewPage = () => new SprintViewPage(pageFixture.page);

Given("a Sprint named 'QA Sprint' contains User Stories 'Story A', 'Story B', and 'Story C'", async function () {
  // Precondition / test data setup is assumed to exist in the environment.
  // This step is intentionally a no-op.
});

When("the user opens 'QA Sprint'", async function () {
  await getSprintListPage().openSprintByName('QA Sprint');
});

Then('a loading indicator is shown while stories are being fetched', async function () {
  await getSprintViewPage().assertLoadingIndicatorVisible();
});

Then("after loading completes, 'Story A' is visible in the Sprint view", async function () {
  await getSprintViewPage().waitForLoadingToComplete();
  await getSprintViewPage().assertStoryVisible('Story A');
});

Then("'Story B' is visible in the Sprint view", async function () {
  await getSprintViewPage().assertStoryVisible('Story B');
});

Then("'Story C' is visible in the Sprint view", async function () {
  await getSprintViewPage().assertStoryVisible('Story C');
});

Then('the loading indicator is no longer displayed', async function () {
  await getSprintViewPage().assertLoadingIndicatorHidden();
});
