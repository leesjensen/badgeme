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

const notFoundBadge = `
<svg xmlns="http://www.w3.org/2000/svg" width="90" height="20" role="img" aria-label="File Not Found">
  <title>File Not Found</title>
  <rect width="90" height="20" fill="#888" rx="5"/>
  <text x="40" y="14" fill="#eee" font-family="Verdana, Geneva, sans-serif" font-size="11" text-anchor="middle">
    😢 Not Found
  </text>
</svg>
`;

function estimateTextWidth(text, fontSize = 11, avgCharWidth = 7) {
  return Math.ceil(text.length * (avgCharWidth * (fontSize / 11)));
}

module.exports = { generateBadge, notFoundBadge };
