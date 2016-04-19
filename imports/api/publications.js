import { Events } from './collections.js';

Meteor.publish('events', function(building, timeFirst, timeLast) {
    return Events.find({
        building: building,
        timeStart: {$gte: timeFirst, $lte: timeLast}
    })
})
