// Services \\
const Express = require("express")
const FileSystem = require("fs")
const Router = Express.Router()
const Path = require("path")

// Variables \\
const Root = Path.resolve(__dirname,"../..")
const AssetsFolder = Path.join(Root,"Assets")
const GameDataJSON = require(Path.join(AssetsFolder,"Data/Games.json"))
const PagesFolder = Path.join(Root,"Pages")

// Function \\
Router.get("/Games",(Request,Response) => {
    const GamesFile = Path.join(PagesFolder,"Games.html")
    const GameData = GameDataJSON["Games"]
    FileSystem.readFile(GamesFile,"utf8",(Error,Data) => {
      if (Error) {
        Response.status(500).send("Error reading GameView HTML file")
        return
      }
      const SortedGames = Object.entries(GameData).sort((GameA,GameB) => 
        GameA[1].Name.localeCompare(GameB[1].Name)
      )
      let GameCardsList = ""
      for (const [GameKey,Game] of SortedGames) {
        let GameThumbnail = "/Assets/Data/Thumbnails/Missing.png"
        if (Game["Thumbnail"]) {
          GameThumbnail = `/Assets/Data/Thumbnails/${Game["Thumbnail"]}`
        }
        GameCardsList += `
          <div class="GameCard">
            <a href="/Game?g=${GameKey}" class="GameLink">
              <img src="${GameThumbnail}" alt="Thumbnail" class="GameThumbnail">
              <h3 class="GameTitle">${Game.Name}</h3>
            </a>
          </div>
        `
      }
      const UpdatedGameView = Data.replace("<!-- $GAMECARDS$ -->",GameCardsList)
      Response.send(UpdatedGameView)
    })
  })

module.exports = Router