//import {HeaderChunk, TrackChunk, MidiFile} from "MidiFile.js";
//import {MidiEventFactory, TrackEvent} from "MidiEvent.js";

const fs = require('fs');

const midiEventModule = require('./MidiEvent.js');
const midiFileModule = require('./MidiFile.js');

const headerId = '4d546864';
const trackId = '4d54726b';


//used to parse midi files to create MidiData objects
class MidiReader {
  constructor() {}

  parseMidiFile(path) {
    fs.readFile('kontakt.mid', 'hex', (err, data) => {
      if(err) console.log('error', err);
      console.log('data', data);



    })
  }
}

var header = '';
var tracks = [];

fs.readFile('kontakt.mid', 'hex', (err, data) => {
  if(err) console.log('error', err);
  console.log('data', data);

  var chunks = data.indexOf('4d54');
  console.log(chunks);
  
  /*chunks.forEach(function(chunk) {
    console.log('\n ######### chunk \n');
    console.log(chunk);
  })*/


})
