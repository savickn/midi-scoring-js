

class ScoreOptions {
	constructor() {
		this.ymargin = 30; //margin above score
		this.xmargin = 50; //margin to the left of score

		this.lineWidth = 1;
		this.lineSpace = 20;

		this.staffHeight = 4 * this.lineSpace + 5 * this.lineWidth; //height of main staff
		this.staffMargin = 7 * this.lineSpace + 7 * this.lineWidth; //space between staffs

		this.noteWidth = 3 * this.lineSpace/2
		this.noteHeight = this.lineSpace + this.lineWidth;
	}	
}

/*
var ymargin = 30; //margin above score
		var xmargin = 50; //margin to the left of score

		var lineWidth = 1;
		var lineSpace = 20;

		var staffHeight = 4 * lineSpace + 5 * lineWidth; //height of main staff
		var staffMargin = 7 * lineSpace + 7 * lineWidth; //space between staffs

		var noteWidth = 3 * lineSpace/2
		var noteHeight = lineSpace + lineWidth;

*/