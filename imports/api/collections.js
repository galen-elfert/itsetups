import { Mongo } from 'meteor/mongo';
import regexes from '../objects/regexes.js';

export const Events = new Mongo.Collection('events');
export const Users = new Mongo.Collection('users');
export const Spaces = new Mongo.Collection('spaces');

SimpleSchema.debug = true;

var Schemas = {};

Schemas.Resource = new SimpleSchema({
    quantity: {type: Number},
    name: {type: String},
    note: {type: String, optional: true},
    setupBy: {type: String, optional: true},
    setupTime: {type: Date, optional: true},
    pickupBy: {type: String, optional: true},
    pickupTime: {type: Date, optional: true},
    cancelled: {type: Boolean, defaultValue: false}
});

Schemas.MetaData = new SimpleSchema({
    exported: {type: Date},
    version: {type: String, regEx: regexes.version}
});

Schemas.Event = new SimpleSchema({
    building: {type: String},
    space: {type: String},
    timeStart: {type: Date},
    timeEnd: {type: Date},
    eventNumber: {type: Number},
    eventName: {type: String},
    onsite: {type: String, optional: true},
    contact: {type: String, optional: true},
    type: {type: String, optional: true},
    attend: {type: Number, optional: true},
    resources: {type: [Schemas.Resource], optional: true},
    metadata: {type: Schemas.MetaData}
});

Schemas.User = new SimpleSchema({
    name: {type: String},
    colour: {type: String}
});

Schemas.Space = new SimpleSchema({
    building: {type: String},
    space: {type: String},
    label: {type: Boolean, defaultValue: false},
    rowFirst: {type: Number, defaultValue: 0},
    rowLast: {type: Number, defaultValue: 0}
});

Events.attachSchema(Schemas.Event);
Users.attachSchema(Schemas.User);
Spaces.attachSchema(Schemas.Space);
