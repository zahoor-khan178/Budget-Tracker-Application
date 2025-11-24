


const mongoose=require('mongoose')

const Transactionschema= new mongoose.Schema({

     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title:{
              type:String,
              required:true,
          
    },
    amount:{
        type:Number,
        required:true,
        min: [0, 'Amount must be greater than 0'] 

},
category:{
    type:String,
   
},

transactionType: {
    type: String,
    required: true,
    // enum: ['income', 'expense'],  
    message: 'Transaction type must be either "income" or "expense"'  
},

},{collection:'Transaction'});

const transaction= mongoose.model('Transaction',Transactionschema);

console.log('schema defined successfuly');

module.exports= transaction;