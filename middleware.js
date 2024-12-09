const jwt = require("jsonwebtoken")

function authenticationProcess(req, res, next){
    const token = req.cookies.authToken

    if (!token){
        return res.status(401).send("Token not found")
    }

    jwt.verify(token, process.env.SECRET_JWT_APP, (e, user)=>{
        if(e){
            return res.status(403).send("token invalid")
        }
        req.user = user
        next()
    })
}

function authenticateAdmin(req, res, next){
    if (!req.user) {
        return res.status(401).send("user not authenticated")
    }
    console.log(req.user)
    if (req.user.role !== "admin") {
        return res.status(403).send("user is not an admin")
    }
    
    next()
}

module.exports = { authenticationProcess, authenticateAdmin }