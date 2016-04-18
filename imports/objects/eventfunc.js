// Functions for manipulation lists of events (Comparison stuff should be factored out to prototype methods)


/*  Takes an array of events, merges all events with matching time, space, and event number, and overlapping times.
    Returns the new array of events including the merged events.
 */

export function mergeEvents(input) {
    // Copy the array
    events = [...input];

    // Compare every member to every other member
    for (var i = 0; i < events.length; i++) {
        for (var k = i+1; k < events.length; k++) {
            if (events[i].building == events[k].building &&
                events[i].space == events[k].space &&
                events[i].timeStart < events[k].timeEnd &&
                events[k].timeStart < events[i].timeEnd) {
                    console.log("Event numbers:", events[i].eventNumber, events[k].eventNumber);
                    console.log("Match?", Boolean(events[i].eventNumber == events[k].eventNumber));
                    if (events[i].eventNumber == events[k].eventNumber) {
                        // Set resource specific start time, if different.
                        if(events[k].timeStart > events[i].timeStart) {
                            events[k].resources.forEach(resource => {
                                resource.setTimeStart(events[k].timeStart);
                            });
                        } else if (events[i].timeStart > events[k].timeStart) {
                            events[i].resources.forEach(resource => {
                                resource.setTimeStart(events[i].timeStart);
                            });
                        }
                        // Merge resources
                        console.log("Merging: ", events[i], events[k]);
                        events[i].resources.push(...events[k].resources);
                        // Delete second event
                        events.splice(k, 1);
                    } else {
                        console.log('Mismatched overlapping events:', events[i], events[k]);
                        // throw Error('Mismatched overlapping events:');
                        events.splice(k, 1);
                    }
            }
        }
    }
    return events;
}
