"use strict";
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
const fs = require('fs');
var EventEmitter   = require('events').EventEmitter;

var GvfsMount = EventEmitter;
GvfsMount.prototype.parameters = {domain: '', user: '', password: '', resource: '', protocol: 'smb'};

GvfsMount.prototype._build_string = function(){
  var string_return = "";

  string_return = this.parameters.protocol+'://';
  string_return = string_return+this.parameters.domain+'\;';
  string_return = string_return+this.parameters.user+'@';
  string_return = string_return+this.parameters.resource;

/*
  if(_args.protocol && _args.protocol.length > 0){
    string_return = _args.protocol+'://';
  }else{
    string_return = this.parameters.protocol+'://';
  }
  if(_args.domain && _args.domain.length > 0){
    string_return = string_return+_args.domain+'\;';
  }else{
    string_return = string_return+this.parameters.domain+'\;';
  }
  if(_args.user && _args.user.length > 0){
    string_return = string_return+_args.user+'@';
  }else{
    string_return = string_return+this.parameters.user+'@';
  }
  if(_args.resource && _args.resource.length > 0){
    string_return = string_return+_args.resource;
  }else{
    string_return = string_return+this.parameters.resource;
  }
  */
  console.log(string_return);
  return string_return;
};

GvfsMount.prototype.mount = function (_param) {
  var t = this;
  var args = [];

  if(_param){
    this.parameters = _param;
  }

  args.push(this._build_string());
  var i = 1;

  const child = spawn('gvfs-mount', args);
  child.on('close', (code, signal) => {
    console.log(
      `child process terminated due to receipt of signal ${signal}`);
  });

  child.on('exit', (code, signal) => {

    switch(code){
      case 0:
      t.emit('mounted', {resource: args[0], code: code});
      break;
      case 2:
      t.emit('fail', {message: 'Ya se encuentra montado', resource: args[0], code: code});
      break;
    }

    console.log(
      `child process exit ${code}`,  code, signal);
  });

  child.on('error', (error) => {
    console.log(
      `child process error ${error}`);
  });


  child.on('message', (message) => {
    console.log(
      `child process message due to receipt of message ${message}`);
  });

  child.stdout.on('data', (message) => {
    console.log(message+'');

    if((new RegExp('Password:')).test(message)){
      console.log(t.parameters.password);
      if(i < 3){
        child.stdin.write(t.parameters.password);
        child.stdin.write('\n');
      }else{
        child.kill();
        t.emit('fail', {message: 'La contraseña no es correcta', error: -1, resource: args[0]});
      }
    }
    
    i++;
  });

  child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    t.emit('fail', {message: data+'', error: -2, resource: args[0]});
  });


}

module.exports = GvfsMount;