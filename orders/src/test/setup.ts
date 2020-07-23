import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

global.signin = () => {
  // Build a JWT payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt }
  const session = { jwt: token };

  // Turn the session to JSON
  const sessionJSON = JSON.stringify(session);

  // Encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return the string with cookie with encoded data
  return [`express:sess=${base64}`];
};

jest.mock('../lib/nats-client');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
});
