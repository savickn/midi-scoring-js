
/*
* libraries
*/

const MetaEventModule = require('../Midi/MetaEvent.js');
const MidiEventModule = require('../Midi/MidiEvent.js');
const OptionsModule = require('../ScoreOptions.js');
const ScoreModule = require('../SheetMusic.js');
const NoteModule = require('../Symbols/NoteSymbol.js');
const StaffModule = require('../Staff.js');
const MeasureModule = require('../Measure.js');
const TimeSignatureModule = require('../TimeSignature.js');
const KeySignatureModule = require('../KeySignature.js');

/*
* globals
*/

//const defaultTempo;
const defaultKeySignature = new KeySignatureModule.KeySignature('C', 0, 0);
const defaultTimeSignature = new TimeSignatureModule.TimeSignature(4, 4, 96);
const defaultClef = 'Treble';

// removes 'entry' from 'collection' if it exists and returns the modified Array
function removeFromCollection(entry, collection) {
  var idx = collection.indexOf(entry);
  if(idx !== -1) {
    collection.splice(idx, 1);
  }
  return collection;
}

/*
* helper functions
*/

// used to create a Staff that can be copied for all MIDI tracks (only need to add Notes/Rests + Clefs)
function createMeasureArray(numberOfMeasures, ticksPerQNote, timeSignatureMap, keySignatureMap) {
  var measures = [];

  var tsBreakpoints = Array.from(timeSignatureMap.keys());
  var ksBreakpoints = Array.from(keySignatureMap.keys());

  var tsIdx = 0;
  var ksIdx = 0;
  var midiTime = 0;

  var currentTsBreakpoint = tsBreakpoints[tsIdx];
  var nextTsBreakpoint = tsBreakpoints[tsIdx + 1];

  var currentKsBreakpoint = ksBreakpoints[ksIdx];
  var nextKsBreakpoint = ksBreakpoints[ksIdx + 1];

  var activeTimeSignature = timeSignatureMap.get(currentTsBreakpoint);
  var timeSignature = activeTimeSignature ? new TimeSignatureModule.TimeSignature(activeTimeSignature.getNumerator(), activeTimeSignature.getDenominator(), ticksPerQNote) : defaultTimeSignature;
  var activeKeySignature = keySignatureMap.get(currentKsBreakpoint);
  var keySignature = activeKeySignature ? new KeySignatureModule.keySignature(activeKeySignature.getSharpsAndFlats(), activeKeySignature.getMajorMinor()) : defaultKeySignature;

  for(let i = 1; i <= numberOfMeasures; i++) {
    if(typeof nextTsBreakpoint != undefined && midiTime >= nextTsBreakpoint) {
      currentTsBreakpoint = nextTsBreakpoint;
      activeTimeSignature = timeSignatureMap.get(currentTsBreakpoint);
      timeSignature = activeTimeSignature ? new TimeSignatureModule.TimeSignature(activeTimeSignature.getNumerator(), activeTimeSignature.getDenominator(), ticksPerQNote) : defaultTimeSignature;
      tsIdx += 1;
      nextTsBreakpoint = tsBreakpoints[tsIdx + 1];
    }
    if(typeof nextKsBreakpoint != undefined && midiTime >= nextKsBreakpoint) {
      currentKsBreakpoint = nextKsBreakpoint;
      activeKeySignature = keySignatureMap.get(currentKsBreakpoint);
      keySignature = activeKeySignature ? new KeySignatureModule.keySignature(activeKeySignature.getSharpsAndFlats(), activeKeySignature.getMajorMinor()) : defaultKeySignature;
      ksIdx += 1;
      nextKsBreakpoint = ksBreakpoints[ksIdx + 1];
    }
    /*console.log('activeTimeSignature', activeTimeSignature);
    console.log('timeSignature', timeSignature);
    console.log('activeKeySignature', activeKeySignature);
    console.log('keySignature', keySignature);*/

    measures.push(new MeasureModule.Measure(i, midiTime, timeSignature, keySignature));
    midiTime += timeSignature.getMeasureLengthInPulses();
  }
  return measures;
}

// used to determine the number of quarter-notes per bar based on time signature, WORKING
function calculateQuarterNotesPerBar(numerator, denominator) {
  var scaleFactor = 4 / denominator;
  return numerator * scaleFactor;
}

// used to return the first instance of NoteOff for a given NoteOn event, WORKING
function getCorrespondingNoteOff(noteOn, noteOffEvents) {
  for(let ev of noteOffEvents) {
    if(ev.getEvent().getNote() === noteOn.getEvent().getNote()) {
      return ev;
    }
  }
}

// returns the number of measures in a MIDI track given the 'trackLength' in midi pulses, pulses per quarter note, and time signatures, WORKING
function calculateNumberOfMeasures(timeSignatureMap, trackLength, ticksPerQNote) {
  var timeSignatureDTs = Array.from(timeSignatureMap.keys());
  console.log('timeSignatureDTs', timeSignatureDTs);
  console.log('timeSignatureMap', timeSignatureMap);

  var measureLength = 0;
  timeSignatureDTs.forEach(function(dt, idx) {
    var activeTimeSignature = timeSignatureMap.get(dt);

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
    measureLength += quarterNotes/quarterNotesPerMeasure;
  })
  return measureLength;
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
  var timeSignatureMap = new Map();
  for(let ts of timeSignatures) {
    timeSignatureMap.set(ts.getTimeStamp(), ts.getEvent());
  };

  /*timeSignatures.forEach(function(ts) {
    timeSignatureMap[ts.getTimeStamp()] = ts.getEvent();
  });*/

  var keySignatures = track.getEventsByType(MetaEventModule.KeySignature);
  var keySignatureMap = new Map();
  for(let ks of keySignatures) {
    keySignatureMap.set(ks.getTimeStamp(), ks.getEvent());
  };

  /*var keySignatureMap = {};
  keySignatures.forEach(function(ks) {
    keySignatureMap[ks.getTimeStamp()] = ks.getEvent();
  });*/

  var tempos = track.getEventsByType(MetaEventModule.SetTempo);
  var tempoMap = new Map();
  for(let t of tempos) {
    tempoMap.set(t.getTimeStamp(), t.getEvent());
  };

  /*tempos.forEach(function(t) {
    tempoMap.set(t.getTimeStamp(), t.getEvent());
    //tempoMap[t.getTimeStamp()] = t.getEvent();
  });*/

  var trackLength = track.getTrackLengthInTicks();
  console.log('trackLength', trackLength);
  var numberOfMeasures = calculateNumberOfMeasures(timeSignatureMap, trackLength, ticksPerQNote);
  console.log('measures', numberOfMeasures);
  var options = new OptionsModule.ScoreOptions();
  console.log('options', options);

  var measureArray = createMeasureArray(numberOfMeasures, ticksPerQNote, timeSignatureMap, keySignatureMap);
  console.log('measureArray', measureArray);

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
  console.log('instrument', instrument);
  console.log('notes', notes);

  //var staffInfo = new StaffModule.StaffTemplate(instrument, notes);
  //var score = new ScoreModule.SheetMusic(title, options, [staffInfo], timeSignatureMap, keySignatureMap, tempoMap, numberOfMeasures);
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
// used to return the first instance of NoteOff for a given NoteOn event
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


*/
