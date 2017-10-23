
// WORKING
function getDeltaTime(v) {
  var binary = parseInt(v, 16).toString(2);
  var value = '';
  console.log('binary', binary);
  for (var i = 0, len = binary.length; i < len; i += 8) {
      var bstring = binary.slice(i, i + 8);
      if(bstring.length < 8) {
        value += bstring;
      } else {
        value += bstring.slice(1, 8);
      }
      console.log('value updated', value);
  }
  return parseInt(value, 2);
}

var r = getDeltaTime('00');
console.log(r);
