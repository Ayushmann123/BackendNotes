var jwt = require("jsonwebtoken");
require("dotenv").config();

// const JWT_SECRET = "ShriRamJankiBaithehaimereSeeneme";
const JWT_SECRET = `${process.env.JWT_SECRET}`;
console.log(JWT_SECRET)
fetchUser = (req, res, next) => {
  // Get the user from jwt token aand add if to it

  const token = req.header("authToken");
  if (!token) {
    res.status(401).send({ error: "please authenticate using a valid token" });
  }


  try{
    const data = jwt.verify(token, JWT_SECRET);//The jwt.verify() method first checks whether the token is valid and hasn't expired.
    //  If the token is valid, it decodes the payload of the token and returns the payload as a JavaScript object. 
    // In this case, the payload contains a user object, which is extracted and added to the req object as req.user.
   
   
    req.user = data.user;  //In the code, req.user = data.user sets the user object that was extracted from the JWT payload to the user property of the req object.
    next();

  } catch(error){
    res.status(401).send({ error: "please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
