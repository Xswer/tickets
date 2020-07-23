import express, { Request, Response } from 'express';
const router = express.Router();

import { createChargeRouter } from './new';

router.use(createChargeRouter);

export { router };
