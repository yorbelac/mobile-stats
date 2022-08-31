// app/Menu

//dependencies
import {useState, useEffect} from 'react'
import moment from 'moment'

//components
import ChartMenu from '../components/charts/ChartMenu'
// import { tab } from '@testing-library/user-event/dist/tab'

function Kitchen({menu, tabs}) {

  //variables

  const orders = tabs
    .filter((entry) => String(entry.item).startsWith('Food'))
    .filter((entry) => moment(entry.createdAt).subtract(2,'hours').format('MM/DD/YYYY') === moment().subtract(2,'hours').format('MM/DD/YYYY'))
    .sort((a,b) => moment(b.createdAt) - moment(a.createdAt))

  return (
    <div>
      <section name="header" style={{backgroundColor:'whiteSmoke', padding:'10px'}}>
        <h1>Food Orders</h1>
        <h1 style={{marginBottom:'-20px'}}>{moment().format('dddd')}</h1>
        <h3>{moment().format('MMMM DD, YYYY')}</h3>
      </section>
      <br/>
      <section name="todayOrders">
        <table style={{margin:'auto'}} cellSpacing='0'>
          <thead>
            <tr style={{backgroundColor:'lightgrey'}}>
              <td></td>
              <td width="25%" style={{textAlign:'left'}}><b>Customer</b></td>
              <td width="50%" style={{textAlign:'left'}}><b>Item</b></td>
              <td width="20%"><b>Age</b></td>
            </tr>
          </thead>
          <tbody>
            {orders.sort((a,b) => b.count - a.count).map((tab) => 
              <tr>
                <td width="40px"><input type='checkbox'></input></td>
                <td style={{textAlign:'left', fontFamily:'poppins'}}>{tab.customer}</td>
                <td style={{textAlign:'left', fontFamily:'poppins'}}>{tab.item}</td>
                <td>
                  <>
                    {moment().format('hhmm')-moment(tab.createdAt).format('hhmm') > 90 ? 'old' : `${moment().format('hhmm')-moment(tab.createdAt).format('hhmm')} min`}
                  </>
                  
                </td>
              </tr>          
            )}
          </tbody>
        </table> 
      </section>
    </div>
  )
}

export default Kitchen