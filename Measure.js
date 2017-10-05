

class Measure {
	constructor(id, timeSignature, keySignature, clef, sound) {
		this.id = id; //starts at 1
		this.width = getMeasureWidth(); //width in pixels based on symbols in symbolArra
		this.starttime = timeSignature.measure + id*timeSignature.measure; //MIDI pulse time when this measure starts
		this.endtime = starttime + timeSignature.measure; //MIDI pulse time at end

		this.sound = sound;

		//this.drawableclef = drawableclef; //determines if clef should be drawn
		//this.drawablekey = drawablekey; //determines if clef should be drawn
		//this.drawabletime = drawabletime; //determines if clef should be drawn

		this.symbolMap = new Map();

		this.clef = clef;
		this.clefSymbol = new ClefSymbol(clef, starttime);

		this.keySignature = keySignature;
		this.keySymbol = new KeySymbol();

		this.timeSignature = timeSignature;
		this.timeSymbol = new TimeSymbol();
	}

	//determines how long the measure needs to be drawn
	getMeasureWidth() {
		var measureWidth = 0;
		for(var i = 0; i < symbolArray.length; i++) {
			var symbol = symbolArray[i];
			measureWidth += symbol.width;
		}
		return measureWidth;
	}

	//adds Note to array so it can be drawn
	addNoteSymbol(starttime, duration) {
		var endtime = starttime + duration;
		var self = this;

		self.symbolMap.forEach(function(symbol, oldStarttime) {
			if (symbol.instanceof === NoteSymbol || symbol.instanceof === RestSymbol) && (symbol.starttime >=
				starttime && symbol.endtime < endtime) {
					self.symbolMap.delete(oldStarttime);
			}
		})
		this.symbolMap.set(starttime, new NoteSymbol(starttime, duration))
	}

	//adds Rest to array so it can be drawn
	addRestSymbol(starttime, duration) {
		var endtime = starttime + duration;
		var self = this;

		self.symbolMap.forEach(function(symbol, oldStarttime) {
			if (symbol.typeof === NoteSymbol || RestSymbol) && (symbol.starttime >=
				starttime && symbol.endtime < endtime) {
					self.symbolMap.delete(oldStarttime);
			}
		})

		self.symbolMap.set(starttime, new RestSymbol(starttime, duration));
	}

	//used to change clef properties of this measure
	setClef(newclef) {
		this.clef = newclef;
	}

	//used to change timeSig properties of this measure
	setTimeSig(newTimeSig) {
		this.timeSignature = newTimeSig;
	}

	//used to change keySig properties of this measure
	setKeySig(newKeySig) {
		this.keySignature = newKeySig;
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
    for (line = 1; line &lt;= 5; line++) {
      graphics.lineTo(xstart + measureLength, y);
      y += lineWidth + lineSpace;
      graphics.moveTo(xstart, y);
    }
    //xstart += measureLength;
	}

	//draw vertical staff lines
	drawBarlines(stage, graphics, ytop, xstart) {
	  graphics.moveTo(xstart, ytop);
	  graphics.lineTo(xstart, ystaff);
	}

}
