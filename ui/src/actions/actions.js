export const LOAD_GENERAL_MESSAGES = 'LOAD_GENERAL_MESSAGES';
export const RENDER_GENERAL_MESSAGES = 'RENDER_GENERAL_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RENDER_MESSAGE = 'RENDER_MESSAGE';

export function sendMessage(text) {
  return {
    type: SEND_MESSAGE,
    text: text
  };
}

export function loadGeneralMessages() {
  return {
    type: LOAD_GENERAL_MESSAGES
  };
}