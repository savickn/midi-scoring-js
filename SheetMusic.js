
//renders the visual representation of the score (using MidiData object)

class SheetMusic {
	constructor(scoreTitle, composerName, staffMap, scoreOptions) {
		this.scoreTitle = scoreTitle;
		this.composer = composerName;

		this.instruments = instruments;

		this.scoreOptions = scoreOptions;

		this.measureLengthsArray = this.buildMeasureLengthsArray(numberOfMeasures);

		this.cursorMode = null; // can be 'WRITE' or 'SELECT'
		this.activeDuration = null; //can be 'quarter-note', 'half-note', etc
	}

	//an array of longestMeasure lengths for each measure
	buildMeasureLengthsArray (numberOfMeasures) {
		for(i = 0; i < numberOfMeasures; i++) {
			var longestLength = this.getLongestMeasureLength(i);
			this.measureLengths.push(longestLength);
		}
	}

	//determines the total length of each measure based on the
	//longest measure in the collection at a particular index
	getLongestMeasureLength(index) {
		var testMeasure = index;
		var longestLength = 0;
		this.staffArray.forEach(function(staff) {
			var measureLength = staff.measureArray[testMeasure].getMeasureWidth();
			if(measureLength > longestLength) {
				longestLength = measureLength;
			}
		}, this)
		return longestLength;
	}

	renderScore(stage, graphics) {
		var self = this;
		var ytop = this.scoreOptions.ymargin;
		var xstart = this.scoreOptions.xmargin;

		self.staffArray.forEach(function(staff) {
			staff.draw(stage, graphics, ytop, xstart);
			ytop += self.scoreOptions.staffHeight + self.scoreOptions.staffMargin;
		});
	}
}
