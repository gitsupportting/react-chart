import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  ButtonGroup,
  Button
} from 'shards-react'

import RangeDatePicker from '../common/RangeDatePicker'
import Chart from '../../utils/chart'

class SalesReport extends React.Component {
  fileInput
  constructor (props) {
    super(props)
    this.state = {
      month: [],
      profit: [],
      shipping: [],
      tax: []
    }
    this.legendRef = React.createRef()
    this.canvasRef = React.createRef()
  }

  componentDidMount() {
    fetch('/Sales-Report-Patle-Hare.csv').then(response => {
      return response.text();
    })
    .then(data => {
      this.processData(data);
    })
  }

  componentDidUpdate (prevProps, prevState) {
    // only update chart if the data has changed
    if (prevState.month !== this.state.month) {
      const chartOptions = {
        ...{
          legend: false,
          // Uncomment the next line in order to disable the animations.
          // animation: false,
          tooltips: {
            enabled: false,
            mode: 'index',
            position: 'nearest'
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                gridLines: false
              }
            ],
            yAxes: [
              {
                stacked: true,
                ticks: {
                  userCallback (label) {
                    return label > 999 ? `${(label / 1000).toFixed(0)}k` : label
                  }
                }
              }
            ]
          }
        },
        ...this.props.chartOptions
      }

      var chartData = {
        labels: this.state.month,
        // labels: this.state.month,
        datasets: [
          {
            label: 'Profit',
            fill: 'start',
            data: this.state.profit,
            // data: this.state.profit,
            backgroundColor: 'rgba(0, 123, 255, 1)',
            borderColor: 'rgba(0, 123, 255, 1)',
            pointBackgroundColor: '#FFFFFF',
            pointHoverBackgroundColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1.5
          },
          {
            label: 'Shipping',
            fill: 'start',
            data: this.state.shipping,
            // data: this.state.shipping,
            backgroundColor: 'rgba(72, 160, 255, 1)',
            borderColor: 'rgba(72, 160, 255, 1)',
            pointBackgroundColor: '#FFFFFF',
            pointHoverBackgroundColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1.5
          },
          {
            label: 'Tax',
            fill: 'start',
            data: this.state.tax,
            // data: this.state.tax,
            backgroundColor: 'rgba(153, 202, 255, 1)',
            borderColor: 'rgba(153, 202, 255, 1)',
            pointBackgroundColor: '#FFFFFF',
            pointHoverBackgroundColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1.5
          }
        ]
      }

      const SalesReportChart = new Chart(this.canvasRef.current, {
        type: 'bar',
        data: chartData,
        options: chartOptions
      })

      // Generate the chart labels.
      this.legendRef.current.innerHTML = SalesReportChart.generateLegend()

      // Render the chart.
      SalesReportChart.render()
    }
  }  

  processData (allText) {
    var allTextLines = allText.split(/\r\n|\n/)
    var headers = allTextLines[0].split(',')
    var lines = []

    for (var i = 1; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(',')
      if (data.length == headers.length) {
        var tarr = []
        for (var j = 0; j < headers.length; j++) {
          tarr.push(headers[j] + ':' + data[j])
        }
        lines.push(tarr)
      }
    }
    let profit = [],
      shipping = [],
      tax = [],
      month = []
    for (let i = 0; i < lines.length; i++) {
      tax.push(parseInt(lines[i][3].replace(/\D/g, '')))
      profit.push(parseInt(lines[i][2].replace(/\D/g, '')))
      shipping.push(parseInt(lines[i][1].replace(/\D/g, '')))
      month.push(lines[i][0].replace('Month:', ''))
    }
    this.setState({
      tax: tax,
      profit: profit,
      shipping: shipping,
      month: month
    })
  }

  render () {
    const { title } = this.props

    return (
      <Card small className='h-100'>
        <CardHeader className='border-bottom'>
          <h6 className='m-0'>{title}</h6>
          <div className='block-handle' />
        </CardHeader>

        <CardBody className='pt-0'>
          <Row className='border-bottom py-2 bg-light'>
            {/* Time Interval */}
            <Col sm='6' className='col d-flex mb-2 mb-sm-0'>
              <ButtonGroup>
                <Button theme='white'>Hour</Button>
                <Button theme='white'>Day</Button>
                <Button theme='white'>Week</Button>
                <Button theme='white' active>
                  Month
                </Button>
              </ButtonGroup>
            </Col>

            {/* DatePicker */}
            <Col sm='6' className='col'>
              <RangeDatePicker className='justify-content-end' />
            </Col>
          </Row>
          <div ref={this.legendRef} />
          <canvas
            height='120'
            ref={this.canvasRef}
            style={{ maxWidth: '100% !important' }}
            className='sales-overview-sales-report'
          />
        </CardBody>
      </Card>
    )
  }
}

SalesReport.propTypes = {
  /**
   * The title of the component.
   */
  title: PropTypes.string,
  /**
   * The chart data.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object
}

export default SalesReport
