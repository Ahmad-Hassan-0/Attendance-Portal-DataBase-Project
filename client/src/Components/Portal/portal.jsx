
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './portal.css';
import PropTypes from 'prop-types';
import LoginPage from '../Login/login.jsx';



const Portal = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    { headerName: 'Name', field: 'Name', headerCheckboxSelection: true, checkboxSelection: true },
    { headerName: 'Status', field: 'Status', cellRenderer: StatusRenderer },
    { headerName: 'Registration ID', field: 'Reg_Id' },
    { headerName: 'Attendance', field: 'percentage', cellStyle: getPercentageCellStyle, cellRenderer: PercentageRenderer },
    { headerName: 'Semester', field: 'semester' },
    { headerName: 'Request Status', field: 'reqStatus', cellRenderer: ReqStatusRenderer },
  ]);

  const gridRef = useRef();

  // const exportTableAsCsv = () => {
  //   const selectedRows = gridRef.current.api.getSelectedRows();
  //   gridRef.current.api.exportDataAsCsv({ allColumns: true, onlySelected: true, skipHeader: false, fileName: 'export.csv' });
  // };

  // Method to download CSV
  /*
  const exportTableAsCsv = () => {
    // Create a new array to store the data for exporting
    const exportData = [];

    const columnHeaders = gridRef.current.api.getColumnDefs().map(col => col.headerName);
    exportData.push(columnHeaders);

  
    gridRef.current.api.forEachNode(node => {

      const isSelected = node.isSelected() ? 1 : 0;
  
      // Get the data for the current row
      const rowData = node.data;
  
      // Add a new property to the row data indicating the selection status
      const rowDataWithSelection = { ...rowData, isSelected };
  
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
  
  const exportTableAsCsv = () => {
    // Create a new array to store the data for exporting
    const exportData = [];
    console.log(LoginPage.current_th_regId)
    console.log("this is the new thing")
    // const columnHeaders = gridRef.current.api.getColumnDefs().map(col => col.headerName);
    // exportData.push(columnHeaders);

    gridRef.current.api.forEachNode(node => {
      const isSelected = node.isSelected() ? 1 : 0;
      const rowData = node.data;
      const rowDataWithSelection = { ...rowData, isSelected };
      exportData.push(rowDataWithSelection);
    });
  
    // Convert exportData to CSV format
    const csvData = exportData.map(row => Object.values(row).join(',')).join('\n');
  
    // // Make a POST request to the server
    // fetch('http://localhost:3000/dashboard', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'text/csv'
    //   },
    //   body: csvData
    // })
    // .then(response => {
    //   if (!response.ok) {
    //     throw new Error('Failed to upload CSV data');
    //   }
    //   // Handle successful response
    //   console.log('CSV data uploaded successfully');
    // })
    // .catch(error => {
    //   // Handle error
    //   console.error('Error uploading CSV data:', error);
    // });
  };


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