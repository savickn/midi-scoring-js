//import {HeaderChunk, TrackChunk, MidiFile} from "MidiFile.js";
//import {MidiEventFactory, TrackEvent} from "MidiEvent.js";

const fs = require('fs');

const midiEventModule = require('./MidiEvent.js');
const metaEventModule = require('./MetaEvent.js');
const systemEventModule = require('./SysexEvent.js');
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



// WORKING
function parseHeader(header) {
  var length = header.slice(8, 16);
  var format = header.slice(16, 20);
  var tracks = header.slice(20, 24);
  var division = header.slice(24, 28);

  console.log('#### HEADER ####');
  console.log(header);
  console.log(length);
  console.log(format);
  console.log(tracks);
  console.log(division);

  var mfh = new midiFileModule.HeaderChunk(format, tracks, division);
  return mfh;
}

function getDeltaTime(chunk) {
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
}

function getEvent(chunk) {
  if(eventCode === 'FF') {
    // handle meta event
    var metaCode = eventChunk.slice(0 + offset, 2 + offset);
    var metaLength =
  } else if(eventCode === 'F0' || eventCode === 'F7') {
    // handle sysex event
  } else if(channelRegex.test(eventCode)) {
    // handle midi event
  } else {
    continue;
  }
}

function getDeltaTimeEventPairs(eventChunk) {
  dtePairs = [];

  while(eventChunk.length > 0) {
    var chunkLength = eventChunk.length;

    var vlv = getDeltaTime(eventChunk);
    var vlvLength = vlv.length;
    console.log('vlvlength', vlvLength);

    eventChunk = eventChunk.slice(0 + vlvLength, chunkLength);
    console.log('eventChunk', eventChunk);

    chunkLength = eventChunk.length;

    var ev = getEvent(eventChunk);
    var evLength = ev.length;
    console.log('eventlength', evLength);

    eventChunk = eventChunk.slice(0 + evLength, chunkLength);

    dtePairs.push({
      'deltaTime' : vlv,
      'event' : ev,
    });
  }


  return dtePairs;
}

function parseTrack(track) {
  var length = track.slice(8, 16);
  var eventChunk = track.slice(16, track.length - 1);

  console.log('#### TRACK ####');
  console.log(track);
  console.log(length);
  console.log(eventChunk);

  var dtePairs = getDeltaTimeEventPairs(eventChunk);


}

fs.readFile('ableton.mid', 'hex', (err, data) => {
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

})





// WORKING, but can just use 'obj.toString('hex')' instead
function hexToBytes(hex) {
  count = 0;

  for(var i = 0; i < hex.length; i++) {
    var scalar = Math.pow(16, i);
    hexDigit = hex.charAt(hex.length)

    var num = Number(hex.charAt(hex.length - (i + 1))) * scalar;
    count += num;
  }
  console.log('count', count);
  return count;
}
