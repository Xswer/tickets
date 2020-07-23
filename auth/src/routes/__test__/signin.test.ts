import request from 'supertest';
import { app } from '../../app';

it('fails when email that does not exists supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'asdfasdf',
    })
    .expect(400);
});

it('fails when an incorrect password supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asdfasdf',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'sadfsadfa',
    })
    .expect(400);
});

it('responds with a cookie, when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asdfasdf',
    })
    .expect(201);

  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'asdfasdf',
    })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
