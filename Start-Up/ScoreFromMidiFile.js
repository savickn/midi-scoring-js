
/*
* libraries
*/

const MetaEventModule = require('../Midi/MetaEvent.js');
const MidiEventModule = require('../Midi/MidiEvent.js');
const OptionsModule = require('../ScoreOptions.js');
const ScoreModule = require('../SheetMusic.js');
const NoteModule = require('../Symbols/NoteSymbol.js');

/*
* globals
*/

//const defaultTempo;
//const defaultKey;
//const defaultClef;


/*
* helper functions
*/

function calculateQuarterNotesPerBar(numerator, denominator, quarternote) {
  var scaleFactor = 4 / denominator;
  var quarterNotesPerBar = numerator * scaleFactor;
  return quarterNotesPerBar;
}

function removeFromCollection(entry, collection) {
  var idx = collection.indexOf(entry);
  if(idx !== -1) {
    collection.splice(idx, 1);
  }
  return collection;
}

function getCorrespondingNoteOff(noteOn, noteOffEvents) {
  var noteOff = null;
  noteOffEvents.forEach(function(trackEvent) {
    if(trackEvent.getEvent().getNote() === noteOn.getEvent().getNote() && noteOff === null) {
      noteOff = trackEvent;
      return;
    }
  })
  return noteOff;
}

// returns the number of measures in a MIDI track given the 'trackLength' in midi pulses, pulses per quarter note, and time signatures
function calculateNumberOfMeasures(timeSignatureMap, trackLength, ticksPerQNote) {
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
  var title = midifile.getTitle();

  var numberOfTracks = header.getNumberOfTracks();
  var ticksPerQNote = header.getTicksPerQuarterNote();
  console.log('ticksPerQNote', ticksPerQNote);

  var timeSignatures = track.getEventsByType(MetaEventModule.TimeSignature);
  var timeSignatureMap = {};
  timeSignatures.forEach(function(ts) {
    timeSignatureMap[ts.getTimeStamp()] = ts.getEvent();
  });

  var keySignatures = track.getEventsByType(MetaEventModule.KeySignature);
  var keySignatureMap = {};
  keySignatures.forEach(function(ks) {
    keySignatureMap[ks.getTimeStamp()] = ks.getEvent();
  });

  var tempos = track.getEventsByType(MetaEventModule.SetTempo);
  var tempoMap = {};
  tempos.forEach(function(t) {
    tempoMap[t.getTimeStamp()] = t.getEvent();
  });

  var trackLength = track.getTrackLengthInTicks();
  console.log('trackLength', trackLength);
  var numberOfMeasures = calculateNumberOfMeasures(timeSignatureMap, trackLength, ticksPerQNote);
  console.log('measures', numberOfMeasures);
  var options = new OptionsModule.ScoreOptions();
  console.log('options', options);

  // build Staff from track chunk
  var instruments = track.getEventsByType(MidiEventModule.ProgramChange);
  var instrument = instruments.length > 0 ? instruments[0].getInstrument() : 1; // defaults to Acoustic Grand Piano

  var noteOnEvents = track.getEventsByType(MidiEventModule.NoteOn);
  var noteOffEvents = track.getEventsByType(MidiEventModule.NoteOff);
  var notes = [];

  noteOnEvents.forEach(function(noteOnEvent) {
    var noteOffEvent = getCorrespondingNoteOff(noteOnEvent, noteOffEvents);
    var starttime = noteOnEvent.getTimeStamp();
    var duration = noteOffEvent.getTimeStamp() - noteOnEvent.getTimeStamp();
    notes.push(new NoteModule.NoteSymbol(starttime, duration, noteOnEvent.getEvent().getNote(), noteOnEvent.getEvent().getVelocity(), noteOffEvent.getEvent().getVelocity()))
    noteOffEvents = removeFromCollection(noteOffEvent, noteOffEvents);
  })
  console.log('notes', notes);


  //var score = new ScoreModule.SheetMusic(title, options, [track], timeSignatureMap, keySignatureMap, tempoMap, numberOfMeasures);
  //console.log('score', score);
  //return score;
}

function parseFormatOne(midifile) {
  console.log('not implemented');
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


/*


*/
