package com.memtime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.memtime.pages.HomePage;
import org.junit.jupiter.api.Test;

class HomeTest extends BaseTest {

  @Test
  void appLoadsWithBrandAndPanels() {
    HomePage page = new HomePage(driver, baseUrl);
    page.open();
    page.waitForApp();

    assertEquals("Memtime", page.brandTitle());
    assertNotNull(page.findByTestId("clients-panel"));
    assertNotNull(page.findByTestId("projects-panel"));
    assertNotNull(page.findByTestId("tasks-panel"));
    assertNotNull(page.findByTestId("time-entries-panel"));
    assertNotNull(page.findByTestId("time-entry-form"));
  }

  @Test
  void clientsLoadFromApi() {
    HomePage page = new HomePage(driver, baseUrl);
    page.open();
    page.waitForApp();
    page.waitForClients();

    assertFalse(page.clientItems().isEmpty());
  }
}
