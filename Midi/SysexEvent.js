
// abstract base class for System events like _________
class SystemEvent {
  constructor(code, length) {

  }
}

class SysExStart extends SystemEvent {
  constructor() {
    super('F0');
  }
}

class SysExEnd extends SystemEvent {
  constructor() {
    super('F7');

  }
}


// used to retrieve System Events in real-time
class SystemEventFactory {

}

module.exports = {
  'SystemEventFactory': SystemEventFactory,
};
