// Script Values \\
require("dotenv").config()

// Services \\
const Express = require("express")
const JSONWebToken = require("jsonwebtoken")
const {MongoClient,ServerApiVersion} = require("mongodb")
const Router = Express.Router()

// Variables \\
let Database
const DBClient = new MongoClient(process.env.MongoDBURI,{
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

// Functions \\
async function Connect() {
  try {
    await DBClient.connect()
    await DBClient.db("Database").command({ping: 1})
    Database = DBClient.db("Database")
    global.Database = Database
    console.log("Database Connected")
  } catch (Error) {
    console.error("Database Error: ",Error)
    throw Error
  }
}

// Routes \\
Router.post("/Api/Auth/Login",require("./API/Auth/Login"))
Router.post("/Api/Auth/Logout",require("./API/Auth/Logout"))
Router.get("/Api/User/Current",require("./API/User/Current"))

// Connection \\
module.exports = Router

Connect().catch(console.dir)