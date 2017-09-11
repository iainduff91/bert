'use strict';

exports.handler = (event, context, callback) => {
    console.log('Did it work?');
    console.log('Printing event values...');
    console.log('value1 =', event.key1);
    console.log('value2 =', event.key2);
    console.log('value3 =', event.key3);
    console.log('Values printed');
    return callback(null, 'AWS CLI victory!');
}
