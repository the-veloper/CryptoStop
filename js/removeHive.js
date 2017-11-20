if(window.CoinHive !== undefined) {
    window.CoinHive = null;
	var data = { type: "BLOCKED" };
	window.postMessage(data, "*");
}