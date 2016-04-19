import { Events, Users, } from './collections.js';

Meteor.methods({
    'uploadEvents': function (events) {
        console.log('uploadEvents called');
        var modified = [];
        events.forEach(event => {
            // find matching event (if exists)
            let selector = {
                // Selector: match building and space, overlapping time
                building: event.building,
                space: event.space,
                timeStart: {$lt: event.timeEnd},
                timeEnd: {$gt: event.timeStart}
            };
            let result = Events.findOne(selector);
            if (result) {
                let newer = event.metadata.exported > result.metadata.exported;
                // Bunch of complicated logic to decide when to overwrite the existing record,
                // based on comparing export dates and presence of resources.
                if ((!result.resources && event.resources) ||
                    event.resources && newer ||
                    !event.resources && !result.resources && newer) {
                    Events.update(result._id, {$set: event}, function (error, affected) {
                        if (error) {
                            console.log('Error updating:', error);
                        } else {
                            console.log('Updated event '+event.eventNumber+', '+event.eventName);
                        }
                    });
                } else {
                    console.log('Stale dated or wrong filetype, skipping update');
                    console.log('Existing:', result.eventNumber+' '+result.eventName+', '+result.timeStart.getHours()+'-'+result.timeEnd.getHours());
                    console.log('New:', event.eventNumber+' '+event.eventName+', '+event.timeStart.getHours()+'-'+event.timeEnd.getHours());
                }
            } else {
                // No match found, insert new event
                Events.insert(event, function (error, affected) {
                    if (error) {
                        console.log('Error updating:', error);
                    } else {
                        console.log('Updated ' + affected + ' events');
                    }
                });
            }


            /*
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
            */
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
