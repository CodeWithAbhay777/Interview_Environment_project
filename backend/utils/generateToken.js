import jwt from 'jsonwebtoken';

export const generateToken = (res , user , message) => {
    const token = jwt.sign({
        userId : user._id,
    } , process.env.SECRET_TOKEN , {expiresIn : '1d'});


    return res.status(200)
    .cookie("jobify_token" , token , {httpOnly:true , sameSite:'lax' , maxAge:2*24*60*60*1000})
    .json({
        success : true,
        message,
        user 
    });
}