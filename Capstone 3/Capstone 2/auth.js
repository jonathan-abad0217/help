// [Section] JSON Web Tokens
    const jwt = require("jsonwebtoken");

// [Section] Secret Keyword
    const secret_key = "eCommerceAPI";


// [SECTION] JSON Web Tokens

// [Section] Token creation 
    module.exports.createAccessToken = (user) => {
        const user_data = {
            id : user._id,
            name: user.name,
            email : user.email,
            isAdmin : user.isAdmin
        };
        return jwt.sign(user_data, secret_key, {});      
    };



//[Section] Token Verification
   
    module.exports.verify = (req, res, next) => {
        console.log(req.headers.authorization);

        let token = req.headers.authorization;

        //This if statement will first check IF token variable contains undefined or a proper jwt. If it is undefined, we will check token's data type with typeof, then send a message to the client.
        if(typeof token === "undefined"){
            return res.send({auth: "Failed. No Token"});
        } else {
            console.log(token);     
            token = token.slice(7, token.length);
            console.log(token);

//[SECTION] Token decryption

            // Validate the token using the "verify" method decrypting the token using the secret code
            jwt.verify(token, secret_key, function(err, decodedToken){
                if(err){
                    return res.send({
                        auth: "Failed",
                        message: err.message
                    });
                } else {
                    console.log(decodedToken);//contains the data from our token                
                    req.user = decodedToken
                    next();
                }
            })
        }
    };




//[Section] verifyAdmin will also be used a middleware.
module.exports.verifyAdmin = (req, res, next) => {
    if(req.user.isAdmin){
        next();
    } else {
        return res.send({
            auth: "Failed",
            message: "Action Is Prohibited"
        })
    }
}