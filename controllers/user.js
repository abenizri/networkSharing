const mongodb = require('./../services/mongo')
const MONGO_URL = 'mongodb://localhost:27017/networkSharing'
const mongo = new mongodb()
const User = require('../services/repository/user_repo')

exports.show = async (ctx) => {
    let ip = ctx.params.ip
    // add validation
    let mongoClient = await mongo.connectToDB(MONGO_URL)
    let user = new User(mongoClient)
    await user.initialize()

    // await user.truncateTable()
    await user.addUser({ ip, status: 'active' })
    console.log(await user.get("109.186.238.61"));

    ctx.body = 'done'
};
