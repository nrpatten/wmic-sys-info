# Wmic-Sys-Info
[![MIT License](https://img.shields.io/github/license/nrpatten/wmic-sys-info.svg?color=success)](https://github.com/nrpatten/wmic-sys-info/blob/master/LICENSE)
[![Git Version](https://img.shields.io/github/package-json/v/nrpatten/wmic-sys-info.svg?color=success)]()
[![Git Issues](https://img.shields.io/github/issues/nrpatten/wmic-sys-info.svg?color=success)](https://github.com/nrpatten/wmic-sys-info/issues)
[![Git Forks](https://img.shields.io/github/forks/nrpatten/wmic-sys-info.svg?color=success)](https://github.com/nrpatten/wmic-sys-info/network/members)
[![Git Stars](https://img.shields.io/github/stars/nrpatten/wmic-sys-info.svg?color=success)](https://github.com/nrpatten/wmic-sys-info/stargazers)
[![npm downloads](https://img.shields.io/npm/dt/wmic-sys-info.svg?label=npm%20downloads)](https://www.npmjs.com/package/wmic-sys-info)
[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/nrpatten/wmic-sys-info.svg?color=success)](https://github.com/nrpatten/wmic-sys-info)
## Node Wmic (Windows Management Instrumentation Command-Line) System Info Package
* Windows 7 and up Only
## install:
* `npm i wmic-sys-info` or `npm i git://github.com/nrpatten/wmic-sys-info/`
## Usage:
```javascript
const wsi = require('wmic-sys-info');
wsi.getProcessor().then(function(data) {
  console.log(data);
}).catch(error => console.log(error));
```
## References
* `getBaseBoard()` MotherBoard Info
* `getBIOS()` BIOS Info
* `getOS()` Operating System Info
* `getProcessor()` Processor Info
* `getMemoryDevice()` Memory Info
* `getLogicalDisk()` Local Disk Info
* `getDiskDrive()` Disk Drive Info
* `getVideoController()` GPU Info
* `getDesktopmonitor` Monitor Info
* `getKeyboard()` KeyBoard Info
* `getMouse()` Mouse Info
* `getSoundDevice()` Sound Device Info
* `getNvidiaSmi()` Sound Device Info, Note! Testing.