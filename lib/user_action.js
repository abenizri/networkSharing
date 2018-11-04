const MONGO_URL = config.database
const mongodb = require('./../services/mongo')
const mongo = new mongodb()
const User = require('../services/repository/user_repo')

class UserAction{

async initialize() {
  const mongoClient = await mongo.connectToDB(MONGO_URL)
  this.user = new User(mongoClient)
  await this.user.initialize()
}

async addUser(data) {
  return this.user.addUser(data)
}

async getUser(ip) {
  return await this.user.get(ip)
}

}
module.exports = UserAction
