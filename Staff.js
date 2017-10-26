
// used to pass relevant data to build Staffs
class StaffTemplate {
	constructor(instrument, notes) {
		this.instrument = instrument;
		this.notes = notes;
	}

	getInstrument() {
		return this.instrument;
	}

	getNotes() {
		return this.notes;
	}
}

class Staff {
	constructor(id, instrument, measureArray/*, controllerMap, track*/) {
		//this.sheetMusic = context;

		//this.ytop = ytop; //top of the staff aka y-axis starting point
		//this.xstart = context.xmargin; //x-axis starting point

		this.id = id // starts at 0
		this.instrument = instrument; // represents the MIDI instrument to use as a value between 0-127
		//this.controllerMap = controllerMap; // represents controller changes for this track... structured as {ctrlName: {timestamp1: ctrlValue1, timestamp2: ctrlValue2, etc}}
		this.measureArray = measureArray; // represents the Measures of each staff

		//this.track = track; // represents the MIDI track that can be constructed from the 'measureArray'
	}

	// returns the Measure that contains the provided timestamp
	getMeasureFromTimeStamp(timestamp) {
		for(let m of this.measureArray) {
			if(m.containsTimeStamp(timestamp)) {
				return m;
			}
		}
	}

	//draws the staff
	draw(stage, graphics, ytop, xstart) {
		var xstart = xstart;
		this.measureArray.forEach(function(measure) {
			var drawableObject = {
				clefDrawable: false,
				keyDrawable: false,
				timeDrawable: false
			};

			if(measure.id === 1) {
				drawableObject.clefDrawable = true;
				drawableObject.keyDrawable = true;
				drawableObject.timeDrawable = true;

			} else {
				var prevMeasure = measureArray[measure.id - 2];

				if(measure.clef != prevMeasure.clef) {
					drawableObject.clefDrawable = true;
				}
				if (measure.keySignature != prevMeasure.keySignature) {
					drawableObject.keyDrawable = true;
				}
				if (measure.timeSignature != prevMeasure.timeSignature) {
					drawableObject.timeDrawable = true;
				}
			}

			measure.draw(stage, graphics, ytop, xstart, drawableObject);
			xstart += measure.getMeasureWidth();
		});
	}
}

module.exports = {
	Staff: Staff,
	Template: StaffTemplate,
};
