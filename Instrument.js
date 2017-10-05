
var instruments {
	
}


class Instrument {
	constructor(clef, sound) {
		//staffs associated with this instrument
		this.staffArray = staffs;
		
		//soundfont 
		this.sound = sound;


	}
}

class MidiFile {
	constructor() {
		this.name = name //filename
		this.header = header //representation of <header_chunk>
		this.tracks = tracks //array of MidiTrack objects which are representations of <track_chunk>
	}
}

//represents <header_chunk>
class MidiHeader {
	constructor() {

	}
}

//represents <track_chunk>
class MidiTrack {
	constructor() {

	}
}

class MidiTrackEvent {
	constructor() {

	}
}

class MidiMetaEvent {
	constructor() {

	}
}


/*Common MIDI CCs
tempo?
volume?
velocity?

*/


