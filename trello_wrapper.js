'use strict';

const BOARD_ID = '54b4d5df9849cd0999ad99d4';

let Trello = require('node-trello');
let trello = new Trello("57a16d18be99f6b5a31d21c8e7c9f940", "4c5db157bae39369aa98c3e7427e13e6bba43f0ed233ea4c66e15438fb858f30");
let datetime = require('node-datetime');


let getBoardLists = (cb) => {
    console.log('Retrieving board lists...');
    trello.get('/1/members/me/boards', (err, data) => {
        if (err) {
            console.error(`Unable to retrieve board information: ${err}`);
            return cb(err);
        }

        console.log(`Retrieved Trello board data`);
        return cb(null, data);
    });
};

let getBacklogListId = (cb) => {
    getListId('Backlog', (err, lists) => {
        if (err) {
            return cb(err);
        }
        return cb(null, lists);
    });
};

let getAgingBacklogListId = (cb) => {
    getListId('Aging Backlog Items', (err, lists) => {
        if (err) {
            return cb(err);
        }
        return cb(null, lists);
    });
};

let getListId = (listName, cb) => {
    trello.get(`/1/boards/${BOARD_ID}/lists`, (err, lists) => {
        if (err) {
            console.error(`Unable to retrieve lists from board ${BOARD_ID}`);
            console.error(err);
            return cb(err);
        }

        console.log(`Successfully retrieved lists for board ${BOARD_ID}`);

        for(var list of lists) {
            if (list.name == listName) {
                console.log(`ID for list "${listName}" is: ${list.id}`);
                return cb(null, list.id);
            }
        }
        return cb(`Could not find list with name ${listName}`);
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

        return cb(null, untouchedCards);
    });
};

let moveCard = (card, listId, cb) => {
    trello.put(`/1/cards/${card.id}`, {idList: listId}, (err, card) => {
        if (err) {
            console.error(`Unable to move card ${card.id} (${card.name}) to list ID ${listId}`);
            console.error(err);
            return cb(err);
        }
        return cb();
    });
};

module.exports = {
    getBoardLists,
    getBacklogListId,
    getAgingBacklogListId,
    getBacklogCards,
    moveCard
}