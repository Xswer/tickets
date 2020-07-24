import mongoose from 'mongoose';
import { app } from './app';
import { natsClient } from './lib/nats-client';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
const port = 3000;

(async () => {
  console.log('Bump');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO URI must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  await natsClient.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL,
  );
  natsClient.client.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });
  process.on('SIGINT', () => natsClient.client.close());
  process.on('SIGTERM', () => natsClient.client.close());

  new OrderCreatedListener(natsClient.client).listen();
  new OrderCancelledListener(natsClient.client).listen();

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
