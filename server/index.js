// adding depedencies
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql')
const cors = require('cors')
const csv = require('csv-parser');
const fs = require('fs');


app.use(express.json())
app.use(cors())
app.use(bodyParser.text({ type: 'text/csv' }));

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
  const query = 'SELECT * FROM atten';
  
  const query1 = `
  SELECT 
  students.stu_name, 
  sub_query.IDs AS stuRegIds, 
  sub_query.attendance_percentage, 
  2026 - students.stu_batch AS semester, 
  sub_query.RQs AS requestStatus,
  lids AS leave_id
FROM students
LEFT JOIN (
  -- Subquery to get IDs, attendance_percentage, and RQs-- 
  SELECT 
      studentregisteredcourses.stu_regId AS IDs,
      (COALESCE(studentregisteredcourses.src_totalPresent, 0) / 24) * 100 AS attendance_percentage, 
      COALESCE(leave_application.request_status, 'No Request') AS RQs,
  COALESCE(leave_application.leave_id) AS lids
  FROM studentregisteredcourses
  INNER JOIN students ON studentregisteredcourses.stu_regId = students.stu_regId
  LEFT JOIN leave_application ON students.stu_regId = leave_application.stu_regId
      AND leave_application.leave_date = '2024-05-30'
  WHERE studentregisteredcourses.course_id = 'CSE101'
) AS sub_query ON students.stu_regId = sub_query.IDs
WHERE sub_query.IDs IS NOT NULL; -- Filter out students not enrolled in the course
`;


  db.query(query1, (error, results) => {
    res.json(results);
    console.log("dataSEnt")
  });
});

///////////////////////////////////////

//into the Attendance table
/*

app.post('/dashboard', (req, res) => {

  const csvData = req.body;
  const valuesArray = [];
  //console.log('Received CSV data:', csvData);

  const SQL = 'INSERT INTO attendance(att_id, course_id, th_regid, att_status, att_date, att_timerecorded, att_type, stu_regId) VALUES (?,?,?,?,?,?,?,?)'

  fs.createReadStream(csvData)
  .pipe(csv())
  .on('data', (row) => {
    // Extract values from the CSV row and push them into the values array
    const values = [
      row.att_id,
      row.course_id,
      row.att_status,
      row.att_date,
      row.att_timerecorded,
      row.att_type,
      row.stu_regId
    ];
    valuesArray.push(values);
  })
  .on('end', () => {
    // All data has been read from the CSV
    console.log('Values extracted from CSV:', valuesArray);
    // Here you can execute your SQL query using the valuesArray
    // For example:
    // db.query(SQL, [valuesArray], (err, result) => {
    //   if (err) throw err;
    //   console.log('Inserted rows:', result.affectedRows);
    // });
});

  res.send('CSV data received');

});
*/

app.post('/dashboard', (req,res) =>{
    
  console.log(req.body);
}
)


app.post('/dashboard', (req, res) => {
  // Initialize an array to store the selected columns from the CSV
  console.log(req.body);
  const valuesArray = [];

  // Read the CSV data from the request body
  const csvData = req.body;

  // Define the names of the columns you want to extract
  const selectedColumns = ['Name', 'Status', 'Reg_Id', 'percentage', 'semester', 'reqStatus']; // Use headerName instead of field

  // Parse the CSV data line by line
  csvData
    .pipe(csv())
    .on('data', (row) => {
      // Extract values from the CSV row for the selected columns
      const values = selectedColumns.map(column => row[column]); // Map to headerName
      valuesArray.push(values);
    })
    .on('end', () => {
      // All data has been read from the CSV
      console.log('Selected columns extracted from CSV:', valuesArray);
      // Here you can process the extracted values as needed
    });

  // Respond to the client
  res.send('Selected columns from CSV data received');
});




// app.post('/register', (req, res) => {
//   const setEmail = req.body.Email
//   const setUsername = req.body.UserName
//   const setPassword = req.body.Password

//   const Values = [setEmail, setUsername, setPassword]
//   //SQL post method

//   const SQL = 'INSERT INTO login (l_recEmail, l_username, l_password) VALUES (?,?,?)'


//   db.query(SQL, Values, (err, result)=>{

//     if(err){
//         res.send(err)
//     }
//     else{
//       console.log('User Added Successfully')
//       res.send({message: 'User Added'})
//     }
//   })
// }
// )


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