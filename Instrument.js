
class Instrument {
	constructor(sound, clefs) {
		this.sound = sound; // soundfont
		this.clefs = clefs; // used to create an independent Staff for each clef
	}
}

var instruments = {};

instruments.Piano = new Instrument('Piano', ['Treble', 'Bass']);
instruments.Violin = new Instrument('Violin', ['Treble']);

module.exports = {
	Instrument: instruments,
};
