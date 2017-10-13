
// represents a MIDI Header chunk
class HeaderChunk {
  constructor(format, numberOfTracks, deltaTime) {
    this.type = 0x4d546864;
    this.length = 0x00000006;

    this.tracks = numberOfTracks;
    this.format = format;
    this.deltaTime = deltaTime;
  }
}

// represents a MIDI Track chunk
class TrackChunk {
  constructor(length, events) {
    this.type = 0x4d54726b;
    this.events = []; // represents
  }
}

// class representing a <deltaTimne>-<event> pair (e.g. MidiTracks contains many TrackEvents)
class TrackEvent {
  constructor(deltaTime, event) {
    this.deltaTime = deltaTime;
    this.event = event;
  }
}

// represents a MIDI File which contains a single Header chunk and multiple Track chunks
class MidiFile {
  constructor(headerChunk) {
    this.headerChunk = headerChunk;
    this.trackChunks = [];

  }
}


//export HeaderChunk, TrackChunk, MidiFile;

module.exports = {
  MidiFile: MidiFile,
  HeaderChunk: HeaderChunk,
  TrackChunk: TrackChunk,
}
