const fs = require('fs');
const path = require('path');
const { app, BrowserWindow } = require('electron');

const defaultCachePath = path.join(app.getPath('userData'), 'Cache');
const fallbackCachePath = path.join(app.getPath('temp'), 'daily-life-tracking-system-cache');

app.commandLine.appendSwitch('disk-cache-dir', defaultCachePath);
app.setPath('cache', defaultCachePath);

function ensureCachePath(dir) {
    try {
        fs.mkdirSync(dir, { recursive: true });
        return dir;
    } catch (error) {
        return null;
    }
}

const actualCachePath = ensureCachePath(defaultCachePath) || ensureCachePath(fallbackCachePath);
if (actualCachePath && actualCachePath !== defaultCachePath) {
    app.commandLine.appendSwitch('disk-cache-dir', actualCachePath);
    app.setPath('cache', actualCachePath);
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 850,
        minWidth: 1000,
        minHeight: 700,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('home.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});