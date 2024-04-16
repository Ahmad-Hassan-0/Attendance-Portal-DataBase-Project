import {useState} from 'react'
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import './portal.css'

const portal = () => {

//  const [thing, thingsetter] = useState("");

const [rowData, setRowData] = useState([
  { make: "Tesla", model: "Model Y", price: 64950, electric: true },
  { make: "Ford", model: "F-Series", price: 33850, electric: false },
  { make: "Toyota", model: "Corolla", price: 29600, electric: false },
]);

// Column Definitions: Defines the columns to be displayed.
const [colDefs, setColDefs] = useState([
  { field: "make" },
  { field: "model" },
  { field: "price" },
  { field: "electric" }
]);

const rowClassRules = {
    // apply red to Ford cars
    'rag-red': params => params.data.make === 'Ford',
};

  return (
    <div className="ag-theme-quartz" >

   <AgGridReact
       rowData={rowData}
       columnDefs={colDefs}
       rowClassRules={rowClassRules}
   />

    </div>
  )
}

export default portal