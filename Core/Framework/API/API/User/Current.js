// Services \\
const Express = require("express")
const JSONWebToken = require("jsonwebtoken")
const Router = Express.Router()

// Functions \\
Router.get("/Api/User/Current", async(Request, Response) => {
    try {
      const Database = global.Database
      if (!Database) {return Response.status(401).json({Message:"Database Error"})}
      const Token = Request.cookies.LunarWebToken
      if (!Token) {return Response.status(401).json({Message:"No Token Found"})}
      const WebToken = JSONWebToken.verify(Token,process.env.JSONWebTokenKey)
      const UserID = WebToken.UserID
      const User = await Database.collection("Users").findOne({"UserID":UserID})
      if (!User) {return Response.status(401).send("Invalid User")}
      return Response.status(200).json({
        "UserID": User.UserID,
        "Username": User.Username,
        "DisplayName": User.DisplayName,
        "JoinedDate": User.JoinedDate,
        "Role": User.Role
      })
    } catch (Error) {
      return Response.status(500).json({Message:"Internal Server Error"})
    }
  })

// Connection \\
module.exports = Router