import { Events, Users, } from './collections.js';

Meteor.methods({
    'uploadEvents': function (events) {
        console.log('uploadEvents called');
        var modified = [];
        events.forEach(event => {
            // If event has resource then upsert, if not then insert only if no match
            console.log('Inserting: ', event);
            let thisModifier;
            if (event.resources) {
                thisModifier = {event};
            } else {
                thisModifier = {$set:{}};
            }
            let thisInsert = Events.upsert({
                    // Selector: match building and space, overlapping time
                    building: event.building,
                    space: event.space,
                    timeStart: {$lte: event.timeEnd},
                    timeEnd: {$gte: event.timeStart}
                },
                thisModifier,
                function (error, affected) {
                    if (error) {
                        console.log('Error:', error);
                    } else {
                        console.log('Updated ' + affected + ' events');
                    }
                });
            modified.push(thisInsert.insertedId);
        });
        // Next step: Remove all events in db matching buildings and times
        // which were not updated (assumed cancelled).
        console.log('Modified: ', modified);
    },
    'insertEvent': function (event) {
        console.log('Inserting: ', event);
        Events.insert(event, function(error, id) {
            if (error) {
                console.log('Error: ', error);
            } else {
                console.log('Inserted: ', id);
            }
        })
    }
});
