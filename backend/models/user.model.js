import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
      trim: true,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["admin", "candidate", "recruiter"],
      default: "candidate",
      required: true,
    },
  },
  { timestamps: true }
);


//this is a middleware function that hashes the password before saving the user document
userSchema.pre("save",async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password , 10);
  }
  next();
});


//Method for checking is password correct or not
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
}

//Method for generating refresh tokens
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        userId : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
       expiresIn : process.env.REFRESH_TOKEN_EXPIRY || "14d" 
    });
}


//Method for generating access tokens
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        userId : this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
       expiresIn : process.env.ACCESS_TOKEN_EXPIRY || "1d" 
    });
}



const UserModel = mongoose.model("UserModel", userSchema);

export default UserModel;
