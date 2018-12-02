const MONGO_URL = config.database
const mongodb = require('./../services/mongo')
const mongo = new mongodb()
const ClicksRepo = require('../services/repository/clicks_repo')

class ClicksHendler{

async initialize() {
  const mongoClient = await mongo.connectToDB(MONGO_URL)
  this.clicksRepo = new ClicksRepo(mongoClient)
  await this.clicksRepo.initialize()
}

async getClicksPerDomain(data, configData){
   // let allElenentsPerDomain =  await this.clicksRepo.find(data)
   let selectorPerUser = await this.clicksRepo.aggregateSelectorClicksPerUserCount(data)
   let totalClicks = await this.clicksRepo.aggregateSelectorClicksCount(data)
   let selerInfo = await this.clicksRepo.getSelectorInfo(data)

   let array = []
   for (const elem of configData ) {
     // let all = allElenentsPerDomain.find( x => x.selector === elem._id.selector)
     let users = selectorPerUser.find( x => x._id.selector === elem.selector)
     let total = totalClicks.find( x => x._id.selector === elem.selector)
     let info = selerInfo.find( x => x._id.selector === elem.selector)

     let obj = {}
     obj['selector'] = elem.selector
     obj['users'] = users.count
     obj['usersClicks'] = total.count
     obj['info'] = this._getElementObjectId(info)
     obj['usage'] =  elem.usage
     obj['feedback'] =  elem.feedback
     obj['sendFeedbackTo'] = elem.sendFeedbackTo
     obj['status'] = elem.status
     obj['duration'] = elem.duration

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

async findSelector(data){
  return await this.clicksRepo.find(data)
}

async incrementClicks(data) {
  let newData = Object.assign({},data)
  delete newData['elementInfo']
  let find =  await this.clicksRepo.find(newData)
  if (find !== null && find.length) {
    return await this.clicksRepo.inc(data)
  }
  data.count = 1
  return await this.clicksRepo.insert(data)

}

}
module.exports = ClicksHendler
