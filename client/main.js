import { Template } from 'meteor/templating';
import '../imports/startup/routes.js';
import { Events, Users, Spaces} from '../imports/api/collections.js';
import parseTTX from '../imports/parsers/parsettx.js';
import parseCSV from '../imports/parsers/parsecsv.js';
import spaceObj from '../imports/objects/spaceobj.js';
import { mergeEvents } from '../imports/objects/eventfunc.js';

Template.upload.events({
    'change [name="fileUpload"]' (event, template) {
        let files = event.target.files;
        let file = files[0];
        let fileName = files[0].name;
        let extension = fileName.split('.')[1].toLowerCase();
        if (window.FileReader) {
            console.log('FileReader supported');
            let reader = new FileReader();
            let parse;
            if (extension == 'ttx') {
                parse = parseTTX;
            } else if (extension == 'csv') {
                parse = parseCSV;
            }
            reader.onload = function(event) {
                // try {
                    let newEvents = parse(reader.result);
                    console.log('Events:', newEvents.events);
                    console.log('Spaces:', newEvents.spaces);
                    console.log('Buildings:', newEvents.buildings);
                    console.log('Date range', newEvents.dateFirst, newEvents.dateLast);
                    eventsMerged = mergeEvents(newEvents.events);
                    console.log('Events (merged):', eventsMerged);
                    var modified = [];
                    eventsMerged.forEach(event => {
                        // If event has resource then upsert, if not then insert only if no match
                        if (event.resources)
                        modified.push(Events.upsert({
                            // Selector: match building and space, overlapping time
                            building: event.building,
                            space: event.space,
                            timeStart: {$lte: event.timeEnd},
                            timeEnd: {$gte: event.timeEnd}
                        },
                        // Modifier: for now, complete replacement:
                        { event }));
                    })
                    // Next step: Remove all events in db matching buildings and times
                    // which were not updated (assumed cancelled).
                    console.log('Modified: ', modified)
                // } catch (err) {
                //     alert(err);
                //     console.log(err);
                // }
            };
            reader.readAsText(file);
        }
    }
});
