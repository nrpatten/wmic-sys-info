'use strict';

const exec = require('child_process').exec;
const platform = require('os').platform();
const parser = require('./lib/parser.js');
const results = [];
let result;
let unit;

function dataValue(args) {
  if (args == 0) {
    result = 0;
    unit = '';
  }
  if(args !== 0 && args < 1024) {
    result = args;
    unit = '';
  }
  if(args >= 1024 && args < Math.pow(1024, 2)) {
    result = args / 1024;
    unit = 'KB';
  }
  if(args >= Math.pow(1024, 2) && args < Math.pow(1024, 3)) {
    result = args / Math.pow(1024, 2);
    unit = 'MB';
  }
  if(args >= Math.pow(1024, 3) && args < Math.pow(1024, 4)) {
    result = args / Math.pow(1024, 3);
    unit = 'GB';
  }
  if(args >= Math.pow(1024, 4) && args < Math.pow(1024, 5)) {
    result = args / Math.pow(1024, 4);
    unit = 'TB';
  }
  return result.toFixed(0) + unit;
}

function getVideoController(callback) {
  return new Promise(function(resolve) {
    exec('wmic path win32_VideoController', (error, stdout, stderr) => {
      if (error) {
        console.error(`gpu-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        var date = item[i].DriverDate;
        var year = parseInt(date.substr(0,4));
        var month = parseInt(date.substr(4,2))-1;
        var day = parseInt(date.substr(6,2));
        date = new Date(year, month, day); 
        results.push({
          "Status": item[i].Status,
          "Manufacturer": item[i].AdapterCompatibility,
          "Name": item[i].Name,
          "VideoProcessor": item[i].VideoProcessor,
          "DeviceID": item[i].DeviceID,
          "Memory": dataValue(item[i].AdapterRAM),
          "Resolution": item[i].CurrentHorizontalResolution + 'x' + item[i].CurrentVerticalResolution + '@' + item[i].CurrentBitsPerPixel,
          "RefreshRate": item[i].CurrentRefreshRate + 'Hz',
          "DriverVersion": item[i].DriverVersion,
          "DriverDate": date.toDateString()
        });
      }
      resolve(results);
    });
  });
}

function getDesktopmonitor(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_Desktopmonitor', (error, stdout, stderr) => {
      if (error) {
        console.error(`monitor-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "Manufacturer": item[i].MonitorManufacturer,
          "Name": item[i].Name,
          "DeviceID": item[i].DeviceID
        });
      }
      resolve(results);
    });
  });
}

function getProcessor(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_Processor', (error, stdout, stderr) => {
      if (error) {
        console.error(`processor-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "Manufacturer": item[i].Manufacturer,
          "Name": item[i].Name,
          "Description": item[i].Description,
          "ClockSpeed": item[i].CurrentClockSpeed,
          "Cores": item[i].NumberOfCores,
          "Threads": item[i].NumberOfLogicalProcessors,
          "Socket": item[i].SocketDesignation,
          "CpuID": item[i].DeviceID,
          "LoadPercentage": item[i].LoadPercentage,
          "L2CacheSize": item[i].L2CacheSize,
          "L3CacheSize": item[i].L3CacheSize,
          "DataWidth": item[i].DataWidth + 'Bit',
          "VirtualizationEnabled": item[i].VirtualizationFirmwareEnabled
        });
      }
      resolve(results);
    });
  });
}

function getBaseBoard(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_BaseBoard', (error, stdout, stderr) => {
      if (error) {
        console.error(`mobo-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "Manufacturer": item[i].Manufacturer,
          "Product": item[i].Product,
          "Description": item[i].Description,
          "Version": item[i].Version,
          "SerialNumber": item[i].SerialNumber
        });
      }
      resolve(results);
    });
  });
}

function getBIOS(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_BIOS', (error, stdout, stderr) => {
      if (error) {
        console.error(`bios-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        var date = item[i].ReleaseDate;
        var year = parseInt(date.substr(0,4));
        var month = parseInt(date.substr(4,2))-1;
        var day = parseInt(date.substr(6,2));
        date = new Date(year, month, day); 
        results.push({
          "Status": item[i].Status,
          "Manufacturer": item[i].Manufacturer,
          "BiosVersion": item[i].BIOSVersion,
          "Name": item[i].Name,
          "Version": item[i].Version,
          "Date": date.toDateString()
        });
      }
      resolve(results);
    });
  });
}

function getDiskDrive(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_DiskDrive', (error, stdout, stderr) => {
      if (error) {
        console.error(`drive-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "Manufacturer": item[i].Manufacturer,
          "Model": item[i].Model,
          "Size": dataValue(item[i].Size),
          "SerialNumber": item[i].SerialNumber,
          "DeviceID": item[i].DeviceID.replace(/\\\\.\\/g, ''),
          "InterfaceType": item[i].InterfaceType,
          "FirmWare": item[i].FirmwareRevision,
          "Index": item[i].Index,
          "Partitions": item[i].Partitions,
          "Cylinders": item[i].TotalCylinders,
          "Heads": item[i].TotalHeads,
          "Sectors": item[i].TotalSectors,
          "Tracks": item[i].TotalTracks,
          "TracksPerCylinder": item[i].TracksPerCylinder
        });
      }
      resolve(results);
    });
  });
}

function getLogicalDisk(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_LogicalDisk', (error, stdout, stderr) => {
      if (error) {
        console.error(`localdrive-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Drive": item[i].Name,
          "Size": dataValue(item[i].Size),
          "FreeSpace": dataValue(item[i].FreeSpace),
          "VolumeName": item[i].VolumeName,
          "FileSystem": item[i].FileSystem,
          "SerialNumber": item[i].VolumeSerialNumber
        });
      }
      resolve(results);
    });
  });
}

function getMemoryDevice(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_PhysicalMemory', (error, stdout, stderr) => {
      if (error) {
        console.error(`memeory-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Location": item[i].DeviceLocator,
          "PartNumber": item[i].PartNumber,
          "Bank": item[i].BankLabel,
          "Speed": item[i].Speed,
          "ClockSpeed": item[i].ConfiguredClockSpeed,
          "Capacity": dataValue(item[i].Capacity)
        });
      }
      resolve(results);
    });
  });
}

function getOS(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic os', (error, stdout, stderr) => {
      if (error) {
        console.error(`os-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "Name": item[i].Caption,
          "Manufacturer": item[i].Manufacturer,
          "BuildNumber": item[i].BuildNumber,
          "SystemDrive": item[i].SystemDrive
        });
      }
      resolve(results);
    });
  });
}

function getKeyboard(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_Keyboard', (error, stdout, stderr) => {
      if (error) {
        console.error(`keyboard-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "ProductName": item[i].Description,
          "Name": item[i].Name
        });
      }
      resolve(results);
    });
  });
}

function getMouse(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_PointingDevice', (error, stdout, stderr) => {
      if (error) {
        console.error(`mouse-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "Manufacturer": item[i].Manufacturer,
          "Name": item[i].Name
        });
      }
      resolve(results);
    });
  });
}

function getSoundDevice(callback) {
  return new Promise(function(resolve, reject) {
    exec('wmic sounddev', (error, stdout, stderr) => {
      if (error) {
        console.error(`sound-info - exec error: ${error}`);
        return reject(error);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "Manufacturer": item[i].Manufacturer,
          "Name": item[i].Name,
          "ProductName": item[i].ProductName
        });
      }
      resolve(results);
    });
  });
}

exports.getVideoController = getVideoController;
exports.getDesktopmonitor = getDesktopmonitor;
exports.getMemoryDevice = getMemoryDevice;
exports.getSoundDevice = getSoundDevice;
exports.getLogicalDisk = getLogicalDisk;
exports.getProcessor = getProcessor;
exports.getBaseBoard = getBaseBoard;
exports.getDiskDrive = getDiskDrive;
exports.getKeyboard = getKeyboard;
exports.getMouse = getMouse;
exports.getBIOS = getBIOS;
exports.getOS = getOS;