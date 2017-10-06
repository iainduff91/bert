'use strict';

let trello = require('./trello_wrapper');
let async = require('async');

exports.handler = (event, context, callback) => {
    //Run the lambda function on a schedule
    //When that schedule is triggered...
        //Get all cards that are over 2 weeks old
        async.waterfall([
            (next) => {
                //Get the list ID for the Backlog column
                trello.getBacklogListId((err, backlogListId) => {
                    if (err) {
                        return next(err);
                    }
                    return next(null, backlogListId);
                })
            },
            (backlogListId, next) => {
                //Get all cards that are over 2 weeks old
                trello.getBacklogCards(backlogListId, (err, cards) => {
                    if (err) {
                        return next(err);
                    }
                    return next(null, cards);
                });
            },
            (cards, next) => {
                //Move them from the Backlog into a new column (Aging Backlog Items)
                return next();
            },
            (next) => {
                //Insert a "Refine Backlog" ticket into the "Ready" column
                return next();
            },
            (next) => {
                //Generate an email with the following info:
                //All cards in the "Aging Backlog Items" column
                //The total number of cards
                return next();
            }
        ], (err) => {
            if (err) {
                console.error(err);
                return callback(err);
            }
            return callback(null, 'Bert has finished, me lord');
        });

    //return trello.getBoardLists((err, data) => {
    //    if (err) {
    //        return callback(err);
    //    }
    //
    //    console.dir(data);
    //    return callback(null, 'AWS CLI victory!');
    //});
}
