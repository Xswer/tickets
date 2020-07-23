import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: 'sadfasddf',
  });

  // Save the ticket to the DB
  await ticket.save();

  // fetch the ticket twice
  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);

  // make two separate changes to the tickets we found
  ticket1!.set({ price: 10 });
  ticket2!.set({ price: 15 });
  // save the first fetched ticket
  await ticket1!.save();
  // save the second, expect error
  try {
    await ticket2!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this code');
});

it('increments a version num on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
