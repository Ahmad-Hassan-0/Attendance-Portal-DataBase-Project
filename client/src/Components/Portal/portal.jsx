import {useState, useEffect} from 'react'
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import './portal.css'
import PropTypes from 'prop-types';
//import Axios from 'axios'

const portal = () => {
  
// if conditions
const StatusRenderer = ({ value }) => {
  let dotClass;
  if (value === 'none') {
    dotClass = 'none-grey-dot';
  } else if (value === 'Live') {
    dotClass = 'live-blue-dot';
  } else if (value === 'accepted') {
    dotClass = 'accepted-green-dot';
  } else if (value === 'rejected') {
    dotClass = 'rejected-red-dot';
  } else {
    dotClass = 'grey-dot';
  }
  return <span className={`dot ${dotClass}`}></span>;
};

StatusRenderer.propTypes = {
  value: PropTypes.string.isRequired
};


// defining the table rows and columns
const [rowData, setRowData] = useState([]);

const [colDefs, setColDefs] = useState([

  // column 1
  { headerName: "Name", field: "Name", 
    headerCheckboxSelection: true,
    checkboxSelection: true
},

  //column 2
  { headerName: "Status", field: "Status", 
  
  
  
  
  },
  
   //column 3
  { headerName: "Registration ID", field: "Reg_Id" },
  
  //column 4
  { headerName: "Attendance %", 
    field: "percentage", 
 //  valueFormatter: params => { return params.value.toLocaleString() + " %"; },
    flex: 1,
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
   </>
  },

  //column 5
  { headerName: "Semester", field: "semester"},
  
  //column 6
  { headerName: "Request Status",field: "reqStatus", cellRenderer: StatusRenderer
},
]);

// defuault column styling

const defaultColDef = {
    flex:1,
    resizable: false,
    editable: false,
    sortable: true,
    filter: true,
    lockPosition: true
  
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

        class="ag-theme-balham"
        gridReady="onGridReady($event)"
        selectionChanged="onSelectionChanged()"
        rowSelection="multiple"
   />
   
    </div>
  )
}

export default portal