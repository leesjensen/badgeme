const express = require('express');
const app = express();

app.get('*', (req, res) => {
  const primaryText = req.query.text || 'Hi';
  const secondaryText = req.query.text || 'joe';
  const color = req.query.color || 'aacc00';

  const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="116" height="20" role="img" aria-label="${primaryText}: ${secondaryText}">
        <title>${primaryText}</title>
        <linearGradient id="s" x2="0" y2="100%">
            <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
            <stop offset="1" stop-opacity=".1"/>
        </linearGradient>
        <clipPath id="r">
            <rect width="116" height="20" rx="3" fill="#fff"/>
        </clipPath>
        <g clip-path="url(#r)">
            <rect width="63" height="20" fill="#555"/>
            <rect x="63" width="53" height="20" fill="#${color}"/>
            <rect width="116" height="20" fill="url(#s)"/>
        </g>
        <g fill="#fff" text-anchor="start" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
            <text aria-hidden="true" x="10" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${primaryText}</text>
            <text x="10" y="140" transform="scale(.1)" fill="#fff">${primaryText}</text>
            <text aria-hidden="true" x="885" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${secondaryText}</text>
            <text x="885" y="140" transform="scale(.1)" fill="#fff">${secondaryText}</text>
        </g>
    </svg>
    `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

const port = process.argv[2] || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
