
// renders the visual representation of the score (using MidiData object)
class SheetMusic {
	constructor(scoreTitle, /*composerName,*/ scoreOptions, tracks, /*midiHeader, midiTracks,*/ timeSignatureMap, keySignatureMap, tempoMap, numberOfMeasures) {
		this.scoreTitle = scoreTitle;
		//this.composer = composerName;
		this.scoreOptions = scoreOptions;

		this.timeSignatureMap = timeSignatureMap; // represents the time signature changes in the song (as midi pulse timestamps)
		this.keySignatureMap = keySignatureMap; // represents the key signature changes in the song (as midi pulse timestamps)
		this.tempoMap = tempoMap; // represents the tempo changes in the song (as midi pulse timestamps)
		this.numberOfMeasures = numberOfMeasures; // represents the totla number of measures in the song

		this.staffArray = this.buildStaffs(tracks); // used to create Staffs from MIDI track chunks
		//this.measureLengthsArray = this.buildMeasureLengthsArray(numberOfMeasures);

		this.cursorMode = null; // can be 'WRITE' or 'SELECT'
		this.activeDuration = null; //can be 'quarter-note', 'half-note', etc
	}

	buildStaffs(tracks) {
		var staffArray = [];
		tracks.forEach(function(tracks) {

		})
		return staffArray;
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

module.exports = {
	'SheetMusic': SheetMusic,
}
