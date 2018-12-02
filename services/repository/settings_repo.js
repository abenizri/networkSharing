const _ = require('lodash')
const COLLECTION_NAME = 'settings'

module.exports = class Users {
  constructor(mongo) {
    this.mongodb = mongo
  }

  async initialize() {
    await this.mongodb.createCollection(COLLECTION_NAME)
    this.collection = await this.mongodb.collection(COLLECTION_NAME)
    // await this.collection.ensureIndex({ domainId: 1 }, { unique: true })
    // await this.collection.ensureIndex({ userId: 1 }, { unique: true })
    // await this.collection.ensureIndex({ selector: 1 }, { unique: true })
    await this.collection.ensureIndex({ domain: 1, selector: 1 } )
  }

  async truncateTable() {
    return this.collection.remove({})
  }

  async aggregateSelectorClicksPerUserCount(data){
    return await this.collection.aggregate(
      [
        { $match: { domain: data.domain } },
        {"$group" : {_id:{selector:"$selector", userId: "$userId"}, count:{$sum: 1}}},
        { $sort: { count : -1 } }
    ]).toArray()
  }

  async aggregateSelectorClicksCount(data){
    return await this.collection.aggregate(
      [
        { $match: { domain: 'localhost' } },
        {"$group" : {_id:{selector:"$selector"}, count:{$sum: "$count"}}},
        { $sort: { count : -1 } }
    ]).toArray()
  }

  async getSelectorInfo(data){
    return await this.collection.aggregate(
      [
        { $match: { domain: 'localhost' } },
        {"$group" : {_id:{selector:"$selector",  elementInfo: "$elementInfo"}, count:{$sum: 1}}},
        { $sort: { count : -1 } }
    ]).toArray()
  }

  async insert(userInfo) {
    return this.collection.insertOne(userInfo)
  }

  async get(selector) {
    return this.collection.findOne({selector}, { projection: {_id: 0} })
  }

  async find(query, limit = Number.MAX_SAFE_INTEGER) {
    return this.collection.find(query).limit(limit).toArray()
  }

  async addUser(data) {
    // let user = await this.get(data.ip)
    // if (user !== null) {
    //   return await this.update(user)
    // }
    return await this.insert(data)
  }
  /**
  { selector:
        'html>body>div:nth-child(3)>div:nth-child(6)>div:nth-child(2)>main>div>div>div:nth-child(2)>div>div>div>div',
       tagName: 'Total Visits',
       usage: 'high',
       feedback: 'no',
       sendFeedbackTo: 'all',
       duration: 'month',
       domain: 'localhost',
       state: 'active' }
  */

  async updateBulk(query) {
    if (!query || query.length === 0) return
    let bulkOperations = _.map(query, match => {
      return {
        updateOne: {
          filter: { domain: match.domain, selector: match.selector, skuId: match.skuId },
          update: { $set: match },
          upsert: true
        }
      }
    })
    return this.collection.bulkWrite(bulkOperations)
  }

  async inc(data) {
    // let clone = Object.assign({}, data)
    return await this.collection.updateOne(
        data ,
       // { $set: clone },
       { $inc: { count: 1 } },
       { upsert: true }
    )


    // await this.collection.findOneAndUpdate({
    //     query: { domainId: data.domainId, userId: data.userId, selector: data.selector },
    //     sort: { domainId: 1 },
    //     update: { $inc: { count: 1 } },
    //     upsert: true,
    //     new: true
    // })
    // let result
    // let clone = Object.assign({}, data)
    // result = await this.collection.update(
    //   {ip: data.selector },
    //   { $set: clone },
    //   // { id: 1 },
    //   { $inc: { value: 1 } },
    //   {upsert: true, new: true})
    //   console.log(result);
    // return result.value.value.toString()
  }

  // async update(user) {
  //   let clone = Object.assign({}, user)
  //   clone.status = (user.status === 'active') ? 'inactive' : 'active'
  //    return this.collection.update({ip: user.ip}, {
  //      $set: clone
  //    }, { upsert: true })
  //
  //   }
}