const UNICODE_POINT_START = 192;
const CHARS = 255;
var res = '';
for (var i = 0; i < CHARS; i++) {
  res += '&#x' + (UNICODE_POINT_START + i).toString(16) + ';';
}
console.log(res);
