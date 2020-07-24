import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { router } from './routes';
import { errorHandler } from '@xstickets/common';
import { NotFoundError } from '@xstickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  }),
);

app.use('/api', router);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
