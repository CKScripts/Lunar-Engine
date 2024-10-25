// Services \\
const Express = require("express")
const Router = Express.Router()

// Functions \\
Router.post("/Api/Auth/Logout",async(Request,Response) => {
    try {
      Response.cookie("LunarWebToken","",{
        httpOnly: true,
        secure: process.env.NodeENV === "production",
        expires: new Date(0),
        path: "/"
      })
      return Response.status(200).json({Message:"Successful Logout"})
    } catch (Error) {
      return Response.status(500).json({Message:"Internal Server Error"})
    }
  })

// Connection \\
module.exports = Router