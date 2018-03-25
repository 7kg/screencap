const {app, BrowserView, BrowserWindow, dialog, globalShortcut, Menu} = require('electron');

app.on('ready', function(){
    let win = new BrowserWindow({width: 800, height: 600, frame: true, transparent: true, show: true, autoHideMenuBar: true})
    // const {width, height} = require('electron').screen.getPrimaryDisplay().workAreaSize
    // let win = new BrowserWindow({width, height})

    win.on('closed', () => {
        win = null
    });

    win.loadURL(`file://${__dirname}/app/index.html`)
    win.setHasShadow(true)
});