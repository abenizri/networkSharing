const MONGO_URL = config.database
const mongodb = require('./../services/mongo')
const mongo = new mongodb()
const FeedbacksRepo = require('../services/repository/feedbacks_repo')

class FeedbacksHendler{

  async initialize() {
    const mongoClient = await mongo.connectToDB(MONGO_URL)
    this.feedbacksRepo = new FeedbacksRepo(mongoClient)
    await this.feedbacksRepo.initialize()
  }

  async saveTable(data){
    return await this.feedbacksRepo.updateBulk(data)
  }

  async getDailyFeedbackSelector(data) {
    return await this.feedbacksRepo.getFeedbackElement(data)
  }

  async getAggSelectorAndPagePerDomain(data){
    return await this.feedbacksRepo.aggregateSelectorAndPagePerDomain(data)
  }

  async findSelector(data){
    return await this.feedbacksRepo.find(data)
  }

  async insert(data) {
    return await this.feedbacksRepo.insert(data)
  }

}
module.exports = FeedbacksHendler
