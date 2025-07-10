
require('./model/dbconnection');
const User = require('./model/userschema');
const Transaction=require('./model/transaction')
const express = require('express');
const cors=require('cors');
// const transaction = require('./model/transaction');
const jwt=require('jsonwebtoken');
const jwtkey="BUDGET";



const app = express();
app.use(express.json());







app.use(cors());




app.post('/register', async (req, resp) => {
   try {
      const user = new User(req.body);
      let result = await user.save();
      result = result.toObject();
      delete result.password;

      
            jwt.sign({result},jwtkey,{expiresIn:"1h"},(err,token)=>{

               if(err){

                  resp.send('problem in token')
               }
               else{

                     resp.send({result,auth:token})
               }
            })


   } catch (error) {       
    console.log('Error in signup API:',error);    
}

});


app.post('/login', async (req, resp) => {

   try {

      if (req.body.email && req.body.password) {



         const user = await User.findOne(req.body).select('-password')
         if (user) {

            jwt.sign({user},jwtkey,{expiresIn:"1h"},(err,token)=>{

               if(err){

                  resp.send('something went wrong')
               }
               else{

                     resp.send({user,auth:token})
               }
            })

            

            
         }
         else {

            resp.send('no user found')
         }
      }
      else {

         resp.send('no user found')
      }

   }
   catch (err) {

      console.log('error in login api:', err);

   }
})





app.post('/transaction', verifyToken, async (req, resp) => {
    try {
        
       const newtransaction = new Transaction(req.body);
       let result = await newtransaction.save();


       result = result.toObject();
        resp.send(result);
 
    } catch (error) {       
     console.log('Error in transaction API:',error);    
 }
 
 });


 app.get('/list', verifyToken, async (req, resp) => {

    const products = await Transaction.find()
    if (products.length > 0) {
 
       resp.send(products);
    } else {
 
       resp.send({ result: "no record found in the list" })
    }
 })


 app.delete('/delete/:id', verifyToken, async (req, resp) => {

    // resp.send('api in progress...');
    const result = await Transaction.deleteOne({ _id: req.params.id })
    resp.send(result)
 
 
 })


 app.get('/income-sum', verifyToken, async (req, res) => {
    try {
      // Calculate the sum of all amounts where transactionType is 'income'
      const result = await Transaction.aggregate([
        { $match: { transactionType: 'income' } },  // Filter for 'income' transactions
        { $group: { _id: null, totalIncome: { $sum: '$amount' } } }  // Sum the amounts
      ]);
  
      // If there are income transactions, return the sum, else return 0
      if (result.length > 0) {
        res.json({ totalIncome: result[0].totalIncome });
      } else {
        res.json({ totalIncome: 0 });
      }
    } catch (error) {
      console.error("Error fetching total income:", error);
      res.status(500).json({ message: "Error calculating total income", error });
    }
  });









  app.get('/expense-sum', verifyToken, async (req, res) => {
    try {
      // Calculate the sum of all amounts where transactionType is 'expense'
      const result = await Transaction.aggregate([
        { $match: { transactionType: 'expense' } },  // Filter for 'expense' transactions
        { $group: { _id: null, totalExpense: { $sum: '$amount' } } }  // Sum the amounts
      ]);
  
      // If there are expense transactions, return the sum, else return 0
      if (result.length > 0) {
        res.json({ totalExpense: result[0].totalExpense });
      } else {
        res.json({ totalExpense: 0 });
      }
    } catch (error) {
      console.error("Error fetching total expense:", error);
      res.status(500).json({ message: "Error calculating total expense", error });
    }
  });
  

  app.get('/update/fetchdata/:id', verifyToken, async (req, resp)=>{

   const result= await Transaction.findOne({_id: req.params.id});
   resp.send(result);
   
})
  app.put('/update/:id', async (req, resp)=>{

   const result= await Transaction.updateOne({_id: req.params.id},{$set: req.body});
   resp.send(result);
   
})





function verifyToken(req, resp, next) {
   let token = req.headers['authorization'];
   if(token) {

      token = token.split(' ')[1]; 
      jwt.verify(token, jwtkey, (err, valid) => {
         if(err) {
            resp.status(401).send({ message: " your session has been expired. please login again" });
         } else {
            next();
         }
      });
   }
   else {
      resp.status(403).send({ message: "please add token with header" });
   }

}













app.listen((11000),async =>{

    try{

        console.log("server is running on port 11000")
    }
    catch{

        console.log("server is not started")

    }
});