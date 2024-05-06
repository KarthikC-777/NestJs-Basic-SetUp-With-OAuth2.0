import { RESPONSE_MESSAGE_CONSTANT } from '../constants/message.constants';
import { CustomError } from './responses.util';

/**
 * It takes a message code, a dynamic payload and an overwritten message code and returns a custom
 * error object
 * @param {string} messageCode - The message code that you want to use.
 * @param [dynamicPayload] - This is an object that contains the dynamic values that you want to
 * replace in the error message.
 * @param {string} [overwrittenMessageCode] - This is the error code that you want to send to the
 * client.
 * @returns A function that takes in a string and returns a CustomError.
 */
const constructMessage = (
  messageCode: string,
  dynamicPayload?: { [k in string]: string },
  overwrittenMessageCode?: string,
): CustomError => {
  let errorMessages = RESPONSE_MESSAGE_CONSTANT;
  let message: string = messageCode;
  // check if messageCode includes .
  for (const mCode of messageCode.split('.')) {
    if (typeof errorMessages[mCode] === 'string') {
      message = errorMessages[mCode];
      break;
    }
    if (errorMessages[mCode]) {
      errorMessages = errorMessages[mCode];
    }
  }

  Object.keys(dynamicPayload || {}).forEach((constraint) => {
    dynamicPayload[constraint] &&
      (message = message.replace(
        new RegExp(`{{${constraint}}}`, 'g'),
        dynamicPayload[constraint],
      ));
  });

  return { message, errorCode: overwrittenMessageCode || messageCode };
};

/**
 * It takes a message code, a dynamic payload and an overwritten message code and returns a custom
 * error object
 * @param {string} messageCode - The message code that you want to use.
 * @param [dynamicPayload] - This is an object that contains the dynamic values that you want to
 * replace in the error message.
 * @param {string} [overwrittenMessageCode] - This is the error code that you want to send to the
 * client.
 * @returns A function that takes in a string and returns a CustomError.
 */
export const constructErrorMessage = (
  messageCode: string,
  dynamicPayload?: { [k in string]: string },
  overwrittenMessageCode?: string,
): CustomError[] => {
  return [
    constructMessage(messageCode, dynamicPayload, overwrittenMessageCode),
  ];
};

/**
 * It takes a message code, a dynamic payload and an overwritten message code and returns a custom
 * error object
 * @param {string} messageCode - The message code that you want to use.
 * @param [dynamicPayload] - This is an object that contains the dynamic values that you want to
 * replace in the error message.
 * @returns A function that takes in a string and returns a string.
 */
export const constructSuccessMessage = (
  messageCode: string,
  dynamicPayload?: { [k in string]: string },
): string => constructMessage(messageCode, dynamicPayload).message;
