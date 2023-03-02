const abcjs = window.ABCJS

const main = document.querySelector("main")
const abc = document.querySelector("abc").innerHTML
const sheet = abcjs.renderAbc(main, abc, { responsive: "resize" })
let synth = new abcjs.synth.CreateSynth()

const button = document.querySelector("button")
button.addEventListener("click", async () => {
	const audioCtx = new AudioContext()

	if (button.innerText == "\uea1c") {
		await audioCtx.resume()
		await synth.init({
			visualObj: sheet[0],
			audioContext: audioCtx,
			millisecondsPerMeasure: sheet[0].millisecondsPerMeasure()
		})
		await synth.prime()
		await synth.start()

		button.innerText = "\uea1e"

	} else {
		await audioCtx.close()
		synth.stop()

		button.innerText = "\uea1c"
	}
})