import {useState, useEffect} from 'react'
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import './portal.css'
import PropTypes from 'prop-types';
import Axios from 'axios'

const portal = () => {
  
// if conditions
const CompanyLogoRenderer = ({ value }) => {
  let dotClass;
  if (value === 'none') {
    dotClass = 'none-grey-dot';
  } else if (value === 'Live') {
    dotClass = 'live-blue-dot';
  } else if (value === 'accepted') {
    dotClass = 'accepted-green-dot';
  } else if (value === 'Rejected') {
    dotClass = 'rejected-red-dot';
  } else {
    dotClass = 'grey-dot';
  }
  return <span className={`dot ${dotClass}`}></span>;
};

CompanyLogoRenderer.propTypes = {
  value: PropTypes.string.isRequired
};


// defining the table rows and columns
const [rowData, setRowData] = useState([]);

const [colDefs, setColDefs] = useState([

  { headerName: "Name", field: "Name", flex: 1, headerCheckboxSelection: true,
  checkboxSelection: true,
   suppressMenu: true,
   suppressSorting: true
},

  { headerName: "Status", field: "Status", filter:true, flex: 1 },
  
  { headerName: "Registration ID", field: "Reg_Id", filter:true, flex: 1 },
  
  { headerName: "Attendance %", 
    field: "percentage", 
 //  valueFormatter: params => { return params.value.toLocaleString() + " %"; },
    flex: 1,
    cellStyle: params => {
      if (params.value == 8) {
        return { color: 'green' };
      } else if (params.value <= 15) {
        return { color: 'red' };
      } else {
        return { color: 'black' };
      }
    }
   ,cellRenderer: p => <> {p.value}<span style={{ color: 'rgb(184, 184, 184)' }}>%</span>
   </>
  },

  { headerName: "Semester", field: "semester" , flex: 1},
  { headerName: "Request Status",field: "reqStatus", flex: 1, cellRenderer: CompanyLogoRenderer
},
]);

// defuault column styling

const defaultColDef = {
    flex:1,
    resizable: false,
    editable: false
};

// getting the data from the server
useEffect(() => {
  console.log('Fetching table list from server');
  fetch('http://localhost:3000/dashboard')
    .then(result => result.json())
    //.then(rowData => console.log(rowData)); // Update state of `rowData`
    .then(rowData => setRowData(rowData));
 }, [])

  return (
    <div className="ag-theme-quartz" >

   <AgGridReact
        defaultColDef={defaultColDef}
        columnDefs={colDefs}
        rowData={rowData}
        //pagination={true}
   />
   
    </div>
  )
}

export default portal