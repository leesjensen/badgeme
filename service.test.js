const request = require('supertest');
const app = require('./service');

test('homepage', async () => {
  const getHomepageRes = await request(app).get('/');
  expect(getHomepageRes.status).toBe(200);
  expect(getHomepageRes.headers['content-type']).toMatch('text/html; charset=UTF-8');
  expect(getHomepageRes.text).toContain('<title>BadgeMe</title>');
});
