// app/Stats

//dependencies
import moment from 'moment'

//components
import { useState, useEffect } from 'react'
import ChartRevenue from '../components/charts/ChartRevenue'
import TableRevenue from '../components/tables/TableRevenue'

function Stats({tabs}) {

  //loading
  const [loading, setLoading] = useState()

  //tuned arrays///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //ORDERS
  const orders = tabs
  .filter(
    (tab) =>
      tab.item !== "CASH" &&
      tab.item !== "CHANGE" &&
      tab.item !== "CREDIT" &&
      tab.item !== "TIP"
  )
  .map((o) => {
    return {
      date: moment(o.createdAt)
        .subtract(2, "hours")
        .format("M/D/YYYY"),
      total: o.cost
    };
  });

  //PAYMENTS
  const payments = tabs
  .filter(
    (tab) =>
      tab.item === "CASH" || tab.item === "CHANGE" || tab.item === "CREDIT"
  )
  .map((o) => {
    return {
      date: moment(o.createdAt)
        .subtract(2, "hours")
        .format("M/D/YYYY"),
      total: o.cost
    };
  });

  const cashs = tabs
    .filter(
      (tab) =>
        tab.item === "CASH" || tab.item === "CHANGE"
    )  .map((o) => {
      return {
        date: moment(o.createdAt)
          .subtract(2, "hours")
          .format("M/D/YYYY"),
        total: o.cost
      };
    });

  const credits = tabs
  .filter(
    (tab) =>
      tab.item === "CREDIT"
  )  .map((o) => {
    return {
      date: moment(o.createdAt)
        .subtract(2, "hours")
        .format("M/D/YYYY"),
      total: o.cost
    };
  }); 

  //TIPS
  const tips = tabs
  .filter((tab) => tab.item === "TIP")
  .map((o) => {
    return {
      date: moment(o.createdAt)
        .subtract(2, "hours")
        .format("M/D/YYYY"),
      total: o.cost
    };
  });

  //CHART dates///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //attempting state based dates
    const [dayLeft, setDateLeft] = useState(new Date("July 1 2022 02:00"))
    const [dayRight, setDateRight] = useState(new Date())
    const upDateLeft = () => {
      setDateLeft(document.getElementById('dayLeft').value)
          }
    const upDateRight = () => {
      setDateRight(document.getElementById('dayRight').value)
    }

  let balance = payments
    .filter((tab) => moment(tab.date) <= moment(dayLeft).subtract(2,'hours'))
    .reduce((x, y) => (x = x + y.total), 0)
    + orders
    .filter((tab) => moment(tab.date) <= moment(dayLeft).subtract(2,'hours'))
    .reduce((x, y) => (x = x + y.total), 0)

  //THE LOOP (X = DAYS)////AND ARRAYS////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let day = moment(dayLeft).subtract(2,'hours');
  let data = new Array();
  let dataR = new Array();

  while (day <= moment(dayRight)) {
    var order = orders
    .filter((tab) => tab.date === day.format('M/D/YYYY'))
    .reduce((x, y) => (x = x + y.total), 0)
    var cash = -cashs
    .filter((tab) => tab.date === day.format('M/D/YYYY'))
    .reduce((x, y) => (x = x + y.total), 0)
    var credit = -credits
    .filter((tab) => tab.date === day.format('M/D/YYYY'))
    .reduce((x, y) => (x = x + y.total), 0)
    var tip = -tips
    .filter((tab) => tab.date === day.format('M/D/YYYY'))
    .reduce((x, y) => (x = x + y.total), 0)

    data.push({
      date: day.format('M/D'),
      orders: order,
      cash: cash,
      credit: credit,
      tips: tip,
      balance: balance,
    });
    balance = balance - ( cash + credit ) + order
    day = day.add(1, "days");
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Array reversal for chart
  dataR = data.slice().sort((a,b) => a.date - b.date)

  useEffect(() => {
    if(!data.length) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  },[data,dayLeft,dayRight])

  return (

      <div className="container">
        <div className="col1">
          <h2>Stats</h2>
        </div>
        <div className="col1">
          <div className='col2'>
            <div style={{float:'left'}}><input 
              type='date' 
              id='dayLeft' 
              onChange={upDateLeft}/>
            
          </div>
          <div style={{float:'right'}}><input 
            type='date' 
            id='dayRight' 
            onChange={upDateRight}/>
          </div>
        </div>
        <div style={{margin:'auto'}}>
          <ChartRevenue data={dataR}/>
          <br/>
          <hr style={{width:'50vw', borderTop:'1px solid lightgrey'}}/>
          <br/>
        </div> 
        <div style={{display:'flex',justifyContent:'center', margin:'auto'}}>
          <TableRevenue data={data}/>
        </div>         
          
        </div>
      </div>

  )
}

export default Stats
