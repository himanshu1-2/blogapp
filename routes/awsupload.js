 const express=require('express')
const requireLogin = require('../middlewares/requireLogin');
const AWS = require('aws-sdk')
const keys = require('../config/keys')
const uuid = require('uuid/v1')
const s3 = new AWS.S3({
    accessKeyId: keys.accessKey,
    secretAccessKey: keys.awsSecret,
    signatureVersion: 'v4',
    region: 'ap-south-1'
})
module.exports = app => {
    app.get('/api/upload',requireLogin, (req, res) => {
        const key = `${req.user.id}/${uuid()}.png`
        s3.getSignedUrl('putObject', {

            Bucket: 'dmartadminpic',
            ContentType: 'png',
            
            Key: key

        }, (err, url) => { res.send({ url, key }) })


    })
}