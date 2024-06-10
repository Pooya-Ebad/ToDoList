const { connectToMongodb } = require("../utils/connectionToMongodb");
const os = require("os")
const db =  new connectToMongodb().Get()

async function findTask(taskNumber){
    const inProgressCollection = await db.collection("in-progress")

    return new Promise(async(res,rej)=>{
         const result = await inProgressCollection.aggregate([

            {$match : {"number": taskNumber}},
            {$project : {_id : 0}}

        ]).toArray()
        res(result)        
    })
}
async function getInProgress(){
    const inProgressCollection = await db.collection("in-progress")

    return new Promise(async(res,rej)=>{
        const result = await inProgressCollection.aggregate([

            {$match : {}},
            {$project : {_id : 0}},
            {$sort : {"number": 1}}

        ]).toArray()
        res(result)
    })
}
async function getAllTasks(){
    const allUserCollection = await db.collection("allTasks")

    return new Promise(async(res,rej)=>{
        const result = await allUserCollection.aggregate([

            {$match : {}},
            {$project : {_id : 0}},
            {$sort : {"number": -1}}

        ]).toArray()
        res(result)
    })
}
async function newTask(ToDo){
    const inProgressCollection = await db.collection("in-progress")
    
    return new Promise(async(res,rej)=>{
        inProgressCollection.insertOne(ToDo)
        res("New task created.")
    })
}
async function deleteTask(taskNumber){  //delete the task and sort the number of documents after deleted document
    const inProgressCollection = await db.collection("in-progress")

    return new Promise(async(res,rej)=>{
        const deletedTask = await inProgressCollection.findOneAndDelete({"number" : taskNumber})
        const allTask = await getInProgress()

        for(task of allTask){           
            if(task.number > deletedTask.number){
                inProgressCollection.updateOne(

                    {"number":task.number},
                    {$set: {"number" : task.number -= 1}}

                )
            }
        }

    res("task deleted successfully.")
    })
}
async function updateTask(taskNumber,newTask){
    const inProgressCollection = await db.collection("in-progress")

    return new Promise(async(res,rej)=>{
        inProgressCollection.updateOne(

            {"number" : taskNumber},
            {$set : {...newTask}}
            
        )   
        res(`Task number ${taskNumber} updated.`)
    })
}
async function updateTaskState(taskNumber,taskState){ //change task state and move that to allTask collection
    const inProgressCollection = await db.collection("in-progress")
    const allUserCollection = await db.collection("allTasks")
    let number =0;
    let message;

    return new Promise(async(res,rej)=>{
        if(taskState == "done"){
            await inProgressCollection.updateOne({"number" : taskNumber},{
                $set : {
                    "state" : taskState,
                    "complete at" :new Date().toLocaleString()
                }
            })

            message = `congratulation ${os.hostname}.`;
        }else{

            await inProgressCollection.updateOne({"number" : taskNumber},{
                $set : {
                    "state" : taskState,
                    "canceled at" :new Date().toLocaleString()
                }
            })

            message = `task number ${taskNumber} canceled.`;
        }

        const task = await inProgressCollection.findOneAndDelete(
            {"number" : taskNumber},
            {projection : {number : 0, _id : 0}}
        )
        const allTasks = await getAllTasks()

        if(allTasks.length>0){
            number = allTasks[0].number
        }
        allUserCollection.insertOne({"number" : number+1 ,...task})

        res(message)
    })
}
const TaskModel = {
    getInProgress,
    newTask,
    updateTaskState,
    updateTask,
    findTask,
    getAllTasks,
    deleteTask
}
module.exports = TaskModel