const { Builder, By, until } = require("selenium-webdriver");

/*
This script uses Selenium WebDriver to automate a login test for a web application. It performs the following steps:
1. Opens a Chrome browser and navigates to the login page.
2. Fills in the username and password fields with predefined credentials.
3. Clicks the login button and waits for XSS alert.
4. Waits for a redirect to the /students page to confirm a successful login.
5. Closes XSS alert again
6. Click the add student button
7. Fills in the new student form and submits it.
8. Verifies that the new student appears in the student list.
9. Logs the result of the test (pass/fail) to the console.
10. Closes the browser.
*/

async function userAddTest() {
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

    await driver.findElement(By.css("a[href='/students/add']")).click();

    await driver.findElement(By.name("name")).sendKeys("Test Student");
    await driver.findElement(By.name("course")).sendKeys("Computer Science");

    await driver.findElement(By.css("button")).click();
    
    //Dismisses alert for the second time due to XSS demonstration
    await driver.wait(until.alertIsPresent(), 2000);
      await alert.accept();

    // Wait for redirect back to /students
    await driver.wait(until.urlContains("/students"), 3000);

    // Verify student appears in the list
    const pageSource = await driver.getPageSource();

    //Checks to see if "Test Student" is in the page source to confirm addition
    if (pageSource.includes("Test Student")) {
      console.log("Add Student Test: PASSED");
    } else {
      console.log("Add Student Test: FAILED - No Student found.");
    }

  } catch (error) {
    //Error handling, will print fail message and reason
    console.log("Add Student Test: FAILED");
    console.log("Reason:", error.message);
  } finally {
    //Close browser at test end
    await driver.quit();
  }
}

userAddTest();
