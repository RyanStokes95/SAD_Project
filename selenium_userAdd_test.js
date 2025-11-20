const { Builder, By, until } = require("selenium-webdriver");


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
