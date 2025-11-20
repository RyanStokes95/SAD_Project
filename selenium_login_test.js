const { Builder, By, until } = require("selenium-webdriver");


/*
This script uses Selenium WebDriver to automate a login test for a web application. It performs the following steps:
1. Opens a Chrome browser and navigates to the login page.
2. Fills in the username and password fields with predefined credentials.
3. Clicks the login button and waits for XSS alert.
4. Waits for a redirect to the /students page to confirm a successful login.
5. Logs the result of the test (pass/fail) to the console.
6. Closes the browser.
*/


async function loginTest() {
  //Start Chrome browser
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    //Navigate to login page
    await driver.get("http://localhost:3000/login");

    //Fill in login fields with test acccount credentials
    await driver.findElement(By.name("username")).sendKeys("test");
    await driver.findElement(By.name("password")).sendKeys("test12345");

    //Click login button
    await driver.findElement(By.css("button")).click();

    //Dismisses the XSS alert present due to demonstration purposes
    //Without this test will hang at alert and fail
    await driver.wait(until.alertIsPresent(), 2000);
      let alert = await driver.switchTo().alert();
      await alert.accept();

    //Wait until redirected to /students
    await driver.wait(until.urlContains("/students"), 3000);

    //If reached here, login was successful, logs pass
    console.log("Login Test: PASSED");

  } catch (error) {
    console.log("Login Test: FAILED");
    console.log("Reason:", error.message);
  } finally {
    //Close browser
    await driver.quit();
  }
}

loginTest();
