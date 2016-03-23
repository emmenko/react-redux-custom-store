import { jsdom } from 'jsdom'

global.document = jsdom('')
global.window = document.defaultView

for (const property in global.window) {
  if (!(property in global)) {
    global[property] = global.window[property]
  }
}

global.navigator = { userAgent: 'Node.js' }
