// Services \\
const Express = require("express")
const FileSystem = require("fs")
const Router = Express.Router()
const Path = require("path")

// Variables \\
const Root = Path.resolve(__dirname,"../..")
const PagesFolder = Path.join(Root,"Pages")

// Functions \\
async function GetUserData(CookieData) {
    try {
        const Response = await fetch(`http://localhost:${global.ServerPort}/Api/User/Current`, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "Cookie": CookieData
            },
            credentials: "include"
        })
        if (!Response.ok) {return null}
        const UserData = await Response.json()
        return UserData
    } catch (Error) {
        console.error("Error: ",Error)
        return null
    }
}

Router.use(async (Request,Response,Next) => {
    const UserData = await GetUserData(Request.headers.cookie)
    if (!UserData || !UserData.Role) {
      Response.sendFile(Path.join(PagesFolder,"Login.html"))
    } else {
      Next()
    }
  })

// Connection \\
module.exports = Router