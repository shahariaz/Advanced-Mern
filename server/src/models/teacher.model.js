const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'teacher' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Use a secure password hashing library
  approvedHomeworkHistory: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'HomeworkSubmission' },
  ],
  // Add a reference to courses
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  // Add other relevant fields
});
//to find
teacherSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});
teacherSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

teacherSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//verify or match password

teacherSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//for changed password

teacherSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//for forgetting password
teacherSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
