


const mongoose=require('mongoose')

const tempuserschema= new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    token: String,
   expiry: {
    type: Date,
    default: () => Date.now() + 10 * 60 * 1000,  // 10 minutes
    index: { expires: 0 } //TTL (time-to-live) index,  document is automatically removed after expiry
}

},{collection:'tempuser'});



const TempUser= mongoose.model('tempuser',tempuserschema);

console.log('tempuser schema defined successfuly');

module.exports= TempUser;