const electron  = require('electron')
const {app} = electron
const {BrowserWindow} = electron

let win
let express = require('./server.js') //引入express服务器

function createWindow(){
	//express
	express()
	win = new BrowserWindow({
		width: 500,
		height: 500
	})

	win.loadURL('file://' + __dirname + '/index.html') //正式环境

	win.on('closed', () => {
		win = null
	})
}

app.on('ready',createWindow)

app.on('window-all-closed',() => {
	if(process.platform !== 'darwin'){
		app.quit()
	}
})

app.on('activate', () => {
	if(win === null){
		createWindow()
	}
})