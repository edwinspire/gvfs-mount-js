"use strict";
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
const fs = require('fs');
var events = require('events');
var extend = require('obj-extend');

var Gvfs = function () {

};

Gvfs.prototype = extend({}, events.EventEmitter.prototype, {

  mount: function (args) {
//location, domain, user, password
const child = execFile('gvfs-mount', args, (error, stdout, stderr)=>{
  if(error){
    console.error(error);
    throw error;
  }else{
   this.emit('mounted', {});     
 }
});

},

info: function () {
  
const child = spawn('gvfs-info', args);
child.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

child.on('error', (error) => {
  console.log(
    `child process error ${error}`);
});

child.on('exit', (message, sendHandle) => {
  console.log(
    `child process message due to receipt of message ${message}`);
});

},



});


};

module.exports = Gvfs;