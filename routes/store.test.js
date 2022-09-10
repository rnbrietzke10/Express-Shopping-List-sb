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

/****** Get all Items ******/

describe('Get /items', () => {
  test('Gets list of items in store', async () => {
    const resp = await request(app).get('/items');
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ items: [popcorn] });
  });
});
