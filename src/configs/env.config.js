import 'dotenv/config';

export default {
  port: process.env.PORT || 8000,
  development: {
    username: process.env.MARIA_USERNAME,
    password: process.env.MARIA_PASSWORD,
    database: process.env.MARIA_DATABASE,
    host: process.env.MARIA_HOST,
    dialectOptions: { charset: 'utf8mb4', dateStrings: true, typeCast: true },
    timezone: '+09:00',
  },
  saltOrRounds: process.env.SALTORROUNDS,
  jwtSecretKey: process.env.JWT_SECRETKEY,
  jwtType: process.env.JWT_TYPE,
  jwtRefreshOption: {
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
    issuer: process.env.JWT_ISSUER,
  },
  cryptoAlgorithm: process.env.CRYPTO_ALGORITHM,
  cryptoKey: process.env.CRYPTO_KEY,
  aws_bucket: process.env.AWS_BUCKET,
  awsConfig: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    region: process.env.AWS_REGION,
  },
  serviceAccountKey: {
    type: process.env.FB_TYPE,
    projectId: process.env.FB_PROJECT_ID,
    privateKeyId: process.env.FB_PRIVATE_KEY_ID,
    privateKey: process.env.FB_PRIVATE_KEY,
    clientEmail: process.env.FB_CLIENT_EMAIL,
    clientId: process.env.FB_CLIENT_ID,
    authUri: process.env.FB_AUTH_URI,
    tokenUri: process.env.FB_TOKEN_URI,
    authProviderX509CertUrl: process.env.FB_AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: process.env.FB_CLIENT_X509_CERT_URL,
  },
};
