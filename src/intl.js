
import { enUS, zhTW, zhCN  } from 'date-fns/locale';

import messagesEn from './languages/en.json'
import messagesSc from './languages/sc.json'
import messagesTc from './languages/tc.json'

// monkey patching date-fns locale
function ordinalNumber(dirtyNumber, dirtyOptions) {
  var number = Number(dirtyNumber)
  return number.toString() + '日'
}

const zhTW_patched = {
  ...zhTW,
  localize: {
    ...zhTW.localize,
    ordinalNumber,
  }
}
const zhCN_patched = {
  ...zhCN,
  localize: {
    ...zhCN.localize,
    ordinalNumber,
  }
}

const createMessages = (messagesArray) => {
  const returnObject = {};
  messagesArray.forEach(messageObject => {
    returnObject[messageObject.id] = messageObject.defaultMessage || ""
  })
  return returnObject;
}

export const messages = {
  'en-US': createMessages(messagesEn),
  'zh-CN': createMessages(messagesSc),
  'zh-TW': createMessages(messagesTc),
}

export const dateFnsLocales = {
  'en-US': enUS,
  'zh-CN': zhCN_patched,
  'zh-TW': zhTW_patched,
}