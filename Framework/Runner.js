// Services \\
const Express = require("express");
const FileSystem = require("fs");
const Path = require("path");
const HTTPS = require("https");

const App = Express();
const Port = 443;

// Variables \\
const Root = Path.resolve(__dirname,"../..");
const CoreFolder = Path.join(Root,"Core");
const AssetsFolder = Path.join(CoreFolder,"Assets");
const GameDataJSON = require(Path.join(AssetsFolder,"Data/Games.json"));
const EmulationsFolder = Path.join(AssetsFolder,"Emulations");
const EmulatorGames = require(Path.join(EmulationsFolder,"Config/Games.json"));
const ROMsFolder = Path.join(EmulationsFolder,"ROMs");
const PagesFolder = Path.join(CoreFolder,"Pages");
const GamesFolder = Path.join(PagesFolder,"Games");

const options = {
  key: FileSystem.readFileSync(Path.join(AssetsFolder,"Important/Key.pem")),
  cert: FileSystem.readFileSync(Path.join(AssetsFolder,"Important/Cert.pem"))
};

// Functions \\
App.use(Express.static(CoreFolder));
App.use("/Assets",Express.static(AssetsFolder));
App.use("/Pages/Games",Express.static(GamesFolder));
App.use("/ROMs",Express.static(ROMsFolder));
App.get("/",(Request,Response) => {Response.sendFile(Path.join(PagesFolder,"Index.html"));});
App.get("/Games",(Request,Response) => {Response.sendFile(Path.join(PagesFolder,"Games.html"));});
App.get("/Game",(Request,Response) => {
  const GameViewPath = Path.join(PagesFolder,"GameView.html");
  const GameData = GameDataJSON["Games"][Request.query.g]
  if (GameData) {
    FileSystem.readFile(GameViewPath,"utf8",(Error,Data) => {
      if (Error) {
          Response.status(500).send("Error reading GameView HTML file");
          return;
      }
      let GameUI = "GameBar.remove();"
      if (GameData["GameUI"]) {
        GameUI = "";
      }
      const UpdatedGameView = Data
        .replace("$GAMENAME$",`${GameData["Name"]}`)
        .replace("$CREATOR$",`${GameData["Creator"]}`)
        .replace("$DATE$",`${GameData["Release"]}`)
        .replace("$GENRE$",`${GameData["Genre"]}`)
        .replace("$PLATFORM$",`${GameData["Platform"]}`)
        .replace("$DESC$",`${GameData["Description"]}`)
        .replace("$URL$",`https://lunar.zapto.org/GameSource?g=${Request.query.g}`)
        .replace("GameBar.remove();",`${GameUI}`)
      Response.send(UpdatedGameView);
  });
  } else {
    Response.status(404).sendFile(Path.join(PagesFolder,"404.html"));
  }
});
App.get("/GameSource",(Request,Response) => {
    const GamePath = Path.join(GamesFolder,Request.query.g,"Index.html");
    FileSystem.access(GamePath,FileSystem.constants.F_OK,(Error) => {
      if (Error) {
        const GameData = EmulatorGames["Games"][Request.query.g]
        if (GameData) {
          const GameCore = GameData["Core"]
          const GameFile = GameData["GameFile"]
          const FilePath = Path.join(GamesFolder,"Emulator","Index.html");
          FileSystem.readFile(FilePath,"utf8",(Error,Data) => {
            if (Error) {
                Response.status(500).send("Error reading HTML file");
                return;
            }
            let Cheats = []
            if (GameData["Cheats"]) {
              Cheats = GameData["Cheats"];
            }
            const UpdatedEmulator = Data
              .replace("$CORE$",`${GameCore}`)
              .replace("$URL$",`ROMs/${GameCore}/${GameFile}`)
              .replace("$CHEATS$",`${JSON.stringify(Cheats)}`);
            Response.send(UpdatedEmulator);
        });
        } else {
          Response.status(404).sendFile(Path.join(PagesFolder,"404.html"));
        }
      } 
      else {Response.sendFile(GamePath);}
    });
  });
App.use((Request,Response,Next) => {
    Response.status(404).sendFile(Path.join(PagesFolder,"404.html"));
  });
const Server = HTTPS.createServer(options,App)
Server.on("secureConnection",(TLSSocket) => {
  const cert = TLSSocket.getPeerCertificate();
  console.log("Certificate details:");
  console.log("Subject:",cert.subject);
  console.log("Issuer:",cert.issuer);
  console.log("Valid from:",cert.valid_from);
  console.log("Valid to:",cert.valid_to);
  console.log("Fingerprint:",cert.fingerprint);
});
Server.on("clientError",(Error,Socket) => {
  console.error("Client error:",Error);
  Socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  Socket.destroy();
});
Server.listen(Port,() => {
  console.log(`Server is running on https://localhost:${Port}`);
});