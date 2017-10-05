
const fs = require('fs');

// abstract class for HeaderChunk and TrackChunk
class MidiChunk {

}

class HeaderChunk {
  constructor(numberOfTracks deltaTime) {
    this.type = "MThd";
    this.length = 6;

  }
}

class TrackChunk {
  constructor(length, events) {
    this.type = "MTrk"
    this.events = []; // represents
  }
}

class MidiFile {
  constructor(headerChunk) {
    this.headerChunk = headerChunk;
    this.trackChunks = [];

  }
}


export HeaderChunk, TrackChunk, MidiFile;
