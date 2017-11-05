// Dependencies
var StudentClass = require('../models/studentClass'),
    mongoose = require('mongoose'),
    StudentClass = require('../models/studentClass'),
    os = require('os'),
    handleError = require('../errors/handle');

// Controller
var StudentClassController = {

    getClasses: function(req, res) {
        return StudentClass.find({})
            .populate('students').exec(function (err, classes) {
            if (err) { return handleError(res, err); }
        }).then(function (classes) {
            res.status(200).send(classes);
        });
    },

    addClass: function(req, res) {
        return StudentClass.create({
            name: req.body.name,
            description: req.body.description
        }, function (err, studentClass) {
            if (err) { return handleError(res, err); }
        }).then(function (studentClass) {
            res.send(studentClass);
        });
    },

    getClass : function(req, res) {
        return StudentClass.findById(req.params.class_id)
            .populate('students').exec(function(err, studentClass) {
            if (err) { return handleError(res, err); }
        }).then(function(studentClass) {
            res.send(studentClass);
        });
    },

    deleteClass : function(req, res) {
        return StudentClass.findByIdAndRemove(req.params.class_id, function(err, studentClass) {
            if (err) { return handleError(res, err); }
            res.send(studentClass.name + ' class has been deleted');
        });
    },

    addStudentToClass : function(req, res, student) {
        StudentClass.findById(req.body.studentClass, function (err, studentClass) {
            if (err) { return handleError(res, err); }
        }).then(function (studentClass) {
            studentClass.students.push(student._id);
            studentClass.save(function (err) {
                if (err) { return handleError(res, err); }
            }).then(function (data) {
                res.status(201).send(student);
            });
        }).catch(function (err) {
            return handleError(res, err);
        });
    },

    updateStudentClass : function(req, res, student) {
        StudentClass.findById(req.params.class_id, function (err, studentClass) {
            if (err) { return handleError(res, err); }
        }).then(function (studentClass) {
            studentClass.students.push(student._id);
            studentClass.save(function (err) {
                if (err) { return handleError(res, err); }
            }).then(function (data) {
                res.status(201).send(student);
            });
        }).catch(function(err) {
            return handleError(res, err);
        });
    }

}

module.exports = StudentClassController;