// Dependencies
var Student = require('../models/student'),
    mongoose = require('mongoose'),
    StudentClassController = require('./StudentClassController'),
    StudentClass = require('../models/studentClass'),
    fs = require('fs'),
    config = require('../config/main'),
    handleError = require('../errors/handle');

// Controller
var StudentsController = {

    getAllStudents : function (req, res) {
        return Student.find({})
            .populate('studentClass', '_id name').exec(function (err, students) {
            if (err) { return handleError(res, err); }
        }).then(function (students) {
            res.send(students);
        });
    },

    getStudent : function(req, res) {
        return Student.findById(req.params.id)
            .populate('studentClass', '_id name').exec(function (err, student) {
            if (err) { return handleError(res, err); }
        }).then(function (student) {
            if (! student) {
                res.status(404).send('Student Account not found');
            } else {
                res.status(200).send(student);
            }
        });
    },

    addStudent : function(req, res) {
        StudentClass.findById(req.body.studentClass, function (err, studentClass) {
            if (err) { return handleError(res, err); }
        }).then(function (studentClass) {
            var student = new Student({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                studentClass: {
                    _id: req.body.studentClass,
                    name: studentClass.name
                },
                photo: StudentsController.resolveFileName(req.file) || null
            });
            student.save(function (err) {
                if (err) { return handleError(res, err); }
                return StudentClassController.addStudentToClass(req, res, student);
            }).then(function(student){
                res.status(201).send(student);
            });
        });
    },
 
    updateStudent : function(req, res) {
        StudentClass.findById(req.body.studentClass, function (err, studentClass) {
            if (err) { return handleError(res, err); }
        }).then(function (studentClass) {    
            Student.findById(req.params.id, function (err, student) {
                if (err) { return handleError(err); }
            }).then(function (student) {
                student.name = req.body.name || student.name;
                student.email = req.body.email || student.email;
                student.studentClass._id = req.body.studentClass || student.studentClass._id;
                student.studentClass.name = studentClass.name || student.studentClass.name;
                student.photo = StudentsController.determineFile(student.photo, req.file);
                student.save((err, student) => {
                    if (err) {
                        return handleError(err);
                    }
                    res.status(200).send(student);
                });
            });
        });
    },

    deleteStudent : function(req, res) {
        Student.findByIdAndRemove(req.params.id, function (err, student) {
            if (err) { return handleError(err); }
            if (! student) {
                res.status(200).send('Student\'s account has been deleted');
            } else {
                StudentsController.determineFile(student.photo, false);
                res.status(200).send(student.name + '\'s account has been deleted');
            }
        });
    },
    
    getStudentsByClass : function(req, res, next) {
        StudentClass.findById(req.params.class_id).
            populate('students').exec(function(err, studentClass){
                if (err) { return handleError(res, err); }
        }).then(function(studentClass) {
            res.send(studentClass.students);
        });
    },

    getStudentByClass : function(req, res) {
        Student.findById(req.params.id)
            .populate('students').exec(function(err, student) {
            if (err) { return handleError(res, err); }
        }).then(function (student) {
            if (! student) {
                res.send('Student record not found');
            } else {
                res.status(200).send(student);
            }
        });
    },

    addStudentByClass : function(req, res) {
        StudentClass.findById(req.params.class_id, function(err, studentClass) {
            if (err) { return handleError(res, err); }
        }).then(function(studentClass) {
            var student = new Student({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                studentClass: {
                    _id: req.params.class_id,
                    name: studentClass.name
                },
                photo: StudentsController.resolveFileName(req.file)
            });
            student.save(function(err) {
                if (err) { return handleError(res, err); }
                return StudentClassController.updateStudentClass(req, res, student);
            });
        })
    },

    deleteStudentByClass : function(req, res) {
        StudentClass.findById(req.params.class_id, function(err, studentClass) {
            if (err) { return handleError(res, err); }
        }).then(function(studentClass) {
            studentClass.students.pull(req.params.id);
            studentClass.save(function(err) {
                if (err) { return handleError(err); }
            });
            Student.findByIdAndRemove(req.params.id, function (err, student) {
                if (err) { return handleError(res, err); }
                StudentsController.determineFile(student.photo, false);
                res.send('Student record deleted successfully');
            });
        });
    },

    resolveFileName(file) {
        return config.hostname + '/img/' + file.filename;
    },

    determineFile(currentFile, uploadfile = false) {
        if (currentFile) {
            var photoString = currentFile.split('/');
            var fileToDelete = './public/' + photoString[3] + '/' + photoString[4];
            if (uploadfile == false) {
                StudentsController.deleteFile(fileToDelete);
            } else {
                if (uploadfile) {
                    StudentsController.deleteFile(fileToDelete);
                    return StudentsController.resolveFileName(uploadfile);
                } else {
                    return currentFile;
                }
            }
        }
    },

    deleteFile(fileToDelete) {
        return fs.unlink(fileToDelete, function (err) {
            if (err && err.code == 'ENOENT') {
                // file doesn't exist
                console.info("File doesn't exist, won't remove it.");
            } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                console.error("Error occurred while trying to remove file");
            } else {
                console.info(`removed`);
            }
        });
    }
}

module.exports = StudentsController;