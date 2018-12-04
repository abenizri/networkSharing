const MONGO_URL = config.database
const mongodb = require('./../services/mongo')
const mongo = new mongodb()
const SettingsRepo = require('../services/repository/settings_repo')

class SettingsHendler{

async initialize() {
  const mongoClient = await mongo.connectToDB(MONGO_URL)
  this.settingsRepo = new SettingsRepo(mongoClient)
  await this.settingsRepo.initialize()
}

async saveTable(data){
  return await this.settingsRepo.updateBulk(data)
}


async getAggSelectorAndCategoryPerDomain(data){
  return await this.settingsRepo.aggregateSelectorAndCategoryPerDomain(data)
}

async findSelector(data){
  return await this.settingsRepo.find(data)
}

async insert(data) {
  return await this.settingsRepo.insert(data)
}

}
module.exports = SettingsHendler
