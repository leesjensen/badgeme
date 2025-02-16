const express = require('express');
const fs = require('fs');
const app = express();
const { generateBadge, notFoundBadge } = require('./badgeMaker');

app.get('/badge/:account/:id', (req, res) => {
  const ids = getIdParams(req);
  const dir = `accounts/${ids.account}`;
  const file = `${dir}/${ids.badge}.svg`;

  let svg = notFoundBadge;
  let status = 404;
  if (fs.existsSync(file)) {
    svg = fs.readFileSync(file);
    status = 200;
  }
  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(status).send(svg);
});

app.post('/badge/:account/:id', authorizeRequest, (req, res) => {
  const labelText = req.query.label || 'Coverage';
  const valueText = req.query.value || '0.00%';
  const color = req.query.color || '#ee0000';

  const svg = generateBadge(labelText, valueText, color);

  const ids = getIdParams(req);
  fs.writeFileSync(`accounts/${ids.account}/${ids.badge}.svg`, svg);

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

function authorizeRequest(req, res, next) {
  const account = getIdParams(req).account;
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  const dir = `accounts/${account}`;
  if (token && getAccountData(dir, account, token).token === token) {
    next();
  } else {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
}

function getAccountData(dir, account, token) {
  const accountFile = `${dir}/account.json`;
  let data = { account, token };
  if (fs.existsSync(dir)) {
    data = JSON.parse(fs.readFileSync(accountFile));
  } else {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(accountFile, JSON.stringify(data));
  }
  return data;
}

function getIdParams(req) {
  const cleanParam = (param) => param.replace(/[^a-zA-Z0-9]/g, '');
  const account = cleanParam(req.params.account);
  const badge = cleanParam(req.params.id);
  if (account && badge) {
    return { account, badge };
  }

  const err = new Error('Invalid account or badge');
  err.status = 400;
  throw err;
}

const port = process.argv[2] || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
