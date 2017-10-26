
class ClefSymbol {
	constructor (clef, starttime) {
		this.starttime = starttime;
		this.clef = clef;
		this.width = getMinWidth();
	}

	get minWidth() {
		return SheetMusic.noteWidth * 2;
	}

	draw(stage, graphics, ytop, xstart) {
		var y = ytop;

		if (this.clef === "Treble") {
			var trebletex = PIXI.Texture.fromImage('treble.png');
			var trebleClef = new PIXI.Sprite(trebletex);
			trebleClef.position.x = xmargin;
			trebleClef.position.y = ymargin;

			trebleClef.height = SheetMusic.staffHeight;
			trebleClef.width = this.width;

			stage.addChild(trebleClef)

		} else {
			var basstex = PIXI.Texture.fromImage('bass.png');
			var bassClef = new PIXI.Sprite(basstex);

			bassClef.position.x = xmargin;
			bassClef.position.y = ytop;

			bassClef.height = SheetMusic.staffHeight;
			bassClef.width = this.width;

			stage.addChild(bassClef)
		}
	}
}

module.exports = {
	ClefSymbol: ClefSymbol,
}
