// app/Stats/TableRevenue

//dependencies
import moment from 'moment'

//components

function TableRevenue({data}) {

    //variables
    let arr = data.slice().reverse()

    //functions

    //effects

    return (
        <div>
            <table cellSpacing='0'>
                <thead>
                    <tr style={{fontWeight:500}}>
                        <td style={{textAlign:'left', backgroundColor:'#444', color:'whitesmoke'}}><i>Date</i></td>
                        <td style={{backgroundColor:'#ea4335', color:'white'}}>Billed</td>
                        {/* <td style={{backgroundColor:'#DDA703', color:'white'}}>Credit</td>
                        <td style={{backgroundColor:'#fbbc05', color:'white'}}>Cash</td>
                        <td style={{backgroundColor:'#34a853', color:'white'}}>Tips</td> */}
                        <td style={{backgroundColor:'#4285f4', color:'white'}}>Revenue</td>
                    </tr>
                </thead>
                <tbody>
                    {arr.map((entry) => 
                        <tr key={entry.date}>
                            <td style={{textAlign:'left'}}><i>{moment(entry.date).format("MM/DD")}</i></td>
                            <td>{entry.orders == 0 ? '' : entry.orders.toFixed(2)}</td>
                            {/* <td>{entry.payments == 0 ? '' : entry.credit.toFixed(2)}</td>
                            <td>{entry.payments == 0 ? '' : entry.cash.toFixed(2)}</td>
                            <td>{entry.tips == 0 ? '' : entry.tips.toFixed(2)}</td> */}
                            <td>{(entry.cash+entry.credit+entry.tips).toFixed(2)}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br/>
            <br/>
        </div>
    )

}

export default TableRevenue
