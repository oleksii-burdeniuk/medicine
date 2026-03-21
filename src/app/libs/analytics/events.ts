export const EVENTS = {
  MENU_OPEN: 'menu_click',
  SAVE_CLICK: 'save_click',
  DELETE_CLICK: 'delete_click',
  PASTE_LAST_SAVED_CLICK: 'paste_last_saved_click',
  USER_CLICK: 'user_click',
  SCANNER_CLICK: 'scanner_click',
  LIST_CLICK: 'list_click',
  LINKEDIN_CLICK: 'linkedin_click',
  GITHUB_CLICK: 'github_click',
  SMART_LUNCH_CLICK: 'smart_lunch_click',
  LANGUAGE_CHANGE: 'language_change',
  CHOOSE_PHOTO_CLICK: 'choose_photo_click',
} as const;
export type EventKey = keyof typeof EVENTS;
export type EventType = (typeof EVENTS)[EventKey];
