var opentype = require('opentype.js');
var Fontmin = require('fontmin');

const UNICODE_POINT_START = 192;

module.exports = function(config, text) {
  config.chars = config.chars || 255;
  config.from = config.from || UNICODE_POINT_START;
  config.font = config.font || 'Roboto-Medium';
  console.log('generating font', config);
  var baseFont = opentype.loadSync('./fonts/' + config.font + '.ttf');
  var notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: 650,
    path: new opentype.Path(),
  });
  var glyphs = [notdefGlyph];
  var hash = {};
  var emptyGlyph;
  var count = 0;
  for (var i = 0; i < config.chars; i++) {
    var unicodePoint = config.from + i;
    if (i < text.length) {
      var char = text[i];
      if (hash[char]) {
        hash[char].unicodes.push(unicodePoint);
      } else {
        console.log('creating glyph for char', char);
        var glyph = baseFont.charToGlyph(char);
        glyph.name = char;
        glyph.unicode = unicodePoint;
        glyph.unicodes = [unicodePoint];
        hash[char] = glyph;
        glyphs.push(glyph);
      }
    } else {
      if (emptyGlyph) {
        emptyGlyph.unicodes.push(unicodePoint);
      } else {
        console.log('create empty glyph');
        var path = new opentype.Path();
        emptyGlyph = new opentype.Glyph({
          name: 'empty',
          unicode: unicodePoint,
          unicodes: [unicodePoint],
          advanceWidth: 1,
          xMin: 0,
          xMax: 0,
          yMin: 0,
          yMax: 0,
          path: path,
        });
        glyphs.push(emptyGlyph);
      }
    }
  }
  var font = new opentype.Font({
    familyName: 'DynamicFont',
    styleName: 'Medium',
    unitsPerEm: config.scaled ? baseFont.unitsPerEm / 100 : baseFont.unitsPerEm,
    ascender: baseFont.ascender,
    descender: baseFont.descender,
    glyphs: glyphs,
  });
  return new Buffer(font.toArrayBuffer());
};
