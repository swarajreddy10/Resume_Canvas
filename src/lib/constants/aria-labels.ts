/**
 * ARIA Labels for Accessibility
 * Centralized accessibility labels
 */

export const ariaLabels = {
  navigation: {
    mainMenu: 'Main navigation',
    userMenu: 'User menu',
    sidebar: 'Sidebar navigation',
    breadcrumb: 'Breadcrumb navigation',
  },
  buttons: {
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    download: 'Download',
    share: 'Share',
    clone: 'Clone',
    menu: 'Open menu',
  },
  forms: {
    required: 'Required field',
    optional: 'Optional field',
    error: 'Error message',
    help: 'Help text',
  },
  resume: {
    preview: 'Resume preview',
    template: 'Resume template',
    section: (name: string) => `${name} section`,
  },
  status: {
    loading: 'Loading',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
  },
} as const;
