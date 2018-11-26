'use strict'
var app = require('./server.js');
var fs = require('fs');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

var db = mongojs('contactlist', ['contactlist']);

app.use(bodyParser.json());
var contactController = {
    listContact: listContact,
    addContact: addContact,
    removeContact: removeContact,
    editContact: editContact,
    updateContact: updateContact
};

function listContact(req, res) {
    db.contactlist.find(function (err, doc) {
        res.json(doc);
    });
}

function addContact(req, res) {
    db.contactlist.insert(req.body, function (err, doc) {
        res.json(doc);
    })
}

function removeContact(req, res) {
    var id = req.params.id;
    db.contactlist.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
}

function editContact(req, res) {
    var id = req.params.id;
    db.contactlist.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
}

function updateContact(req, res) {
    var id = req.params.id;
    delete req.body._id;
    var qry = {
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: req.body
        },
        new: true
    }
    db.contactlist.findAndModify(qry, function (err, doc) {
        res.json(doc);
    });
}
/*
Define All the routes of the controller in this file
*/
app
    .get('/contact/list', contactController.listContact)
    .post('/contact/add', contactController.addContact)
    .delete('/contact/remove/:id', contactController.removeContact)
    .get('/contact/edit/:id', contactController.editContact)
    .put('/contact/update/:id', contactController.updateContact);