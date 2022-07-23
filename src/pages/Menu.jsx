// app/Menu

//dependencies
import {useState, useEffect} from 'react'
import moment from 'moment'

//components
import ChartMenu from '../components/charts/ChartMenu'
import { tab } from '@testing-library/user-event/dist/tab'

function Menu({menu, tabs}) {

  //variables
  const [item, setItem] = useState('Hookah-10-')
  const changeItem = (item) => {
    setItem(item)
  }

  const orders = tabs.filter((tab) => 
       tab.item !== "CASH" 
    && tab.item !== "CREDIT" 
    && tab.item !== "TIP" 
    && tab.item !== "CHANGE" 
    && tab.item !== "Change" 
    && tab.item !== "ADJUSTMENT")
  const uniqueItems = [...new Set(orders.map((tab) => tab.item))]
  let popular = []
  for (let i = 0; i < uniqueItems.length; i++) {
    popular.push({
      item: uniqueItems[i], 
      count: orders.filter((tab) => uniqueItems[i] === tab.item).length, 
      revenue: orders.filter((tab) => uniqueItems[i] === tab.item).length * tabs.filter((tab) => uniqueItems[i] === tab.item)[0].cost
    })
  }

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

  //THE LOOP (X = DAYS)////AND ARRAYS////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let day = moment(dayLeft).subtract(2,'hours');
  let data = new Array();
  let dataR = new Array();

  while (day <= moment(dayRight)) {

    data.push({
      date: day.format('M/D'),
      count: tabs.filter((tab) => tab.item === item && moment(tab.createdAt).format('M/D/YYYY') === day.format('M/D/YYYY')).length
    });
    // balance = balance - ( cash + credit ) + order
    day = day.add(1, "days");

  }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Array reversal for chart
  dataR = data.slice().sort((a,b) => a.date - b.date)

  // useEffect(() => {
  //   if(!data.length) {
  //     setLoading(true)
  //   } else {
  //     setLoading(false)
  //   }
  // },[data,dayLeft,dayRight])

  return (
    <div>
      <h2>Menu Stats</h2>
      <section name="chart" className='container'>
        {item === '' ?
          <></>
        :
          <>
            {/* date inputs */}
            <div className='col2' style={{padding:'10px'}}>
              <div style={{float:'left'}}>
                <input 
                  label='start date'
                  type='date' 
                  id='dayLeft' 
                  placeholder='start date'
                  onChange={upDateLeft}
                />            
              </div>
              <div style={{float:'right'}}>
                <input 
                  type='date' 
                  id='dayRight' 
                  placeholder='end date'
                  onChange={upDateRight}
                />
              </div>
            </div>
            <br/>
            <ChartMenu data={dataR} item={item} responsive='true'/>
          </>
        }
      </section>

      <section name="popular" style={{padding:'10px'}}>
        <h3 style={{marginBottom:'-20px'}}>Menu Items</h3>
        <p>tap to chart</p>
        <table style={{margin:'auto'}} cellSpacing='0'>
          <thead>
            <tr style={{backgroundColor:'whitesmoke'}}>
              <td style={{textAlign:'left', fontFamily:'poppins', border:'0px'}}>TOTAL</td>
              <td>{popular.reduce((a,b) => a + b.count, 0)}</td>
              <td>{popular.reduce((a,b) => a + b.revenue, 0).toFixed(2)}</td>
            </tr>
            <tr style={{backgroundColor:'lightgrey'}}>
              <td style={{textAlign:'left', fontFamily:'poppins', border:'0px'}}><b>Name</b></td>
              <td><b>Qty</b></td>
              <td><b>Rev</b></td>
            </tr>
          </thead>
          <tbody>
            {popular.sort((a,b) => b.count - a.count).map((tab) => 
              <tr onClick={() => changeItem(tab.item)}>
                <td style={{textAlign:'left', fontFamily:'poppins'}}>{tab.item}</td>
                <td>{tab.count}</td>
                <td>{tab.revenue.toFixed(2)}</td>
              </tr>          
            )}
          </tbody>
        </table>   
      </section>
    </div>
  )
}

export default Menu
