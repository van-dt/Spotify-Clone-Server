export const configuration = () => ({
  tz: process.env.TZ,
  environment: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  docker: {
    port: process.env.DOCKER_APP_PORT
      ? parseInt(process.env.DOCKER_APP_PORT, 10)
      : 3000,
    POSTGRESPort: process.env.DOCKER_DB_POSTGRES_PORT
      ? parseInt(process.env.DOCKER_DB_POSTGRES_PORT, 10)
      : 3306,
    redisPort: process.env.DOCKER_DB_REDIS_PORT
      ? parseInt(process.env.DOCKER_DB_REDIS_PORT, 10)
      : 6379,
  },
  databasePostgres: {
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT
      ? parseInt(process.env.DB_POSTGRES_PORT, 10)
      : 3306,
    user: process.env.DB_POSTGRES_USER,
    password: process.env.DB_POSTGRES_PASSWORD,
    name: process.env.DB_POSTGRES_NAME,
    trigger: process.env.DB_POSTGRES_TRIGGER
      ? JSON.parse(process.env.DB_POSTGRES_TRIGGER)
      : false,
  },
  redis: {
    host: process.env.DB_REDIS_HOST || 'localhost',
    port: process.env.DB_REDIS_PORT
      ? parseInt(process.env.DB_REDIS_PORT, 10)
      : 6379,
    ttl: process.env.DB_REDIS_TTL ? parseInt(process.env.DB_REDIS_TTL) : 0,
    name: process.env.DB_REDIS_NAME,
    prefix: process.env.DB_REDIS_PREFIX,
  },
  auth: {
    secret: process.env.SECRET_KEY,
    expire: process.env.EXPIRE_TOKEN + 's',
    secretKeyValidationTokenUrl: process.env.SECRET_KEY_VALIDATION_TOKEN_URL,
    expireValidationTokenUrl: process.env.EXPIRE_VALIDATION_TOKEN_URL + 's',
    secretKeyRefreshToken: process.env.SECRET_KEY_REFRESH_TOKEN,
    expire_refresh_token: process.env.EXPIRE_REFRESH_TOKEN + 's',
    jwtSecret: process.env.JWT_SECRET,
  },
  winston: {
    path: process.env.WINSTON_LOG_PATH,
  },
  client: {
    url: process.env.CLIENT_URL,
  },
  cms: {
    url: process.env.CMS_URL,
  },
  aws: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      url: process.env.AWS_S3_URL,
    },
    ses: {
      email: process.env.AWS_SES_EMAIL,
    },
  },
});

export enum EConfiguration {
  TZ = 'tz',

  ENVIRONMENT = 'environment',
  APP_NAME = 'appName',
  PORT = 'port',

  DOCKER_APP_PORT = 'docker.port',
  DOCKER_DB_POSTGRES_PORT = 'docker.postgresPort',
  DOCKER_DB_REDIS_PORT = 'docker.redisPort',

  DB_POSTGRES_HOST = 'databasePostgres.host',
  DB_POSTGRES_PORT = 'databasePostgres.port',
  DB_POSTGRES_USER = 'databasePostgres.user',
  DB_POSTGRES_PASSWORD = 'databasePostgres.password',
  DB_POSTGRES_NAME = 'databasePostgres.name',
  DB_POSTGRES_TRIGGER = 'databasePostgres.trigger',

  DB_REDIS_HOST = 'redis.host',
  DB_REDIS_PORT = 'redis.port',
  DB_REDIS_TTL = 'redis.ttl',
  DB_REDIS_NAME = 'redis.name',
  DB_REDIS_PREFIX = 'redis.prefix',

  AUTH_SECRET_KEY = 'auth.secret',
  AUTH_TOKEN_EXPIRE = 'auth.expire',
  AUTH_SECRET_KEY_REFRESH_TOKEN = 'auth.secretKeyRefreshToken',
  AUTH_REFRESH_TOKEN_EXPIRE = 'auth.expire_refresh_token',
  JWT_SECRET = 'auth.jwtSecret',
  SECRET_KEY_VALIDATION_TOKEN_URL = 'auth.secretKeyValidationTokenUrl',
  EXPIRE_VALIDATION_TOKEN_URL = 'auth.expireValidationTokenUrl',

  WINSTON_LOG_PATH = 'winston.path',
  DOMAIN_FRONTEND = 'domain.frontEnd',

  AWS_SECRET_ACCESS_KEY = 'aws.secretAccessKey',
  AWS_ACCESS_KEY_ID = 'aws.accessKeyId',
  AWS_REGION = 'aws.region',

  AWS_S3_BUCKET = 'aws.s3.bucket',
  AWS_S3_URL = 'aws.s3.url',

  AWS_SES_EMAIL = 'aws.ses.email',
}
