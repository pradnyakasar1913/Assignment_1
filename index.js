const express = require('express');
const tasksRouter = require('./routes/tasks')
const app = express();
const port = 3000;
app.use(express.json());

app.use("/tasks",tasksRouter)

app.listen(port,() => {
    console.log("server running on port",port);
}).on('error',(e) =>{
console.log(e)
})