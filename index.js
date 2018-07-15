const r2 = require('r2');

const rePrefix = /^(cdn|unpkg):([\w-_@\.~^\/:]+)/;

const resolveUnpkg = (suffix) => {
  return `https://unpkg.com/${suffix}`;
};

const resolveURL = (prefix, suffix) => {
  if (prefix === 'unpkg') return resolveUnpkg(suffix);
  return suffix;
};

const end = (done) => (value) => {
  return done ? done(value) : value;
}

module.exports = function(url, prev, done) {
  done = end(done);
  if (!url) return done(null);

  const matches = rePrefix.exec(url);
  if (!matches) return done(null);

  const prefix = matches[1];
  const suffix = matches[2];

  try {
    r2(resolveURL(prefix, suffix)).text.then((contents) => {
      return done({ contents });
    });
  } catch (err) {
    return done(err);
  }
};
