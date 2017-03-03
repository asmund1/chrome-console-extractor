#!/usr/bin/env node

const CDP = require('chrome-remote-interface');
const fs = require('fs');
var program = require('commander');

program
  .option('-o, --outputfile <outputfile>', 'Specify file to write to [chrome.log]', String, "chrome.log")
  .option('-c, --printtoconsole <printtoconsole>', 'Also print to screen [false]', Boolean, false)
  .parse(process.argv);

writeStream = fs.createWriteStream(
	program.outputfile,
	{
		defaultEncoding: 'utf8',
		autoClose: true
	}
);
writeStream.on('error', function (err) {
    console.log(err);
});

function logData(data) {
	if (program.printtoconsole) {
	    console.log(data);
	}
	writeStream.write(data + "\r\n");
}

CDP((client) => {
    // Extract domains
    const {Network, Page, Runtime} = client;
	
    // Setup event handlers
    Network.requestWillBeSent((params) => {
		logData("------------ NET INFO -----------------");
		logData("time: " + (new Date()).toISOString());
		logData("requestId: " + JSON.stringify(params.requestId));
		logData("frameId: " + JSON.stringify(params.frameId));
		logData("loaderId: " + JSON.stringify(params.loaderId));
		logData("documentURL: " + JSON.stringify(params.documentURL));
		logData("request: " + JSON.stringify(params.request));
		logData("timestamp: " + JSON.stringify(params.timestamp));
		logData("wallTime: " + JSON.stringify(params.wallTime));
		logData("initiator: " + JSON.stringify(params.initiator));
		logData("redirectResponse: " + JSON.stringify(params.redirectResponse));
		logData("type: " + JSON.stringify(params.type));
	});
	Network.loadingFinished((params) => {
		logData("------------ NET SUCCESS --------------");
		logData("time: " + (new Date()).toISOString());
		logData("requestId: " + JSON.stringify(params.requestId));
		logData("timestamp: " + JSON.stringify(params.timestamp));
		logData("encodedDataLength: " + JSON.stringify(params.encodedDataLength));
	});
	Network.loadingFailed((params) => {
		logData("------------ NET ERROR ----------------");
		logData("time: " + (new Date()).toISOString());
		logData("requestId: " + JSON.stringify(params.requestId));
		logData("timestamp: " + JSON.stringify(params.timestamp));
		logData("type: " + JSON.stringify(params.type));
		logData("errorText: " + JSON.stringify(params.errorText));
		logData("canceled: " + JSON.stringify(params.canceled));
		logData("blockedReason: " + JSON.stringify(params.blockedReason));
	});
	Runtime.exceptionThrown((params) => {
		logData("------------- EXCEPTION ---------------");
		logData("time: " + (new Date()).toISOString());
		logData("reason: " + JSON.stringify(params.reason));
		logData("exceptionId: " + JSON.stringify(params.exceptionId));
	});
	Runtime.consoleAPICalled((params) => {
		logData("-------------- CONSOLE ----------------");
		logData("time: " + (new Date()).toISOString());
		logData("type: " + JSON.stringify(params.type));
		logData("args: " + JSON.stringify(params.args));
		logData("timestamp: " + JSON.stringify(params.timestamp));
		logData("stackTrace: " + JSON.stringify(params.stackTrace));
	});
	
    // Enable listening
	Network.enable();
	Runtime.enable();
}).on('error', (err) => {
    console.error('Cannot connect to remote endpoint:', err);
});
