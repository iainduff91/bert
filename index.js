'use strict';

let trello = require('./trello_wrapper');

exports.handler = (event, context, callback) => {
    //Run the lambda function on a schedule
    //When that schedule is triggered...
        //Get all cards that are over 2 weeks old

        //Move them from the Backlog into a new column (Aging Backlog Items)
        //Insert a "Refine Backlog" ticket into the "Ready" column
        //Generate an email with the following info:
            //All cards in the "Aging Backlog Items" column
            //The total number of cards

    return trello.getBoardInfo((err, data) => {
        if (err) {
            return callback(err);
        }

        console.dir(data);
        return callback(null, 'AWS CLI victory!');
    });
}
