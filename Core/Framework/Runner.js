// Script Values \\
require("dotenv").config()

// Services \\
const CookieParser = require("cookie-parser")
const Express = require("express")
const HTTP = require("http")
const Path = require("path")

// Variables \\
const App = Express()
const Server = HTTP.createServer(App)
const Port = 80

const Root = Path.resolve(__dirname,"../..")
const CoreFolder = Path.join(Root,"Core")
const Authentication = require("./API/Authentication")
const AssetsFolder = Path.join(CoreFolder,"Assets")
const EmulationsFolder = Path.join(AssetsFolder,"Emulations")
const ROMsFolder = Path.join(EmulationsFolder,"ROMs")
const PagesFolder = Path.join(CoreFolder,"Pages")
const GamesFolder = Path.join(PagesFolder,"Games")

// Assets \\
App.use(Express.static(CoreFolder))
App.use("/Assets",Express.static(AssetsFolder))
App.use("/Pages/Games",Express.static(GamesFolder))
App.use("/ROMs",Express.static(ROMsFolder))

// Middleware \\
App.use(CookieParser())
App.use(Express.json())
App.use(Express.urlencoded({extended: true}))

// API Modules \\
App.post("/Api/Auth/Login",require("./API/Database"))
App.post("/Api/Auth/Logout",require("./API/Database"))
App.get("/Api/User/Current",require("./API/Database"))

// Directories \\
App.get("/",(Request,Response) => {Response.sendFile(Path.join(PagesFolder,"Index.html"))})
App.get("/Login",(Request,Response) => {Response.sendFile(Path.join(PagesFolder,"Login.html"))})
App.get("/SignUp",(Request,Response) => {Response.sendFile(Path.join(PagesFolder,"SignUp.html"))})

// Modulated Directories \\
App.get("/Games",Authentication,require("./API/Games"))
App.get("/Game",Authentication,require("./API/Game"))
App.get("/GameSource",Authentication,require("./API/GameSource"))

// Server \\
App.use((Request,Response,Next) => {Response.status(404).sendFile(Path.join(PagesFolder,"404.html"))})
Server.on("clientError",(Error,Socket) => {
  console.error("Client error:",Error)
  Socket.end("HTTP/1.1 400 Bad Request\r\n\r\n")
  Socket.destroy()
})
Server.listen(Port,async () => {
  console.log(`Server is running on http://localhost:${Port}`)
  global.ServerPort = Port
  await import("./API/Database.js")
})