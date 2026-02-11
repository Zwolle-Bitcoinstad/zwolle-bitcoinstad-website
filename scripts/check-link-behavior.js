const assert = require('node:assert/strict');
const {
  addRelValues,
  applyLinkBehavior,
  hasIgnoredProtocol,
  isInternalUrl,
} = require('../assets/js/link-behavior.js');

class FakeLink {
  constructor(attributes) {
    this.attributes = new Map(Object.entries(attributes));
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }
}

const baseHref = 'https://zwollebitcoinstad.nl/blogs.html';

assert.equal(isInternalUrl('/meetup', baseHref), true);
assert.equal(isInternalUrl('#contact', baseHref), true);
assert.equal(isInternalUrl('https://zwollebitcoinstad.nl/agenda', baseHref), true);
assert.equal(isInternalUrl('https://www.zwollebitcoinstad.nl', baseHref), true);
assert.equal(isInternalUrl('https://shop.zwollebitcoinstad.nl', baseHref), true);
assert.equal(isInternalUrl('https://bitcoin.org', baseHref), false);

assert.equal(hasIgnoredProtocol('mailto:info@zwollebitcoinstad.nl'), true);
assert.equal(hasIgnoredProtocol('tel:+31612345678'), true);
assert.equal(hasIgnoredProtocol('javascript:void(0)'), true);
assert.equal(hasIgnoredProtocol('https://bitcoin.org'), false);

assert.equal(addRelValues('nofollow', ['noopener', 'noreferrer']), 'nofollow noopener noreferrer');
assert.equal(addRelValues('noopener nofollow', ['noopener', 'noreferrer']), 'noopener nofollow noreferrer');

const internalLink = new FakeLink({ href: 'https://zwollebitcoinstad.nl/meetup/', target: '_blank' });
applyLinkBehavior(internalLink, baseHref);
assert.equal(internalLink.getAttribute('target'), null);

const externalLink = new FakeLink({ href: 'https://bitcoin.org', rel: 'nofollow' });
applyLinkBehavior(externalLink, baseHref);
assert.equal(externalLink.getAttribute('target'), '_blank');
assert.equal(externalLink.getAttribute('rel'), 'nofollow noopener noreferrer');

const mailtoLink = new FakeLink({ href: 'mailto:info@zwollebitcoinstad.nl' });
applyLinkBehavior(mailtoLink, baseHref);
assert.equal(mailtoLink.getAttribute('target'), null);
assert.equal(mailtoLink.getAttribute('rel'), null);

console.log('Link behavior checks passed.');
