
//PIXI.JS config
var renderer = PIXI.autoDetectRenderer(800, 600,{backgroundColor : 0x1099bb, 
	antialiasing: false, transparent: false, resolution: 1});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();

//initiated at startup
var pianoA1 = new Instrument('treble', 'pianofont.midi');
var pianoA2 = new Instrument('bass', 'pianofont.midi');
var violin = new Instrument('treble', 'violinfont.midi');

var instrumentMap = new Map();

//press Add instrument button
instrumentMap.set("pianoA1", pianoA1);
instrumentMap.set("pianoA1", pianoA2);
instrumentMap.set("pianoA1", violin);

//via select keysignature section which should return 'C', 'Dm', etc
var keySig = "C"; //userinput
var keySignature = new KeySignature(keySig);

//via select tempo section
var tempo = 100; //userinput

//via select timesignature section
var timeNum = 4; //userinput
var timeDenom = 4; //userinput
var timeSignature = new TimeSignature(tempo, timeNum, timeDenom, 96);

//via select title and composer section
var scoreTitle = "Piano Sonata in C"; //userinput
var composer = "Nick"; //userinput

//via select number of measures
var numberOfMeasures = 10; //userinput

//initiate options
var scoreOptions = new ScoreOptions();

//maps unique names (e.g. PianoA1-measures) to measure collections
var measureMap = {};
var staffMap = {};

//create measure collection for each instrument
instrumentArray.forEach(function(instrument) {
	var ytop = 
	var measureArray = [];
	for(var i = 1; i <= numberOfMeasures; i++) {
		measureArray.push(new Measure(i, timeSignature, keySignature, 
			instrument.clef, instrument.sound));
	}

	measureMap.set("#{instrument}-measures", measureArray);

	staffMap.set("#{instrument}-staff", new Staff(measureArray));
})



//create SheetMusic object
var score = new SheetMusic(scoreTitle, composer, staffMap, scoreOptions);

score.renderSheetMusic(stage, graphics);






