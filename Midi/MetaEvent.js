
// abstract base class for Meta events like EndOfTrack, SetTempo
class MetaEvent {
  constructor(type, length) {
    this.code = 'FF'; //0xFF;
    this.type = type;
    this.length = length;
  }
}

class SequenceNumber extends MetaEvent {
  constructor(sequence) {
    super('00', '02'); //(0x00, 0x02);
    this.sequence = sequence; // 16-bit binary number
  }
}

class TextEvent extends MetaEvent {
  constructor(text) { // text as a string of 8-bit ascii/utf-8 characters
    super('01', text.length.toString(16)); //(0x01, text.length.toString(16));
    this.text = text;
  }
}

class CopyrightNotice extends MetaEvent {
  constructor(cpyrightTxt) { // text as a string of 8-bit ascii/utf-8 characters
    super('02', cpyrightTxt.length.toString(16));
    this.text = cpyrightTxt;
  }
}

class TrackName extends MetaEvent {
  constructor(trackName) { // text as a string of 8-bit ascii/utf-8 characters
    super('03', trackName.length.toString(16));
    this.text = trackName;
  }
}

class EndOfTrack extends MetaEvent {
  constructor() {
    super('2f', '00'); //(0x2F, 0x00);
  }
}

class SetTempo extends MetaEvent {
  constructor(tempo) { // tempo in microseconds per quarter-note
    super('51', '03'); //(0x51, 0x03);
    this.tempo = tempo;
  }
}

class TimeSignature extends MetaEvent {
  //constructor(num, denom, midiClocks, thirtySecondsNotesPer24MidiClocks) {
  constructor(data) {
    super('58', '04'); //(0x58, 0x04);
    this.num = data.slice(0, 2);
    this.denom = data.slice(2, 4);
    this.clocks = data.slice(4, 6); //
    this.notesPerClock = data.slice(6, 8); //
  }
}

/*
* numberOfSharpsFlats should be between -7 (7 flats) and +7 (7 sharps)
* majorMinorKey should be either 0 (major) or 1 (minor)
*/
class KeySignature extends MetaEvent {
  //constructor(numberOfSharpsFlats, majorMinorKey) {
  constructor(data) {
    super('59', '02'); //(0x59, 0x02);
    this.sharpsFlats = data.slice(0, 2);
    this.majorMinor = data.slice(2, 4);
  }
}


// used to retrieve Meta Events in real-time
function getMetaEvent(code, data='') {
  switch(code) {
    case '00': //0x00:
      return new SequenceNumber(data);
      break;
    case '01': //0x01:
      return new TextEvent(data);
      break;
    case '2f': //0x2f:
      return new EndOfTrack();
      break;
    case '51': //0x51:
      return new SetTempo(data);
      break;
    case '58': //0x58:
      return new TimeSignature(data);
      break;
    case '59': //0x59:
      return new KeySignature(data);
      break;
    default:
      break;
  }
}

module.exports = {
  GetMetaEvent: getMetaEvent,
};
