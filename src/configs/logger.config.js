import winston from 'winston';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');

const format = winston.format.combine(
  winston.format.timestamp({
    format: moment().format('YYYY년 MM월 DD일 HH:mm:ss'),
  }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [ ${info.level} ] ▶ ${info.message}`
  )
);

const Logger = winston.createLogger({
  format,
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
});

export default Logger;
