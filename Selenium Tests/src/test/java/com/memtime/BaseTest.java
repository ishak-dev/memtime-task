package com.memtime;

import java.time.Duration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public abstract class BaseTest {
  protected WebDriver driver;
  protected String baseUrl;

  @BeforeEach
  void setUp() {
    baseUrl = System.getenv().getOrDefault("BASE_URL", "http://localhost:5173").replaceAll("/$", "");

    ChromeOptions options = new ChromeOptions();
    if (!"0".equals(System.getenv("HEADLESS"))) {
      options.addArguments("--headless=new");
    }
    options.addArguments("--window-size=1440,900");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");

    driver = new ChromeDriver(options);
    driver.manage().timeouts().implicitlyWait(Duration.ZERO);
    driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
  }

  @AfterEach
  void tearDown() {
    if (driver != null) {
      driver.quit();
    }
  }
}
