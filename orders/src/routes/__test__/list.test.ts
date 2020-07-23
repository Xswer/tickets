import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('fetches orders for a particular user', async () => {
  // create
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const cookie1 = global.signin();
  const cookie2 = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie1)
    .send({ ticketId: ticket1.id });

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie2)
    .send({ ticketId: ticket2.id });

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie2)
    .send({ ticketId: ticket3.id });

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie2)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
