import express from 'express';
const router = express.Router();

import { deleteOrderRouter } from './delete';
import { newOrderRouter } from './new';
import { showOrderRouter } from './show';
import { listOrderRouter } from './list';

router.use(deleteOrderRouter);
router.use(newOrderRouter);
router.use(showOrderRouter);
router.use(listOrderRouter);

export { router };
