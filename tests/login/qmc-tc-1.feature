Feature: Sprint Loading State

  @login @smoke
  Scenario: All Sprint User Stories are correctly displayed after loading
    Given the user is authenticated and on the Sprint List page
    And a Sprint named 'QA Sprint' contains User Stories 'Story A', 'Story B', and 'Story C'
    When the user opens 'QA Sprint'
    Then a loading indicator is shown while stories are being fetched
    And after loading completes, 'Story A' is visible in the Sprint view
    And 'Story B' is visible in the Sprint view
    And 'Story C' is visible in the Sprint view
    And the loading indicator is no longer displayed
