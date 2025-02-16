const express = require('express');
const fs = require('fs');
const app = express();

app.get('/badge/:account/:id', (req, res) => {
  const ids = getIds(req);
  const dir = `accounts/${ids.account}`;
  const file = `${dir}/${ids.badge}.svg`;

  let svg = fileNotFound;
  if (fs.existsSync(file)) {
    svg = fs.readFileSync(file);
  }
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.post('/badge/:account/:id', (req, res) => {
  const ids = getIds(req);
  if (!requestAuthorized(req.headers['authorization'], ids.account)) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const labelText = req.query.label || 'Coverage';
  const valueText = req.query.value || '0.00%';
  const color = req.query.color || '#ee0000';

  const svg = generateBadge(labelText, valueText, color);

  fs.writeFileSync(`accounts/${ids.account}/${ids.badge}.svg`, svg);

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.get('*', (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BadgeMe</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          background-color: #f0f0f0;
        }
        h1 {
          margin: 1.5em 0 1em 1em;
        }
        ul {
          list-style-type: none;
          padding: 0;
          margin-left: 1em;
        }
        li {
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: .5em;
          margin: .5em;
          font-family: monospace;
    }
      </style>
    </head>
    <body>
      <h1>🏅 BadgeMe endpoints</h1>
      <ul>
        <li>[GET] /badge/:account/:id</li>
        <li>[POST] /badge/:account/:id?label=Coverage&value=0.00%25&color=red<br/>authorization: bearer token</li>
      </ul>
    </body>
    </html>`);
});

const fileNotFound = `
<svg xmlns="http://www.w3.org/2000/svg" width="90" height="20" role="img" aria-label="File Not Found">
  <title>File Not Found</title>
  <rect width="90" height="20" fill="#888" rx="5"/>
  <text x="40" y="14" fill="#eee" font-family="Verdana, Geneva, sans-serif" font-size="11" text-anchor="middle">
    😢 Not Found
  </text>
</svg>
`;

function getIds(req) {
  const cleanParam = (param) => param.replace(/[^a-zA-Z0-9]/g, '');
  const account = cleanParam(req.params.account);
  const badge = cleanParam(req.params.id);
  return { account, badge };
}

function estimateTextWidth(text, fontSize = 11, avgCharWidth = 7) {
  return Math.ceil(text.length * (avgCharWidth * (fontSize / 11)));
}

function generateBadge(label, value, color, padding = 5) {
  const labelTextWidth = estimateTextWidth(label);
  const valueTextWidth = estimateTextWidth(value);
  const labelWidth = labelTextWidth + padding * 2;
  const valueWidth = valueTextWidth + padding * 2;
  const totalWidth = labelWidth + valueWidth;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
      <title>${label}: ${value}</title>
      <linearGradient id="s" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
      </linearGradient>
      <clipPath id="r">
        <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
      </clipPath>
      <g clip-path="url(#r)">
        <rect width="${labelWidth}" height="20" fill="#555"/>
        <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
        <rect width="${totalWidth}" height="20" fill="url(#s)"/>
      </g>
      <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
        <text aria-hidden="true" x="${(labelWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${labelTextWidth * 10}">${label}</text>
        <text x="${(labelWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${labelTextWidth * 10}">${label}</text>
        <text aria-hidden="true" x="${(labelWidth + valueWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${valueTextWidth * 10}">${value}</text>
        <text x="${(labelWidth + valueWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${valueTextWidth * 10}">${value}</text>
      </g>
    </svg>`;
}

function requestAuthorized(authHeader, account) {
  if (!authHeader) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  if (!isValidToken(token)) {
    return false;
  }

  const dir = `accounts/${account}`;
  const accountFile = `${dir}/account.json`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(accountFile, `{"account":"${account}", "token": "${token}"}`);
  }

  if (!fs.existsSync(accountFile)) {
    return false;
  }

  const data = JSON.parse(fs.readFileSync(accountFile));
  return data.token === token;
}

function isValidToken(token) {
  if (token) {
    token = token.toLowerCase();
    if (token !== 'undefined' && token !== 'null') {
      return true;
    }
  }
  return false;
}

const port = process.argv[2] || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
