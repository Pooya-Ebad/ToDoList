const { MongoClient } = require("mongodb")
class connectToMongodb { 
#DB_URL = "mongodb://127.0.0.1:27017/ToDoList"
    #db =  null
    #connect(){
        try {
            const client = new MongoClient(this.#DB_URL)
            this.#db = client.db()
            return this.#db
        } catch (error) {
            console.log(error.message);
        }
        
    }
    Get(){
        try {
            if(this.#db){
                console.log("connection already done");
                return this.#db
            }else{
                this.#db = this.#connect()
                return this.#db
            }        
        } catch (error) {
            console.log(error.message);
        }
    }
}
module.exports = {connectToMongodb}
