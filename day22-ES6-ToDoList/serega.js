"use strict";

const DIR_NAME = "/home/andy/1/";
const NEW_DIR_NAME = "/home/andy/2/";
const FS = require("fs");

let copyFiles = (sourceDir, destinationDir) => {
    FS.readdir(sourceDir, (err, files) => {
        if (err) {
            console.log("Read dir error ");
        }
        if (files.length == 0) {
            console.log("No files in dir");
        }
        (function iterator(i) {
            if (i < files.length) {
                let data = {sourceDir, destinationDir, files}
                readFile(data)
                    .then(writeFile)
                    .then(iterator(i + 1))
                    .catch((error) => console.log(error));
            }
        })(0);
    });

};

let readFile = (_data) => {
    return new Promise((resolve, reject) => {
        if (!_data.files.length) {
            reject("Copy files complete");
        }
        FS.readFile(_data.sourceDir + _data.files[0], (err, data) => {
            if (err) {
                reject("Read file error");
            }
            //console.log("read " + _data.files[0]);
            let data1 = {sourceDir: _data.sourceDir, destinationDir: _data.destinationDir, files: _data.files, data};
            resolve(data1);
        });
    });
};

let writeFile = (data1) => {
    return new Promise((resolve, reject) => {
        FS.writeFile(data1.destinationDir + data1.files[0], data1.data, (err) => {
            if (err) {
                reject("Write file error");
            }
            console.log(data1.destinationDir + data1.files[0]);
            console.log("wrote " + data1.files[0]);
            data1.files.splice(0, 1);
            //resolve(sourceDir, destinationDir, files);
        });
    });
};

copyFiles(DIR_NAME, NEW_DIR_NAME);
