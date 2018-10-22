@sprint1
Feature: To verify the performance and load testing of application

  Scenario Outline: User should be able to see and analyze the data related to load of multiple user

    Then User hit load of "100" users on url "<Loginpage>" and generate report

  Examples:
    |Loginpage               |
    |https://quickspin.com/|


