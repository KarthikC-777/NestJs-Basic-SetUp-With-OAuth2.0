import { HttpStatus } from '@nestjs/common';

export const HTTP_STATUS_CODE_MESSAGE = {
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error Occurred.',
  [HttpStatus.BAD_REQUEST]: 'Bad Request.',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized.',
  [HttpStatus.CONFLICT]: 'Conflict Occurred.',
  [HttpStatus.FORBIDDEN]: 'Access Denied.',
  [HttpStatus.NOT_FOUND]: 'Not Found.',
  [HttpStatus.PAYLOAD_TOO_LARGE]: 'Request Entity Size too large.',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Rate limit exceeded.',
} as const;

export const RESPONSE_MESSAGE_CONSTANT = {
  DEFAULT: {
    ERROR: 'Sorry! Something is wrong with this request!',
    VALIDATION: 'Validation Failed',
    PAGE_NOT_FOUND: 'Page not found',
    CREATE_SUCCESS: 'Successfully Created',
    UPDATE_SUCCESS: 'Successfully Updated!',
    DELETE_SUCCESS: 'Successfully Deleted!',
    DELETE_FAIL: 'Delete Unsuccessful',
    LIST: 'List fetch successfully!',
    DETAILS: 'Details fetched successfully!',
    NOT_FOUND: 'Details not found!',
    VALID_MONGO_ID: 'Not a valid MongoID',
    ALREADY_EXISTS: 'Data already exists.',
    SUCCESS: 'Success.',
    SIGNUP_COMPLETE: 'Successfully signed up!',
    BAD_REQUEST: 'Bad request',
    ALREADY_SIGNED_UP: 'You already completed the sign-up process!',
    EMAIL_NOT_VERIFIED: 'Your email id is not verified',
    CREDENTIAL_MISMATCH: 'Credentials do not match',
    CREDENTIAL_INVALID: 'Client credentials not provided OR invalid',
    MAX_LOGIN: 'Too many active logins',
  },
  DB: {
    MODULE_SAVE_SUCCESS: '{{MODULE}} has been saved successfully.',
    MODULE_SAVE_FAILED: 'Failed to save {{MODULE}}.',
    MODULE_UPDATE_SUCCESS: '{{MODULE}} has been updated successfully.',
    MODULE_UPDATE_FAILED: 'Failed to update {{MODULE}}.',
    MODULE_DELETE_SUCCESS: '{{MODULE}} has been deleted successfully.',
    MODULE_DELETE_FAILED: 'Failed to delete {{MODULE}}.',
    MODULE_RESTORE_SUCCESS: '{{MODULE}} has been restored successfully.',
    MODULE_RESTORE_FAILED: 'Failed to restore {{MODULE}}.',
    MODULE_COPY_SUCCESS: '{{MODULE}} has been copied successfully.',
    MODULE_DETAILS: '{{MODULE}} details fetched successfully.',
    MODULE_FETCH: '{{MODULE}} fetched successfully.',
    MODULE_FETCH_FAILED: 'Failed to fetch {{MODULE}}.',
    MODULE_NOT_FOUND: '{{MODULE}} not found.',
    MODULE_ALREADY_EXISTS: '{{MODULE}} already exists.',
  },
  DEFAULT_VALIDATION: {
    ACCEPTED: 'The {{attribute}} must be accepted.',
    ACTIVE_URL: 'The {{attribute}} is not a valid URL.',
    AFTER: 'The {{attribute}} must be a date after {{date}}.',
    AFTER_OR_EQUAL:
      'The {{attribute}} must be a date after or equal to {{date}}.',
    ALPHA: 'The {{attribute}} may only contain letters.',
    ALPHA_DASH:
      'The {{attribute}} may only contain letters, numbers, and dashes.',
    ALPHA_NUM: 'The {{attribute}} may only contain letters and numbers.',
    ARRAY: 'The {{attribute}} must be an array.',
    BEFORE: 'The {{attribute}} must be a date before {{date}}.',
    BEFORE_OR_EQUAL:
      'The {{attribute}} must be a date before or equal to {{date}}.',
    BETWEEN: {
      NUMERIC: 'The {{attribute}} must be between {{min}} and {{max}}.',
      FILE: 'The {{attribute}} must be between {{min}} and {{max}} kilobytes.',
      STRING:
        'The {{attribute}} must be between {{min}} and {{max}} characters.',
      ARRAY: 'The {{attribute}} must have between {{min}} and {{max}} items.',
    },
    BOOLEAN: 'The {{attribute}} field must be true or false.',
    CONFIRMED: 'The {{attribute}} confirmation does not match.',
    DATE: 'The {{attribute}} is not a valid date.',
    DATE_EQUALS: 'The {{attribute}} must be a date equal to {{date}}.',
    DATE_FORMAT: 'The {{attribute}} does not match the format {{format}}.',
    DIFFERENT: 'The {{attribute}} and {{other}} must be different.',
    DIGITS: 'The {{attribute}} must be {{digits}} digits.',
    DIGITS_BETWEEN:
      'The {{attribute}} must be between {{min}} and {{max}} digits.',
    DIMENSIONS: 'The {{attribute}} has invalid image dimensions.',
    DISTINCT: 'The {{attribute}} field has a duplicate value.',
    EMAIL: 'The {{attribute}} must be a valid email address.',
    ENDS_WITH:
      'The {{attribute}} must end with one of the following: {{values}}',
    EXISTS: 'The selected {{attribute}} is invalid.',
    FILE: 'The {{attribute}} must be a file.',
    FILLED: 'The {{attribute}} field is required.',
    GT: {
      NUMERIC: 'The {{attribute}} must be greater than {{value}}.',
      FILE: 'The {{attribute}} must be greater than {{value}} kilobytes.',
      STRING: 'The {{attribute}} must be greater than {{value}} characters.',
      ARRAY: 'The {{attribute}} must have more than {{value}} items.',
    },
    GTE: {
      NUMERIC: 'The {{attribute}} must be greater than or equal {{value}}.',
      FILE: 'The {{attribute}} must be greater than or equal {{value}} kilobytes.',
      STRING:
        'The {{attribute}} must be greater than or equal {{value}} characters.',
      ARRAY: 'The {{attribute}} must have {{value}} items or more.',
    },
    IMAGE: 'The {{attribute}} must be an image.',
    IN: 'The selected {{attribute}} is invalid.',
    INTEGER: 'The {{attribute}} must be an integer.',
    IP: 'The {{attribute}} must be a valid IP address.',
    IPV4: 'The {{attribute}} must be a valid IPv4 address.',
    IPV6: 'The {{attribute}} must be a valid IPv6 address.',
    JSON: 'The {{attribute}} must be a valid JSON string.',
    LT: {
      NUMERIC: 'The {{attribute}} must be less than {{value}}.',
      FILE: 'The {{attribute}} must be less than {{value}} kilobytes.',
      STRING: 'The {{attribute}} must be less than {{value}} characters.',
      ARRAY: 'The {{attribute}} must have less than {{value}} items.',
    },
    LTE: {
      NUMERIC: 'The {{attribute}} must be less than or equal {{value}}.',
      FILE: 'The {{attribute}} must be less than or equal {{value}} kilobytes.',
      STRING:
        'The {{attribute}} must be less than or equal {{value}} characters.',
      ARRAY: 'The {{attribute}} must not have more than {{value}} items.',
    },
    MAX: {
      NUMERIC: 'The {{attribute}} may not be greater than {{max}}.',
      FILE: 'The {{attribute}} may not be greater than {{max}} kilobytes.',
      STRING: 'The {{attribute}} may not be greater than {{max}} characters.',
      ARRAY: 'The {{attribute}} may not have more than {{max}} items.',
    },
    MIMES: 'The {{attribute}} must be a file of type: {{values}}.',
    MIMETYPES: 'The {{attribute}} must be a file of type: {{values}}.',
    MIN: {
      NUMERIC: 'The {{attribute}} must be at least {{min}} characters long.',
      FILE: 'The {{attribute}} must be at least {{min}} kilobytes.',
      STRING: 'The {{attribute}} must be at least {{min}} characters.',
      ARRAY: 'The {{attribute}} must have at least {{min}} items.',
    },
    NOT_IN: 'The selected {{attribute}} is invalid.',
    NOT_REGEX: 'The {{attribute}} format is invalid.',
    NUMERIC: 'The {{attribute}} must be a number.',
    PRESENT: 'The {{attribute}} field must be present.',
    REGEX: 'The {{attribute}} format is invalid.',
    REQUIRED: 'The {{attribute}} field is required.',
    REQUIRED_IF:
      'The {{attribute}} field is required when {{other}} is {{value}}.',
    REQUIRED_UNLESS:
      'The {{attribute}} field is required unless {{other}} is in {{values}}.',
    REQUIRED_WITH:
      'The {{attribute}} field is required when {{values}} is present.',
    REQUIRED_WITH_ALL:
      'The {{attribute}} field is required when {{values}} is present.',
    REQUIRED_WITHOUT:
      'The {{attribute}} field is required when {{values}} is not present.',
    REQUIRED_WITHOUT_ALL:
      'The {{attribute}} field is required when none of {{values}} are present.',
    SAME: 'The {{attribute}} and {{other}} must match.',
    NOTSAME: 'The {{attribute}} and {{other}} must not match.',
    SIZE: {
      NUMERIC: 'The {{attribute}} must be {{size}}.',
      FILE: 'The {{attribute}} must be {{size}} kilobytes.',
      STRING: 'The {{attribute}} must be {{size}} characters.',
      ARRAY: 'The {{attribute}} must contain {{size}} items.',
    },
    STARTS_WITH:
      'The {{attribute}} must start with one of the following: {{values}}',
    STRING: 'The {{attribute}} must be a string.',
    TIMEZONE: 'The {{attribute}} must be a valid zone.',
    UNIQUE: 'The {{attribute}} has already been taken.',
    UPLOADED: 'The {{attribute}} failed to upload.',
    URL: 'The {{attribute}} format is invalid.',
    UUID: 'The {{attribute}} must be a valid UUID.',
    INVALID_ID: 'The {{attribute}} is not valid ID.',
    INVALID: 'The {{attribute}} is not valid.',
  },
  XHR_ERROR: {
    DEFAULT: "The request couldn't be completed! Please try again later.",
    '400': 'Sorry! Something is wrong with this request!',
    '401': 'Unauthorized access to a restricted area!',
    '403': 'Access is forbidden to the requested URL!',
    '404': "The requested URL couldn't be found!",
    '413': 'The uploaded {{file}} is bigger than {{size}}!',
    '500': 'Sorry! Something is wrong with this request!',
    '429': 'Too many requests',
  },
  VALIDATION: {
    AREA_CODE: {
      MAX: 'Area code is too long. Maximum length is 4 characters',
      MIN: 'Area code is too short. Minimal length is 2 characters',
    },
    EMAIL: {
      INVALID: 'Email is invalid. Please enter valid email',
      EMPTY: 'Email is empty',
    },
    FIRST_NAME: {
      INVALID:
        'User first name should be alphanumeric only, without special characters and should not be empty.',
      EMPTY: 'First Name is empty',
    },
    LAST_NAME: {
      INVALID:
        'User last name should be alphanumeric only, without special characters and should not be empty.',
      EMPTY: 'Last Name is empty',
    },
    SETTINGS: {
      INVALID: '{settings} is invalid, should be an enum value',
    },
    PASSWORD: {
      INVALID:
        'Password must contain one capital letter, one digit, one special charcter and must be between 8-20 characters',
      MIN: 'Password must be at least 8 characters long.',
      MAX: 'Password must be maximum of 20 characters.',
      STRING: 'Password must be a string',
      EMPTY: 'Password should not be empty',
      INCORRECT: 'Current Password is incorrect',
    },
    CURRENT_PASSWORD: {
      INCORRECT: 'Current Password is incorrect',
      LESS_THAN_CURR: 'Date cannot be less than current date',
    },
    NEW_PASSWORD: {
      MATCH: 'Current Password and New password should not be same',
    },
    CONFIRM_PASSWORD: {
      INVALID: 'Confirm password is invalid',
      MATCH: 'New Password and Confirm password do not match',
    },
    CONFIRMEMAIL: {
      MATCH: "The two emails you've entered don't match",
      EMPTY: "Confirm email can't be empty",
    },

    PAGINATION: {
      INVALID: 'Page number must be a valid integer zero or greater.',
      LIMIT: {
        INVALID: 'Limit must be a valid integer one or greater.',
        MAX: 'Limit must not be greater than 30.',
        MIN: 'Limit must not be less than 1',
      },
      PAGE_NUMBER: {
        INVALID: 'Page number must be a valid integer zero or greater.',
        MIN: 'Page number must not be less than 1',
      },
      ORDER: {
        INVALID: {
          KEY: 'Order key property must be createdAt',
          VALUE: 'Order value must be either 1 or -1',
        },
      },
    },
    TOKEN: {
      EMPTY: 'Token is empty',
      GRANT_TYPE: {
        EMPTY: 'Grant type cannot be empty',
        INVALID: 'Grant type is not valid',
      },
    },
    FILE: {
      INVALID: 'This is not an {{type}}, Please upload an {{type}}',
    },

    LIMIT: {
      NAN: 'Limit should be a valid number',
    },
    PAGE: {
      NAN: 'Page should be a valid number',
    },
    LANGUAGE: {
      EMPTY: 'Language is empty',
      INVALID: 'Language is invalid',
    },
  },

  AUTH: {
    LOGOUT_SUCCESS: 'User logged out successfully',
  },

  USERS: {
    NOT_FOUND: 'User not found',
    USER_DETAILS: {
      NOT_FOUND: '{{MODULE}} details not found',
    },

    EMAIL: {
      MISMATCH: 'Email does not match with registered email',
      SEND_FAILED: '{{MODULE}} email to user sending failed',
      SEND_SUCCESS: '{{MODULE}} email to user sent successfully',
      ALREADY_VERIFIED: '{{MODULE}} already verified',
    },

    FORGOT_PASSWORD: {
      SUCCESS: 'Forgot password link sent successfully',
    },

    USERROLE: {
      INVALID: 'User role is invalid',
      EMPTY: 'User role is empty',
      FORBIDDEN: 'User role cannot be admin.',
    },
  },
} as const;
