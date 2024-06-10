const http = require("http");
const taskController = require("./controller/taskController");
const PORT = 3000
http.createServer((req,res)=>{

    const {url , method} = req;
    if(url == "/tasks/inprogress" && method == "GET"){      //you can see all your in-progress tasks
        taskController.inProgressTasks(req,res)

    }else if(url == "/tasks/allTasks" && method == "GET"){      //history of tasks
        taskController.allTasks(req,res)
        
    }else if(url == "/uploadTask" && method == "POST"){     //upload task by json 
        taskController.createTask(req,res)

    }else if(url.match(/\/updateTask\/[0-9]/)&& method == "POST"){     //update task by json
        taskController.updateTask(req,res)  
    }else if(url.match(/\/tasks\/[0-9]/)&& method == "GET"){    //you find your task
        taskController.findTaskByNumber(req,res)
    }else if(url.match(/\/tasks\/[0-9]/)&& method == "DELETE"){      
        taskController.deleteTaskByNumber(req,res)

    }else if(url == "/updateState" && method == "POST"){  //if you complete your task or you want to cancel one of your tasks you can do that with give number and state of your task in json
        taskController.updateState(req,res)
    }
}).listen(PORT,console.log(`server run on:http://localhost:${PORT}`))