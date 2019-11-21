import { Temperature } from './../../../@core/data/temperature-humidity';
import { Component, OnDestroy, EventEmitter, Input, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { Electricity, ElectricityChart, ElectricityData } from '../../../@core/data/electricity';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ElectricityChartComponent } from './electricity-chart/electricity-chart.component';

@Component({
  selector: 'ngx-electricity',
  styleUrls: ['./electricity.component.scss'],
  templateUrl: './electricity.component.html',
})
export class ElectricityComponent implements OnDestroy, OnInit {

  private alive = true;

  listData = [
    { name: 'HSA ',amps: 0 },
    { name: 'HSF', amps: 0 },
    { name: 'VSF', amps: 0 },
    { name: 'VSA', amps: 0 },
    { name: 'HPF', amps: 0 },
    { name: 'HPA', amps: 0 },
    { name: 'VPF', amps: 0 },
    { name: 'VPA', amps: 0 },
  ];
  chartData: ElectricityChart[] = [];
  amperage: number;
  @Input() amperageEmitter: EventEmitter<number>;
  @Input('logicCurrents')
  set logicCurrents(currents: number[]) {
    for(var i = 0; i < currents.length; i++) {
      this.listData[i].amps = currents[i];
    }
  }

  newData = new EventEmitter<any>();

  currentTheme: string;
  themeSubscription: any;



  constructor(private electricityService: ElectricityData,
    private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    // forkJoin(
    //   this.electricityService.getListData(),
    //   this.electricityService.getChartData(),
    // )
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe(([listData, chartData]: [Electricity, ElectricityChart[]]) => {
    //     this.listData = listData;
    //     //this.chartData = chartData;
    //   });
  }

  ngOnInit() {
    this.amperageEmitter.subscribe(a => {
      this.amperage = a.toFixed(2);
      this.chartData.push({ label: '', value: this.amperage });
      this.newData.emit();
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
