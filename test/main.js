const { BrowserWindow, app } = require("electron")
const { format } = require("url")
const { join } = require("path")
const { schema, rootValue } = require("./schema")
const { createGraphQLExecutor } = require("electron-graphql")

const isTest = process.env.NODE_ENV === "test"

let mainWindow = null

let gqlExecutor = createGraphQLExecutor({
  schema: schema,
  rootValue: rootValue,
  channel: "apollo-link-electron-test",
})

gqlExecutor.init()

app.on("ready", () => {
  mainWindow = new BrowserWindow()

  if (!isTest) {
    require("devtron").install()
    mainWindow.webContents.openDevTools()
    mainWindow.maximize()
  }

  mainWindow.loadURL(
    format({
      pathname: join(__dirname, "main.html"),
      protocol: "file:",
      slashes: true,
    })
  )
})
