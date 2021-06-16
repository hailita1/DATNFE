import {Component, OnInit} from '@angular/core';
import {UsageBillService} from '../../service/usageBill/usage-bill.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {UserToken} from '../../model/user-token';
import {House} from '../../model/house';
import {HouseService} from '../../service/house/house.service';

declare var $: any;
declare var Chart: any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  currentYear: number;
  currentUser: UserToken;
  isSelected = true;
  listHouseOfHost: House[];
  currentHouse: House;
  idHouse: number;

  constructor(private usageBillService: UsageBillService,
              private authenticationService: AuthenticationService,
              private houseService: HouseService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
  }

  ngOnInit() {
    if (this.idHouse == null || this.idHouse === undefined) {
      this.drawChart();
    }
    this.getllHouseByHost();
  }

  async drawChart() {
    this.currentYear = new Date().getFullYear();
    let monthTotalBought = [];
    for (let i = 0; i < 12; i++) {
      let totalSpendByBought = await this.sumTotalPrice(i + 1, this.currentYear, this.currentUser.id);
      if (totalSpendByBought == null) {
        totalSpendByBought = 0;
      }
      monthTotalBought.push(totalSpendByBought);
    }
    let areaChartData = {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
        'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',],
      datasets: [
        {
          label: 'Tổng doanh thu',
          backgroundColor: 'rgba(210, 214, 222, 1)',
          borderColor: 'rgba(210, 214, 222, 1)',
          pointRadius: false,
          pointColor: 'rgba(210, 214, 222, 1)',
          pointStrokeColor: '#c1c7d1',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: monthTotalBought
        },
      ]
    };
    // @ts-ignore
    let barChartData = jQuery.extend(true, {}, areaChartData);
    let stackedBarChartCanvas = $('#stackedBarChart').get(0).getContext('2d');
    // @ts-ignore
    let stackedBarChartData = jQuery.extend(true, {}, barChartData);

    let stackedBarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      }
    };

    let stackedBarChart = new Chart(stackedBarChartCanvas, {
      type: 'bar',
      data: stackedBarChartData,
      options: stackedBarChartOptions
    });
  }

  sumTotalPrice(month: number, year: number, id: number) {
    return this.usageBillService.sumPrice(month, year, id).toPromise();
  }

  sumTotalPriceByHouse(month: number, year: number, idHost: number, idHouse: number) {
    return this.usageBillService.sumPriceByHouse(month, year, idHost, idHouse).toPromise();
  }

  async changeHouse(event: any) {
    this.idHouse = event;
    const bill = {
      id: event
    };
    this.currentHouse = await this.getHouse(this.idHouse);
    this.currentYear = new Date().getFullYear();
    let monthTotalBought = [];
    let monthTotalGet = [];
    for (let i = 0; i < 12; i++) {
      let totalSpendByBought = await this.sumTotalPrice(i + 1, this.currentYear, this.currentUser.id);
      let totalGetByMonth = await this.sumTotalPriceByHouse(i + 1, this.currentYear, this.currentUser.id, this.idHouse);
      if (totalSpendByBought == null) {
        totalSpendByBought = 0;
      }
      if (totalGetByMonth == null) {
        totalGetByMonth = 0;
      }
      monthTotalBought.push(totalSpendByBought);
      monthTotalGet.push(totalGetByMonth);
    }
    let areaChartData = {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
        'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',],
      datasets: [
        {
          label: this.currentHouse.name,
          backgroundColor: 'rgba(60,141,188,0.9)',
          borderColor: 'rgba(60,141,188,0.8)',
          pointRadius: false,
          pointColor: '#3b8bba',
          pointStrokeColor: 'rgba(60,141,188,1)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          data: monthTotalGet
        },
        {
          label: 'Tổng doanh thu',
          backgroundColor: 'rgba(210, 214, 222, 1)',
          borderColor: 'rgba(210, 214, 222, 1)',
          pointRadius: false,
          pointColor: 'rgba(210, 214, 222, 1)',
          pointStrokeColor: '#c1c7d1',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: monthTotalBought
        }
      ]
    };
    // @ts-ignore
    let barChartData = jQuery.extend(true, {}, areaChartData);
    let stackedBarChartCanvas = $('#stackedBarChart').get(0).getContext('2d');
    // @ts-ignore
    let stackedBarChartData = jQuery.extend(true, {}, barChartData);

    let stackedBarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      }
    };

    let stackedBarChart = new Chart(stackedBarChartCanvas, {
      type: 'bar',
      data: stackedBarChartData,
      options: stackedBarChartOptions
    });
  }

  getHouse(id: number) {
    return this.houseService.getHouse(id).toPromise();
  }

  getllHouseByHost() {
    const user = {
      id: this.currentUser.id
    };
    this.houseService.getAllHouseByUser(user).subscribe(listHouseOfHost => {
      this.listHouseOfHost = listHouseOfHost;
    });
  }
}
