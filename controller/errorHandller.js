async function errorHandler(res,err){
    res.writeHead(404,{'content-type': 'application/json'})
    res.write(JSON.stringify({"Error Message": err}))
    res.end()
}
module.exports = errorHandler