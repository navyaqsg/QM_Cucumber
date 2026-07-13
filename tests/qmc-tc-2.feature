Feature: Sprint Loading State

  Scenario: Loading indicator displayed while Sprint stories are being fetched
    Given the user is authenticated and on the Sprint List page
    When the user selects a Sprint that contains existing User Stories
    Then a loading indicator or skeleton loader is displayed immediately
    And the 'Add Story' empty-state section is not visible during the loading phase
    And after the stories finish loading, the Sprint's User Stories are displayed correctly
    And the loading indicator is no longer visible once stories are rendered
