var express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// Create connection to database
var config = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa', 
            password: 'SAkomutel1'
        }
    },
    options: {
        database: 'db',
        port: 50219
    }
}
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected');
    }
});
var app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//**************************************************** FUNCTIONS ****************************************************************** */
//********************************************************************************************************************************* */

function processSQLRequest(SQL, onRowCb, onEndCb, onErrorCb, params) {

    SQL = SQL ? SQL : "";
    onRowCb = onRowCb ? onRowCb : function () { };
    onEndCb = onEndCb ? onEndCb : function () { };
    onErrorCb = onErrorCb ? onErrorCb : function () { };

    request = new Request(SQL, (err, results) => {
        if (err) throw onErrorCb(err);
       //res.send({ users: results });
    });

    request.on('row', function (columns) {
        let result = {};
        columns.forEach(function (column) {
            result[column.metadata.colName] = column;
        });

        onRowCb(result)
    });

    request.on('requestCompleted', function () {
        onEndCb();
    })
    request.on('error', function (err) {
        console.log(err);
        
     });

    if (params && Array.isArray(params)) {

        params.forEach(function (param) {

            if (param && param.name && param.type && param.value) {
                request.addParameter(param.name, param.type, param.value)
            }
        })
    }
    // Execute SQL statement
    connection.execSql(request);

}


/************************************************** Select All User Function************************************************* */

app.get('/getUsers', (req, res) => {

    let sql = 'SELECT * FROM users';
    let result = [];
    processSQLRequest(sql, function (row) {
        result.push({
            id: row['id'].value,
            firstname: row['firstname'].value,
            lastname: row['lastname'].value,
        })

    }, function () {
        res.send({ result: result })
    }, function (err) {
        console.log("ERR = ", err)
    })
});


/************************************************** Delete User Function******************************************************** */

app.get('/deleteUser/:id', (req, res) => {

    let sql = "DELETE FROM users WHERE id = @id "
    let params = [
        { name: "id", type: TYPES.Int, value: req.params.id },
    ]

    processSQLRequest(sql,function (){}, function () {
        res.send(200)
    }, function () {}, params)

});

/**************************************************Insert User Function******************************************************** */

app.post('/adduser', (req, res) => {
    var user = {};
    let sql = "INSERT INTO users (firstname , lastname) VALUES (@firstname , @lastname) " 
            +  "select * from users where id = SCOPE_IDENTITY()"
    let params = [
        { name: "firstname", type: TYPES.VarChar, value: req.body.firstname },
        { name: "lastname", type: TYPES.VarChar, value: req.body.lastname }
    ]
    processSQLRequest(sql, function(row) {
        user['firstname'] = row['firstname'].value;
        user['id'] = row['id'].value;
        user['lastname'] = row['lastname'].value;
    }, function () {
        res.send({user : user})
    },function () {}, params)
});


/********************************************************Update User Function*************************************************** */

app.post('/updateUser/:id', (req, res) => {

    let sql = "UPDATE users SET firstname= @firstname , lastname=  @lastname WHERE id = @id";
            
    let params = [
        { name: "id", type: TYPES.Int, value: req.params.id },
        { name: "firstname", type: TYPES.VarChar, value: req.body.firstname },
        { name: "lastname", type: TYPES.VarChar, value: req.body.lastname }
    ]
    processSQLRequest(sql, function () {},function () {
        res.send(200)
    }, function () {},params)

});
/***************************************************Select Single User Function**************************************************** */

app.get('/getUser/:id', (req, res) => {
   
    let sql = "SELECT * FROM users WHERE id = @id";
    let params = [
        { name: "id", type: TYPES.Int, value: req.params.id },
    ]
    let result;
    processSQLRequest(sql, function (row) {
        result = {
            id: row['id'].value,
            firstname: row['firstname'].value,
            lastname: row['lastname'].value,
        }

    }, function () {
        res.send({ result: result })
    }, function (err) {
       
    }, params
    )
});
/**************************************************************************************************************** */
/**************************************************************************************************************** */
app.listen(3300, (err => {
    if (err) throw err;
    console.log('server is running on port 3300')
}))