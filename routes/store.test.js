process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');
const items = require('../fakeDB');

let popcorn = { name: 'Popcorn', price: 1.75 };

beforeEach(() => {
  items.push(popcorn);
});

afterEach(() => {
  items.length = 0;
});

/****** Get all items ******/

describe('GET /items', () => {
  test('Gets list of items in store', async () => {
    const resp = await request(app).get('/items');
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ items: [popcorn] });
  });
});

/****** Get indiviual item by name ******/

describe('GET /items/:name', () => {
  test('Gets single item by name', async () => {
    const resp = await request(app).get(`/items/${popcorn.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ item: popcorn });
  });

  test('Respond with 404 if item is not found', async () => {
    const resp = await request(app).get('/items/pizza');
    expect(resp.statusCode).toBe(404);
  });
});

/****** Create indiviual item ******/

describe('POST /items', () => {
  test('Create new item', async () => {
    const resp = await request(app)
      .post('/items')
      .send({ name: 'KitKat', price: 1.25 });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ item: { name: 'KitKat', price: 1.25 } });
  });
  test('Missing name responds with 400 error', async () => {
    const resp = await request(app).post('/items').send({ price: 1.25 });
    expect(resp.statusCode).toBe(400);
  });
  test('Missing price responds with 400 error', async () => {
    const resp = await request(app).post('/items').send({ name: 'KitKat' });
    expect(resp.statusCode).toBe(400);
  });
  test('Missing name and price responds with 400 error', async () => {
    const resp = await request(app).post('/items').send({});
    expect(resp.statusCode).toBe(400);
  });
});

/****** Update indiviual item ******/

describe('PATCH /items/:name', () => {
  test('Update item name', async () => {
    const resp = await request(app)
      .patch(`/items/${popcorn.name}`)
      .send({ name: 'Carmel Popcorn' });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: 'Carmel Popcorn', price: 1.75 },
    });
  });
  test('Update item price', async () => {
    const resp = await request(app)
      .patch(`/items/${popcorn.name}`)
      .send({ price: 2.5 });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: 'Carmel Popcorn', price: 2.5 },
    });
  });
  test('Update item name and price', async () => {
    const resp = await request(app)
      .patch(`/items/${popcorn.name}`)
      .send({ name: 'Carmel Popcorn', price: 2.5 });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: 'Carmel Popcorn', price: 2.5 },
    });
  });

  test('Item not found responds with 404', async () => {
    const resp = await request(app)
      .patch(`/items/cake`)
      .send({ name: 'Chocolate Cake', price: 12.99 });
    expect(resp.statusCode).toBe(404);
  });
});

/****** Delete item ******/

describe('DELETE /items/:name', () => {
  test('Deletes item from store', async () => {
    const resp = await request(app).delete(`/items/${popcorn.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: 'Deleted' });
  });

  test('Item not found responds with 404', async () => {
    const resp = await request(app).delete('/items/cake');
    expect(resp.statusCode).toBe(404);
  });
});
