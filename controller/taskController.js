const TaskModel = require("../model/task.model");
const errorHandler = require("./errorHandller");

async function findTaskByNumber(req,res){
    try {
        const taskNumber = parseInt(req.url.split("/")[2])
        const task = await TaskModel.findTask(taskNumber)
        
        if(task.length>0){
            res.writeHead(200,{'content-type': 'application/json'})
            res.write(JSON.stringify(task[0]))
            res.end()
        }else{throw error = "Not Found"}

    } catch (error) {
        errorHandler(res,error)
    }
}
async function inProgressTasks(req,res){
    try {
        const tasks = await TaskModel.getInProgress()

        res.writeHead(200,{'content-type': 'application/json'})
        res.write(`All available tasks : ${JSON.stringify(tasks)}`)
        res.end()
    } catch (error) {
        errorHandler(res,error)
    }
}
async function allTasks(req,res){
    try {
        const tasks = await TaskModel.getAllTasks()

        res.writeHead(200,{'content-type': 'application/json'})
        res.write(`All available tasks : ${JSON.stringify(tasks)}`)
        res.end()
    } catch (error) {
        errorHandler(res,error)
    }
}
async function createTask(req,res){
    try {
        let body ="";

        req.on('data',(chunk)=>{
            body+= chunk
        })
        req.on('end',async ()=>{
            const allTask = await TaskModel.getInProgress()
            let lastNumber = 0

            if(allTask.length >0){
                lastNumber = allTask[(allTask.length)-1].number
            }
            const task = { "number": lastNumber+1, "state" : "in-progress" , ...JSON.parse(body) }
            const newTask = await TaskModel.newTask(task) 
            res.writeHead(201,{'Content-Type' : 'text/plain'})
            res.write(JSON.stringify(newTask))
            res.end()
        })
        
    } catch (error) {
        errorHandler(res,error)
    }
}
async function updateTask(req,res){
    try {
        let body ="";

        req.on('data',(chunk)=>{
            body+= chunk
        })
        req.on('end',async ()=>{
            const task = {...JSON.parse(body)}
            const taskNumber = parseInt(req.url.split("/")[2])
            const checkExist = await TaskModel.findTask(taskNumber);
            
            if(checkExist.length>0){
                if(task.state || task.number){
                   return errorHandler(res,"you cant cheng the value of state and number")
                }
                const newTask = await TaskModel.updateTask(taskNumber,task) 

                res.writeHead(201,{'Content-Type' : 'text/plain'})
                res.write(JSON.stringify(newTask))
                res.end()

            }else {errorHandler(res,"Not Found")}
        })
        
    }catch (error) {
        console.log(error);
    }
}
async function updateState(req,res){
    try { 
        let body ="";

        req.on('data',(chunk)=>{
            body+= chunk
        })
        req.on('end',async ()=>{
            const {number,state} = {...JSON.parse(body)}
            const checkExist = await TaskModel.findTask(number)
            
            if(checkExist.length>0){
                if(!(state == "done" || state == "cancel")){
                    return errorHandler(res,"state is not correct")
                }
                const result = await TaskModel.updateTaskState(number,state)
                res.writeHead(201,{'Content-Type' : 'text/plain'})
                res.write(JSON.stringify(result))
                res.end()
            }else {errorHandler(res,"task Not Found")}
            })

    }catch (err) {
        console.log(err);
    }
}
async function deleteTaskByNumber(req,res){
    try {
        const taskNumber = parseInt(req.url.split("/")[2])
        const task = await TaskModel.findTask(taskNumber)
        if(task.length>0){
            const result = await TaskModel.deleteTask(taskNumber)
            res.writeHead(200,{'content-type': 'text/plain'})
            res.write(result)
            res.end()
        }else{throw error = "Not Found"}
    } catch (error) {
        errorHandler(res,error)
    }
}
const taskController = {
    createTask,
    inProgressTasks,
    updateTask,
    findTaskByNumber,
    updateState,
    allTasks,
    deleteTaskByNumber
}
module.exports = taskController
