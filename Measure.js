
const NoteModule = require('./Symbols/NoteSymbol.js');
const RestModule = require('./Symbols/RestSymbol.js');

class Measure {
	constructor(id, starttime, endtime) {
		this.id = id; // starts at 0 for simplicity
		this.width = getMeasureWidth(); //width in pixels based on symbols in symbolArra

		this.starttime = starttime; // returns the start of the measure as a MIDI pulse timestamp
		this.endtime = endtime; // returns the end of the measure as a MIDI pulse timestamp

		this.symbolMap = new Map(); // used to map individual notes to their midi pulse timestamps


		// alternative implementation
		//this.starttime = timeSignature.measure + id*timeSignature.measure; // returns the start of the measure as a MIDI pulse timestamp
		//this.endtime = starttime + timeSignature.measure; // returns the end of the measure as a MIDI pulse timestamp

		// not needed, will be stored as a ClefMap by Staff and passed as argument when drawing
		//this.clef = clef;
		//this.keySignature = keySignature;
		//this.timeSignature = timeSignature;
	}

	/* SETTERS & GETTERS */

	// returns 'starttime' attr
	getStartTime() {
		return this.starttime;
	}

	// returns 'endtime' attr
	getEndTime() {
		return this.endtime;
	}

	// returns 'width' attr
	getWidth() {
		return this.width;
	}

	//used to change clef properties of this measure
	setClef(clef) {
		this.clef = clef;
	}

	//used to change timeSig properties of this measure
	setTimeSignature(ts) {
		this.timeSignature = ts;
	}

	//used to change keySig properties of this measure
	setKeySignature(ks) {
		this.keySignature = ks;
	}

	/* CLASS LOGIC */

	// returns 'true' if the specified timestamp occurs within this measure
	containsTimeStamp(timestamp) {
		return timestamp >= this.getStartTime() && timestamp < this.getEndTime() ? true : false;
	}

	//determines how long the measure needs to be drawn
	getMeasureWidth() {
		var measureWidth = 0;
		for(var i = 0; i < symbolArray.length; i++) {
			var symbol = symbolArray[i];
			measureWidth += symbol.getWidth();
		}
		return measureWidth;
	}

	// adds Note to array so it can be drawn
	addNoteSymbol(starttime, duration) {
		var endtime = starttime + duration;
		var self = this;

		/*self.symbolMap.forEach(function(symbol, oldStarttime) {
			if (symbol typeof NoteModule.NoteSymbol || symbol typeof RestModule.RestSymbol) && (symbol.starttime >=
				starttime && symbol.endtime < endtime) {
					self.symbolMap.delete(oldStarttime);
			}
		})
		this.symbolMap.set(starttime, new NoteSymbol(starttime, duration))*/
	}

	// adds Rest to array so it can be drawn
	addRestSymbol(starttime, duration) {
		var endtime = starttime + duration;
		var self = this;

		/*self.symbolMap.forEach(function(symbol, oldStarttime) {
			if (symbol typeof NoteModule.NoteSymbol || symbol typeof RestModule.RestSymbol) && (symbol.starttime >=
				starttime && symbol.endtime < endtime) {
					self.symbolMap.delete(oldStarttime);
			}
		})

		self.symbolMap.set(starttime, new RestSymbol(starttime, duration));*/
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
