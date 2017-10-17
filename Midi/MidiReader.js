//import {HeaderChunk, TrackChunk, MidiFile} from "MidiFile.js";
//import {MidiEventFactory, TrackEvent} from "MidiEvent.js";

const fs = require('fs');

const MidiEventModule = require('./MidiEvent.js');
const MetaEventModule = require('./MetaEvent.js');
const SystemEventModule = require('./SysexEvent.js');
const midiFileModule = require('./MidiFile.js');

const headerId = '4d546864';
const trackId = '4d54726b';
const vlvMidpoint = 0x80;

const metaRegex = /^(FF)/;
const sysexRegex = /^([F]{1}[0|7]{1})/;
const channelRegex = /^([8-9a-e]{1}[0-9a-f]{1})/;

var meta = 'FF0301';
var sysex = 'F00245F7';
var midi = '803C40';

console.log(metaRegex.test(meta)); // should be 'true'
console.log(metaRegex.test(sysex)); // should be 'false'
console.log(metaRegex.test(midi)); // should be 'false'

console.log(sysexRegex.test(sysex)); // should be 'true'
console.log(sysexRegex.test(meta)); // should be 'false'
console.log(sysexRegex.test(midi)); // should be 'false'

console.log(channelRegex.test(midi)); // should be 'true'
console.log(channelRegex.test(sysex)); // should be 'false'
console.log(channelRegex.test(meta)); // should be 'false'

//used to parse midi files to create MidiData objects
/*class MidiReader {
  constructor() {}

  parseMidiFile(path) {
    fs.readFile('kontakt.mid', 'hex', (err, data) => {
      if(err) console.log('error', err);
      console.log('data', data);
    })
  }
}*/



// used to parse a MIDI header chunk, WORKING
function parseHeader(header) {
  var length = header.slice(8, 16);
  var format = header.slice(16, 20);
  var tracks = header.slice(20, 24);
  var division = header.slice(24, 28);

  /*console.log('#### HEADER ####');
  console.log(header);
  console.log(length);
  console.log(format);
  console.log(tracks);
  console.log(division);*/

  var mfh = new midiFileModule.HeaderChunk(format, tracks, division);
  return mfh;
}

// used to extract a 'variable-length quantity' from a stream of bytes in hexadecimal, WORKING
function getDeltaTime(chunk) {
  var offset = 0;
  do {
    significantByte = parseInt(chunk.slice(offset, 2 + offset), 16);
    //console.log('sigByte', significantByte);
    offset += 2;
  } while(significantByte > vlvMidpoint);
  return chunk.slice(0, offset);
}

// used to extract the 'event' chunk that follows the 'delta-time' declaration in the track chunk, WORKING
function getEvent(chunk) {
  var chunkLength = chunk.length;
  var eventCode = chunk.slice(0, 2);
  chunk = chunk.slice(2, chunkLength);
  chunkLength = chunk.length;
  //console.log('eventCode', eventCode);

  if(eventCode === 'ff') {  // handle meta event
    var metaCode = chunk.slice(0, 2);
    //console.log('metaCode', metaCode);

    chunk = chunk.slice(2, chunkLength);
    chunkLength = chunk.length;

    var metaVlv = getDeltaTime(chunk);
    var vlvLength = metaVlv.length;
    //console.log('metaVLV', metaVlv);
    var metaHex = parseInt(metaVlv, 16);
    //console.log('metaHex', metaHex);

    chunk = chunk.slice(vlvLength, chunkLength);
    chunkLength = chunk.length;

    var eventData = chunk.slice(0, 2*metaHex);
    //console.log('eventData', eventData);
    //var metaEvent = MetaEventModule.GetMetaEvent(metaCode, eventData);
    //return metaEvent;
    return eventCode + metaCode + metaVlv + eventData;

  } else if(eventCode === 'f0' || eventCode === 'f7') { // handle sysex event
    var sysVlv = getDeltaTime(chunk);
    var vlvLength = sysVlv.length;
    var sysHex = parseInt(sysVlv, 16);

    chunk = chunk.slice(vlvLength, chunkLength);
    chunkLength = chunk.length;

    var eventData = chunk.slice(0, 2*sysHex);
    return eventCode + sysVlv + eventData;

  } else if(channelRegex.test(eventCode)) { // handle midi event
    var midiCode = eventCode.slice(0, 1);
    var channel = eventCode.slice(1, 2);

    if(midiCode === '' || midiCode === '') {
      var dataBytes = chunk.slice(0, 2);
      return eventCode + dataBytes;
    } else {
      var dataBytes = chunk.slice(0, 4);
      return eventCode + dataBytes;
    }
  } else {
    console.log('#### UNABLE TO PARSE ####');
    return;
  }
}

// used to split a 'track' chunk into 'deltaTime-event' pairs
function getDeltaTimeEventPairs(eventChunk) {
  dtePairs = [];
  while(eventChunk.length > 0) {
    console.log('\n ### NEW ITERATION ### \n')
    var chunkLength = eventChunk.length;

    var vlv = getDeltaTime(eventChunk);
    var vlvLength = vlv.length;
    console.log('vlv', vlv);

    eventChunk = eventChunk.slice(0 + vlvLength, chunkLength);
    chunkLength = eventChunk.length;
    //console.log('eventChunk', eventChunk);

    var ev = getEvent(eventChunk);
    console.log('parsedEvent', ev)
    if(ev === null) {
      continue; //used to skip sections that are not supported midi events, PROB NOT WORKING PERFECTLY
    }
    var evLength = ev.length;
    console.log('eventlength', evLength);

    eventChunk = eventChunk.slice(0 + evLength, chunkLength);
    chunkLength = eventChunk.length;

    var trackEvent = new midiFileModule.TrackEvent(vlv, ev);
    dtePairs.push(trackEvent);
  }
  return dtePairs;
}

// used to parse a single midi 'track' chunk
function parseTrack(track) {
  var trackLength = track.slice(8, 16);
  var eventChunk = track.slice(16, track.length);

  console.log('#### TRACK ####');
  console.log(track);
  console.log(trackLength);
  console.log(eventChunk);

  var dtePairs = getDeltaTimeEventPairs(eventChunk);
  var track = new midiFileModule.TrackChunk(trackLength, dtePairs);
  return track;
}

// used to parse/convert '.mid' file to MidiFile object, WORKING
function readMidi(filename, cb) {
  fs.readFile(filename, 'hex', (err, data) => {
    if(err) console.log('error', err);
    console.log('data', data);
    console.log('dataLength', data.length);

    var headerIdx = data.indexOf(headerId);
    var track1Idx = data.indexOf(trackId);
    var trackSize = data.slice(track1Idx + 8, track1Idx + 16);
    var bytes = parseInt(trackSize, 16);

    var header = data.slice(headerIdx, track1Idx);
    var track1 = data.slice(track1Idx, track1Idx + 16 + bytes * 2);

    console.log('headerIdx', headerIdx);
    console.log('track1Idx', track1Idx);

    console.log('header', header);
    console.log('headerLength', header.length);

    console.log('track1', track1);
    console.log('track1Length', track1.length);

    var headerObj = parseHeader(header);
    var trackObj = parseTrack(track1);

    var midiFile = new midiFileModule.MidiFile(headerObj, [trackObj]);
    console.log('midiFile', midiFile);
    return cb(null, midiFile);
  })
}

module.exports = {
  'readMidi': readMidi,
}


/*readMidi('ableton.mid', function(err, midifile) {
  console.log('midiFile', midifile);
});*/



// WORKING, but can just use 'obj.toString('hex')' instead
/*function hexToBytes(hex) {
  count = 0;

  for(var i = 0; i < hex.length; i++) {
    var scalar = Math.pow(16, i);
    hexDigit = hex.charAt(hex.length)

    var num = Number(hex.charAt(hex.length - (i + 1))) * scalar;
    count += num;
  }
  console.log('count', count);
  return count;
}*/

// used to extract a 'variable-length quantity' from a stream of bytes in hexadecimal, NOT WORKING (does not extend past 1 byte)
/*function getDeltaTime(chunk) {
  var offset = 0;
  var vlv = 0x00;
  console.log('initialVLV', vlv);

  do {
    significantByte = parseInt('0x' + chunk.slice(0 + offset, 2 + offset));
    console.log('sigByte', significantByte);
    vlv += significantByte;
    console.log('updatedVLV', vlv);
    offset += 2;
  } while(significantByte > vlvMidpoint);
  var hex = vlv.toString(16);
  if(hex.length % 2 === 1) {
    hex = '0' + hex;
  }
  return hex;
}*/
