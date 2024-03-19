export const CONSTANTS = {
  jwt: {
    expiresIn: 60 * 60 * 24,
  },
  prisma: {
    // transactionのtimeout。cmサインとファイルアップロードを考慮して、40000ms = 40sを指定
    // https://www.prisma.io/docs/concepts/components/prisma-client/transactions#the-transaction-api
    maxTimeoutMs: 40_000,
  },
  dateTime: {
    jst: 9, // 日本標準時（UTC+9）
  },
  file: {
    minSizeByte: 0,
    maxSizeByte: 20_971_520, // 20MB
    attachmentsFetchMaxRetryCount: 100, // 100回
    attachmentsFetchRetryDelayMilliSeconds: 1000, // 1000ms
  },
  multiFileUpload: {
    minSizeByte: 5_242_880, // 5MB
  },
  cookie: {
    maxAage: 2 * 24 * 60 * 60 * 1000, // 2日で設定 (2日間未アクセスでセッションが切れる)。単位はms。
  },
  s3: {
    preSignedUrlExpiresIn: 60 * 60 * 24, // 1日間
  },
};
