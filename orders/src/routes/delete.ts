import express, { Request, Response } from 'express';
import {
  requireAuth,
  OrderStatus,
  NotFoundError,
  NotAuthorizedError,
} from '@xstickets/common';
const router = express.Router();
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsClient } from '../lib/nats-client';

router.delete(
  '/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) throw new NotFoundError();
    if (order.userId !== req.user!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event "order:updated"
    new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  },
);

export { router as deleteOrderRouter };
