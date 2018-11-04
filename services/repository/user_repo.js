const COLLECTION_NAME = 'users'

module.exports = class Users {
  constructor(mongo) {
    this.mongodb = mongo
  }

  async initialize() {
    await this.mongodb.createCollection(COLLECTION_NAME)
    this.collection = await this.mongodb.collection(COLLECTION_NAME)
    await this.collection.ensureIndex({ ip: 1 }, { unique: true })
    await this.collection.ensureIndex({ status: 1 })
  }

  async truncateTable() {
    return this.collection.remove({})
  }

  async insert(userInfo) {
    return this.collection.insertOne(userInfo)
  }

  async get(ip) {
    return this.collection.findOne({ip}, { projection: {_id: 0} })
  }

  async find(query, limit = Number.MAX_SAFE_INTEGER) {
    return this.collection.find(query).limit(limit).toArray()
  }

  async addUser(data) {
    let user = await this.get(data.ip)
    if (user !== null) {
      return await this.update(user)
    }
    return await this.insert(data)
  }

  async update(user) {
    let clone = Object.assign({}, user)
    clone.status = (user.status === 'active') ? 'inactive' : 'active'
     return this.collection.update({ip: user.ip}, {
       $set: clone
     }, { upsert: true })

    }
}
