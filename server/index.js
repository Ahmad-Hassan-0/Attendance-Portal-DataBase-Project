// adding depedencies
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql')
const cors = require('cors')
const fs = require('fs');


app.use(express.json())
app.use(cors())
app.use(bodyParser.json());

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
    const setRegId = req.body.UserRegId

    const Values = [setRegId, setEmail, setUsername, setPassword]
    //SQL post method
    console.log(Values);

    const SQL = 'INSERT INTO login(th_regId, l_username, l_password, l_recmail) VALUES (?,?,?,?)'


    db.query(SQL, Values, (err, result)=>{
      if(err){
          res.send(err)
          console.log("warGaye")
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

  const SQL = 'SELECT th_regId FROM login WHERE l_username = ? && l_password = ?'

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

// send
app.get('/dashboard', (req, res) => {
  //const query = 'SELECT * FROM atten';
  
  const query1 = `
  SELECT 
  students.stu_name, 
  sub_query.IDs AS stuRegIds, 
  sub_query.attendance_percentage, 
  2026 - students.stu_batch AS semester, 
  sub_query.RQs AS requestStatus,
  sub_query.lids AS leave_id
FROM students
LEFT JOIN (
  SELECT 
      studentregisteredcourses.stu_regId AS IDs,
      (COALESCE(studentregisteredcourses.src_totalPresent, 0) / COALESCE(teacherregisteredcourses.trc_totalClassesTaken, 1)) * 100 AS attendance_percentage, 
      COALESCE(leave_application.request_status, 'No Request') AS RQs,
      COALESCE(leave_application.leave_id) AS lids
  FROM studentregisteredcourses
  INNER JOIN students ON studentregisteredcourses.stu_regId = students.stu_regId
  LEFT JOIN leave_application ON students.stu_regId = leave_application.stu_regId
      AND leave_application.leave_date = '2024-05-30'
  LEFT JOIN teacherregisteredcourses ON studentregisteredcourses.course_id = teacherregisteredcourses.course_id
      AND teacherregisteredcourses.th_regId = 'CS001'
      AND teacherregisteredcourses.course_id = 'CSE101'
  WHERE studentregisteredcourses.course_id = 'CSE101'
) AS sub_query ON students.stu_regId = sub_query.IDs
WHERE sub_query.IDs IS NOT NULL;
`;


  db.query(query1, (error, results) => {
    res.json(results);
    console.log("dataSEnt")
  });
});

///////////////////////////////////////

//into the Attendance table

app.post('/dashboard', (req, res) => {
  const data = req.body.data;
  console.log(data);
  if (!Array.isArray(data)) {
    return res.status(400).send('Invalid data format');
  }

  const query = `
    INSERT INTO attendance (course_id, th_regid, att_status, att_date, att_timerecorded, att_type, stu_regId, leave_id)
    VALUES ?`;

  const values = data.map(item => [
    item.course_id,
    item.th_regId,
    item.isSelected,
    item.date,
    item.time,
    item.type,
    item.stuRegIds,
    item.leave_id
  ]);

  db.query(query, [values], (error, results) => {
    if (error) {
      console.error('Error inserting data into the database:', error);
      return res.status(500).send('Error inserting data into the database');
    }
    res.send('Data inserted successfully');
  });
});

//////////////////////////////

// app.post('/dashboard', (req,res) =>{
    
//   console.log(req.body);


// }
// )

app.listen(port, ()=> {
    console.log("listening");   
})