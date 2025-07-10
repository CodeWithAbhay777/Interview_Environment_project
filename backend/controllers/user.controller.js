import userModel from '../models/user.module.js';
import {generateToken} from '../utils/generateToken.js'
import bcrypt from "bcrypt";
import moment from "moment";

export const register = async (req,res) => {
    try {
        const {username , email , password , role , fullname } = req.body;
        if (!username || !email || !password || !role || !fullname){
            return res.status(400).json({
                success : false,
                message  : "All fields are required",
            })
        }

        const user = await userModel.findOne({username , email});

        if (user){
            return res.status(400).json({
                success :  false,
                message : "User already exists",
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const createdAt = moment().format("D MMM YYYY");

        const savedData = await userModel.create({
            username ,
            email , 
            password : hashedPassword,
            createdAt ,
            fullname
        })

        if (!savedData) {
            return res.status(400).json({
                success : false , 
                message : "Saving data : Something went wrong!"
            })
        }

        generateToken(res ,savedData , "Register user successfully" );
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : "Register : Something went wrong!",
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, username, password , role } = req.body;

        
        if (!email || !username || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Required all fields"
            });
        }

        
        const user = await userModel.findOne({
            $and: [
                {
                    $or: [
                        { email: email },
                        { username: username }
                    ]
                },
                { role: role }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        
        generateToken(res, user, "Login successful");

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Login: Something went wrong!",
            error: error.message
        });
    }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("jobify_token", "", {
      httpOnly: true,
      
      sameSite: "lax",
       maxAge: 0 
       
      }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
  
    return res.status(500).json({
      success: false,
      message : "Failed to logout : Something went wrong",
    });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.cookies.jobify_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    
    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
  
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};



