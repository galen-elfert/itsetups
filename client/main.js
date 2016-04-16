import { Template } from 'meteor/templating';
import '../imports/startup/routes.js';
import { Events, Users, Spaces} from '../imports/api/collections.js';
import parseTTX from '../imports/parsers/parsettx.js';
import parseCSV from '../imports/parsers/parsecsv.js';
import roomObj from '../imports/objects/roomobj.js';
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
                try {
                    let output = parse(reader.result);
                    // Get a set of all unique rooms
                    let roomsStr = new Set(output.map(event => [event.building, event.space].join('|')));
                    //let rooms =
                    // Get buildings and dates:
                    let buildings = new Set([...roomsStr].map(room => room.split('|')[0]));
                    let dates = new Set(output.map(event => event.timeStart));
                    let dateStart = Math.min(...dates);
                    let dateEnd = Math.max(...dates);
                    console.log('Rooms:', roomsStr);
                    console.log('Buildings:', buildings);
                    console.log('Date range', dateStart, dateEnd);
                } catch (err) {
                    alert(err);
                    console.log(err);
                }
            };
            reader.readAsText(file);
        }
    }
});
