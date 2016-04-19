import { Template } from 'meteor/templating';
import '../imports/startup/routes.js';
import { Events, Users, Spaces} from '../imports/api/collections.js';
import parseTTX from '../imports/parsers/parsettx.js';
import parseCSV from '../imports/parsers/parsecsv.js';
import testParser from '../imports/parsers/testparser.js';
import spaceObj from '../imports/objects/spaceobj.js';
import { mergeEvents } from '../imports/objects/eventfunc.js';


Template.main.onRendered(
    
)

Template.upload.events({
    'change [name="fileUpload"]' (event, template) {
        let files = event.target.files;
        let file = files[0];
        let fileName = files[0].name;
        let extension = fileName.split('.')[1].toLowerCase();
        if (window.FileReader) {
            console.log('FileReader supported');
            let reader = new FileReader();
            let parser;
            if (extension == 'ttx') {
                parser = parseTTX;
            } else if (extension == 'csv') {
                parser = parseCSV;
            }
            reader.onload = function(event) {
                // try {
                    let newEvents = parser(reader.result);
                    console.log('Events:', newEvents.events);
                    console.log('Spaces:', newEvents.spaces);
                    console.log('Buildings:', newEvents.buildings);
                    console.log('Date range', newEvents.dateFirst, newEvents.dateLast);
                    eventsMerged = mergeEvents(newEvents.events);
                    console.log('Events (merged):', eventsMerged);
                    // Meteor.call('uploadEvents', eventsMerged);
                    Meteor.call('uploadEvents', eventsMerged);
                // } catch (err) {
                //     alert(err);
                //     console.log(err);
                // }
            };
            reader.readAsText(file);
        }
    }
});
