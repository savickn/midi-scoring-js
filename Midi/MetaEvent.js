
// abstract base class for Meta events like EndOfTrack, SetTempo
class MetaEvent {
  constructor(type, length, data) {
    this.code = 'ff'; //0xFF;
    this.type = type;
    this.length = length;
    this.data = data;
  }

  toHex() {
    return this.code + this.type + this.length + this.data;
  }
}

class SequenceNumber extends MetaEvent {
  constructor(sequence /*16-bit binary number*/) {
    super('00', '02', sequence); //(0x00, 0x02);
  }
}

class GeneralText extends MetaEvent {
  constructor(len, text) { // text as a string of 8-bit ascii/utf-8 characters
    super('01', len, text); // 0x01
  }
}

class CopyrightNotice extends MetaEvent {
  constructor(len, cpyrightTxt) { // text as a string of 8-bit ascii/utf-8 characters
    super('02', len, cpyrightTxt);
  }
}

class TrackName extends MetaEvent {
  constructor(len, trackName) { // 'text' as a string of 8-bit ascii/utf-8 characters, 'len' as bytes in hexadecimal
    super('03', len, trackName);
  }
}

class EndOfTrack extends MetaEvent {
  constructor() {
    super('2f', '00', ''); //(0x2F, 0x00);
  }
}

class SetTempo extends MetaEvent {
  constructor(tempo) { // tempo in microseconds per quarter-note
    super('51', '03', tempo); //(0x51, 0x03);
  }
}

class TimeSignature extends MetaEvent {
  constructor(data) {
    super('58', '04', data); //(0x58, 0x04);
    this.num = data.slice(0, 2);
    this.denom = data.slice(2, 4); // as a power of 2 (e.g. denom = 2 would be time signature of 4)
    this.clocks = data.slice(4, 6); //
    this.notesPer24Clocks = data.slice(6, 8); //
  }

  getNumerator() {
    return parseInt(this.num, 16);
  }

  getDenominator() {
    return Math.pow(2, parseInt(this.denom, 16));
  }

  getClocks() {
    return this.clocks;
  }

  getNotesPer24Clocks() {
    return this.notesPer24Clocks;
  }
}

/*
* numberOfSharpsFlats should be between -7 (7 flats) and +7 (7 sharps)
* majorMinorKey should be either 0 (major) or 1 (minor)
*/
class KeySignature extends MetaEvent {
  constructor(data) {
    super('59', '02', data); //(0x59, 0x02);
    this.sharpsFlats = data.slice(0, 2);
    this.majorMinor = data.slice(2, 4);
  }

  getSharpsAndFlats() {
    return this.sharpsFlats;
  }

  getMajorMinor() {
    return this.majorMinor;
  }
}

/*
* used when the midi message format is correct but the message type is unsupported
*/
class SelectMidiPort extends MetaEvent {
  constructor(data) {
    super('21', '01', data); //(0x59, 0x02);
  }
}

/*
* used when the midi message format is correct but the message type is unsupported
*/
class GenericMetaEvent extends MetaEvent {
  constructor(code, length, data) {
    super(code, length, data); //(0x59, 0x02);
  }
}


// used to retrieve Meta Events in real-time
function getMetaEvent(code, length, data='') {
  switch(code) {
    case '00': //0x00:
      return new SequenceNumber(data);
      break;
    case '01': //0x01:
      return new GeneralText(length, data);
      break;
    case '02': //0x03:
      return new CopyrightNotice(length, data);
      break;
    case '03': //0x03:
      return new TrackName(length, data);
      break;
    case '2f': //0x2f:
      return new EndOfTrack();
      break;
    case '21': //0x21:
      return new SelectMidiPort(data);
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
      console.log('meta code', code);
      console.log('meta code not recognized');
      return new GenericMetaEvent(code, length, data);
      break;
  }
}

module.exports = {
  GetMetaEvent: getMetaEvent,
  EndOfTrack: EndOfTrack,
  SetTempo: SetTempo,
  TimeSignature: TimeSignature,
  KeySignature: KeySignature,
};
