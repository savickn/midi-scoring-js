
// represents a MIDI Header chunk
class HeaderChunk {
  constructor(format, numberOfTracks, deltaTime) {
    this.type = "4d546864";
    this.length = "00000006";

    this.tracks = numberOfTracks;
    this.format = format;
    this.deltaTime = deltaTime;
  }
}

// represents a MIDI Track chunk
class TrackChunk {
  constructor(length, events) {
    this.type = "4d54726b"
    this.events = []; // represents
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
  TrackChunk: TrackChunk
}
