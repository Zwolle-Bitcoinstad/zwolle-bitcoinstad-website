const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const htmlFiles = fs.readdirSync('.').filter((file) => file.endsWith('.html'));

const internalDomain = 'zwollebitcoinstad.nl';

const getAttr = (tag, name) => {
  const regex = new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, 'i');
  const match = tag.match(regex);
  return match ? match[2] : null;
};

const isInternal = (href) => {
  const url = new URL(href, `https://${internalDomain}/`);
  const hostname = url.hostname.toLowerCase();
  return hostname === internalDomain || hostname.endsWith(`.${internalDomain}`);
};

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(path.join('.', htmlFile), 'utf8');
  assert.match(content, /assets\/js\/link-behavior\.js/, `${htmlFile} mist link-behavior script include`);

  const anchorTags = content.match(/<a\b[^>]*>/gi) || [];
  for (const tag of anchorTags) {
    const href = getAttr(tag, 'href');
    const target = getAttr(tag, 'target');

    if (!href) {
      continue;
    }

    const lowerHref = href.trim().toLowerCase();
    if (lowerHref.startsWith('mailto:') || lowerHref.startsWith('tel:') || lowerHref.startsWith('javascript:')) {
      continue;
    }

    if (isInternal(href)) {
      assert.notEqual(target, '_blank', `${htmlFile} heeft interne link met target=_blank: ${tag}`);
    }
  }
}

console.log('Static markup checks passed.');
