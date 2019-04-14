"use strict";
exports.__esModule = true;
var loadCollection = function (colName, db) {
    return new Promise(function (resolve) {
        db.loadDatabase({}, function () {
            var _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        });
    });
};
exports.loadCollection = loadCollection;
