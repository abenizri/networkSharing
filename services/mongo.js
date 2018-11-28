module.exports = class {
  async createClient(connectionString) {
    const { MongoClient } = require('mongodb')
    const options = { promiseLibrary: require('bluebird'), useNewUrlParser: true }
    return MongoClient.connect(connectionString, options)
      .catch((err) => {
        log.err(err.message, err);
        // throw new MongoConnectionError(err.message, err)

      })
  }

  async connectToDB(connectionString) {
    const client = await this.createClient(connectionString)
    log.info('connecting to mongodb')
    // connect to default db (specified in connection string)
    // https://github.com/mongodb/node-mongodb-native/blob/3.0.0/HISTORY.md#features-1
    return client.db(null)
  }
}
