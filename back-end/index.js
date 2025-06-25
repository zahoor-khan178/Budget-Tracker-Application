
require('./model/dbconnection');
const Transaction=require('./model/transaction')
const express = require('express');
const cors=require('cors');
const transaction = require('./model/transaction');


const app=express();

app.use(express.json());  // parse the incoming data into javaScript object form














app.use(cors());






app.post('/transaction', async (req, resp) => {
    try {
        
       const newtransaction = new Transaction(req.body);
       let result = await newtransaction.save();


       result = result.toObject();
        resp.send(result);
 
    } catch (error) {       
     console.log('Error in transaction API:',error);    
 }
 
 });


 app.get('/list', async (req, resp) => {

    const products = await Transaction.find()
    if (products.length > 0) {
 
       resp.send(products);
    } else {
 
       resp.send({ result: "no record found" })
    }
 })


 app.delete('/delete/:id', async (req, resp) => {

    // resp.send('api in progress...');
    const result = await Transaction.deleteOne({ _id: req.params.id })
    resp.send(result)
 
 
 })


 app.get('/income-sum', async (req, res) => {
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









  app.get('/expense-sum', async (req, res) => {
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
  



















app.listen((11000),async =>{

    try{

        console.log("server is running on port 11000")
    }
    catch{

        console.log("server is not started")

    }
});