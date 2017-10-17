
// abstract base class for Midi events like NoteOn/NoteOff
class MidiEvent {
  constructor(statusCode, channel) {
    this.statusByte = statusCode + channel;
  }
}

/*
* used to initiate a note on a particular channel
* note is between 0-127
* velocity is the 'attack' between 0-127
*/
class NoteOn extends MidiEvent {
  constructor(channel, data) {
    super('9', channel);
    this.note = data.slice(0, 2);
    this.velocity = data.slice(2, 4);
  }
}

/*
* used to cancel a note on a particular channel
* note is between 0-127
* velocity is the 'release' between 0-127
*/
class NoteOff extends MidiEvent {
  constructor(channel, note, velocity) {
    super('8', channel);
    this.note = data.slice(0, 2);
    this.velocity = data.slice(2, 4);
  }
}

/*
* used to ????
* note is between 0-127
* pressure is amount of 'aftertouch' between 0-127
*/
class PolyphonicPressure extends MidiEvent {
  constructor(channel, data) {
    super('A', channel);
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
    super('B', channel);
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
    super('C', channel);
    this.program = data.slice(0, 2);
  }
}

/*
* used to select instrument for a given channel
* program is the instrument between 0-127 (e.g. )
*/
class PitchBend extends MidiEvent {
  constructor(channel, data) {
    super('E', channel);
    this.lsb = data.slice(0, 2);
    this.msb = data.slice(2, 4);
  }
}

/*
* used to turn all sound off in a particular channel
*/
class AllSoundOff extends MidiEvent {
  constructor(channel) {
    super('B', channel);
    this.data = ['78', '00']; // 0x78 and 0x00
  }

  toHex() {
    return this.statusByte + this.data.join('');
  }
}

/*
* used to reset all controllers
*/
class ResetAllControllers extends MidiEvent {
  constructor(channel) {
    super('B', channel);
    this.data = ['79', '00']; // 0x78 and 0x00
  }

  toHex() {
    return this.statusByte + this.data.join('');
  }
}

/*
* sets receiver to 'polyphonic mode'
*/
class PolyModeOn extends MidiEvent {
  constructor(channel) {
    super('B', channel);
    this.data1 = 0x7F;
    this.data2 = 0x00;
  }
}

/*
* sets receiver to 'monophonic mode'
*/
class MonoModeOn extends MidiEvent {
  constructor(channel) {
    super('B', channel);
    this.data1 = 0x7E;
    this.data2 = 0x00;
  }
}

// used to retrieve MIDI Events in real-time
function getMidiEvent(code, channel, data='') {
  switch(code) {
    case '8': //0x8n:
      return new NoteOff(channel, data);
      break;
    case '9': //0x9n:
      return new NoteOn(channel, data);
      break;
    case 'B': //0xBn:
      return new ControllerChange(channel, data);
      break;
    default:
      break;
  }
}

//export MidiEventFactory;
module.exports = {
  GetMidiEvent: getMidiEvent,
};
