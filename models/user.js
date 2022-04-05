import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

//https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
const validatePassword = function (password) {
  // const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]/;
  const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
  return re.test(password);
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: false, unique: true },
  email: {
    type: String,
    required: [true, 'User email required'],
    unique: true,
    validate: [validateEmail, 'Email address invalid']
  },
  password: {
    type: String,
    required: [true, 'User password required'],
    minlength: [8, 'Password must be a minimum of 8 characters'],
    validate: [
      validatePassword,
      'Password must contain at least one lower case letter, one upper case letter, one number and one special character'
    ]
  },
  isAdmin: { type: Boolean }
});

// This function will get called just before a document
// gets saved. We want to hash the pw before saving it
userSchema.pre('save', function encryptPassword(next) {
  // `this`: new document that'll be created (username, pw etc)
  // `this` won't work with an arrow function! So this must be a function
  if (this.isModified('password')) {
    // hash the password
    // a SALT is an extra string that gets added to the end of the hash, making it a little bit more secure
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  }
  // Tell mongoose to continue its lifecycle:
  next();
});

// Validate the password once it's been hashed - for LOGIN (not register)
userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isEmailUnique = function isEmailUnique(email) {
  return bcrypt.compareSync(password, this.password);
};

// this hides the password field in response, but is STILL in db! 🎉
userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};
// can also import mongoose-hidden then:
// userSchema.plugin(mongooseHidden);

export default mongoose.model('User', userSchema);

userSchema.plugin(uniqueValidator); // checks email is unique
