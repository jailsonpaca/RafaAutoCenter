

import React, { useState, useEffect } from 'react';
import '../assets/main.css';
import 'semantic-ui-css/semantic.min.css';
import { Card, Header } from 'semantic-ui-react';
import Chart from "react-apexcharts";
import axios from "axios";
import history from '../history';
import moment from "moment";
import 'moment/locale/pt-br';
import { HOST, /*TIME*/ } from '../components/global.js'
moment.locale('pt-br');


var chartOptions = {
  options: {
    chart: {
      events: {

        dataPointSelection: function (event, chartContext, config) {

          moment.locale('pt-br');
          if (config.w.config.series[config.seriesIndex].data[config.dataPointIndex]) {

            history.push('/vendas', { data: moment(new Date(config.w.config.series[config.seriesIndex].data[config.dataPointIndex][0])).format("DD-MM-YYYY") });

          }
        }
      },
      height: 350,
      type: "area",
      stacked: false,
      locales: [{
        name: "pt",
        options: {
          months: [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
          ],
          shortMonths: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez"
          ],
          days: [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado"
          ],
          shortDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
          toolbar: {
            exportToSVG: "Baixar SVG",
            exportToPNG: "Baixar PNG",
            exportToCSV: "Baixar CSV",
            menu: "Menu",
            selection: "Selecionar",
            selectionZoom: "Selecionar Zoom",
            zoomIn: "Aumentar",
            zoomOut: "Diminuir",
            pan: "Navegação",
            reset: "Reiniciar Zoom"
          }
        }
      }],
      defaultLocale: "pt",
      toolbar: {
        show: true,
        tools: {
          pan: false,
        },
        autoSelected: 'zoom'
      }
    },
    colors: ["#008FFB", "#00E396", "#CED4DC"],
    title: {
      text: "Vendas/Serviços no Ano",
      align: 'left',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '30px',
        color: '#263238',
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight",
      //lineCap: 'round',
      width: 2,
    },
    series: [
      {
        name: "2019",
        data: [
          [new Date('2020-02-12').getTime(), 30.95],
          [new Date('2020-03-12').getTime(), 31.34],
          [new Date('2020-04-12').getTime(), 31.18],
          [new Date('2020-05-12').getTime(), 31.05],
          [new Date('2020-06-12').getTime(), 31.00],
          [new Date('2020-07-12').getTime(), 30.95],
          [new Date('2020-08-12').getTime(), 31.24],
          [new Date('2020-09-12').getTime(), 31.29],
          [new Date('2020-10-12').getTime(), 31.85],
        ]
      },
      {
        name: "2020",
        data: [
          [new Date('2020-02-12').getTime(), 29.95],
          [new Date('2020-03-12').getTime(), 31.40],
          [new Date('2020-04-12').getTime(), 31.58],
          [new Date('2020-05-12').getTime(), 31.15],
          [new Date('2020-06-12').getTime(), 31.60],
          [new Date('2020-07-12').getTime(), 30.35],
          [new Date('2020-08-12').getTime(), 31.44],
          [new Date('2020-09-12').getTime(), 31.69],
          [new Date('2020-10-12').getTime(), 31.85],
        ]
      },
    ],
    annotations: {

      xaxis: [{
        x: new Date(new Date().getFullYear(), 0, 1).getTime(),
        borderColor: '#999',
        yAxisIndex: 0,
        label: {
          show: true,
          text: 'Este Ano',
          style: {
            color: "#fff",
            background: '#775DD0'
          }
        }
      }]
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      offsetY: -50,
      markers: {
        width: 20,
        height: 20,
        strokeWidth: 0,
        strokeColor: '#fff',
        //fillColors: undefined,
        radius: 4,
        // customHTML: undefined,
        //onClick: undefined,
        offsetX: 10,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 2,
        vertical: 0
      },
    },
    xaxis: {
      type: "datetime",
      min: new Date(new Date().getFullYear() - 1, 0, 1).getTime(),
      max: new Date(new Date().getFullYear(), 11, 31).getTime(),
      labels: {
        offsetX: 20,//MUDEI PARA AJUSTAR EIXO-X COM "LINHA DO TEMPO"
        datetimeFormatter: {
          month: "MMM",
        },
      }
    },
    yaxis: {
      title: {
        text: 'Lucro',
        offsetX: 5,
        style: {
          fontSize: '20px',
        }
      },
    },
    tooltip: {
      x: {
        // format: 'dd MMM yyyy' 
        format: 'dd-MMM-yyyy'

      },
      intersect: true,
      shared: false

    },
    markers: {
      size: 3,
      colors: '#52f',
      strokeWidth: 0.5,
    },
  }
};


export default function Controle() {

  useEffect(() => {
    let isCancelled = false;

    async function loadV() {
      var url = HOST + `/api/hoje`;
      var url2 = HOST + `/api/lucro-hoje`;
      const response = await axios.get(url);
      const response2 = await axios.get(url2);
      var today = new Date(), series = [];

      series.push({
        name: String(today.getFullYear() - 1), data: await axios.get(url2, {
          params: {
            dia: today.getFullYear() - 1,
          }
        }).then((e) => {
          e.data = e.data.map(i => { return [new Date(i[0]).getTime(), parseFloat(i[1])] });
          return e.data
        })
      });

      series.push({
        name: String(today.getFullYear()), data: await axios.get(url2, {
          params: {
            dia: today.getFullYear(),
          }
        }).then((e) => {
          e.data = e.data.map(i => { return [new Date(i[0]).getTime(), parseFloat(i[1])] });
          return e.data
        })
      });

      var newChartOptions = { options: { series: [] } };
      newChartOptions.options.series = series;
      if (!isCancelled) {

        setState(prevState => ({ ...prevState, vendasHoje: response.data, lucroHoje: response2.data, options: newChartOptions.options }));
      }
    }

    loadV();
    return () => {
      isCancelled = true;
    };
  }, []);

  const [state, setState] = useState({
    options: chartOptions.options,
  });




  return (
    <div className="container">

      {/*<Image id="logo" style={{backgroundColor:'white',width:140,margin: 10}} alt="logo" src={logo}></Image>*/}
      <Card.Group centered={true} style={{ marginRight: "11.5%" }} itemsPerRow={2}>
        <Card style={{ width: "40%" }}>
          <Card.Content style={{ backgroundColor: "cornflowerblue" }}>
            <Card.Header >Vendas/Serviços Hoje</Card.Header>

          </Card.Content>
          <Card.Content>
            <Card.Description>
              <Header style={{ fontSize: "300%" }} textAlign="center">{state.vendasHoje}</Header>
            </Card.Description>
          </Card.Content>

        </Card>
        <Card style={{ width: "40%" }}>
          <Card.Content style={{ backgroundColor: "cornflowerblue" }}>
            <Card.Header >Lucro Hoje</Card.Header>

          </Card.Content>
          <Card.Content>
            <Card.Description>
              <Header style={{ fontSize: "300%" }} textAlign="center">{state.lucroHoje}</Header>
            </Card.Description>
          </Card.Content>

        </Card>
        <Card style={{ width: "84%" }}>
          <Chart
            options={state.options}
            series={state.options.series}
            type="area"
            width="100%"
            height="350"
          />
        </Card>
      </Card.Group>


    </div>

  );
}