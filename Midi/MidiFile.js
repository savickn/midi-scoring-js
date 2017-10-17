
// represents a MIDI Header chunk
class HeaderChunk {
  constructor(format, numberOfTracks, division) {
    this.type = '4d546864'; // 0x4d546864
    this.length = '00000006'; // 0x00000006

    this.tracks = numberOfTracks;
    this.format = format;
    this.division = division; // used to set the number of ticks per quarter note
  }

  toHex() {
    return this.type + this.length + this.tracks + this.format + this.division;
  }
}

// represents a MIDI Track chunk
class TrackChunk {
  constructor(length, events) {
    this.type = '4d54726b'; // 0x4d54726b
    this.length = length;
    this.events = events; // represents deltaTime-midiEvent pairs;
  }

  toHex() {
    var rep = this.type + this.length;
    this.events.forEach(function(ev) {
      rep += ev.toHex();
    });
    return rep;
  }
}

// class representing a <deltaTimne>-<event> pair (e.g. MidiTracks contains many TrackEvents)
class TrackEvent {
  constructor(deltaTime, ev) {
    this.deltaTime = deltaTime;
    this.ev = ev;
  }

  toHex() {
    return this.deltaTime + this.ev;
  }
}

// represents a MIDI File which contains a single Header chunk and multiple Track chunks
// add indexing so can alter individual parts of a file
class MidiFile {
  constructor(headerChunk, trackChunks) {
    this.headerChunk = headerChunk;
    this.trackChunks = trackChunks;
  }

  toHex() {
    var rep = this.headerChunk.toHex();
    this.trackChunks.forEach(function(chunk) {
      rep += chunk.toHex();
    });
    return rep;
  }

  getHeader() {
    return this.headerChunk;
  }

  getTracks() {
    return this.trackChunks;
  }
}

//export HeaderChunk, TrackChunk, MidiFile;
module.exports = {
  MidiFile: MidiFile,
  HeaderChunk: HeaderChunk,
  TrackChunk: TrackChunk,
  TrackEvent: TrackEvent,
}


// each MidiController Message has a 'code' (e.g. 0x01, and a value between 0-127, e.g. 01111111)
class ControllerMessage {
    constructor(code, value) {
      this.code = code;
      this.value = value;
    }
}
