import express, { Request, Response } from 'express';
const router = express.Router();

import { newTicketRouter } from './new';
import { showTicketRouter } from './show';
import { updateTicketRouter } from './update';
import { listTicketsRouter } from './list';

router.use(newTicketRouter);
router.use(showTicketRouter);
router.use(updateTicketRouter);
router.use(listTicketsRouter);

export { router };
