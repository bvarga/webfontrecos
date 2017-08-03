'use strict';

var webfont = require('./webfont');
var Fontmin = require('fontmin');

const books = [
  'The Hunger Games',
  'Harry Potter and the Order of the Phoenix',
  'To Kill a Mockingbird',
  'Pride and Prejudice',
  'Twilight',
];

exports.font = (request, response) => {
  var config = request.query && request.query.c ? JSON.parse(request.query.c) : {};
  // recommend a random book.
  var fontBuffer = webfont(config, books[Math.floor(Math.random() * books.length)]);
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Content-Disposition': 'inline; filename=\"webfont.' + (config.format ? config.format : 'otf') + '\"'
  }
  if (config.format === 'woff') {
    console.log('provide font in WOFF format');
    var fontmin = new Fontmin()
    .src(fontBuffer)
    .use(Fontmin.otf2ttf())
    .use(Fontmin.ttf2woff({ deflate: false }));
    fontmin.run(function (err, files) {
      headers['Content-Type'] = 'application/font-woff';
      response.status(err ? 500 : 200).set(headers).send(err ? 'error generating font resource' : files[1].contents);
    });
  } else {
    console.log('provide font in OTF format');
    headers['Content-Type'] = 'application/x-font-opentype';
    response.status(200).set(headers).send(fontBuffer);
  }
};
