export const ERROR_MESSAGES = {
  somethingWentWrong: 'Something went wrong',
  invalidRequestBody: 'Invalid request body',
  timeEntryNotFound: 'Time entry not found',
  requestFailed: (status: number) => `Request failed with status ${status}`,

  loadClients: 'Failed to load clients',
  loadProjects: 'Failed to load projects',
  loadTasks: 'Failed to load tasks',
  loadTimeEntries: 'Failed to load time entries',

  validation: {
    taskId: 'Task ID must be a positive number',
    comment: 'Comment is required',
    start: 'Start must be a valid date/time',
    end: 'End must be a valid date/time',
    endAfterStart: 'End must be after start',
  },

  notFound: (message: string) => `Not found (404): ${message}`,
  invalidInput: (message: string) => `Invalid input (400): ${message}`,
} as const
