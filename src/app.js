import express from 'express';
import cors from 'cors';
import pinoHTTP from 'pino-http';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate.js';
import path from 'node:path';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const app = express();

app.use(cors());

app.use('/api-docs', swaggerDocs());

app.use('/avatars', express.static(path.resolve('src', 'public/avatars')));

app.use(
  pinoHTTP({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(cookieParser());

app.use('/contacts', authenticate, contactsRouter);

app.use('/auth', authRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
