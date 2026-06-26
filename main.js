const fs = require('fs');
const path = require('path');
const { app, BrowserWindow } = require('electron');
const { PythonShell } = require('python-shell');

const defaultCachePath = path.join(app.getPath('userData'), 'Cache');
const fallbackCachePath = path.join(app.getPath('temp'), 'daily-life-tracking-system-cache');

app.commandLine.appendSwitch('disk-cache-dir', defaultCachePath);
app.setPath('cache', defaultCachePath);

function runPythonProcess(data) {
    let options = {
        mode: 'json',
        pythonPath: 'python', // siguraduhing nasa PATH mo ang python
        scriptPath: './',
    };

    let pyshell = new PythonShell('processor.py', options);

    // Ipadala ang data sa Python
    pyshell.send(data);

    // Kunin ang result mula sa Python
    pyshell.on('message', function (message) {
        console.log("Result from Python:", message);
    });

    pyshell.end(function (err) {
        if (err) throw err;
        console.log('Finished');
    });
}

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

    const isDev = !app.isPackaged && !process.argv.includes('--prod');
    if (isDev) {
        win.webContents.openDevTools();
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, 'dist/index.html'));
    }
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
const { ipcMain } = require('electron');

// Listener para tumanggap ng request mula sa renderer (script.js)
ipcMain.handle('run-python', async (event, data) => {
    return new Promise((resolve, reject) => {
        let pyshell = new PythonShell('processor.py', { mode: 'json' });
        pyshell.send(data);
        pyshell.on('message', (msg) => resolve(msg));
        pyshell.on('error', (err) => reject(err));
    });
});
