// Services \\
const Express = require("express")
const FileSystem = require("fs")
const Router = Express.Router()
const Path = require("path")

// Variables \\
const Root = Path.resolve(__dirname,"../..")
const AssetsFolder = Path.join(Root,"Assets")
const EmulationsFolder = Path.join(AssetsFolder,"Emulations")
const EmulatorGames = require(Path.join(EmulationsFolder,"Config/Games.json"))
const GameDataJSON = require(Path.join(AssetsFolder,"Data/Games.json"))
const PagesFolder = Path.join(Root,"Pages")
const GamesFolder = Path.join(PagesFolder,"Games")

// Function \\
Router.get("/GameSource",(Request,Response) => {
    const GamePath = Path.join(GamesFolder,Request.query.g,"Index.html")
    const DisplayGameData = GameDataJSON["Games"][Request.query.g]
    FileSystem.access(GamePath,FileSystem.constants.F_OK,(Error) => {
      if (Error) {
        const GameData = EmulatorGames["Games"][Request.query.g]
        if (GameData) {
          const GameCore = GameData["Core"]
          const GameFile = GameData["GameFile"]
          let FolderName = GameData["Core"]
          if (GameData["Folder"]) {
            FolderName = GameData["Folder"]
          }
          const FilePath = Path.join(GamesFolder,"Emulator","Index.html")
          FileSystem.readFile(FilePath,"utf8",(Error,Data) => {
            if (Error) {
                Response.status(500).send("Error reading HTML file")
                return
            }
            let GameName = "UnknownGameSave"
            let ColorTheme = "#1a237e"
            let Cheats = []
            if (DisplayGameData) {if (DisplayGameData["Name"]) {GameName = DisplayGameData["Name"]}}
            if (GameData["ColorTheme"]) {ColorTheme = GameData["ColorTheme"]}
            if (GameData["Cheats"]) {Cheats = GameData["Cheats"]}
            const UpdatedEmulator = Data
              .replace("$CORE$",`${GameCore}`)
              .replace("$URL$",`ROMs/${FolderName}/${GameFile}`)
              .replace("$COLOR$",`${ColorTheme}`)
              .replace("$NAME$",`${GameName}`)
              .replace("$CHEATS$",`${JSON.stringify(Cheats)}`)
            Response.send(UpdatedEmulator)
        })
        } else {
          Response.status(404).sendFile(Path.join(PagesFolder,"404.html"))
        }
      } 
      else {Response.sendFile(GamePath)}
    })
  })

module.exports = Router