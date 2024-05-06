export const COOKIE_SAME_SITE_POLICY = ['strict', 'none', 'lax'] as const;

export const FALLBACK_VALUES = {
  ENV: 'DEV',
  ACCESS_TOKEN_COOKIE_TIME: 14400000, //4h = 14400000ms
  REFRESH_TOKEN_COOKIE_TIME: 604800000, //7d = 604800000ms
  JWT_MUTATE_PAYLOAD: false,
  JWT_NO_TIMESTAMP: true,
  JWT_EXPIRES_IN: '2h',
};

export const AUTH = {
  MAXIMUM_SESSION: 5,
};
