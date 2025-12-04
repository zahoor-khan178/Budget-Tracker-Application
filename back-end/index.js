
require('./model/dbconnection');
const mongoose = require('mongoose');
const crypto = require("crypto");// node.js bult-in module to generate secure random tokens
const TempUser = require('./model/TempUser');
const User = require('./model/userschema');
const Transaction = require('./model/transaction')
const express = require('express');
const bcrypt = require('bcrypt');// library to hash passwords

const cors = require('cors');

const jwt = require('jsonwebtoken');


const jwtkey = process.env.JWT_SECRET || "book";



const app = express();
app.use(express.json());  // convert incoming JSON requests to JS objects 







// app.use(cors());

// CORS = Cross-Origin Resource Sharing
// it allows two different resouces from different origins running on differen ports to communicate 
// with each other.

// Only my frontend, at process.env.FRONTEND_URL, is allowed to send 
// GET / POST / PUT / DELETE requests to my backend, and the backend will 
// accept cookies or tokens from that frontend.”
app.use(cors({
   origin: process.env.FRONTEND_URL,
   methods: ["GET", "POST", "PUT", "DELETE"],
   credentials: true
}));


// || "http://localhost:3000" || "http://localhost:3001" process.env.FRONTEND_URL,


// while updating the password first we need to check whether the email provided by the user
// exists in the database or not. if exists then only we will allow the user to update the password.

app.post('/check-email', async (req, resp) => {

   try {

      const { email } = req.body;
      const emailexists = await User.findOne({ email });
      if (!emailexists) {
         return resp.status(404).json({ message: 'user with this email does not exists' });

      }


   return resp.status(200).json({
         email: emailexists.email,
         message: 'this email is registered'
      });





   } catch (err) {

      resp.status(500).json({ message: "Internal Server Error" });
   }
});



// API to update password 

app.put('/updating-password', async (req, resp) => {

   const { password, email } = req.body;

   const hashpassword= await bcrypt.hash(password,10);
   

   try {


      const result = await User.updateOne({email}, { $set: {password:hashpassword } });

      if (!result) {
         resp.status(404).json({message:'Error while updating password'});
         return;
      }

      return resp.status(200).json({message:'Password is updated successfully'});

   } catch (err) {

      resp.status(500).json({message:'Enternal server error'});
   }




});


// when user signs up, first we need to verify whether the email is already registered or not.

app.post("/verify", async (req, resp) => {
   try {
      const { name, email, password } = req.body;

      // 1. Email already exists in final User DB
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return resp.send({ message: "This email is already registered." });
      }

      // 2. Delete previous unverified token for this email
      await TempUser.deleteMany({ email });

      // 3. Secure 32-byte verification token
      const token = crypto.randomBytes(32).toString("hex");

      // 4. Save temporary user
      await TempUser.create({
         name,
         email,
         password,
         token,
         expiry: Date.now() + 10 * 60 * 1000  // expires in 10 minutes
      });

      resp.send({ token, email });

   } catch (err) {
      console.log("Verify API Error:", err);
      resp.status(500).send({ message: "Internal Server Error" });
   }
});

// Resend verification email API

app.post("/resend-verification", async (req, resp) => {
   try {
      const { email } = req.body;
      // 1. Check if user already exists in final User DB
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return resp.send({ message: "This email is already registered." });
      }
      const existingtempUser = await TempUser.findOne({ email });

      if (existingtempUser) { // if tempuser exists

         // if tempuser exists but the expiray data is less then now date

         if (existingtempUser.expiry < Date.now()) {
            //  Delete previous unverified token for this email
            await TempUser.deleteMany({ email });

            // 3. Secure 32-byte verification token
            const token = crypto.randomBytes(32).toString("hex");

            // 4. Save temporary user
            await TempUser.create({
               name: existingtempUser.name,
               email: existingtempUser.email,
               password: existingtempUser.password,
               token,
               expiry: Date.now() + 10 * 60 * 1000  // expires in 10 minutes
            });


            return resp.send({ token, email });

         }


      }



   }

   catch (err) {
      console.log("Resend Verification API Error:", err);
      resp.status(500).send({ message: "Internal Server Error" });
   }



});



// signs up / Register API
app.post("/register", async (req, resp) => {
   try {
      const { token } = req.body;

      //  Fetch temp user
      const temp = await TempUser.findOne({ token });


      // if temp is empty or expiray data is less then now data

      if (!temp || temp.expiry < Date.now()) {
         return resp.send({ message: "Verification link has expired" });
      }





      //  Hash password
      const hashedPassword = await bcrypt.hash(temp.password, 10);

      //  Move user to final User collection
      const newUser = await User.create({
         name: temp.name,
         email: temp.email,
         password: hashedPassword
      });

      //  Delete temp user entry
      await TempUser.deleteOne({ token });

      delete newUser.password;

      //  Create token
      jwt.sign({ user: newUser }, jwtkey, { expiresIn: "1h" }, (err, authToken) => {
         if (err) {
            return resp.send({ message: "Error generating token" });
         }
         resp.send({ user: newUser, auth: authToken });
      });

   } catch (err) {
      console.log("Register API Error:", err);
      resp.status(500).send({ message: "Internal Server Error" });
   }
});






// login api

app.post('/login', async (req, resp) => {

   try {


      const { email, password } = req.body;


      const existingUser = await User.findOne({ email });
      const ismatch = existingUser ? await bcrypt.compare(password, existingUser.password) : false;


      // if user does not exists or the password does not match
      if (!existingUser || !ismatch) {
         return resp.status(400).send({ message: "Incorrect Email or Password." });
      }



      const user = existingUser.toObject();
      delete user.password;

      if (user) {

         jwt.sign({ user }, jwtkey, { expiresIn: "1h" }, (err, token) => {

            if (err) {

               resp.send('something went wrong')
            }
            else {

               // if user exist send a token and user data to the client

               resp.send({ user, auth: token })
            }
         })




      }
      else {

         resp.send('no user found')
      }


   }
   catch (err) {

      console.log('error in login api:', err);

   }
});


app.delete('/deleteaccount', verifyToken, async (req, resp) => {

   try {
      const { email } = req.body;

      // First, find the user by email

      const user = await User.findOne({ email });

      if (!user) {
         return resp.status(404).json({ message: "User not found." });
      }


      // Delete all transactions associated with the user

      await Transaction.deleteMany({ userId: user._id });

      // Then, delete the user account

      await User.deleteOne({ email });

      resp.json({ message: "Account and associated transactions deleted successfully." });

   }
   catch (err) {
      console.log('Error in delete account API:', err);
      resp.status(500).json({ message: "Internal Server Error" });
   }

}
);




app.post("/transaction", verifyToken, async (req, res) => {
   try {
      const { title, amount, transactionType, category } = req.body;



      const transaction = new Transaction({
         userId: req.user._id,
         title,
         amount,
         transactionType,
         category
      });

      const saved = await transaction.save();
      res.json(saved);
   } catch (err) {
      console.error("Error adding transaction:", err);
      res.status(500).json({ message: "Server error" });
   }
});



// GET /transactions
app.get("/list", verifyToken, async (req, res) => {
   try {
      const transactions = await Transaction.find({ userId: req.user._id });

      res.json(transactions);
   } catch (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).json({ message: "Server error" });
   }
});



app.delete('/delete/:id', verifyToken, async (req, resp) => {

   // resp.send('api in progress...');
   const result = await Transaction.deleteOne({ _id: req.params.id })
   resp.send(result)


})


app.get('/income-sum', verifyToken, async (req, res) => {
   try {

      //  console.log("userId:", req.user._id);
      const idString = req.user._id.toString();
      // the use_id is first converted into string to ensure
      //  we have a plain string value
      const userId = new mongoose.Types.ObjectId(idString); //the string user_id is then converted 
      // back to objectId type. the new keyword plays a crucial role here. without it, the conversion fails.

      const result = await Transaction.aggregate([
         { $match: { userId: userId, transactionType: "income" } },
         { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);


      // mongodb aggregate query returns an array of documents as result
      res.json({ total: result[0]?.total || 0 });
   } catch (err) {
      res.status(500).json({ message: "error on the sever occure while aggregating income-sum" });
   }
});










app.get('/expense-sum', verifyToken, async (req, res) => {
   try {

      const idString = req.user._id.toString();
      const userId = new mongoose.Types.ObjectId(idString);
      const result = await Transaction.aggregate([
         { $match: { userId: userId, transactionType: "expense" } },
         { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      //"?." are the optional chaining operator to avoid error if state is undefined
      //         1. The Optional Chaining Operator (?.)
      // The expression result[0]?.total is the primary reason the code is safe:

      // Scenario 1: Success

      // If the MongoDB aggregation succeeds and returns an array with at least one element (e.g., result is [{ total: 1500 }]), the code checks result[0].

      // Since result[0] exists, it safely accesses and returns the value of the .total property (1500).

      // Scenario 2: Failure/No Data (The Safety Net)

      // If the aggregation fails to match any documents (e.g., the user has no income records), the query returns an empty array (result is []).

      // Without ?., attempting to access result[0].total would throw a TypeError: Cannot read properties of undefined because result[0] is undefined.

      // With ?., the optional chain detects that result[0] is undefined. It stops execution immediately and returns undefined instead of throwing an error.
      res.json({ total: result[0]?.total || 0 });
   } catch (err) {
      res.status(500).json({ message: "error on the sever occure while aggregating expense-sum" });
   }
});



app.get('/update/fetchdata/:id', verifyToken, async (req, resp) => {

   const result = await Transaction.findOne({ _id: req.params.id });
   resp.send(result);

})
app.put('/update/:id', verifyToken, async (req, resp) => {

   const result = await Transaction.updateOne({ _id: req.params.id }, { $set: req.body });
   resp.send(result);

})




// ... (previous code) ...

app.get('/search/:key', verifyToken, async (req, resp) => {
   try {
      const searchKey = req.params.key;

      //   console.log("Search key received:", searchKey);
      const queryConditions = [];


      queryConditions.push({ title: { $regex: searchKey, $options: 'i' } });
      queryConditions.push({ category: { $regex: searchKey, $options: 'i' } });
      queryConditions.push({ transactionType: { $regex: searchKey, $options: 'i' } });


      const searchAmount = parseFloat(searchKey);  // converting the searchkey 
      //  into floating number and if is a text string it will return NaN.
      if (!isNaN(searchAmount)) {
         queryConditions.push({ amount: searchAmount });

      }



      const result = await Transaction.find({

         userId: req.user._id,
         "$or": queryConditions
      });

      if (result.length > 0) {

         //   result.select('-title');
         resp.json(result); // Using json instead of send for consistency
      } else {

         resp.json({ message: "No matching transactions found." });
      }
   } catch (error) {
      console.error('Error during search:', error); // Log the actual error for debugging
      // Send a 500 status code for server errors
      resp.status(500).json({ message: "Error while searching data.", error: error.message });
   }
});





function verifyToken(req, resp, next) {
   let token = req.headers['authorization'];
   if (token) {

      token = token.split(' ')[1];
      jwt.verify(token, jwtkey, (err, decoded) => {
         if (err) {
            return resp.status(401).send({ message: " your session has expired. please login again" });
         }

         req.user = decoded.user;  // attaching the decoded user to req so all protected API routes can 
                                 // know WHICH user is making the request and access their data securely.
         next();

      });
   }
   else {
      resp.status(403).send({ message: "please add token with header" });
   }

}













// ================= SERVER ================= //

// Use PORT from env (for deployment), fallback to 9000 for local dev
const PORT = process.env.PORT || 11000;

// Only listen when running locally, not when importing (Vercel uses exports)
if (process.env.NODE_ENV !== "production") {
   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app; // For Vercel