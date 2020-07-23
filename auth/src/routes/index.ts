import express from 'express';
const router = express.Router();
import { meRouter } from './me';
import { signInRouter } from './signIn';
import { signUpRouter } from './signUp';
import { signOutRouter } from './signOut';

router.use(meRouter);
router.use(signInRouter);
router.use(signUpRouter);
router.use(signOutRouter);

export { router };
