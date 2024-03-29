//app/pages/Today/jsx
//made this page to generate Today data more quickly.
//add to this the ability to scroll dates back and forth

import React, { useState, useEffect } from 'react'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import Spinner from '../components/Spinner'
import axios from 'axios'

function Today({config}) {

    // VARIABLES //
    const [counter, setCounter] = useState(0)
    const [todayTabs, setTodayTabs] = useState([])

    //defines today and formats it to common date format
    const today = moment().add(counter, 'days').subtract(2, 'hours').format('M/D/YYYY')

    //filters to tabs logged TODAY
    //todayTabs//
    // const todayTabs = tabs.filter((t) => moment(t.createdAt).subtract(2, 'hours').format('M/D/YYYY') === today)
    //orders
    const todayOrders = todayTabs.filter((t) => t.item !== "CASH" && t.item !== "CREDIT" && t.item !== "CHANGE" && t.item !== "TIP").reduce((a, b) => a + b.cost, 0)
    //payments
    const todayCash = todayTabs.filter((t) => t.item === "CASH").reduce((a, b) => a + b.cost, 0) * -1
    const todayCredit = todayTabs.filter((t) => t.item === 'CREDIT').reduce((a, b) => a + b.cost, 0) * -1
    const todayChange = todayTabs.filter((t) => t.item === 'CHANGE').reduce((a, b) => a + b.cost, 0) * -1
    const todayTips = todayTabs.filter((t) => t.item === 'TIP').reduce((a, b) => a + b.cost, 0) * -1

    //todayRev
    const todayRev = todayCash + todayCredit + todayChange + todayTips

    const todayReversed = todayTabs.slice().reverse()

    const csvData = todayTabs.map((t) => {
        return { id: t._id, createdAt: moment(t.createdAt).format('M/D/Y - h:mm:ss A'), updatedAt: t.updatedAt ? moment(t.updatedAt).format('M/D/Y - h:mm:ss A') : '', customer: t.customer, item: t.item, cost: t.cost, status: t.status, }
    })

    //this one is working
    const getData = async (date1, date2) => {
        console.log('tabService.getTabsByDate')

        const API_URL = 'https://fpsweapons.herokuapp.com/api/tabs/'

        //as long as wrapped in new Date() you should be able to generate dates however you like.
        const startDate = new Date(date1) //returns millisecond 0 of today.
        const endDate = new Date(date2) //returns last millisecond of today

        const path = API_URL + `dates?startDate=${startDate}&endDate=${endDate}`
        const response = await axios.get(path, config)

        setTodayTabs(response.data)
    }

    useEffect(() => {
        const date1 = new Date().setHours(2 + (counter * 24), 0, 0, 0) //returns up from 2am+ on a given date
        const date2 = new Date().setHours(25 + (counter * 24), 59, 59, 999) //returns until 2am the day 'following' the given date
        getData(date1, date2)
    }, [counter])

    return (
        <div>
            <section name="today" style={{ backgroundColor: 'whiteSmoke', padding: '20px', borderBottom: '1px solid grey' }}>
                <h1 style={{ marginBottom: '-20px' }}>Bites & Pipes Daily</h1>
                <h3>{moment(today).format('dddd | MMMM DD, YYYY')}</h3>
                <button onClick={() => setCounter(counter - 1)} style={{ padding: '5px', margin: '10px' }}>prev</button>
                <button onClick={() => setCounter(counter + 1)} style={{ padding: '5px', margin: '10px' }}>next</button>

            </section>
            <section name="today" style={{ padding: '10px', paddingBottom: "40px", borderBottom: '1px solid Black' }}>
                <h3>Day Totals</h3>

                <table style={{ margin: 'auto', fontSize: "28px", marginTop: '30px' }} cellSpacing='0'>


                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey', backgroundColor: '#eee' }}><b>Orders</b></td>
                            <td style={{ borderTop: '1px solid lightgrey', backgroundColor: '#eee' }}><b>{todayOrders.toFixed(2)}</b></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey' }}>Cash Payments</td>
                            <td style={{ borderTop: '1px solid lightgrey' }}>{(todayCash + todayChange).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey' }}>Credit Payments</td>
                            <td style={{ borderTop: '1px solid lightgrey' }}>{todayCredit.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey' }}>Tips</td>
                            <td style={{ borderTop: '1px solid lightgrey' }}>{todayTips.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey', backgroundColor: '#eee' }}><b>Total Payments</b></td>
                            <td style={{ borderTop: '1px solid lightgrey', backgroundColor: '#eee' }}><b>$ {todayRev.toFixed(2)}</b></td>
                        </tr>
                    </tbody>
                </table>

            </section>

            <section name='tabDisplay' style={{ padding: "0px", borderBottom: '1px solid Black' }}>
                <h3>Day Tabs</h3>
                <CSVLink data={csvData} filename={"stats.csv"} style={{ marginBottom: '10px' }}>
                    Export to CSV
                </CSVLink>
                <table className='borderlessTable' style={{ marginBottom: '100px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#ccc' }}>
                            <th style={{ textAlign: 'left', padding: '10px' }}>time</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>customer</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>item</th>
                            <th>cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todayReversed.map((tab) =>
                            <tr key={tab._id}>
                                <td style={{ textAlign: 'left' }}>{moment(tab.createdAt).format('M/D/Y - h:mm A')}</td>
                                <td style={{ textAlign: 'left' }}>{tab.customer}</td>
                                <td style={{ textAlign: 'left' }}>{tab.item}</td>
                                <td>{tab.cost.toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    )
}

const borderlessTable = {
    borderCollapse: 'collapse',
    border: 'none',
};


export default Today