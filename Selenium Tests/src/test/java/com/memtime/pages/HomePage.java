package com.memtime.pages;

import java.time.Duration;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class HomePage {
  private final WebDriver driver;
  private final String baseUrl;
  private final WebDriverWait wait;

  public HomePage(WebDriver driver, String baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.wait = new WebDriverWait(driver, Duration.ofSeconds(30));
  }

  public void open() {
    driver.get(baseUrl);
  }

  public void waitForApp() {
    wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-testid='app']")));
  }

  public String brandTitle() {
    return driver.findElement(By.cssSelector(".app-brand h1")).getText();
  }

  public void waitForClients() {
    try {
      wait.until(
          ExpectedConditions.presenceOfElementLocated(
              By.cssSelector("[data-testid='clients-panel'] [data-testid^='client-item-']")));
    } catch (Exception firstAttempt) {
      // API rate limits can leave the first load empty — refresh once and retry.
      driver.navigate().refresh();
      waitForApp();
      wait.until(
          ExpectedConditions.presenceOfElementLocated(
              By.cssSelector("[data-testid='clients-panel'] [data-testid^='client-item-']")));
    }
  }

  public List<WebElement> clientItems() {
    return driver.findElements(
        By.cssSelector("[data-testid='clients-panel'] [data-testid^='client-item-']"));
  }

  public List<WebElement> projectItems() {
    return driver.findElements(
        By.cssSelector("[data-testid='projects-panel'] [data-testid^='project-item-']"));
  }

  public List<WebElement> taskItems() {
    return driver.findElements(
        By.cssSelector("[data-testid='tasks-panel'] [data-testid^='task-item-']"));
  }

  public void selectFirstClient() {
    waitForClients();
    clientItems().get(0).click();
  }

  public void waitForProjects() {
    wait.until(d -> !projectItems().isEmpty());
  }

  public void selectFirstProject() {
    waitForProjects();
    projectItems().get(0).click();
  }

  public void waitForTasks() {
    wait.until(d -> !taskItems().isEmpty());
  }

  public void selectFirstTask() {
    waitForTasks();
    taskItems().get(0).click();
  }

  public String projectsEmptyMessage() {
    return driver
        .findElement(By.cssSelector("[data-testid='projects-panel'] .projects-panel__empty"))
        .getText();
  }

  public String tasksEmptyMessage() {
    return driver
        .findElement(By.cssSelector("[data-testid='tasks-panel'] .tasks-panel__empty"))
        .getText();
  }

  public String formHeading() {
    return driver.findElement(By.cssSelector("[data-testid='time-entry-form'] h2")).getText();
  }

  public Select taskSelect() {
    WebElement element =
        wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-testid='task-select']")));
    return new Select(element);
  }

  public void fillTimeEntry(String comment, String start, String end) {
    WebElement commentInput = driver.findElement(By.cssSelector("[data-testid='comment-input']"));
    WebElement startInput = driver.findElement(By.cssSelector("[data-testid='start-input']"));
    WebElement endInput = driver.findElement(By.cssSelector("[data-testid='end-input']"));

    commentInput.clear();
    commentInput.sendKeys(comment);
    setReactInputValue(startInput, start);
    setReactInputValue(endInput, end);
  }

  private void setReactInputValue(WebElement element, String value) {
    ((JavascriptExecutor) driver)
        .executeScript(
            """
            const input = arguments[0];
            const value = arguments[1];
            const setter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype, 'value'
            ).set;
            setter.call(input, value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            """,
            element,
            value);
  }

  public void submitTimeEntry() {
    driver.findElement(By.cssSelector("[data-testid='submit-entry-button']")).click();
  }

  public void waitForToastContaining(String text) {
    wait.until(
        ExpectedConditions.presenceOfElementLocated(
            By.xpath("//*[@data-sonner-toast]//*[contains(text(), '" + text + "')]")));
  }

  public WebElement findByTestId(String testId) {
    return driver.findElement(By.cssSelector("[data-testid='" + testId + "']"));
  }
}
