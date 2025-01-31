# 🏅 Badge Me

Badge Me is a convenient service for creating and persisting badges that display a label and value. This is useful for continuous integration (CI) pipelines that want to use a badge to report the status of the pipeline in a README.md file without having to store a store a badge in the GitHub repository itself.

Badges are represented with a simple but clean looking SVG. The following provides an example.

![Example badge](exampleBadge.svg)

```html
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="118" height="20" role="img" aria-label="Coverage: 10.00%">
  <title>Coverage: 10.00%</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1" />
    <stop offset="1" stop-opacity=".1" />
  </linearGradient>
  <clipPath id="r">
    <rect width="118" height="20" rx="3" fill="#fff" />
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="66" height="20" fill="#555" />
    <rect x="66" width="52" height="20" fill="#00bbee" />
    <rect width="118" height="20" fill="url(#s)" />
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="330" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="560">Coverage</text>
    <text x="330" y="140" transform="scale(.1)" fill="#fff" textLength="560">Coverage</text>
    <text aria-hidden="true" x="920" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="420">10.00%</text>
    <text x="920" y="140" transform="scale(.1)" fill="#fff" textLength="420">10.00%</text>
  </g>
</svg>
```

## Make a badge

When making your first request for an account the provided authorization token will be stored. All future requests for that account must present the same authorization token.

Account and badge IDs must only be alphanumeric values.

The color value may be standard color names (`green`), or hex values (`#001133`)

```
host=localhost:3000

curl -X POST "$host/badge/accountId/badgeId?label=fish&value=taco&color=%230000ee" -H "authorization: bearer 12345"

curl -X POST "$host/badge/accountId/badgeId?label=Coverage&value=0.00%&color=green" -H "authorization: bearer 12345"
```

## Get a badge

Provide the account and badge ID for a previously created badge.

```
curl "$host/badge/accountId/badgeId"
```

If the badge doesn't exist then a placeholder will be returned.

![Not found badge](notFoundBadge.svg)

## Demonstration

You can experiment with **Badge Me** using this service.

```
https://badge.cs329.click
```

## Installation

Badge Me is a simple JavaScript Express application. Simply run `service.js` using Node.js after installing the require Express NPM dependency.

```sh
git clone https://github.com/leesjensen/badgeme
cd badgeme
npm install
npm run start
```

The service will start on port 3000 by default but you can override that by passing the desired port to node.

```
node service.js 5000
```
