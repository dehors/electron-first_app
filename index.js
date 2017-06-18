'use strict';

const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;
const path = require('path')
const url = require('url')

//Template for the menu
let menuTemplate = [
{
	label: 'Application',
	submenu: [
		{
			label: 'About',
			click: () => {
				openAboutWindow()
			}
		}
	]
}
]

let mainWindow;


//-----------------------------Config app
//Close all windows
app.on('window-all-closed', function() {
	if(process.platform != 'darwin') {
		app.quit();
	}
});

//init app
app.on('ready', function() {
	initWindow();

	electron.powerMonitor.on('on-ac', () => {
		mainWindow.restore()
	})

	electron.powerMonitor.on('on-battery', () => {
		mainWindow.minimize()
	})
});

// Reopen the app on macOS
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})

//-----------------------------Windows
function initWindow(argument) {
	// Create the browser window.
	let mainWindow = new BrowserWindow({
		width: 1280,
		height: 720
	})

	// Load the index.html file
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	// Set up the menu
	var menu = Menu.buildFromTemplate(menuTemplate)
	mainWindow.setMenu(menu)

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

// Opens the about window
function openAboutWindow() {

	let aboutWindow = new BrowserWindow({
		parent: mainWindow,
		modal: true,
		show: false,
		width: 400,
		height: 200
	})

	aboutWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'about.html'),
		protocol: 'file:',
		slashes: true
	}))

	aboutWindow.setMenu(null)
	aboutWindow.once('ready-to-show', () => {
		aboutWindow.show()
	})
}