package com.memtime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import com.memtime.pages.HomePage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

class TimeEntryFormTest extends BaseTest {
  private static final DateTimeFormatter LOCAL =
      DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

  @Test
  void formShowsCreateModeByDefault() {
    HomePage page = new HomePage(driver, baseUrl);
    page.open();
    page.waitForApp();

    assertEquals("New time entry", page.formHeading());
    assertEquals("Create entry", page.findByTestId("submit-entry-button").getText());
  }

  @Test
  void createTimeEntryAfterSelectingProject() {
    HomePage page = new HomePage(driver, baseUrl);
    page.open();
    page.waitForApp();

    page.selectFirstClient();
    page.selectFirstProject();
    page.waitForTasks();

    Select select = page.taskSelect();
    List<WebElement> options =
        select.getOptions().stream()
            .filter(option -> option.getAttribute("value") != null && !option.getAttribute("value").isBlank())
            .toList();
    assertFalse(options.isEmpty(), "Expected task options after selecting a project");
    select.selectByValue(options.get(0).getAttribute("value"));

    String stamp = DateTimeFormatter.ofPattern("HHmmss").format(LocalDateTime.now());
    String comment = "Selenium entry " + stamp;
    LocalDateTime start = LocalDateTime.now().withSecond(0).withNano(0);
    page.fillTimeEntry(comment, start.format(LOCAL), start.plusMinutes(30).format(LOCAL));
    page.submitTimeEntry();

    page.waitForToastContaining("Created time entry");
  }
}
