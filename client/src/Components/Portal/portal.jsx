
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './portal.css';
import PropTypes from 'prop-types';
import LoginPage from '../Login/login.jsx';



const Portal = () => {

  //
  var course_id = sessionStorage.getItem('CourseId');
  course_id = "CSE101";
  var type = sessionStorage.getItem('type'); // makeup or regular
  type = "Regular"
 // const course_id = sessionStorage.getItem('CourseId');
  //
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    { headerName: 'Name', field: 'stu_name', headerCheckboxSelection: true, checkboxSelection: true },
    { headerName: 'Status', field: 'requestStatus', cellRenderer: StatusRenderer },
    { headerName: 'Registration ID', field: 'stuRegIds' },
    { headerName: 'Attendance', field: 'attendance_percentage', cellStyle: getPercentageCellStyle, cellRenderer: PercentageRenderer },
    { headerName: 'Semester', field: 'semester' },
    { headerName: 'Request Status', field: 'requestStatus', cellRenderer: ReqStatusRenderer },
    { headerName: "LeaveId", field: "leave_id", hide: true,suppressToolPanel: true
   }
  ]);

  const gridRef = useRef();

  // const exportTableAsCsv = () => {
  //   const selectedRows = gridRef.current.api.getSelectedRows();
  //   gridRef.current.api.exportDataAsCsv({ allColumns: true, onlySelected: true, skipHeader: false, fileName: 'export.csv' });
  // };

  /*
  // Method to download CSV
  const exportTableAsCsv = () => {
    // Create a new array to store the data for exporting
    const exportData = [];

    // const columnHeaders = gridRef.current.api.getColumnDefs().map(col => col.headerName);
    // exportData.push(columnHeaders);

    gridRef.current.api.forEachNode(node => {

      const isSelected = node.isSelected() ? 1 : 0;
      
      const th_regId = sessionStorage.getItem('LoggedUserId');
      console.log(th_regId);
      // Get the data for the current row
      const rowData = node.data;
      
      // Add a new property to the row data indicating the selection status
      const rowDataWithSelection = { ...rowData, isSelected , th_regId };
      
      // Add the modified row data to the export data array
      exportData.push(rowDataWithSelection);
    });
  
    // Convert exportData to CSV format
    const csvData = exportData.map(row => Object.values(row).join(',')).join('\n');
    
    // Create a hidden anchor element to trigger the download
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'export.csv';
    hiddenElement.click();
  };
  */
  //////////////////////////////
  
 const exportTableAsCsv = () => {
   // Create a new array to store the data for exporting
   const exportData = [];

   // const columnHeaders = gridRef.current.api.getColumnDefs().map(col => col.headerName);
   // exportData.push(columnHeaders);
   const th_regId = sessionStorage.getItem('LoggedUserId');

   var datetime = new Date();
   //console.log(datetime);
   var date = datetime.toISOString().slice(0,10);
   var time = datetime.toISOString().slice(11,19);


   gridRef.current.api.forEachNode(node => {
      const isSelected = node.isSelected() ? 1 : 0;
      const rowData = node.data;
      const rowDataWithSelection = { ...rowData, isSelected, th_regId, date, time };
      exportData.push(rowDataWithSelection);
    });

    // Convert exportData to CSV format
    const csvData = exportData.map(row => Object.values(row).join(',')).join('\n');
    
    // Make a POST request to the server
    fetch('http://localhost:3000/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/csv'
      },
      body: csvData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to upload CSV data');
      }
      // Handle successful response
      console.log('CSV data uploaded successfully');
    })
    .catch(error => {
      // Handle error
      console.error('Error uploading CSV data:', error);
    });
  };
  

  /////////////////////////////////////////////////////

  const exportTableAsJson = () => {
    // Create a new array to store the data for exporting
    const exportData = [];
  
    // Get the logged user ID from session storage
    const th_regId = sessionStorage.getItem('LoggedUserId');
  
    // Get the current date and time
    const datetime = new Date();
    const date = datetime.toISOString().slice(0, 10);
    const time = datetime.toISOString().slice(11, 19);
  
    // Iterate over each row in the grid and collect the data

    gridRef.current.api.forEachNode(node => {
      const isSelected = node.isSelected() ? 'Present' : 'Absent';
      const rowData = node.data;
  
      // Specify only the desired fields from rowData
      const { requestStatus, stuRegIds, leave_id } = rowData;
  
      // Create an object with selected variables
      const rowDataWithVariables = {
        course_id,
        th_regId,
        isSelected,
        date,
        time,
        type,
        stuRegIds,
        leave_id
      };
  
      exportData.push(rowDataWithVariables);
    });
  
    // Make a POST request to the server
    fetch('http://localhost:3000/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: exportData }) // Wrap the data in an object
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to upload JSON data');
      }
      // Handle successful response
      console.log('JSON data uploaded successfully');
    })
    .catch(error => {
      // Handle error
      console.error('Error uploading JSON data:', error);
    });
  };
  


///////////////////////////////////////////////////////
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
    fetch('http://localhost:3000/dashboard')
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
      <button onClick={exportTableAsCsv}>Export as CSV</button>
      <button onClick={exportTableAsJson}>exportTableAsJson</button>
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
    </div>
  );
};

const StatusRenderer = ({ value }) => {
  // Custom logic for rendering status
  return <span>{value}</span>;
};

const ReqStatusRenderer = ({ value }) => {
  // Custom logic for rendering request status
  return <span>{value}</span>;
};

const PercentageRenderer = ({ value }) => {
  // Custom logic for rendering percentage
  return <span>{value}</span>;
};

const getPercentageCellStyle = (params) => {
  // Custom cell style logic for percentage column
  return {
    color: params.value === 100 ? 'green' : params.value <= 75 ? 'red' : 'black',
  };
};

Portal.propTypes = {
  // Define PropTypes if needed
};

StatusRenderer.propTypes = {
  value: PropTypes.string.isRequired,
};

ReqStatusRenderer.propTypes = {
  value: PropTypes.string.isRequired,
};

PercentageRenderer.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Portal;