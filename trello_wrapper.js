'use strict';

const BOARD_ID = '54b4d5df9849cd0999ad99d4';

let Trello = require('node-trello');
let trello = new Trello("57a16d18be99f6b5a31d21c8e7c9f940", "4c5db157bae39369aa98c3e7427e13e6bba43f0ed233ea4c66e15438fb858f30");
let datetime = require('node-datetime');


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

let getOldBacklogCards = (cb) => {
    getBacklogListId((err, backlogListId) => {
        if (err) {
            return cb(err);
        }

        getBacklogCards(backlogListId, (err, cards) => {
            if (err) {
                return cb(err);
            }

            return cb(null, cards);
        });
    });
};

let getBacklogListId = (cb) => {
    trello.get(`/1/boards/${BOARD_ID}/lists`, (err, lists) => {
        if (err) {
            console.error('Unable to retrieve backlog list ID');
            console.error(err);
            return cb(err);
        }

        for(var list of lists) {
            if (list.name == "Backlog") {
                return cb(null, list.id);
            }
        }
    });
};

let getBacklogCards = (backlogListId, cb) => {

    console.log(`Retrieving cards from Backlog (list ID: ${backlogListId})...`);

    trello.get(`/1/lists/${backlogListId}/cards`, (err, cards) => {
        if (err) {
            console.error('Unable to retrieve cards from Backlog');
            console.error(err);
            return cb(err);
        }

        console.log(`Found ${cards.length} cards in Backlog list`);

        let currentDateTime = datetime.create();
        let twoWeeksInMillis = 1209600000;
        let twoWeeksAgo = datetime.create(currentDateTime.getTime() - twoWeeksInMillis);
        console.log(`Filtering cards untouched since ${twoWeeksAgo.format('d/m/Y H:M')}...`);


        let untouchedCards = cards.filter((card) => {
            let lastTouchedDateTime = datetime.create(card.dateLastActivity);
            return lastTouchedDateTime.getTime() <= twoWeeksAgo.getTime();
        });

        console.log(`Found ${untouchedCards.length} untouched cards`);

        return cb(null, cards);
    });
}

module.exports = {
    getBoardInfo,
    getOldBacklogCards
}