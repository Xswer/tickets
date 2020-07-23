import express from 'express';
const router = express.Router();

import { currentUser } from '@xstickets/common';

router.get('/users/me', currentUser, (req, res) => {
  return res.status(200).send({ currentUser: req.user || null });
});

export { router as meRouter };
