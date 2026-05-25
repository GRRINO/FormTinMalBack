import jwt from "jsonwebtoken"

export const authenticateToken = (req,res,next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            message:'Access Token Required'
        })
    }

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRECT,(err,user)=>{
        if(err){
            return res.status(403).json({
                message:'Invalid or expired access token'
            })
        }
        req.user = user;
        next();
    })
    
}

export const authorizeRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                message:'Access Denied: Insufficient Permissions'
            })
        }
        next();
    }
}