// app/Stats/ChartRevenue

//dependencies3
import React, { useState, useEffect } from "react";
import moment from "moment";

//chartJS stuff
import "chart.js/auto";
import { Chart, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title
} from "chart.js";
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

function ChartRevenue({data}) {

  const empty = {
    labels: ['past', 'future'],
    datasets: [
      {
        label:'',
        data: [10,15],
      }
    ]
  }

  const [chartData, setChartData] = useState(empty)

  useEffect(() => {
    setChartData({
      labels: data.map((entry) => entry.date),
      datasets: [
        {
          label: "Ordered",
          data: data.map((entry) => entry.orders),
          backgroundColor: [
            "rgba(255, 99, 132, 1)" //red
          ],
          stack: "Stack0"
        },
        {
          label: "Credit",
          data: data.map((entry) => entry.credit),
          backgroundColor: [
            "rgba(221, 167, 3, 1)" //green
          ],
          stack: "Stack1"
        },
        {
          label: "Cash",
          data: data.map((entry) => entry.cash),
          backgroundColor: [
            "rgba(255, 201, 18, 1)" //green
          ],
          stack: "Stack1"
        },
        {
          label: "Tips",
          data: data.map((entry) => entry.tips),
          backgroundColor: [
            "rgba(0, 204, 102, 1)" //green
          ],
          stack: "Stack1"
        },
        {
            label: "Balance",
            type: 'line',
            data: data.map((entry) => entry.balance),
            backgroundColor: [
                'rgba(66, 133, 244, .2)',      //blue
            ],
            // borderColor: 'rgba(66, 133, 244, .2)',
            fill: {
                target: 'origin',
                // below: 'rgba(66, 133, 244, .15)'
            }
        },
      ],
    });
  }, [data]);


  return (
    <div>
      <Chart type="bar" data={chartData}/>
    </div>
  )
}

export default ChartRevenue
