
const NoteModule = require('./Symbols/NoteSymbol.js');
const RestModule = require('./Symbols/RestSymbol.js');

// represents a single measure in a musical score
class Measure {
	constructor(id, starttime, timeSignature, keySignature) {
		this.id = id; // starts at 0 for simplicity
		this.width = this.getMeasureWidth(); //width in pixels based on symbols in symbolArra

		this.starttime = starttime; // stores the start of the measure as a MIDI pulse timestamp
		this.endtime = starttime + timeSignature.getMeasureLengthInPulses(); // stores the end of the measure as a MIDI pulse timestamp

		this.symbolMap = new Map([]); // used to map individual notes to their midi pulse timestamps

		//this.voice1 = new Map([]); // used to replace symbolMap
		//this.voice2

		// alternative implementation
		//this.starttime = timeSignature.measure + id*timeSignature.measure; // returns the start of the measure as a MIDI pulse timestamp
		//this.endtime = starttime + timeSignature.measure; // returns the end of the measure as a MIDI pulse timestamp

		// not needed, will be stored as a ClefMap by Staff and passed as argument when drawing
		//this.clef = clef;
		this.keySignature = keySignature;
		this.timeSignature = timeSignature;
	}

	/* SETTERS & GETTERS */

	getStartTime() {
		return this.starttime;
	}

	getEndTime() {
		return this.endtime;
	}

	getWidth() {
		return this.width;
	}

	setClef(clef) {
		this.clef = clef;
	}

	setTimeSignature(ts) {
		this.timeSignature = ts;
	}

	setKeySignature(ks) {
		this.keySignature = ks;
	}

	/* CLASS LOGIC */

	// returns 'true' if the specified timestamp occurs within this measure
	containsTimeStamp(timestamp) {
		return timestamp >= this.getStartTime() && timestamp < this.getEndTime() ? true : false;
	}

	// adds Note to array so it can be drawn
	// must check for Rests, existing notes of the same duration (create chord),
	// existing notes of greater duration (delete and fill appropriately)
	addNote(note) {
		var starttime = note.getStartTime();
		var duration = note.getDuration();
		var endtime = starttime + duration;
		var existingNote = this.symbolMap.get(starttime);

		if(typeof existingNote != undefined) {
			if(typeof existingNote === RestModule.RestSymbol) {
				// Delete Rest
				// Add note
				// Fill remaining space with Rests
			} else {

			}


			if(duration === existingNote.getDuration()) {
				this.symbolMap.
			}


		} else {
			this.symbolMap.set(starttime, [new NoteModule.NoteSymbol(starttime, duration)]);
		}



		/*self.symbolMap.forEach(function(symbol, oldStarttime) {
			if (symbol typeof NoteModule.NoteSymbol || symbol typeof RestModule.RestSymbol) && (symbol.starttime >=
				starttime && symbol.endtime < endtime) {
					self.symbolMap.delete(oldStarttime);
			}
		})
		this.symbolMap.set(starttime, new NoteSymbol(starttime, duration))*/
	}

	// adds Rest to array so it can be drawn
	addRest(rest) {
		var starttime = note.getStartTime();
		var duration = note.getDuration();
		var endtime = starttime + duration;

		this.symbolMap.set(starttime, [new NoteModule.NoteSymbol(starttime, duration)]);

		/*self.symbolMap.forEach(function(symbol, oldStarttime) {
			if (symbol typeof NoteModule.NoteSymbol || symbol typeof RestModule.RestSymbol) && (symbol.starttime >=
				starttime && symbol.endtime < endtime) {
					self.symbolMap.delete(oldStarttime);
			}
		})

		self.symbolMap.set(starttime, new RestSymbol(starttime, duration));*/
	}

	// used to remove individual NoteSymbols from symbolArray
	removeNote(starttime) {
		
	}

	// helper method for fillWithRests and fillWithNotes
	divideDuration(duration) {
		var remainingDuration = duration;
		var noteDurations = [];
		while(remainingDuration > 0) {
			var subnote = this.timeSignature.convertMIDIDurationToNote(remainingDuration);
			var subnoteDuration = this.timeSignature.convertNoteToMIDIDuration(subnote);
			console.log('subnote', subnote);
			remainingDuration -= subnoteDuration;
			console.log('remainingDuration', remainingDuration);
			noteDurations.push(subnoteDuration);
		};
	}

	// adds Rests until the Measure is completely filled
	fillWithRests(starttime, duration) {
		var restDurations = this.divideDuration(duration)
		var runningStartTime = starttime;

		for(let restDuration of restDurations) {
			this.symbolMap.set(runningStartTime, new RestModule.RestSymbol(runningStartTime, noteDuration));
			runningStartTime += restDuration;
		};
	}

	// used when a shorter duration note replaces a longer duration note to fill the excess space, UNTESTED
	fillWithNotes(note, starttime, duration) {
		var key = note.getNote();
		var velocityOn = note.getVelocityOn();
		var velocityOff = note.getVelocityOff();

		var noteDurations = this.divideDuration(duration);
		var runningStartTime = starttime;

		for(let noteDuration of noteDurations) {
			this.symbolMap.set(runningStartTime, new NoteModule.NoteSymbol(runningStartTime, noteDuration, key, velocityOn, velocityOff));
			runningStartTime += noteDuration;
		};
	}

	/* GRAPHICS */

	//determines how long the measure needs to be drawn
	getMeasureWidth() {
		var measureWidth = 0;
		/*for(let [time, symbol] of this.symbolMap) {
			measureWidth += symbol.getWidth();
		}*/
		return measureWidth;
	}

	//draws the measure
	draw(stage, graphics, ytop, xstart, drawableObject) {
		var xstart = xstart;

		this.drawHorzLines(stage, graphics, ytop, xstart);

		xstart += 5; //left margin

		if(drawableObject.clefDrawable === true) {
			this.clefSymbol.draw(stage, graphics, ytop, xstart);
			xstart += clefSymbol.width;
		}

		if(drawableObject.keyDrawable === true) {
			this.keySymbol.draw(stage, graphics, ytop, xstart);
			xstart += keySymbol.width;
		}

		if(drawableObject.timeDrawable === true) {
			this.timeSymbol.draw(stage, graphics, ytop, xstart);
			xstart += timeSymbol.width;
		}

		this.symbolMap.forEach(function(symbol) {
			symbol.draw(stage, graphics, ytop, xstart);
			xstart += symbol.width;
		})

		xstart += 5; //right margin

		this.drawBarlines(stage, graphics, ytop, xstart);
	}

	//draws horizontal lines of the staff
	drawHorzLines(stage, graphics, ytop, xstart) {
		var line = 1;
		var y = ytop;
		var x = xstart;
    graphics.moveTo(xstart, ytop)
    /*for (line = 1; line &lt;= 5; line++) {
      graphics.lineTo(xstart + measureLength, y);
      y += lineWidth + lineSpace;
      graphics.moveTo(xstart, y);
    }*/
    //xstart += measureLength;
	}

	//draw vertical staff lines
	drawBarlines(stage, graphics, ytop, xstart) {
	  graphics.moveTo(xstart, ytop);
	  graphics.lineTo(xstart, ystaff);
	}
}

module.exports = {
	Measure: Measure,
};
