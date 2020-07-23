import express, { Request, Response } from 'express';
const router = express.Router();
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@xstickets/common';
import { Order } from '../models/order';

router.get(
  '/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) throw new NotFoundError();
    if (order.userId !== req.user!.id) throw new NotAuthorizedError();

    res.status(200).send(order);
  },
);

export { router as showOrderRouter };
