
// represents a MIDI Header chunk
class HeaderChunk {
  constructor(format, numberOfTracks, division) {
    this.type = '4d546864'; // 0x4d546864
    this.length = '00000006'; // 0x00000006

    this.format = format;
    this.tracks = numberOfTracks;

    /* need to convert Hexadecimal to Binary before extracting the MSB */
    this.dType = division.slice(0, 1);
    this.dValue = division.slice(1, division.length); // used to set the number of ticks per quarter note
  }

  toHex() {
    return this.type + this.length + this.format + this.tracks + this.dType + this.dValue;
  }

  getNumberOfTracks() {
    return parseInt(this.tracks, 16);
  }

  getFormat() {
    return parseInt(this.format, 16);
  }

  getTicksPerQuarterNote() {
    return parseInt(this.dValue, 16);
  }
}

// represents a MIDI Track chunk
class TrackChunk {
  constructor(length, events) {
    this.type = '4d54726b'; // 0x4d54726b
    this.length = length;
    this.events = events; // array, represents deltaTime-midiEvent pairs
  }

  toHex() {
    var rep = this.type + this.length;
    this.events.forEach(function(ev) {
      rep += ev.toHex();
    });
    return rep;
  }

  // used to select Midi Events of a specific type by passing a class constructor, WORKING
  getEventsByType(type) {
    var output = [];
    this.events.forEach(function(ev) {
      if(ev.getEvent() instanceof type) {
        output.push(ev);
      }
    });
    return output;
  }

  // used to return the total length of the track in MIDI ticks/pulses, PROBABLY WORKING
  getTrackLengthInTicks() {
    var output = 0;
    this.events.forEach(function(te) {
      output += te.getDeltaTime();
    });
    return output;
  }
}

// class representing a <deltaTimne>-<event> pair (e.g. MidiTracks contains many TrackEvents)
class TrackEvent {
  constructor(timestamp, deltaTime, ev) {
    this.timestamp = timestamp;
    this.deltaTime = deltaTime;
    this.ev = ev;
  }

  toHex() {
    return this.deltaTime + this.ev.toHex();
  }

  // returns the temporal position of the event relative to the track's entire runtime
  getTimeStamp() {
    return this.timestamp;
  }

  // returns delta-time in pulses (decimal base)
  getDeltaTime() {
    var binary = parseInt(this.deltaTime, 16).toString(2);
    var value = '';
    for (var i = 0, len = binary.length; i < len; i += 8) {
      var bstring = binary.slice(i, i + 8);
      if(bstring.length < 8) {
        value += bstring;
      } else {
        value += bstring.slice(1, 8);
      }
    }
    return parseInt(value, 2);
  }

  getEvent() {
    return this.ev;
  }
}

// represents a MIDI File which contains a single Header chunk and multiple Track chunks
// add indexing so can alter individual parts of a file
class MidiFile {
  constructor(headerChunk, trackChunks, title="midi") {
    this.title = title;
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

  getTitle() {
    return this.title;
  }

  getHeader() {
    return this.headerChunk;
  }

  getTracks() {
    return this.trackChunks;
  }

  getFirstTrack() {
    return this.trackChunks[0];
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
