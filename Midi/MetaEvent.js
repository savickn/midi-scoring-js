
// abstract base class for Meta events like EndOfTrack, SetTempo
class MetaEvent {
  constructor(type, length) {
    this.code = 0xFF;
    this.type = type;
    this.length = length;
  }
}

class SequenceNumber extends MetaEvent {
  constructor(sequence) {
    super(0x00, 0x02);
    this.sequence = sequence; // 16-bit binary number
  }
}

class TextEvent extends MetaEvent {
  constructor(text) { // text as a string of 8-bit ascii/utf-8 characters
    super(0x01, text.length.toString(16));
    this.text = text;
  }
}

class EndOfTrack extends MetaEvent {
  constructor() {
    super(0x2F, 0x00);
  }
}

class SetTempo extends MetaEvent {
  constructor(tempo) { // tempo in microseconds per quarter-note
    super(0x51, 0x03);
    this.tempo = tempo;
  }
}

class TimeSignature extends MetaEvent {
  constructor(num, denom, midiClocks, thirtySecondsNotesPer24MidiClocks) {
    super(0x58, 0x04);
    this.num = num;
    this.denom = denom;
    this.clocks = midiClocks;
    this.notesPerClock = thirtySecondsNotesPer24MidiClocks;
  }
}

/*
* numberOfSharpsFlats should be between -7 (7 flats) and +7 (7 sharps)
* majorMinorKey should be either 0 (major) or 1 (minor)
*/
class KeySignature extends MetaEvent {
  constructor(numberOfSharpsFlats, majorMinorKey) {
    super(0x59, 0x02);
    this.sharpsFlats = numberOfSharpsFlats;
    this.majorMinor = majorMinorKey;
  }
}


// used to retrieve Meta Events in real-time
class MetaEventFactory {
  constructor() {}

  static getObjByCode(code, argsObj) {
    switch(code) {
      case 0x00:
        return getSequenceNumber(argsObj);
        break;
      case 0x01:
        return getTextEvent(argsObj);
        break;
      case 0x02:
        break;
      default:
        break;
    }
  }

  getSequenceNumber(argsObject) {
    return new SequenceNumber(argsObject.sequence);
  }

  getTextEvent(argsObject) {
    return new TextEvent(argsObject.sequence);
  }

}

module.exports = {
  MetaEventFactory: MetaEventFactory
};
