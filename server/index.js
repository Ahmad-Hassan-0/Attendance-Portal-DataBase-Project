// adding depedencies
const express = require('express')
const app = express();
const mysql = require('mysql')
const cors = require('cors')

app.use(express.json())
app.use(cors())
// running the server

const port = 3000;

// creating database

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'air_attendance_portal_byted',
})

app.get('/', 
  (req, res) => {
    res.send(' <h1> This is the server <h1>');
  } 
);


// for register
app.post('/register', (req, res) => {
    const setEmail = req.body.Email
    const setUsername = req.body.UserName
    const setPassword = req.body.Password

    //SQL post method

    const SQL = 'INSERT INTO login (l_recEmail, l_username, l_password) VALUES (?,?,?)'

    const Values = [setEmail, setUsername, setPassword]

    db.query(SQL, Values, (err, result)=>{
      if(err){
          res.send(err)
      }
      else{
        console.log('User Added Successfully')
        res.send({message: 'User Added'})
      }
    })
  }
)

app.post('/login', (req, res) => {

  const sentLoginUsername = req.body.LoginUserName
  const sentLoginPassword = req.body.LoginPassword

  //SQL post method

  const SQL = 'SELECT * FROM login WHERE l_username = ? && l_password = ?'

  const Values = [sentLoginUsername, sentLoginPassword]

  db.query(SQL, Values, (err, result)=>{
    if(err){
         res.send({error: err})
    }

    if(result.length > 0){
      res.send(result)
      console.log('user logged')
    }
     else{
      console.log('user not found')
       res.send({message: 'Credentials Dont Match'})
     }
  })
}
)


app.listen(port, ()=> {
    console.log("listening");   
})