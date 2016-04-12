import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/startup/routes.js';
import '../imports/api/collections.js';
import '../imports/parsers/parsettx.js';
import '../imports/parsers/parsecsv.js';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.upload.events({
    'change [name="fileUpload"]' (event, template) {
        let files = event.target.files;
        let file = files[0];
        let fileName = files[0].name;
        let extension = fileName.split('.')[1].toLowerCase();
        if (window.FileReader) {
            console.log('FileReader supported');
            let reader = new FileReader();
            if (extension == 'ttx') {
                reader.onload = function(event) {
                    console.log(parseTTX(reader.result));
                };
            } else if (extension == 'csv') {
                reader.onload = function(event) {
                    console.log(parseCSV(reader.result));
                };
            }

            reader.readAsText(file);
        }
    }
});
