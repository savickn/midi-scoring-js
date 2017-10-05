class Staff {

	constructor(measureArray, track) {
		//this.sheetMusic = context;

		//this.ytop = ytop; //top of the staff aka y-axis starting point
		//this.xstart = context.xmargin; //x-axis starting point
		this.track = track; // represents the MIDI track that can be constructed from the 'measureArray'
		this.measureArray = measureArray; // represents the Measures of each staff
	}

	addNote(measure, starttime, duration) {

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
