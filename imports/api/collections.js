import { Mongo } from 'meteor/mongo';

export const Events = new Mongo.Collection('events');
export const Users = new Mongo.Collection('users');

ResourceSchema = new SimpleSchema({
    quantity: {type: Number},
    name: {type: String},
    note: {type: String, optional: true}
    });

Events.schema = new SimpleSchema({
    building: {type: String},
    space: {type: String},
    timeStart: {type: Date},
    timeEnd: {type: Date},
    eventNumber: {type: Number},
    eventName: {type: String},
    onsite: {type: String, optional: true},
    contact: {type: String, optional: true},
    attend: {type: Number, optional: true},
    resources: {type: [ResourceSchema], optional: true},
    setupBy: {type: String, optional: true},
    setupTime: {type: Date, optional: true},
    pickupBy: {type: String, optional: true},
    pickupTime: {type: Date, optional: true},
    exported: {type: Date},
    });

Users.schema = new SimpleSchema({
    name: {type: String},
    colour: {type: String}
    });
