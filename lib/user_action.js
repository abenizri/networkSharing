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

// async addUser(data) {
//   return this.user.addUser(data)
// }
//
// async getUser(ip) {
//   return await this.user.get(ip)
// }

async getClicksPerDomain(data){
  // let find =  await this.user.find(data)
   let selectorPerUser = await this.user.aggregateSelectorClicksPerUserCount(data)
   let totalClicks = await this.user.aggregateSelectorClicksCount(data)
   let selerInfo = await this.user.getSelectorInfo(data)

   let array = []
   for (const elem of totalClicks ) {
     let users = selectorPerUser.find( x => x._id.selector === elem._id.selector)
     let info = selerInfo.find( x => x._id.selector === elem._id.selector)
     // console.log('hhhh: ' +a);
     let obj = {}
     obj['selector'] = elem._id.selector
     obj['users'] = users.count
     obj['usersClicks'] = elem.count
     obj['info'] = this._getElementObjectId(info)
     array.push(obj)
   }
   return  array;
}

_getElementObjectId(info){
  let raw = info._id.elementInfo
  if (raw.id) return raw.id
  if (raw.text) return raw.text
  if (raw.class) return raw.class
  if (raw.src) return raw.src

  return  raw.tagName
}

_toTableJsonFormat(rawData){
  // aggregate()
}

async incrementClicks(data) {
  let find =  await this.user.find(data)
  if (find !== null && find.length) {
    return await this.user.inc(data)
  }
  data.count = 1
  return await this.user.insert(data)

}

}
module.exports = UserAction
