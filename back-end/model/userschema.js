
const mongoose=require('mongoose')

const userschema= new mongoose.Schema({

    name:{
              type:String,
              required:true,
          
    },
    email:{
        type:String,
        required:true,

},
password:{
    type:String,
    required:true
},

},{collection:'user'});

const user= mongoose.model('user',userschema);

console.log('schema defined successfuly');

module.exports= user;