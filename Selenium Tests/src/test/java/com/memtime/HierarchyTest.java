package com.memtime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.memtime.pages.HomePage;
import org.junit.jupiter.api.Test;

class HierarchyTest extends BaseTest {

  @Test
  void emptyStatesBeforeSelection() {
    HomePage page = new HomePage(driver, baseUrl);
    page.open();
    page.waitForApp();

    assertEquals("Select a client", page.projectsEmptyMessage());
    assertEquals("Select a project", page.tasksEmptyMessage());
  }

  @Test
  void selectingClientProjectTaskLoadsChildren() {
    HomePage page = new HomePage(driver, baseUrl);
    page.open();
    page.waitForApp();

    page.selectFirstClient();
    page.waitForProjects();
    assertFalse(page.projectItems().isEmpty());

    page.selectFirstProject();
    page.waitForTasks();
    assertFalse(page.taskItems().isEmpty());

    page.selectFirstTask();
    assertNotNull(page.findByTestId("time-entries-panel"));
  }
}
