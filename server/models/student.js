// Dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Student = require('./studentClass'),
    config = require('../config/main');

// MongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    useMongoClient: true
});

var StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    studentClass: {
        _id: String,
        name: String
    },
    photo: {
        type: String,
        default: null
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

var Student = mongoose.model('Student', StudentSchema);

// Return model 
module.exports = Student;