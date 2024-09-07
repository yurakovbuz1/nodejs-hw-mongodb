import express from 'express';
import cors from 'cors';
import pinoHTTP from 'pino-http';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());

app.use(
  pinoHTTP({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(cookieParser());

app.use('/contacts', contactsRouter);

app.use('/auth', authRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
