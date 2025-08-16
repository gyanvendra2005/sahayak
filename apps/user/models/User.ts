import mongoose, { Schema, Document } from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
  type: String,
  enum: ['user', 'instructor'],
  default: 'user',  
},

    enrolledCourses:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Course',
        }
    ],
    photoUrl: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
})
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;