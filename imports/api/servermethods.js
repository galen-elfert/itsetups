import { Events, Users, } from './collections.js';

Meteor.methods({
    'uploadEvents': function (events) {
        console.log('uploadEvents called');
        var modified = [];
        events.forEach(event => {
            // If event has resource then upsert, if not then insert only if no match
            let thisInsert = Events.upsert({
                    // Selector: match building and space, overlapping time
                    building: event.building,
                    space: event.space,
                    timeStart: {$lte: event.timeEnd},
                    timeEnd: {$gte: event.timeStart}
                },
                {$set: event},
                function (error, affected) {
                    if (error) {
                        console.log('Error:', error);
                    } else {
                        console.log('Updated ' + affected + ' events');
                    }
                });
            console.log('Return: ', thisInsert);
            //modified.push(thisInsert.insertedId);
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
        });
    },
    'upsertEvent': function (event) {
        Events.upsert({
            // Selector: match building and space, overlapping time
            building: event.building,
            space: event.space,
            timeStart: {$lte: event.timeEnd},
            timeEnd: {$gte: event.timeStart}
        },
        {$set: {
            resources: event.resources
        }},
        function (error, affected) {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Updated ' + affected + ' events');
            }
        });
    }
});
