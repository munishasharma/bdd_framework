    @sprint1
    Feature: To test and verify a game


    Scenario: To test and verify the following the controls and functioning of the game.
    Verify the Fast Play Button
    Also Verify the Autoplay Shortcut Button
    Also Verify the Default Spin Button
    Also Verify the Bet button
    Also Verify the Setiing and verify that in setting there is Sound enabled Button ,
    Games Rules button :- Open the game rules and close it.
    ALso verify the Paytable menu button
    ALso verify the game history button

    Given User navigate to application
    #    When User click on "HomePage_Game"
    #    And  User click on "GamePage_PlayButton"
    #    And User wait for "30" second
    #    And switch to iframe
    #    And User click on "GamePage_iframe"
    And User wait for "20" second
    And User click on "GamePagecontinueButton"
    And User should see element "GamePageGameRulesMenuButton" exist|existed
    And User should see element "GamePageShortCutAuto" exist|existed
    And User should see element "GamePagedefaultspinbutton" exist|existed
    And User should see element "GamePageBetShortCutButton" exist|existed
    And User should see element "GamePageMenuButton" exist|existed
    And User click on "GamePageMenuButton"
    And User should see element "settingDetailsPlaySound" exist|existed
    And User should see element "GamePageGameRulesMenuButton" exist|existed
    And User click on "GamePageGameRulesMenuButton"
    And User should see element "GamePagePlayTableMenuButton" exist|existed
    And User click on "GamePagePlayTableMenuButton"
    And User should see element "GamePageGameHistoryMenuButton" exist|existed
    And User click on "GamePageGameHistoryMenuButton"
    And User should see element "GamePageBalanceField" exist|existed
    And User should see element "GamePageBalanceValue" exist|existed
    And User should see the "GamePageBalanceValue" contains "5000"
    And User should see the "GamePageBetValue" contains "1"

    Scenario: To test and verify that the user is able to launch the game

    Given open the quickspin site to play game
    When User click on "HomePage_Game"
    And  User click on "GamePage_PlayButton"
    And User wait for "30" second

    Scenario: To test and verify that user is able to play multiple rounds.

    Given User navigate to application
    And User wait for "10" second
    And User click on "GamePagecontinueButton"
    And User click on "GamePageSpin"
    And User should see the "GamePageBalanceValue" contains "4999"
    And User should see the "GamePageBetValue" contains "1"
    And User click on "GamePageBetShortCutButton"
    And User click on "GamePage4Euro"
    And User click on "GamePageBetShortCutButton"
    And User click on "GamePageSpin"
    And User wait for "5" second
    And User click on "GamePageBetShortCutButton"
    And User click on "GamePage120Euro"
    And User click on "GamePageBetShortCutButton"
    And User click on "GamePageSpin"
    And User wait for "5" second
    And User click on "GamePageBetShortCutButton"
    And User click on "GamePage40Euro"
    And User click on "GamePageBetShortCutButton"
    And User click on "GamePageSpin"




