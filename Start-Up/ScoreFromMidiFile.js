
const MetaEventModule = require('../Midi/MetaEvent.js');
const MidiEventModule = require('../Midi/MidiEvent.js');

/*
* helper functions
*/

function calculateQuarterNotesPerBar(numerator, denominator, quarternote) {
  var scaleFactor = 4 / denominator;
  var quarterNotesPerBar = numerator * scaleFactor;
  return quarterNotesPerBar;
}

function calculateNumberOfMeasures(timeSignatures, trackLength, ticksPerQNote) {
  var timeSignatureMap = {};
  timeSignatures.forEach(function(ts) {
    timeSignatureMap[ts.getDeltaTime()] = ts.getEvent();
  });
  var timeSignatureDTs = Object.keys(timeSignatureMap);
  console.log('timeSignatureDTs', timeSignatureDTs);
  console.log('timeSignatureMap', timeSignatureMap);

  var measures = 0;
  timeSignatureDTs.forEach(function(dt, idx) {
    var activeTimeSignature = timeSignatureMap[dt];

    if(idx === timeSignatureDTs.length - 1) {
      var endpoint = trackLength;
    } else {
      var endpoint = timeSignatureDTs[idx + 1];
    }

    var duration = endpoint - dt; // in MIDI ticks
    console.log('duration', duration);
    var quarterNotes = duration / ticksPerQNote;
    console.log('quarterNotes', quarterNotes);
    var quarterNotesPerMeasure = calculateQuarterNotesPerBar(activeTimeSignature.getNumerator(), activeTimeSignature.getDenominator(), ticksPerQNote);
    console.log('qnotes per measure', quarterNotesPerMeasure);
    measures += quarterNotes/quarterNotesPerMeasure;
  })
  return measures;
}

/*
* used to convert a MidiFile object into a Score
*/

function parseFormatZero(midifile) {
  var header = midifile.getHeader();
  var track = midifile.getFirstTrack();

  var numberOfTracks = header.getNumberOfTracks();
  var ticksPerQNote = header.getTicksPerQuarterNote();
  console.log('ticksPerQNote', ticksPerQNote);

  var timeSignatures = track.getEventsByType(MetaEventModule.TimeSignature);
  var keySignatures = track.getEventsByType(MetaEventModule.KeySignature);
  var tempos = track.getEventsByType(MetaEventModule.SetTempo);

  var trackLength = track.getTrackLengthInTicks();

  var numberOfMeasures = calculateNumberOfMeasures(timeSignatures, trackLength, ticksPerQNote);
  console.log('measures', numberOfMeasures);


}

function parseFormatOne(midifile) {

}

function parseFormatTwo(midifile) {
  console.log('not implemented');
}

function createSheetMusic(midifile) {
  var format = midifile.getHeader().getFormat();

  switch(format) {
    case 0:
      return parseFormatZero(midifile);
      break;
    case 1:
      return parseFormatOne(midifile);
      break;
    case 2:
      return parseFormatTwo(midifile);
      break;
    default:
      console.log('format', format);
      console.log('invalid format');
  }
}

module.exports = {
  createSheetMusic: createSheetMusic,
}
