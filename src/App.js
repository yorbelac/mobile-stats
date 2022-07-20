// APP

//dependencies
import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

//components
import Navbar from "./components/Navbar";
import Stats from "./pages/Stats";
import Menu from "./pages/Menu";
import Customers from "./pages/Customers";
import Loading from './components/Loading'

// CORS enabled now using URLS and fetch but here still are the placeholders to the static data.
const TABS_URL = 'https://tabsbp.herokuapp.com/api/tabs'
const MENU_URL = 'https://tabsbp.herokuapp.com/api/menu'
const CUST_URL = 'https://tabsbp.herokuapp.com/api/customers'

export default function App() {

  const [loaded, setLoaded] = useState(false)
  const [customers, setCustomers] = useState([])
  const [tabs, setTabs] = useState([])
  const [menu, setMenu] = useState([])

  const [tabStats, setTabStats] = useState([])

  const config = {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ5NzQ0ZmVhNTIxYjRjMGYwYjgzZCIsImlhdCI6MTY1NzkxMzEwOCwiZXhwIjoxNjYwNTA1MTA4fQ.YHK8l-G880-dvcg-A0nGaNdsWbfwxOBFKMZcrRDrH5w'
    }
  }

  const loading = (x) => {
    setLoaded(x)
  }

  async function getData() {
    try {
      await axios.get(CUST_URL,config).then(res => setCustomers(res.data));
      await axios.get(MENU_URL,config).then(res => setMenu(res.data));
      await axios.get(TABS_URL,config).then(res => setTabs(res.data));
    } catch (error) {
      console.log('Fetching failed.')
    }
  }  

  //useEffect for fetchData
  useEffect(() => {
    getData()
  },[])

  //this useEffect watches tabs and generates arrays for the other pages.
  useEffect(() => {

    //generate statsTabs
    setTabStats(tabs.filter((tab) => 
      !isNaN(tab.cost)
      && tab.customer != ''
    ))

    if (tabStats.length === 0) {
      setLoaded(false)
    } else {
      setLoaded(true)
    }
    
  },[tabs])

  return (
    <>
    {/* <p>hello</p> */}
      <Router>
        <Navbar />
        {!loaded ? 
        <>
          <Loading/>
        </>
        :
        <>
          <Routes>
            <Route path='/' element={<Stats tabs={tabStats}/>} />
            <Route path="/stats" element={<Stats tabs={tabStats}/>}/>
            <Route path="/customers" element={<Customers />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </>  
        }

      </Router>
    </>
  );
}
