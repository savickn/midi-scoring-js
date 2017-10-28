

class KeySignature {
	constructor(sharpsFlats, majorMinor) {
		this.numberOfSharpsFlats = sharpsFlats;
		this.majorMinor = majorMinor;
	}
}

module.exports = {
	KeySignature: KeySignature,
};
