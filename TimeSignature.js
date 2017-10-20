

class TimeSignature {
  constructor (numerator, denominator, quarternote) {
  	if (numerator <= 0 || denominator <= 0 || quarternote <= 0) {
      throw new MidiFileException("Invalid time signature", 0);
    }

  	this.numerator = numerator;
    this.denominator = denominator;
    this.quarternote = quarternote || 96; // pulses per quarternote, default is 96

  	//this.timeSignature = numerator/denominator;

    this.beat = denominator === 2 ? quarternote * 2 : quarternote / (denominator/4); // pulses per beat
    this.measure = numerator * beat; // pulses per measure
  }

  /*
  * Given a duration in pulses/ticks, return the closest note duration.
  * only use for sheet music
  */
  convertMIDIDurationToNote(duration) {
    var whole = this.quarternote * 4; //pulses for whole note

    if      (duration >= 56*whole/64)
        return "Whole";
    else if (duration >= 40*whole/64)
        return "DottedHalf";
    else if (duration >= 28*whole/64)
        return "Half";
    else if (duration >= 20*whole/64)
        return "DottedQuarter";
    else if (duration >=  14*whole/64)
        return "Quarter";
    else if (duration >=  10*whole/64)
        return "DottedEighth";
    else if (duration >=  6*whole/64)
        return "Eighth";
    else if (duration >=  5*whole/64)
        return "Triplet";
    else if (duration >=  3*whole/64)
        return "Sixteenth";
    else if (duration >= 2)
        return "ThirtySecond";
    else
    		return "SixtyFourth";
  }

  /** Convert a note duration into a stem duration.  Dotted durations
   * are converted into their non-dotted equivalents.
   */
  get stemDuration(noteValue) {
    if (noteValue == "DottedHalf")
        return "Half";
    else if (noteValue == "DottedQuarter")
        return "Quarter";
    else if (noteValue == "DottedEighth")
        return "Eighth";
    else
        return noteValue;
  }

  /** Return the MIDI time period (in pulses) the the given duration spans */
  convertNoteToMIDIDuration(noteValue) {
    var eighth = this.quarternote/2;
    var sixteenth = eighth/2;

    switch (dur) {
        case "Whole":         return this.quarternote * 4;
        case "DottedHalf":    return this.quarternote * 3;
        case "Half":          return this.quarternote * 2;
        case "DottedQuarter": return 3*eighth;
        case "Quarter":       return this.quarternote;
        case "DottedEighth":  return 3*sixteenth;
        case "Eighth":        return eighth;
        case "Triplet":       return this.quarternote/3;
        case "Sixteenth":     return sixteenth;
        case "ThirtySecond":  return sixteenth/2;
        default:                         return 0;
     }
  }


}
