const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
// 1. Manually grab the token from the Header
const authHeader = req.headers['authorization'];
const tokenFromHeader = authHeader && authHeader.split(' ')[1];

// 2. If we found a token in the header, stuff it into the session
if (tokenFromHeader) {
    req.session.authorization = { accessToken: tokenFromHeader };
}

if (!req.session.authorization) {
    return res.status(400).json({ message: "token unavailable or expired" });
}
const token = req.session.authorization['accessToken'];

jwt.verify(token, 'fingerprint_customer', (err, decoded) => {
    if (err){
        return res.status(400).json({ message: "Invalid token" });
    } else {
        req.user = decoded;
        next();
    }
});


});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
