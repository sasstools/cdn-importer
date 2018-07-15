const fs = require('fs');
const http = require('http');
const promisify = require('util').promisify;
const sass = require('node-sass');
const importer = require('../');

const normalize = sass.renderSync({
  data: fs.readFileSync('node_modules/normalize.css/normalize.css').toString(),
}).css.toString();

const compile = (data, options = {}) => {
  return new Promise((yeah, nah) => {
    return sass.render(
      Object.assign({ data, importer }, options),
      (err, results) => err ? nah(err) : yeah(results.css.toString()),
    );
  });
}

let createServer = (handler) => {
  let server = http.createServer(handler);
  server._close = server.close;
  server.close = (cb) => server._close(cb);
  server._listen = server.listen;
  server.listen = (port, cb) => server._listen(port, cb);
  return server;
}

describe('cdn-importer', () => {
  let server;
  beforeEach(() => {
    server = createServer((req, res) => {
      expect(req.url).toBe('https://unpkg.com/normalize.css@8.0.0/normalize.css');
      res.end('ok');
    });
  });

  afterEach(() => {
    server.close();
    server = null;
  });

  describe('async', () => {
    it('should resolve URLs prefixed with `cdn:` against the proceeding URL', () => (
      new Promise(y => server.listen(1123, y)).then(() => (
        compile('@import "cdn:https://unpkg.com/normalize.css@8.0.0/normalize.css"')
          .then(result => expect(result === normalize).toBeTruthy())
      ))
    ));
    it('should resolve URLs prefixed with unpkg: against unpkg.com', () => (
      new Promise(y => server.listen(1123, y)).then(() => (
        compile('@import "unpkg:normalize.css@8.0.0/normalize.css"')
          .then(result => expect(result === normalize).toBeTruthy())
      ))
    ));
  });
});
