// Dependencies
var express = require('express'),
    crypto = require('crypto'),
    mime = require('mime'),
    router = express.Router(),
    StudentController = require('../controllers/StudentController'),
    StudentClassController = require('../controllers/StudentClassController'),
    multer = require('multer');
    
// File Upload Handling
var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/img");
    },
    filename: function(req, file, callback) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            callback(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var upload = multer({ storage: Storage }).single('image');

// Routes For Classes
router.get('/classes', StudentClassController.getClasses);
router.get('/classes/:class_id', StudentClassController.getClass);
router.post('/classes', StudentClassController.addClass);
router.delete('/classes/:class_id', StudentClassController.deleteClass);

// Routes For Students with Classes
router.get('/classes/:class_id/students', StudentController.getStudentsByClass);
router.get('/classes/:class_id/students/:id', StudentController.getStudentByClass);
router.post('/classes/:class_id/students', upload, StudentController.addStudentByClass);
router.put('/classes/:class_id/students/:id', upload, StudentController.updateStudent);
router.delete('/classes/:class_id/students/:id', StudentController.deleteStudentByClass);

// Routes For Students only without Classes
router.get('/students', StudentController.getAllStudents);
router.get('/students/:id', StudentController.getStudent);
router.post('/students', upload, StudentController.addStudent);
router.delete('/students/:id', StudentController.deleteStudent);

// Return router
module.exports = router;