// Dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config/main'),
    Student = require('./student');

// MongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    useMongoClient: true
});

var ClassSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: null
    },
    students: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }]
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

var StudentClass = mongoose.model('StudentClass', ClassSchema);

// Return model 
module.exports = StudentClass;