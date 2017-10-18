
/*
* used to convert a MidiFile object into a Score
*/

function parseFormatZero(midifile) {
  
}

function parseFormatOne(midifile) {

}

function parseFormatTwo(midifile) {
  console.log('not implemented');
}

function createSheetMusic(midifile) {
  var format = midifile.getHeader().getFormat();

  switch(format) {
    case '0000':
      return parseFormatZero(midifile);
      break;
    case '0001':
      return parseFormatOne(midifile);
      break;
    case '0002':
      return parseFormatTwo(midifile);
      break;
    default:
      console.log('invalid format');
  }
}

module.exports = {
  createSheetMusic: createSheetMusic,
}
