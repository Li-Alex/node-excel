const express = require('express')
const path = require('path')
const request = require('request')
const xls = require('node-xlsx')
const fs = require('fs')
const Bagpipe = require('bagpipe')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
let bagpipe = new Bagpipe(10)

app.use(function(req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*'
    })
    next()
})

let count = 0
let xlsUrl = './excels/'
let imgList = [] //存放图片url地址


app.post('/getImg',(req,res) => {

	let downloadFile = function(src, index, callback){
		request(src)
			.pipe(fs.createWriteStream('./images/' + index + '.jpg'))
			.on('close',_ => {
				callback(null, index)
			})
	}

	function searchList(imgList){
		for(let i = 0, len = imgList.length; i < len; i++){
			bagpipe.push(downloadFile,imgList[i],i,function(err,index){
				count++;
				console.log('count: ' + count)
				console.log('[' + index + '.png] has been downloaded')
				if(count === len){
					console.log('All images have been downloaded')
					res.send('download finished')
				}
			})
		}
	}

	function getImgList(url){
		let xlsData = xls.parse(url)[0].data

		for(let i=0,len=xlsData.length; i < len; i++){
			xlsData[i][1] && imgList.push(xlsData[i][1])
		}
		searchList(imgList)
	}
	
	getImgList(xlsUrl + req.body.fileName)
})

module.exports = function(){
	app.listen(3000, _ => {
		console.log('node is listening in port 3000')
	})
}  