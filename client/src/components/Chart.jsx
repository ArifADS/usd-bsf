import React from "react";
import Chart from "react-chartjs"
import moment from "moment"
import axios from "axios"
const LineChart = Chart.Line;


const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
}

class PricesChart extends React.Component {

    constructor(props) {
        super(props)
        this.state = { labels: [], data: [] }
    }

    componentDidMount() {
        this.getHistory()
    }

    async getHistory() {
        let response = await axios.get("/history/120");
        let data = response.data
        var dt = []
        var simadi = []
        var date = []
        var i = 0
        data.forEach(item => {
            if (!(i % 7)) {
                dt.push(item.dt);
                simadi.push(item.simadi);
                date.push(moment(item.date * 1000).format('MM-DD-YYYY'))
            }
            i = i + 1;
        });
        this.setState({ labels: date, data: [dt, simadi] })
    }

    render() {
        let { labels, data } = this.state
        var chartData = {
            labels,
            datasets: [
                {
                    label: "Dolar Today",
                    data: data[0],
                    fillColor: "#1B5E20"
                },
                {
                    label: "Simadi",
                    data: data[1],
                    fillColor: "#43A047"
                }
            ]
        }
        return (
            <div className="priceChart">
                <LineChart
                    data={chartData}
                    options={chartOptions}
                    height="250"
                />
            </div>
        )
    }
}

export default PricesChart