import React from "react";
import PricesList from "./components/PricesList"
import Chart from "./components/Chart"
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import moment from 'moment'

class App extends React.Component {

  state = {
    precios: [],
    date: null
  }


  async getPrices() {
    let { data } = await axios.get("/dolar");
    this.setState({ precios: data.precios, date: data.date * 1000 })
  }

  async componentDidMount() {
    this.getPrices()
  }


  render() {
    let { date, precios } = this.state;
    let dateStr = moment(date).format('llll');
    return (
      <Container>
        <Row>
          <Col>
            <p className="date">{dateStr}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <PricesList prices={precios} />
          </Col>
          <Col>
            <Chart />
          </Col>
        </Row>
      </Container>
    )
  }
}


export default App;

