const abcjs = window.ABCJS
const main = document.querySelector("main")
const button = document.querySelector("button")
const abc = document.querySelector("abc").innerHTML
const sheet = abcjs.renderAbc(main, abc, { responsive: "resize" })
const synth = new abcjs.synth.CreateSynth()

button.addEventListener("click", async () => {
	const audioCtx = new AudioContext()

	if (button.innerText == "\uea1c") {
		await audioCtx.resume()
		await synth.init({
			visualObj: sheet[0],
			audioContext: audioCtx,
			millisecondsPerMeasure: sheet[0].millisecondsPerMeasure(),
			options: {
				onEnded: async () => {
					await audioCtx.close()
					button.innerText = "\uea1c"
				}
			}
		})
		await synth.prime()
		await synth.start()
		button.innerText = "\uea1e"

	} else {
		await synth.stop()
	}
})