import express, { Request, Response } from 'express';
const router = express.Router();
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@xstickets/common';
import { Ticket } from '../models/ticket';
import { natsClient } from '../lib/nats-client';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

router.post(
  '/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({ title, price, userId: req.user!.id });
    await ticket.save();
    await new TicketCreatedPublisher(natsClient.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(201).send(ticket);
  },
);

export { router as newTicketRouter };
