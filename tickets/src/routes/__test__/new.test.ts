import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsClient } from '../../lib/nats-client';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is logged in ', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
  expect(res.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdfsadf',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdfsadf',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  // add in a check to ensure, that ticket was created
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'asdfasdf';
  const price = 20;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it('publishes an event', async () => {
  const title = 'asdfasdf';
  const price = 20;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
