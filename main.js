// Modules to control application life and create native browser window
const {app, BrowserWindow,dialog} = require('electron')
const fs = require("fs").promises;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    frame : false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.


  const userDataPath = app.getPath('userData');
  fs.readFile(userDataPath+"/config.json").catch(()=>{
    const file = dialog.showSaveDialog({
      title: 'Where to Save ?',
    })
    var data = {dataPath : file};
    return fs.writeFile(userDataPath+"/config.json",JSON.stringify(data),"utf8");

  }).then(()=>{
    mainWindow.loadFile('index.html')
   // mainWindow.webContents.openDevTools()

  });
  // Open the DevTools.



  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.