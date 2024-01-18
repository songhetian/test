const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');



 const UserSchema   = new mongoose.Schema({
      name : {
        type: String,
        required: [true,"姓名必须填写"]
      },
      email:{
        type : String,
        required : [true,"邮箱必须填写"],
        unique :true,
        validate : [validator.isEmail,'请输入争取的邮箱'],
        lowercase : true
      },
      photo:{
        type : String,
      },
      password: {
        type : String,
        minLength : 8,
        required: [true,'请输入密码'],
      },
      passwordConfirm: {
        type : String,
        required: [true,'请输入确认密码'],
        minLength : 8,
        validate : {
          validator: function(el) {
              return this.password === el
          },
          messages: "两次密码不一致"
        }
      }
 });

 UserSchema.pre('save',async function(next) {
   if(!this.isModified('password')) return next();
   this.password = await bcrypt.hash(this.password,12);
   this.passwordConfirm = undefined;
   next();
 });


 const User = mongoose.model('User',UserSchema);

 module.exports = User;