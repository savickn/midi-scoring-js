
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
  constructor(channel, note, velocity) {
    super('9', channel);
    this.note = note;
    this.velocity = velocity;
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
    this.note = note;
    this.velocity = velocity;
  }
}

/*
* used to ????
* note is between 0-127
* pressure is amount of 'aftertouch' between 0-127
*/
class PolyphonicPressure extends MidiEvent {
  constructor(channel, note, pressure) {
    super('A', channel);
    this.note = note;
    this.pressure = pressure;
  }
}

/*
* used to change controller values on a specific channel
* ctrl is between 0-127 (e.g. ctrl 1 is modulation wheel)
* ctrlValue is the new value for the 'ctrl envelope' between 0-127
*/
class ControllerChange extends MidiEvent {
  constructor(channel, ctrl, ctrlValue) {
    super('B', channel);
    this.ctrl = ctrl;
    this.ctrlValue = ctrlValue;
  }
}

/*
* used to select instrument for a given channel
* program is the instrument between 0-127 (e.g. )
*/
class ProgramChange extends MidiEvent {
  constructor(channel, program) {
    super('C', channel);
    this.program = program;
  }
}

/*
* used to select instrument for a given channel
* program is the instrument between 0-127 (e.g. )
*/
class PitchBend extends MidiEvent {
  constructor(channel, program) {
    super('E', channel);
    this.program = program;
  }
}

/*
* used to turn all sound off in a particular channel
*/
class AllSoundOff extends MidiEvent {
  constructor(channel) {
    super('B', channel);
    this.data1 = 0x78;
    this.data2 = 0x00;
  }
}

/*
* used to reset all controllers
*/
class ResetAllControllers extends MidiEvent {
  constructor(channel) {
    super('B', channel);
    this.data1 = 0x79;
    this.data2 = 0x00;
  }

  toHex() {

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
class MidiEventFactory {
  constructor() {}

  getNoteOn(channel, note, velocity) {
    return new NoteOn(channel, note, velocity);
  }

  getNoteOff(channel, note, velocity) {
    return new NoteOff(channel, note, velocity);
  }

  getControllerChange(channel, ctrl, ctrlValue) {
    return new ControllerChange(channel, ctrl, ctrlValue);
  }

}


// each MidiController Message has a 'code' (e.g. 0x01, and a value between 0-127, e.g. 01111111)
class ControllerMessage {
    constructor(code, value) {
      this.code = code;
      this.value = value;
    }
}

//export MidiEventFactory, TrackEvent;

module.exports = {
  MidiEventFactory: MidiEventFactory
};
