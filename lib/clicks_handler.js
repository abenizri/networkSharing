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
     obj['category'] = elem.category
     obj['users'] = users.count
     obj['usersClicks'] = total.count
     obj['elementId'] = elem.elementId
     obj['featureName'] = elem.featureName
     obj['usage'] =  elem.usage
     obj['enableCampaign'] =  elem.enableCampaign
     obj['recipients'] = elem.recipients
     obj['status'] = elem.status
     obj['durationStart'] = elem.durationStart
     obj['durationEnd'] = elem.durationStart

     array.push(obj)
   }
   return  array;
}

getElementObjectId(info){
  if (info.id) return info.id
  if (info.text) return info.text
  if (info.class) return info.class
  if (info.src) return info.src

  return  info.tagName
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
