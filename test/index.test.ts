import { Application } from "spectron"
import { resolve } from "path"

const appPath = __dirname
const electronPath = resolve(__dirname, "../node_modules/.bin/electron")

// shared spection instance
let app

beforeEach(async () => {
  app = new Application({
    path: electronPath,
    args: [appPath],
  })

  await app.start()
})

afterEach(async () => {
  if (app && app.isRunning()) {
    await app.stop()
  }
})

test("spectron should work.", () => {
  return app.client.getTitle().then(title => expect(title).toBe("apollo-link-electron-test"))
})
