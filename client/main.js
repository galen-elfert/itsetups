import { Template } from 'meteor/templating';
import '../imports/startup/routes.js';
import { Events, Users, Spaces} from '../imports/api/collections.js';
import parseTTX from '../imports/parsers/parsettx.js';
import parseCSV from '../imports/parsers/parsecsv.js';

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
                    console.log(output);
                    // Get a set of all unique rooms
                    let rooms = new Set(output.map(event => {
                        return {
                            building: event.building,
                            space: event.space
                        };
                    }));
                    console.log(rooms);
                } catch (err) {
                    alert(err);
                    console.log(err);
                }
            };
            reader.readAsText(file);
        }
    }
});
