// Services \\
const Express = require("express")
const JSONWebToken = require("jsonwebtoken")
const Router = Express.Router()

// Functions \\
Router.post("/Api/Auth/Login",async(Request,Response) => {
    try {
      const Database = global.Database
      if (!Database) {return Response.status(401).json({Message:"Database Error"})}
      if (!Request.body.Username || !Request.body.Password) {
        return Response.status(400).send({Message:"Missing Required Credentials"})
      }
      const {Username,Password} = Request.body
      const User = await Database.collection("Users").findOne({"Username": Username})
      if (!User) {return Response.status(401).send("Invalid")}
      const ValidPassword = (Password === User.Password)
      if (ValidPassword) {
        const UserToken = JSONWebToken.sign(
          {UserID: User.UserID},
          process.env.JSONWebTokenKey,
          {expiresIn: "24h"}
        )
        Response.cookie("LunarWebToken",UserToken,{
          httpOnly: true,
          secure: process.env.NodeENV === "production",
          maxAge: 24*60*60*1000
        })
        return Response.status(200).json({Message:"Successful Login"})
      } else {
        return Response.status(401).json({Message:"Invalid Username or Password"})
      }
    } catch (Error) {
      return Response.status(500).json({Message:"Internal Server Error"})
    }
  })

// Connection \\
module.exports = Router