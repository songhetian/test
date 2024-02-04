const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



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
        select : false
      },
      passwordConfirm: {
        type : String,
        required: [true,'请输入确认密码'],
        minLength : 8,
        validate : {
          validator: function(el) {
              return this.password === el
          },
          message: "确认密码不相同"
        }
      },
   role : {
        type : String,
        enum : ['user','guide','lead-guide','admin'],
        default : 'user'
   },
   passwordChangeAt : Date,
   passwordResetToken : String,
   passwordResetExpires : Date
 });

 UserSchema.pre('save',async function(next) {
   if(!this.isModified('password')) return next();
   this.password = await bcrypt.hash(this.password,12);
   this.passwordConfirm = undefined;
   next();
 });

 UserSchema.pre('save',function(next){
   if(!this.isModified('password') || this.isNew)  next();
   this.passwordChangeAt = Date.now();
   next();
 });

 UserSchema.methods.correctPassword = async function (currentPassword,userPassword) {
    return await bcrypt.compare(currentPassword,userPassword);
 }

UserSchema.methods.changedPasswordAfter =  function(JWTTimestamp) {
   const changedTimestamp = parseInt(this.passwordChangeAt.getTime()/1000,10);
  return JWTTimestamp < changedTimestamp;
 }

 UserSchema.methods.createPasswordResetToken = function() {
      const resetToken = crypto.randomBytes(32).toString('hex');

      this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      this.passwordResetExpires =  Date.now() + (10 * 60 * 1000);

      return resetToken;
 }

 const User = mongoose.model('User',UserSchema);

 module.exports = User;