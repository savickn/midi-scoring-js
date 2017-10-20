
// abstract base class for Midi events like NoteOn/NoteOff
class MidiEvent {
  constructor(statusCode, channel, data) {
    this.statusByte = statusCode + channel;
    this.data = data;
  }

  toHex() {
    return this.statusByte + this.data;
  }
}

/*
* used to initiate a note on a particular channel
* note is between 0-127
* velocity is the 'attack' between 0-127
*/
class NoteOn extends MidiEvent {
  constructor(channel, data) {
    super('9', channel, data);
    this.note = data.slice(0, 2);
    this.velocity = data.slice(2, 4);
  }

  getNote() {
    return this.note;
  }

  getVelocity() {
    return this.velocity;
  }
}

/*
* used to cancel a note on a particular channel
* note is between 0-127
* velocity is the 'release' between 0-127
*/
class NoteOff extends MidiEvent {
  constructor(channel, data) {
    super('8', channel, data);
    this.note = data.slice(0, 2);
    this.velocity = data.slice(2, 4);
  }

  getNote() {
    return this.note;
  }

  getVelocity() {
    return this.velocity;
  }
}

/*
* used to ????
* note is between 0-127
* pressure is amount of 'aftertouch' between 0-127
*/
class PolyphonicKeyPressure extends MidiEvent {
  constructor(channel, data) {
    super('a', channel, data);
    this.note = data.slice(0, 2);
    this.pressure = data.slice(2, 4);
  }
}

/*
* used to change controller values on a specific channel
* ctrl is between 0-127 (e.g. ctrl 1 is modulation wheel)
* ctrlValue is the new value for the 'ctrl envelope' between 0-127
*/
class ControllerChange extends MidiEvent {
  constructor(channel, data) {
    super('b', channel, data);
    this.ctrl = data.slice(0, 2);
    this.ctrlValue = data.slice(2, 4);
  }
}

/*
* used to select instrument for a given channel
* program is the instrument between 0-127 (e.g. )
*/
class ProgramChange extends MidiEvent {
  constructor(channel, data) {
    super('c', channel, data);
    this.program = data.slice(0, 2);
  }
}

/*
* not sure about use ???
*/
class ChannelKeyPressure extends MidiEvent {
  constructor(channel, data) {
    super('d', channel, data);
    this.channelPressure = data.slice(0, 2);
  }
}

/*
* used to select instrument for a given channel
* program is the instrument between 0-127 (e.g. )
*/
class PitchBend extends MidiEvent {
  constructor(channel, data) {
    super('e', channel, data);
    this.lsb = data.slice(0, 2);
    this.msb = data.slice(2, 4);
  }
}

/*
* used to turn all sound off in a particular channel
*/
class AllSoundOff extends MidiEvent {
  constructor(channel) {
    super('b', channel, '7800'); // 0x78 and 0x00
  }
}

/*
* used to reset all controllers
*/
class ResetAllControllers extends MidiEvent {
  constructor(channel) {
    super('b', channel, '7900'); // 0x78 and 0x00
  }
}

/*
* sets receiver to 'polyphonic mode'
*/
class PolyModeOn extends MidiEvent {
  constructor(channel) {
    super('b', channel, '7f00'); // 0x7F and 0x00
  }
}

/*
* sets receiver to 'monophonic mode'
*/
class MonoModeOn extends MidiEvent {
  constructor(channel) {
    super('b', channel, '7e00'); // 0x7E and 0x00
  }
}

// used to retrieve MIDI Events in real-time
function getMidiEvent(code, channel, data='') {
  switch(code) {
    case '8': // 0x8n:
      return new NoteOff(channel, data);
      break;
    case '9': // 0x9n:
      return new NoteOn(channel, data);
      break;
    case 'a': // 0xAn
      return new PolyphonicKeyPressure(channel, data);
      break;
    case 'b': // 0xBn:
      console.log('data', data);


      return new ControllerChange(channel, data);
      break;
    case 'c': // 0xCn
      return new ProgramChange(channel, data);
      break;
    case 'd': // 0xDn
      return new ChannelKeyPressure(channel, data);
      break;
    case 'e': // 0xEn
      return new PitchBend(channel, data);
      break;
    default:
      console.log('midi code', code);
      console.log('midi code not recognized');
      break;
  }
}

//export MidiEventFactory;
module.exports = {
  GetMidiEvent: getMidiEvent,
};
