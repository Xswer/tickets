import express, { Request, Response } from 'express';
const router = express.Router();
import mongoose from 'mongoose';

import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsClient } from '../lib/nats-client';

const EXPIRATION_PERIOD_SECONDS = 15 * 60;

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@xstickets/common';
import { body } from 'express-validator';

import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

router.post(
  '/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // Make sure that the ticket was not reserved
    // Find order with this ticket and order status != cancelled
    if (await ticket.isReserved())
      throw new BadRequestError('Ticket is already reserved');

    // Calculate expiration date
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_PERIOD_SECONDS);

    // Build order and save to the DB
    const order = Order.build({
      userId: req.user!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    // Publish an event "order:created"
    new OrderCreatedPublisher(natsClient.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  },
);

export { router as newOrderRouter };
