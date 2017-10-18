
const fs = require('fs');
const reader = require('./MidiReader.js');

// used to write a 'MidiFile' object to disk as a '.mid' file, WORKING
function saveMidiFile(filename, midiData) {
  fs.writeFile(filename, midiData.toHex(), 'hex', (err) => {
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

reader.readMidi('musescore.mid', function(err, file) {
  //saveMidiFile('mymidi.mid', file);
})

module.exports = {
  'saveMidiFile' : saveMidiFile,
}
