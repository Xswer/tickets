import express, { Request, Response } from 'express';
import { requireAuth } from '@xstickets/common';
const router = express.Router();
import { Order } from '../models/order';

router.get('/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.user!.id,
  }).populate('ticket');

  res.status(200).send(orders);
});

export { router as listOrderRouter };
