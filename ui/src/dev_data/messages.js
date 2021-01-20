import {formatMessageDate} from "../utils/utils";

const msgData1 = {
  username: 'User First',
  time: '19:47',
  text: 'Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 Some text message_1 ',
};
const msgData2 = {
  username: 'User Second',
  time: '19:49',
  text: 'Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 Some text message_2 ',
};
const msgData3 = {
  username: 'User Third',
  time: '19:52',
  text: 'Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 Some text message_3 ',
};
const msgData4 = {
  username: 'User First',
  time: '19:54',
  text: 'Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 Some text message_4 ',
};
const msgData5 = {
  username: 'User Third',
  time: '19:58',
  text: 'Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 Some text message_5 ',
};
const msgData6 = {
  username: 'User Second',
  time: '20:04',
  text: 'Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 Some text message_6 ',
};
const msgData7 = {
  username: 'User Third',
  time: '20:06',
  text: 'Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 Some text message_7 ',
};

let messages = [msgData1, msgData2, msgData3, msgData4, msgData5, msgData6, msgData7];

export function addMockMessage(username, text) {
  messages.push({
    username,
    time: formatMessageDate(new Date()),
    text
  })
}

export default messages;