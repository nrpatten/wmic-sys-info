'use strict';
// ==================================================================================
// index.js
// ----------------------------------------------------------------------------------
// Description:   Windows Management Instrumentation Command-Line System Information
//                - library for Node.js
// Copyright:     (c) 2019
// Author:        Nathan Patten (NRPatten)
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

const exec = require('child_process').exec;
const XMLParser = require('./lib/xml2json');
const parser = require('./lib/parser');
const fs = require('fs');
const results = [];

let result;
let unit;
let res;


function dataValue(args) {
  if (args === 0) {
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

function getNvidiaSmi() {
  return new Promise((resolve, reject) => {
    try {
      fs.stat('C:\\Progra~1\\NVIDIA~1\\NVSMI\\nvidia-smi.exe', (err) => {
        if (!err) {
          const spawn = require('child_process').spawn('C:\\Progra~1\\NVIDIA~1\\NVSMI\\nvidia-smi', ['-x','-q']);
          spawn.stdout.on('data', (data) => {
            res += new Buffer(data,'utf-8').toString();
          });
          spawn.stdout.on('end', (data) => {
            var x2js = new XMLParser();
            var json = x2js.xml_str2json(res);
            for(let i in json) {
              var item = json;
              results.push({
               "driver_version": item[i].driver_version,
               "cuda_version": item[i].cuda_version,
               "attached_gpus": item[i].attached_gpus,
               "gpu": item[i].gpu
              });
            }
            return resolve(results);
          });
        } else
        if (err.code === 'ENOENT') {
          return reject('Sorry nvidia-smi was not found on your system or you have OEM drivers installed');
        }
      });
    } catch (error) {
      return reject(error);
    }
  });
}

function getVideoController() {
  return new Promise(function(resolve, reject) {
    exec('wmic path win32_VideoController', (error, stdout) => {
      if (error) {
        return reject(`gpu-info - exec error: ${error}`);
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
      return resolve(results);
    });
  });
}

function getDesktopmonitor() {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_Desktopmonitor', (error, stdout) => {
      if (error) {
        return reject(`monitor-info - exec error: ${error}`);
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
      return resolve(results);
    });
  });
}

function getProcessor() {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_Processor', (error, stdout) => {
      if (error) {
        return reject(`processor-info - exec error: ${error}`);
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
      return resolve(results);
    });
  });
}

function getBaseBoard() {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_BaseBoard', (error, stdout) => {
      if (error) {
        return reject(`mobo-info - exec error: ${error}`);
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
      return resolve(results);
    });
  });
}

function getBIOS() {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_BIOS', (error, stdout) => {
      if (error) {
        return reject(`bios-info - exec error: ${error}`);
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
      return resolve(results);
    });
  });
}

function getDiskDrive() {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_DiskDrive', (error, stdout) => {
      if (error) {
        return reject(`drive-info - exec error: ${error}`);
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
      return resolve(results);
    });
  });
}

function getLogicalDisk() {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_LogicalDisk', (error, stdout) => {
      if (error) {
        return reject(`localdrive-info - exec error: ${error}`);
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
      return resolve(results);
    });
  });
}

function getMemoryDevice() {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_PhysicalMemory', (error, stdout) => {
      if (error) {
        return reject(`memeory-info - exec error: ${error}`);
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
      return resolve(results);
    });
  });
}

function getOS() {
  return new Promise(function(resolve, reject) {
    exec('wmic os', (error, stdout) => {
      if (error) {
        return reject(`os-info - exec error: ${error}`);
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
      return resolve(results);
    });
  });
}

function getKeyboard() {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_Keyboard', (error, stdout) => {
      if (error) {
        return reject(`keyboard-info - exec error: ${error}`);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "ProductName": item[i].Description,
          "Name": item[i].Name
        });
      }
      return resolve(results);
    });
  });
}

function getMouse() {
  return new Promise(function(resolve, reject) {
    exec('wmic path Win32_PointingDevice', (error, stdout) => {
      if (error) {
        return reject(`mouse-info - exec error: ${error}`);
      }
      let item = parser.parse(stdout);
      for(var i = 0; i < item.length; i++) {
        results.push({
          "Status": item[i].Status,
          "Manufacturer": item[i].Manufacturer,
          "Name": item[i].Name
        });
      }
      return resolve(results);
    });
  });
}

function getSoundDevice() {
  return new Promise(function(resolve, reject) {
    exec('wmic sounddev', (error, stdout) => {
      if (error) {
        return reject(`sound-info - exec error: ${error}`);
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
      return resolve(results);
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
exports.getNvidiaSmi = getNvidiaSmi;
exports.getMouse = getMouse;
exports.getBIOS = getBIOS;
exports.getOS = getOS;