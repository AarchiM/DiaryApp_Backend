const jwt = require('jsonwebtoken');

function authenticationToken(req, res, next){
    // Get awtHeader which contains token having prefix Bearer
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) return res.sentStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(401);
        req.user = user;
        next();       
    })

    module.exports={
        authenticationToken,
    };
}