
// abstract base class for System events like _________
class SystemEvent {
  constructor(code, length, data) {
    this.code = code;
    this.length = length;
    this.data = data;
  }

  toHex() {
    return this.code + this.length + this.data;
  }
}

class SysExStart extends SystemEvent {
  constructor(length, data) {
    super('f0', length, data);
    this.message = 'f0' + data;
  }
}

class SysExEnd extends SystemEvent {
  constructor(length, data) {
    super('f7', length, data);
    this.message = data;
  }
}

// used to retrieve SysEx Events in real-time
function getSystemEvent(code, length, data='') {
  switch(code) {
    case 'f0': //0xF0:
      return new SysExStart(length, data);
      break;
    case 'f7': //0xF7:
      return new SysExEnd(length, data);
      break;
    default:
      break;
  }
}

module.exports = {
  GetSystemEvent: getSystemEvent,
};
