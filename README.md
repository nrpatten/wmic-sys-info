# Wmic-Sys-Info
[![MIT License](https://img.shields.io/github/license/nrpatten/wmic-sys-info.svg?color=success)](https://github.com/nrpatten/wmic-sys-info/blob/master/LICENSE)
[![Git Version](https://img.shields.io/github/package-json/v/nrpatten/wmic-sys-info.svg?color=success)]()
[![Git Issues](https://img.shields.io/github/issues/nrpatten/wmic-sys-info.svg?color=success)](https://github.com/nrpatten/wmic-sys-info/issues)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/nrpatten/wmic-sys-info.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/nrpatten/wmic-sys-info/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/nrpatten/wmic-sys-info.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/nrpatten/wmic-sys-info/alerts/)
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
* `getNvidiaSmi()` Nvidia GPU Device Info, Note! nvidia-smi only works with GTX, RTX and Tesla (It may work with other cards but not tested).