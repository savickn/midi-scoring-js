
// class representing a <deltaTimne>-<event> pair (e.g. MidiTracks contains many TrackEvents)
class TrackEvent {
  constructor(deltaTime, event) {
    this.deltaTime = deltaTime;
    this.event = event;
  }
}

// abstract class for Meta events like _________
class MetaEvent {
  constructor() {

  }
}



// abstract class for System events like _________
class SystemEvent {

}



// abstract class for Midi events like NoteOn/NoteOff
class MidiEvent {
  constructor(statusCode, channel) {
    this.statusByte = statusCode + channel;
  }
}

class NoteOn extends MidiEvent {
  constructor(channel, note, velocity) {
    super('', channel);
    this.note = note;
    this.velocity = velocity;
  }
}

class NoteOff extends MidiEvent {
  constructor(channel, note, velocity) {
    super('', channel);
    this.note = note;
    this.velocity = velocity;
  }
}

class ControllerChange extends MidiEvent {
  constructor(channel, ctrl, ctrlValue) {
    super('', channel);
    this.ctrl = ctrl;
    this.ctrlValue = ctrlValue;
  }
}

// used to retrieve System Events in real-time
class SystemEventFactory {

}

// used to retrieve Meta Events in real-time
class MetaEventFactory {

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
  MidiEventFactory: MidiEventFactory,
  TrackEvent: TrackEvent
};
