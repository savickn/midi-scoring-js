
/*
* graphical rendering will occur 30x per second (at which point the entire UI will be re-drawn)
*/


class NoteSymbol {
	constructor(/*clef, keySig,*/ starttime, duration, note, velocityOn, velocityOff) {
		//this.width = getMinWidth(); // used for drawing graphics

		this.starttime = starttime; // as a midi pulse timestamp, used with 'duration' to create 'NoteOn' and 'NoteOff' MIDI events
		this.duration = duration; // in midi pulses

		this.note = note; // refers to a MIDI note value between 0-127
		this.velocityOn = velocityOn; // refers to MIDI velocity value between 0-127
		this.velocityOff = velocityOff; // refers to MIDI velocity value between 0-127
	}

	/* GETTERS and SETTERS */

	getStartTime() {
		return this.starttime;
	}

	getDuration() {
		return this.duration;
	}

	getNote() {
		return this.note;
	}

	getVelocityOn() {
		return this.velocityOn;
	}

	getVelocityOff() {
		return this.velocityOff;
	}

	/* CLASS LOGIC */




	/* GRAPHICS */

	getMinWidth() {
		return 2 * SheetMusic.NoteHeight + SheetMusic.NoteHeight/2;
	}

  draw(canvas, paint, ytop) {
    /* Align the rest symbol to the right */
    canvas.translate(getWidth() - getMinWidth(), 0);
    canvas.translate(SheetMusic.noteHeight/2, 0);

    //canvas.translate(0, )

    if (duration == "Whole") {
        drawWhole(canvas, paint, ytop);
    }
    else if (duration == "Half") {
        drawHalf(canvas, paint, ytop);
    }
    else if (duration == "Quarter") {
        drawQuarter(canvas, paint, ytop);
    }
    else if (duration == "Eighth") {
        drawEighth(canvas, paint, ytop);
    }
    canvas.translate(-SheetMusic.NoteHeight/2, 0);
    canvas.translate(-(getWidth() - getMinWidth()), 0);
  }

  drawWhole(canvas, paint, ytop) {
    var y = ytop + SheetMusic.NoteHeight;
    paint.setStyle(Paint.Style.FILL);
    canvas.drawRect(0, y, SheetMusic.NoteWidth, y + SheetMusic.NoteHeight/2, paint);
    paint.setStyle(Paint.Style.STROKE);
  }


  drawHalf(canvas, paint, ytop) {
    var y = ytop + SheetMusic.NoteHeight + SheetMusic.NoteHeight/2;
    paint.setStyle(Paint.Style.FILL);
    canvas.drawRect(0, y, SheetMusic.NoteWidth, y + SheetMusic.NoteHeight/2, paint);
    paint.setStyle(Paint.Style.STROKE);
  }

  drawQuarter(canvas, paint, ytop) {
    paint.setStrokeCap(Paint.Cap.BUTT);

    var y = ytop + SheetMusic.NoteHeight/2;
    var x = 2;
    var xend = x + 2*SheetMusic.NoteHeight/3;
    paint.setStrokeWidth(1);
    canvas.drawLine(x, y, xend-1, y + SheetMusic.NoteHeight-1, paint);

    paint.setStrokeWidth(SheetMusic.LineSpace/2);
    y  = ytop + SheetMusic.NoteHeight + 1;
    canvas.drawLine(xend-2, y, x, y + SheetMusic.NoteHeight, paint);

    paint.setStrokeWidth(1);
    y = ytop + SheetMusic.NoteHeight*2 - 1;
    canvas.drawLine(0, y, xend+2, y + SheetMusic.NoteHeight, paint);

    paint.setStrokeWidth(SheetMusic.LineSpace/2);
    if (SheetMusic.NoteHeight == 6) {
        canvas.drawLine(xend, y + 1 + 3*SheetMusic.NoteHeight/4,
                        x/2, y + 1 + 3*SheetMusic.NoteHeight/4, paint);
    }
    else {  /* NoteHeight == 8 */
        canvas.drawLine(xend, y + 3*SheetMusic.NoteHeight/4,
                        x/2, y + 3*SheetMusic.NoteHeight/4, paint);
    }

    paint.setStrokeWidth(1);
    canvas.drawLine(0, y + 2*SheetMusic.NoteHeight/3 + 1,
                    xend - 1, y + 3*SheetMusic.NoteHeight/2, paint);
  }

  drawEighth(stage, graphics, ytop) {
    var y = ytop + SheetMusic.noteHeight - 1;
    var rect = new RectF(0, y+1,
                           SheetMusic.LineSpace-1, y+1 + SheetMusic.LineSpace-1);
    paint.setStyle(Paint.Style.FILL);
    canvas.drawOval(rect, paint);
    paint.setStyle(Paint.Style.STROKE);
    paint.setStrokeWidth(1);
    canvas.drawLine((SheetMusic.LineSpace-2)/2, y + SheetMusic.LineSpace-1,
                    3*SheetMusic.LineSpace/2, y + SheetMusic.LineSpace/2, paint);
    canvas.drawLine(3*SheetMusic.LineSpace/2, y + SheetMusic.LineSpace/2,
                    3*SheetMusic.LineSpace/4, y + SheetMusic.NoteHeight*2, paint);
  }
}

module.exports = {
	NoteSymbol: NoteSymbol,
};
