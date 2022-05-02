import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./TableContainer";
import Dropdown from 'react-dropdown'
import DatePicker from "react-datepicker";
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import 'react-dropdown/style.css'
import "./App.css";
const options = [
  '10', '50', '100'
]
const HOST_URL = `http://localhost:3000`
let defaultPageSize = options[0]
let defaultDate = `stars:>0`
let startdate = new Date()
const defaultOption = options[0]
function App() {
  const [data, setData] = useState([]);


  useEffect(async () => {
    axios(`${HOST_URL}/api/github/repositories?q=stars:>0&sort=stars&per_page=` + defaultPageSize)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.log(err));

  }, []);

  function _onSelect(e) {
    defaultPageSize = e.value;
    restProvider()
  }
 
  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Full Name",
      accessor: "full_name",
    },
    {
      Header: "Language",
      accessor: "language",
    },
    {
      Header: "Created",
      accessor: "created_at",
      Cell: ({ cell: { value } }) =>
        value ? <a href={value}>{value}</a> : "-",
    },
    {
      Header: "Forks",
      accessor: "forks",
      Cell: ({ cell: { value } }) => value || "-",
    },
    {
      Header: "Open Issues",
      accessor: "open_issues",
      //Filter: SelectColumnFilter,
      disableFilters: true,
      filter: "includes",
    },
    {
      Header: "watchers",
      accessor: "watchers",
      // disable the filter for particular column
      disableFilters: true,
      Cell: ({ cell: { value } }) => value || "-",
    }
  ];


  function setStartDate(date) {
    console.log(date)
    startdate = new Date(date)
    defaultDate = `created:>${moment(date).format('YYYY-MM-DD')}`
    console.log(defaultDate)
    restProvider()
  }


  function restProvider() {
    console.log(defaultDate, defaultPageSize)
    axios(`${HOST_URL}/api/github/repositories?q=${defaultDate}&sort=stars&per_page=${defaultPageSize}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="App">
      <h1>
        <center>GIT HUB Public Repositories</center>
      </h1>
      <Row>
        <Col><b>Created Date :</b></Col>
        <Col><DatePicker selected={startdate} onChange={(date) => setStartDate(date)} /></Col>
        <Col><b>Page Size :</b></Col>
        <Col><Dropdown options={options} onChange={_onSelect} value={defaultOption} placeholder="Select an option" /></Col>
      </Row>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default App;
