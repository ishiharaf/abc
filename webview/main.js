const abcjs = window.ABCJS
const vscode = acquireVsCodeApi()
const main = document.querySelector("main")
const button = document.querySelector("button")
const abc = document.querySelector("abc").innerHTML
const synth = new abcjs.synth.CreateSynth()
const sheet = abcjs.renderAbc(main, abc, { responsive: "resize" })

const playMusic = async (ctx) => {
	await synth.init({
		visualObj: sheet[0],
		audioContext: ctx,
		millisecondsPerMeasure: sheet[0].millisecondsPerMeasure(),
		options: {
			onEnded: stopMusic
		}
	})
	await synth.prime()
	await synth.start()
	button.innerText = "\uea1e"
}

const stopMusic = async () => {
	await synth.stop()
	button.innerText = "\uea1c"
}

button.addEventListener("click", async () => {
	const audioCtx = new AudioContext()
	if (button.innerText == "\uea1c") {
		await audioCtx.resume()
		playMusic(audioCtx)
	} else {
		await audioCtx.close()
		stopMusic()
	}
})