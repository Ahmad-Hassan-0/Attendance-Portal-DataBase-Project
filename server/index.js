// adding depedencies
const express = require('express')
const app = express();
const mysql = require('mysql')
const cors = require('cors')

app.use(express.json())
app.use(cors())

const port = 3000;

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


app.get('/dashboard', (req, res) => {
  const query = 'SELECT * FROM atten';
  db.query(query, (error, results) => {
    res.json(results);
    console.log(results)
  });
});


// connection.connect((err) => {
//   if (err) {
//       console.error('Error connecting to database:', err);
//       return;
//   }
//   console.log('Connected to MySQL database');
// });

// // Route to get table list
// app.get('/dashboard', (req, res) => {
//   const query = 'SELECT * FROM login';
//   connection.query(query, (error, results) => {
//       if (error) {
//           console.error('Error retrieving data from database:', error);
//           res.status(500).json({ error: 'Internal server error' });
//           return;
//       }
//       res.json(results);
//       console.log(results);
//   });
// });



app.listen(port, ()=> {
    console.log("listening");   
})