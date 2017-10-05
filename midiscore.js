



	function TimeSignature(tempo, keySig, timeNumerator, timeDenominator) {
		this.tempo = tempo; //in pulses per second

		this.timeSig = timeNumerator/timeDenominator;

		this.numerator = timeNumerator;
        this.denominator = timeDenominator;
        this.quarternote = quarternote;

        var beat;
        if (denominator == 2)
            beat = quarternote * 2;
        else
            beat = quarternote / (denominator/4);

        this.measure = timeNumerator * beat;

	}

	function Note(starttime, channel, notenumber, duration) {
		this.starttime = starttime;
		this.channel = channel;
		this.notenumber = notenumber;
		this.duration = duration;

		this.endtime = starttime + duration;

		this.turnNoteOn = function(starttime) {
			MIDI.NoteOn(starttime);
			//or maybe add_to midiEvents array??
		}

		this.turnNoteOff = function(endtime) {
			MIDI.NoteOff(endtime);
		}



	}





	var midiEvents = [];
