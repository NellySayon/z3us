import browser from 'webextension-polyfill'

// import init from 'pte-manifest-compiler'
import { PORT_NAME, TARGET_BACKGROUND, TARGET_INPAGE } from '@src/services/messanger'

// @ts-ignore
import inpage from './inpage?script&module'

const connectNewPort = () => {
	const port = browser.runtime.connect({ name: PORT_NAME })
	port.onMessage.addListener(message => {
		if (message.target !== TARGET_INPAGE) {
			return
		}

		window.postMessage({ ...message, source: TARGET_BACKGROUND })
	})

	const listener = event => {
		if (event.source !== window) {
			return
		}
		const message = event.data
		if (message.target !== TARGET_BACKGROUND) {
			return
		}

		port.postMessage({ ...message, source: TARGET_INPAGE })
	}

	port.onDisconnect.addListener(() => {
		if (port.error) {
			// eslint-disable-next-line no-console
			console.error(`Disconnected due to an error: ${port.error.message}`)
		}
		window.removeEventListener('message', listener, false)
		connectNewPort()
	})

	window.addEventListener('message', listener, false)
}

// returns true in any case to prevent reinjecting of the script
browser.runtime.onMessage.addListener(() => Promise.resolve(true))

connectNewPort()

const script = document.createElement('script')
script.type = 'module'
script.src = browser.runtime.getURL(inpage)

const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
head.appendChild(script)

// const wasmPath = browser.runtime.getURL('pte_manifest_compiler_bg.wasm')
// // eslint-disable-next-line no-console
// init(wasmPath).catch(console.error)
