



const mongoose=require('mongoose');

const dbconnection=()=>{

mongoose.connect("mongodb+srv://zk:admin@cluster0.ofz7kpq.mongodb.net/Budget-Tracker-App")
.then(()=>{

    console.log('db connected successfuly.');
    
})
.catch(()=>{

    console.log('error while connecting to db.')
})
}

dbconnection();

