import mongoose from 'mongoose';
import { app } from './app';
const port = 3000;

(async () => {
  console.log('Bump');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO URI must be defined');
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log('Connected to MDB');

  app.listen(port, () => {
    console.log(`Listening on port ${port}!!!`);
  });
})();
