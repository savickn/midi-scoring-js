
const fs = require('fs');
const reader = require('./MidiReader.js');
const converter = require('../Start-Up/ScoreFromMidiFile.js');

// used to write a 'MidiFile' object to disk as a '.mid' file, WORKING
function saveMidiFile(filename, midifile) {
  fs.writeFile(filename, midifile.toHex(), 'hex', (err) => {
    if(err) console.log('error', err);

    /*reader.readMidi('mymidi.mid', function(err, file) {
      console.log('mymidi', file);
      var tracks = file.getTracks();
      tracks.forEach(function(track, idx) {
        console.log(idx + ' ' + track.toHex());
      })
    })*/
  })
}

reader.readMidi('./MidiFiles/ableton.mid', function(err, file) {
  //saveMidiFile('mymidi.mid', file);
  converter.createSheetMusic(file);
})

module.exports = {
  'saveMidiFile' : saveMidiFile,
}
