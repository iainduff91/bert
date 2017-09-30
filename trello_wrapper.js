'use strict';

let Trello = require('node-trello');
let trello = new Trello("57a16d18be99f6b5a31d21c8e7c9f940", "4c5db157bae39369aa98c3e7427e13e6bba43f0ed233ea4c66e15438fb858f30");


let getBoardInfo = (cb) => {
    trello.get('/1/members/me/boards', (err, data) => {
        if (err) {
            console.error(`Unable to retrieve board information: ${err}`);
            return cb(err);
        }

        console.log(`Retrieved Trello board data`);
        return cb(null, data);
    });
};

module.exports = {
    getBoardInfo
}