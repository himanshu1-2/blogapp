const mongoose = require('mongoose')
const exec = mongoose.Query.prototype.exec
const redis = require('redis')
const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)
const util = require('util')
client.hget = util.promisify(client.hget)
mongoose.Query.prototype.cache = function (option={}) {
    this.useCache = true
    this.hashKey=JSON.stringify(option.key||'')
    return this
}
mongoose.Query.prototype.exec = async function () {

    if (!this.useCache)
        return exec.apply(this, arguments)

    const key =
        JSON.stringify(
            Object.assign({}, this.getQuery(), {
                collection: this.this.mongooseCollection.name

            }))

    const cachedBlogs = await client.hget(this.hashKey,key)
    if (this.cachedBlogs) {
        const doc = JSON.parse(cachedBlogs)
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d)) :
            new this.model(doc)
    }

    const result = await exec.apply(this, arguments)
    client.hset(this.hashKey,key, JSON.stringify(result))
    return result
}

module.exports={
clearHash(hashKey)
{client.del(JSON.stringify(hashKey))}
}



