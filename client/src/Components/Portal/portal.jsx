import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './portal.css';
import PropTypes from 'prop-types';
import LoginPage from '../Login/login.jsx';


const Portal = () => {

  const [expansions, setExpansions] = useState([]);

  /////////////////////////////
  //const [requestStatusVar, setReqStatusVar] = useState('');

  const ReqStatusRenderer = ({ value }) => {
    let dotClass;
    //setReqStatusVar(value)
    //console.log(value)
    if (value === 'none') {
      dotClass = 'none-grey-dot';
    } else if (value === 'Live') {
      dotClass = 'live-blue-dot';
    } else if (value === 'Approved') {
      dotClass = 'accepted-green-dot';
    } else if (value === 'Rejected') {
      dotClass = 'rejected-red-dot';
    } else {
      dotClass = 'grey-dot';
    }
    return <span className={`dot ${dotClass}`}></span>;
  };

  var course_id = sessionStorage.getItem('CourseId');
  course_id = "CSE101";
  var type = sessionStorage.getItem('type'); // makeup or regular
  type = "Regular"
 // const course_id = sessionStorage.getItem('CourseId');

  ////////////////////////////////////////

  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    { headerName: 'Name', field: 'stu_name', headerCheckboxSelection: true, checkboxSelection: true },
    { headerName: 'Status', field: 'requestStatus', cellRenderer: StatusRenderer },
    { headerName: 'Registration ID', field: 'stuRegIds' },
    { headerName: 'Attendance%', field: 'attendance_percentage',
    cellStyle: params => {
      if (params.value == 100) {
        return { color: 'green' };
      } else if (params.value <= 75) {
        return { color: 'red' };
      } else {
        return { color: 'black' };
      }
    }
   ,cellRenderer: p => <> {p.value}<span style={{ color: 'rgb(184, 184, 184)' }}>%</span>
   </> },
    { headerName: 'Semester', field: 'semester',flex: 0.9, cellRenderer: semesterRendere },
    { headerName: 'Request Status', field: 'requestStatus', cellRenderer: ReqStatusRenderer },
    { headerName: "LeaveId", field: "leave_id", hide: true,suppressToolPanel: true
   }
  ]);

  const gridRef = useRef();

  ///////////////////////////////////
  
  const exportTableAsJson = () => {

    const exportData = [];
  
    const th_regId = sessionStorage.getItem('LoggedUserId');
  
    const datetime = new Date();
    const date = datetime.toISOString().slice(0, 10);
    const time = datetime.toISOString().slice(11, 19);
  
    gridRef.current.api.forEachNode(node => {
      const isSelected = node.isSelected() ? 'Present' : 'Absent';
      const rowData = node.data;
  
        const { requestStatus, stuRegIds, leave_id } = rowData;
  
      const rowDataWithVariables = {course_id, th_regId, isSelected, date, time, type, stuRegIds, leave_id
      };
  
      exportData.push(rowDataWithVariables);
    });
  
    // Make a POST request to the server
    fetch('http://localhost:3000/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: exportData })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to upload JSON data');
      }
      // Handle successful response
      console.log('JSON data uploaded successfully');
      thing();
    })
    .catch(error => {
      console.error('Error uploading JSON data:', error);
    });
  };
  
  ///////////////////////////////////

  useEffect(() => {
    console.log('Fetching column from server');
    fetch('http://localhost:3000/dashboard/nothing')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setExpansions(data); // Update the expansions state with the fetched data
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  ///////////////////////////////////

  const thing = useCallback(() => {
    window.alert("Attendance Marked");
  }, []);

/////////////////////////////////////


  const defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    filter: true,
    lockPosition: true,
    headerCheckboxSelectionFilteredOnly: true
  };

  useEffect(() => {
    console.log('Fetching table list from server');
    fetch('http://localhost:3000/dashboard/getStudents')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => setRowData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const onRowSelected = useCallback(
    (event) => {
      window.alert(
        'row ' +
        event.node.data.Name +
        ' selected = ' +
        event.node.isSelected(),
      );
    },
    [],
  );

  const onCellValueChanged = useCallback(
    (event) => {
      console.log(event); // access the entire event object
      console.log(event.data.Name); // access and print the updated row data
    },
    [],
  );

  return (
    <div className="ag-theme-quartz">
      <AgGridReact
       ref={gridRef}
       rowSelection="multiple"
        defaultColDef={defaultColDef}
        columnDefs={colDefs}
        rowData={rowData}
        suppressRowClickSelection="true"
     //   onRowSelected={onRowSelected}
   //     onCellValueChanged={onCellValueChanged}
      />


      <div>
      <button onClick={exportTableAsJson}>Mark Attendance</button>
      </div>


     <h1>Expansions</h1>
     <select name="Expsn">
    <option value="All">Select Course</option>
      {expansions.map(expansion => (
        <option key={expansion.Name} value={expansion.Name}>{expansion.Name}</option>
      ))} 
    </select>


    </div>

    
  );

};

const StatusRenderer = ({ value }) => {
  // Custom logic for rendering status
  return <span>{}</span>;
};

const semesterRendere = ({ value }) => {
  var temp = "WTF";

  if(value === 1) temp = "I";
  else if(value == 2) temp = "II";
  else if(value == 3) temp = "III";
  else if(value == 4) temp = "IV";
  else if(value == 5) temp = "V";
  else if(value == 6) temp = "VI";
  else if(value == 7) temp = "VII";
  else if(value == 8) temp = "VIII";
  return <span>{temp}</span>;
};

Portal.propTypes = {
  // Define PropTypes if needed
};

StatusRenderer.propTypes = {
  value: PropTypes.string.isRequired,
};


export default Portal;