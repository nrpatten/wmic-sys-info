'use strict';

let unit;
let result;

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
  return result.toFixed(0) + ' ' + unit;
}

function netValue(args) {
  if(args !== 0 && args < 1024) {
    result = args / 1;
    unit = 'B/s';
  }
  if(args >= 1024 && args < Math.pow(1024, 2)) {
    result = args / 1024;
    unit = 'KB/s';
  }
  if(args >= Math.pow(1024, 2) && args < Math.pow(1024, 3)) {
    result = args / Math.pow(1024, 2);
    unit = 'MB/s';
  }
  if(args >= Math.pow(1024, 3) && args < Math.pow(1024, 4)) {
    result = args / Math.pow(1024, 3);
    unit = 'GB/s';
  }
  if(args >= Math.pow(1024, 4) && args < Math.pow(1024, 5)) {
    result = args / Math.pow(1024, 4);
    unit = 'TB/s';
  }
  return result.toFixed(2) + ' ' + unit;
}

exports.dataValue = dataValue;
exports.netValue = netValue;
