import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

import { Password } from '../lib/password';
import { validateRequest } from '@xstickets/common';
import { BadRequestError } from '@xstickets/common';
import { User } from '../models';

router.post(
  '/users/signIn',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(user.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(200).send(user);
  },
);

export { router as signInRouter };
