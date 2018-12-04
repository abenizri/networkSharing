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

async getClicksPerDomain(data, configData, selectorAndCategoryPerDomain){
   // let allElenentsPerDomain =  await this.clicksRepo.find(data)
   let selectorPerUser = await this.clicksRepo.aggregateSelectorClicksPerUserCount(data)
   let totalClicks = await this.clicksRepo.aggregateSelectorClicksCount(data)
   let selerInfo = await this.clicksRepo.getSelectorInfo(data)

   let array = []
   for (const elem of selectorAndCategoryPerDomain ) {
     // let all = allElenentsPerDomain.find( x => x.selector === elem._id.selector)
     let users = selectorPerUser.find( x => x._id.selector === elem._id.selector && x._id.category === elem._id.category)
     let total = totalClicks.find( x => x._id.selector === elem._id.selector && x._id.category === elem._id.category)
     let info = selerInfo.find( x => x._id.selector === elem._id.selector && x._id.category === elem._id.category)
     let confData = configData.find( x =>  x.selector === elem._id.selector && x.category === elem._id.category )

     if (users && total && info) {
     let obj = {}
       obj['selector'] = elem._id.selector
       obj['category'] = elem._id.category
       obj['users'] = users.count
       obj['usersClicks'] = total.count
       obj['elementId'] = confData.elementId
       obj['featureName'] = confData.featureName
       obj['usage'] =  confData.usage
       obj['enableCampaign'] =  confData.enableCampaign
       obj['recipients'] = confData.recipients
       obj['feedbackForm'] = confData.feedbackForm
       obj['status'] = confData.status
       obj['durationStart'] = confData.durationStart
       obj['durationEnd'] = confData.durationStart

       array.push(obj)
     }
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
