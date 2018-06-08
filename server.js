const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sq_techs'
});
connection.connect();


app.use(cors());


port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log('Express is listening on port', 8080);
});


app.post('/auth/login', (req, res)=>{
    var email = req.body.email;
    var password = req.body.password;
    if(!email || !password)
    {   
        res.json({response_message: 404});
        return;
    }
    var query = `SELECT * FROM users WHERE email = \'${email}\' AND password = \'${password}\'`;
    connection.query(query, function (error, results, fields) {
        if (error) res.json({response_message: 404});
        if(results)
        if(results.length == 0){
            res.json({response_message: 404}); return;
        } else
            res.json({response_message: 200}); return;
        
    });
})

app.post('/auth/signup', (req, res)=>{

    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    if(!email || !password || !name)
    {
        res.json({response_message: 404});
        return;
    }
    var query = `INSERT INTO users (name, email, password) VALUES (\'${name}\', \'${email}\', \'${password}\')`;
    connection.query(query, function (error, results, fields) {
        console.log(error);
        if (error) res.json({response_message: 404});
        res.json({response_message: 200});
    });
})


app.post('/character/get', (req, res)=>{
    var query = `SELECT * FROM characters`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        if(results)
        if(results.length >= 0)
        {
            res.json({characters: results});
            return;
        }
        res.json({response_message: 404});
    });
    
})

app.post('/character/new', (req, res)=>{

    var query = `INSERT INTO characters (id_table, name, email, sex, address) VALUES (\'${req.body.characterInfo.id}\', \'${req.body.characterInfo.name}\', \'${req.body.characterInfo.email}\', \'${req.body.characterInfo.sex}\', \'${req.body.characterInfo.address}\')`;

    connection.query(query, function (error, results, fields) {
        if (error) throw error;
    });
    res.json({response_message: 200});
})

app.post('/character/update', (req, res)=>{

    console.log(req.body.characterInfo);
    var query;
    if(req.body.characterInfo.id_table)
        query = `UPDATE characters SET name=\'${req.body.characterInfo.name}\', email=\'${req.body.characterInfo.email}\', sex=\'${req.body.characterInfo.sex}\', address=\'${req.body.characterInfo.address}\' WHERE id_table = ${req.body.characterInfo.id_table}`;
    else
    query = `UPDATE characters SET name=\'${req.body.characterInfo.name}\', email=\'${req.body.characterInfo.email}\', sex=\'${req.body.characterInfo.sex}\', address=\'${req.body.characterInfo.address}\' WHERE id_table = ${req.body.characterInfo.id}`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
    });
    res.json({response_message: 200});
})

app.post('/character/remove', (req, res)=>{
    var query = `DELETE FROM characters WHERE id = \'${req.body.id}\'`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
    });
    res.json({response_message: 200});
})