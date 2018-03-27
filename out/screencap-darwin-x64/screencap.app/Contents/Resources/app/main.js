const {app, BrowserView, BrowserWindow, dialog, globalShortcut, Menu} = require('electron');

app.on('ready', function(){
    let win = new BrowserWindow({minWidth: 500, minHeight: 500, frame: true, transparent: false, show: true, autoHideMenuBar: true, webPreferences: {devTools: false}})
    // const {width, height} = require('electron').screen.getPrimaryDisplay().workAreaSize
    // let win = new BrowserWindow({width, height})

    win.on('closed', () => {
        win = null
    });

    win.loadURL(`file://${__dirname}/app/index.html`)
    win.setHasShadow(true)
});