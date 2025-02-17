const request = require('supertest');
const app = require('./service');
const fs = require('fs');

const testAccountsDir = 'testAccounts';

beforeAll(async () => {
  app.setConfig({ accountDir: testAccountsDir });
});

afterAll(async () => {
  if (fs.existsSync(testAccountsDir)) {
    fs.rmdirSync(testAccountsDir, { recursive: true });
  }
});

test('homepage', async () => {
  const getHomepageRes = await request(app).get('/');
  expect(getHomepageRes.status).toBe(200);
  expect(getHomepageRes.headers['content-type']).toMatch('text/html; charset=UTF-8');
  expect(getHomepageRes.text).toContain('<h1>🏅 BadgeMe endpoints</h1>');
});

test('Badge create', async () => {
  const [account, badge] = generateIds();
  const labelText = 'testLabel';
  const valueText = 'testValue';
  const color = 'testColor';

  const postBadgeRes = await request(app).post(`/badge/${account}/${badge}`).query({ label: labelText, value: valueText, color: color }).set('Authorization', 'Bearer testToken');
  expect(postBadgeRes.status).toBe(200);
  expect(postBadgeRes.headers['content-type']).toMatch('image/svg+xml');

  const svgContent = postBadgeRes.body.toString('utf8');
  expect(svgContent).toContain(labelText);
  expect(svgContent).toContain(valueText);
  expect(svgContent).toContain(color);
});

test('Badge create and get', async () => {
  const [account, badge] = generateIds();
  const postBadgeRes = await request(app).post(`/badge/${account}/${badge}`).set('Authorization', 'Bearer testToken');
  expect(postBadgeRes.status).toBe(200);

  const getBadgeRes = await request(app).get(`/badge/${account}/${badge}`);
  expect(getBadgeRes.status).toBe(200);
});

test('Badge get unknown', async () => {
  const [account, badge] = generateIds();

  const getBadgeRes = await request(app).get(`/badge/${account}/${badge}`);
  expect(getBadgeRes.status).toBe(404);
  expect(getBadgeRes.headers['content-type']).toMatch('image/svg+xml');
  const svgContent = getBadgeRes.body.toString('utf8');
  expect(svgContent).toContain('😢 Not Found');
});

test('Badge create no auth', async () => {
  const [account, badge] = generateIds();
  const postBadgeRes = await request(app).post(`/badge/${account}/${badge}`);
  expect(postBadgeRes.status).toBe(401);
});

test('Badge create bad auth', async () => {
  const [account, badge] = generateIds();
  const postBadgeRes = await request(app).post(`/badge/${account}/${badge}`).set('Authorization', 'Bearer');
  expect(postBadgeRes.status).toBe(401);
});

test('Badge create bad auth undefined text', async () => {
  const [account, badge] = generateIds();
  const postBadgeRes = await request(app).post(`/badge/${account}/${badge}`).set('Authorization', 'Bearer undefined');
  expect(postBadgeRes.status).toBe(401);
});

test('Badge create good then bad auth', async () => {
  const [account, badge] = generateIds();
  let postBadgeRes = await request(app).post(`/badge/${account}/${badge}`).set('Authorization', 'Bearer testToken');
  expect(postBadgeRes.status).toBe(200);

  postBadgeRes = await request(app).post(`/badge/${account}/${badge}`).set('Authorization', 'Bearer bad');
  expect(postBadgeRes.status).toBe(401);
});

test('Badge create with bad account', async () => {
  let postBadgeRes = await request(app).post(`/badge/-/-`).set('Authorization', 'Bearer testToken');
  expect(postBadgeRes.status).toBe(400);
  expect(postBadgeRes.body).toMatchObject({ error: 'Invalid account or badge' });
});

function generateIds() {
  const account = `account_${Math.random().toString(36).substring(2, 15)}`;
  const badge = `badge_${Math.random().toString(36).substring(2, 15)}`;
  return [account, badge];
}
