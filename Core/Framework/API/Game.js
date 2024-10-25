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
Router.get("/Game",(Request,Response) => {
    const GameViewPath = Path.join(PagesFolder,"GameView.html")
    const GameData = GameDataJSON["Games"][Request.query.g]
    if (GameData) {
      FileSystem.readFile(GameViewPath,"utf8",(Error,Data) => {
        if (Error) {
          Response.status(500).send("Error reading GameView HTML file")
          return
        }
        let GameUI = "GameBar.remove()"
        if (GameData["GameUI"]) {
          GameUI = ""
        }
        const SortedTags = GameData["Tags"].sort((TagA,TagB) => TagA.localeCompare(TagB))
        let TagsList = ""
        for (const Tag of SortedTags) {
          TagsList += `
          <a href="#" class="tag">${Tag}</a>
          `
        }
        const UpdatedGameView = Data
          .replace("$GAMENAME$",`${GameData["Name"]}`)
          .replace("$CREATOR$",`${GameData["Creator"]}`)
          .replace("$DESC$",`${GameData["Description"]}`)
          .replace("$URL$",`/GameSource?g=${Request.query.g}`)
          .replace("GameBar.remove()",`${GameUI}`)
          .replace("<!-- $TAGS$ -->",TagsList)
        Response.send(UpdatedGameView)
      })
    } else {
      Response.status(404).sendFile(Path.join(PagesFolder,"404.html"))
    }
  })

module.exports = Router