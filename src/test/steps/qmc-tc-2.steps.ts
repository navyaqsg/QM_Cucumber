import { When, Then } from '@cucumber/cucumber';
import { pageFixture } from '../../hooks/pageFixture';
import { SprintListPage } from '../pages/SprintListPage';

const getSprintListPage = () => new SprintListPage(pageFixture.page);

When('the user selects a Sprint that contains existing User Stories', async function () {
  await getSprintListPage().openSprintSwitcher();
  await getSprintListPage().selectSprintThatHasStories();
});

Then('a loading indicator or skeleton loader is displayed immediately', async function () {
  await getSprintListPage().assertLoadingIndicatorVisibleImmediately();
});

Then("the 'Add Story' empty-state section is not visible during the loading phase", async function () {
  await getSprintListPage().assertAddStoryNotVisibleDuringLoading();
});

Then("after the stories finish loading, the Sprint's User Stories are displayed correctly", async function () {
  await getSprintListPage().assertUserStoriesDisplayedCorrectly();
});

Then('the loading indicator is no longer visible once stories are rendered', async function () {
  await getSprintListPage().assertLoadingIndicatorNotVisibleAfterRender();
});
