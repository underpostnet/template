import {Component, OnInit, ViewChild} from '@angular/core';
import {IndicatorService} from '../../services/indicator/indicator.service';
import {User} from '../../classes/user/user';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {MapData} from '../../classes/map/map-data';
import {Period} from 'src/app/classes/period/period';
import {ChartData} from '../../classes/chart/chart-data';
import {CommonService} from '../../services/common/common.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {FieldService} from 'src/app/services/field/field.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import notify from 'devextreme/ui/notify';
import * as Highcharts from 'highcharts';
import {DxDataGridComponent} from 'devextreme-angular';
import {exportDataGrid} from 'devextreme/excel_exporter';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TimeoutError } from 'rxjs';


declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {

  @ViewChild('deleteModal') deleteModal: any;

  user: User;
  species;
  field: any = [];
  sector: any = [];
  sectorId;
  sectors = [];
  activeSector = null;
  waterPotentials = [];
  waterPotentialsSector = [];
  currentWaterPotential = null;
  formData = [];
  linesData = null;
  // Mapa
  mapData: MapData = null;

  // 'home', 'add'
  wpMode = 'home';
  mode = {
    comment: false,
    calculate: false,
  }

  formWaterPotential: FormGroup;
  tempDate = null;

  //Primer Periodo a seleccionar
  /*period: Period = new Period('Semana', 30, 7, new Date().setDate(new Date().getDate() - 6), new Date().getTime(), {
    name: 'Semana',
    value: 7,
    group: {name: '30 Minutos', value: 30}
  }, {name: '30 Minutos', value: 30});*/
  period: Period = new Period('Dia', 1, 1, new Date().setDate(new Date().getDate() - 30), new Date().getTime(), {
    name: 'Dia',
    value: 1
    /* group: {name: '30 Minutos', value: 1} */
  }, {name: '30 Minutos', value: 30});
  //Fechas inciales

  today = new Date();
  pastDate = this.today.getDate() - 6;

  // Charts
  chartWaterPotential: ChartData = null;
  chartOptionsWaterPotential: Highcharts.Options = null;
  chartWaterBalance: ChartData = null;
  chartOptionsWaterBalance: Highcharts.Options = null;
  chartbaseLine: ChartData = null;

  chartOptionsVolume: Highcharts.Options = null;
  chartVolume: ChartData = null;

  //Highcharts: typeof Highcharts = Highcharts;
  Highcharts = Highcharts.setOptions({
    lang: {
      loading: 'Cargando...',
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
        'Sábado'],
      shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep',
        'Oct', 'Nov', 'Dic'],
      rangeSelectorFrom: "Desde",
      rangeSelectorTo: "Hasta",
      rangeSelectorZoom: "Período",
      downloadPNG: 'Descargar imagen PNG',
      downloadJPEG: 'Descargar imagen JPEG',
      downloadPDF: 'Descargar imagen PDF',
      downloadSVG: 'Descargar imagen SVG',
      printChart: 'Imprimir',
      resetZoom: 'Reiniciar zoom',
      resetZoomTitle: 'Reiniciar zoom',
      thousandsSep: ",",
      decimalPoint: '.'
    }
  });
  charts = {
    chart1: null as Highcharts.Options,
  }

  xAxis = {
    //Potencial Hidrico
    chart1: null,
    //Balance Hidrico
    chart2: null,
  }

  yAxis = {
        //Potencial Hidrico
        chart1: null,
        //Balance Hidrico
        chart2: null,
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private fieldService: FieldService,
    private indicatorService: IndicatorService,
    private commonService: CommonService,
  ) {
    this.field = this.fieldService.getSelectField();
    //console.log('EL FIELD: '+this.field.name);

    this.sector = this.field._id;
    //console.log('EL SECTOR: '+this.sector);

    if (!this.field) {
      let user = this.authService.getUser();
      this.fieldService.setFields(user.fields);
      this.fieldService.setSelectField(user.fields.length > 0 ? user.fields[0] : null);
      this.field = this.fieldService.getSelectField();
    }

    this.fieldService.fieldChanged.subscribe((field => {
      if (this.field != field) {
        this.field = field;
        this.waterPotentials = [];
        this.mapData = null;
        this.period.from = new Date(this.field.seasonStartDate).getTime();
        this.init();
      }
    }), (error) => {
      console.log(error);
    })
  }

  ngOnInit(): void {
    this.init();
  }


  async init() {
    let formSectorDetail;

    this.formWaterPotential = this.formBuilder.group({
      temperature: [null, Validators.required],
      water_potential:[null],
      sector:[null],
      relative_humidity: [null, Validators.required],
      eto: [null, Validators.required],
      created_date: [null, Validators.required],
      base_line: [null],
    });

    this.setVisible('#loading', true);
    await this.getSectorsByField(this.field._id);
    await this.getWaterPotentialsByField(this.field._id);
    await this.getWaterPotentialsBySector(this.sectorId);

    await this.updateChart();
    this.setVisible('#loading', false);
    console.log(this.sectors);
    console.log(this.species);
    console.log(this.getSectorsByField(this.field._id));
  }

  // ******
  // API
  // ******
  getSpeciesByField(fieldId) {
    return new Promise((resolve, reject) => {
      this.indicatorService.getSpeciesByField(fieldId).subscribe((response) => {
        console.warn('getSpeciesByField', response.data);
        this.species = response.data
        resolve('ok');
      }, (error) => {
        console.log('Error', error);
        reject(error);
      })
    })
  }


  getSectorsByField(fieldId) {
    return new Promise((resolve, reject) => {
      this.indicatorService.getSectorsByField(fieldId).subscribe((response) => {
        console.log('getSectorsByField', response);
        this.sectors = response.data;
        this.activeSector = this.sectors[0];
        this.sectorId = this.activeSector._id;
        //console.log('SECTOR ACTIVO: '+this.activeSector.name);
        //console.log('SECTOR ACTIVO: '+this.activeSector._id);

        this.mapData = new MapData('sectors', this.sectors, this.activeSector);
        resolve('ok');
      }, (error) => {
        console.log('Error', error);
        reject(error);
      })
    });
  }

  getWaterPotentialsByField(fieldId) {
    return new Promise((resolve, reject) => {
      this.indicatorService.getWaterPotentialsByField(fieldId).subscribe((response) => {
        console.warn('getWaterPotentialsByField', response.data);
        this.waterPotentials = response.data
        resolve('ok');
      }, (error) => {
        console.log('Error', error);
        reject(error);
      })
    })
  }

  getWaterPotentialsBySector(sectorId) {
    return new Promise((resolve, reject) => {
      this.indicatorService.getWaterPotentialsBySector(sectorId).subscribe((response) => {
        console.warn('getWaterPotentialsBySector', response.data);
        this.waterPotentialsSector = response.data
        resolve('ok');
      }, (error) => {
        console.log('Error', error);
        reject(error);
      })
    })
  }

  createWaterPotential(wp) {
    return new Promise((resolve, reject) => {
      this.indicatorService.createWaterPotential(wp).subscribe((response) => {
        console.log('createWaterPotential', response.data);
        notify("La medición se ha creado correctamente.", "success", 3000);
        resolve('ok');
      }, (error) => {
        console.log('Error', error);
        notify("Ocurrió un error, no fue posible crear la medición en este momento.", "error", 3000);
        reject(error);
      })
    })
  }

  updateWaterPotential(wp, wpId) {
    return new Promise((resolve, reject) => {
      this.indicatorService.updateWaterPotential(wp, wpId).subscribe((response) => {
        console.log('updateWaterPotential', response.data);
        notify("La medición se ha actualizado correctamente.", "success", 3000);
        resolve('ok');
      }, (error) => {
        console.log('Error', error);
        notify("Ocurrió un error, no fue posible actualizar la medición en este momento.", "error", 3000);
        reject(error);
      })
    })
  }

  deleteWaterPotential(wpId) {
    return new Promise((resolve, reject) => {
      this.indicatorService.deleteWaterPotential(wpId).subscribe((response) => {
        console.log('deleteWaterPotential', response.data);
        notify("La medición se ha eliminado correctamente.", "success", 3000);
        resolve('ok');
      }, (error) => {
        console.log('Error', error);
        notify("Ocurrió un error, no fue posible eliminar la medición en este momento.", "error", 3000);
        reject(error);
      })
    })
  }

  // ******
  // Mapa
  // ******

  onChangeActiveSector(newSector) {
    this.activeSector = newSector;
    this.updateChart();
  }

  // ******
  // Tabla
  // ******

  newWP() {
    console.log('newWP');
    console.log(this.sectors);
    this.wpMode = 'add';
  }

  editWP(data) {
    console.log('editWP', data);

    this.currentWaterPotential = data;

    this.formWaterPotential.patchValue({
      water_potential: data.waterPotential,
      sector: data.sector,
      temperature: data.temperature,
      relative_humidity: data.relativeHumidity,
      eto: data.eto,
      created_date: data.createdDate,
    });
    this.tempDate = data.createdDate;

    this.wpMode = 'edit';
  }

  deleteWP(data) {
    console.log('deleteWP', data);
    this.currentWaterPotential = data;
    this.deleteModal.show();
  }

  async confirmDeleteWP() {
    await this.deleteWaterPotential(this.currentWaterPotential._id);
    this.deleteModal.hide();

    this.currentWaterPotential = null;
    await this.getWaterPotentialsByField(this.field._id);
    await this.updateChart();
  }

  async onSubmitWaterPotential() {
    console.log('onSubmitWaterPotential', this.formData);
    if (this.formWaterPotential.invalid) {
      notify("Existen campos obligatorios que no están completados.", "error", 3000);
      return;
    }

    // const data = {
    //   water_potential: this.formWaterPotential.value.water_potential,
    //   sector: this.formWaterPotential.value.sector._id,
    //   temperature: this.formWaterPotential.value.temperature,
    //   relative_humidity: this.formWaterPotential.value.relative_humidity,
    //   eto: this.formWaterPotential.value.eto,
    //   created_date: this.formWaterPotential.value.created_date,
    // }

    if (this.wpMode == 'add') {
      this.formData.forEach(async (v, i) => {
      console.log('ADD', v);
          await this.createWaterPotential(v);
          this.formData = [];
      });
      setTimeout(()=>{
          this.back();
      },2000)

    } else if (this.wpMode == 'edit') {
      // Update
      // console.log('EDIT', v);
      // await this.updateWaterPotential(data, this.currentWaterPotential._id);
    }

  }

  onChangeDate(date) {
    this.formWaterPotential.patchValue({
      created_date: date,
    });
  }

  onChangeSector(item) {
    this.formWaterPotential.patchValue({
      sector: item,
    });
  }

  // ******
  // Gráfico
  // ******

  /**
  async getLinesFromMonitor(field, key): Promise<any> {
    return new Promise((resolve, reject) => {
      this.indicatorService.getLinesFromMonitor(field, key).subscribe((response) => {
        console.log('getLinesFromMonitor', response);
        resolve(response.data)
      }, (error) => {
        console.log(error);
      });
    })
  }
 */
  // este metodo trae las lineas de riego desde talgil
  /**
  async getLines(field, key): Promise<any> {
    return new Promise((resolve, reject) => {
      this.indicatorService.getFieldLines(field, key).subscribe((response) => {
        console.log('getFieldLines', response);
        let lines = []
        for (var i in response.data) {
          if (response.data[i].groups?.length) {
            lines.push(response.data[i]);
          }
        }
        resolve(lines)
      }, (error) => {
        console.log(error);
      });
    })
  }
*/
  // Gráfico potencial hídrico
  async setWaterPotentialChart(data) {
    let s;
    //var lines = await this.getLines(this.field._id, 'week');
    //var linesMonitor = await this.getLinesFromMonitor(this.field._id, 'week');
    //lines = lines.concat(linesMonitor);
    //this.linesData = lines;
    //console.warn('this.linesData', this.linesData);
    console.warn('this.mapData', this.mapData);
    // for (var i in this.linesData) {
    //   for (var j in this.linesData[i].groups) {
    //     let group = this.linesData[i].groups[j];
    //     // console.warn([group._id,this.mapData.active._id]);
    //     // if (group._id === this.mapData.active._id) {
    //     // if (group._id === this.mapData.active.activeSector._id) { //TODO: cambiar a sector activo seleccionado por el usuario
    //     //   this.mapData.active.activeSector = group;
    //       s = group;
    //       break;
    //     // }
    //   }
    // }
    s = {'groupedIrrigation': [1, 2, 3, 4, 5, 6, 7]};
    console.warn('s ', s);
    //console.log('setWaterPotentialChart', data);
    let title = 'Dinámica de los Riegos y Potencial Hídrico - Sector: ' + this.activeSector.name;

    //waterPotential
    let waterPotential = [];
    let unitWaterPotential = 'bar';
    let baseline = [];
    let irrigation = [];
    let categories = [];
    for (let d of data) {
      if(this.period.from<(new Date(d.createdDate).getTime())){
        categories.push(new Date(d.createdDate).getTime());
      waterPotential.push(
        [new Date(d.createdDate).getTime(), Number(d.waterPotential)]
      );
      baseline.push(
        [new Date(d.createdDate).getTime(), Number(d.baseline)]
      );
      irrigation.push(
        [new Date(d.createdDate).getTime(), Number((d.irrigationLine))]
      );
      // baseline.push({y:Number(d.baseline),container: "chartEffIrrigation"});
      }
    }

    let yAxisTitleWaterPotential = 'Potencial Hídrico (' + unitWaterPotential + ') ';
    let yAxisColorWaterPotential = '#111c1b';
    let yAxisUnitWaterPotential = ' ';
    let yAxisTitleBaseLine = 'Linea Base (' + unitWaterPotential + ') ';
    let yAxisColorBaseLine = '#C77800';
    let yAxisUnitBaseLine = ' ';
    let yAxisTitleIrrigation = 'Linea de Riego (bar) ';
    let yAxisColorIrrigation = '#008891';
    let yAxisUnitIrrigation = ' ';


    // título, color, unidad, y data, 'spline', ...
    let waterPotentialData = this.commonService.createChartTemplate(yAxisTitleWaterPotential, yAxisColorWaterPotential, yAxisUnitWaterPotential, waterPotential, 'spline', 0, false, [], null, null);
    let baseLineData = this.commonService.createChartTemplate(yAxisTitleBaseLine, yAxisColorBaseLine, yAxisUnitBaseLine, baseline, 'spline', 0, false, [], null, null);
    let irrigationData = this.commonService.createChartTemplate(yAxisTitleIrrigation, yAxisColorIrrigation, yAxisUnitIrrigation, irrigation, 'spline', 0, false, [], null, 0);
    irrigationData.serie['zIndex'] = 1;

    let waterPotentialSerie = waterPotentialData.serie;
    let baseLineSerie = baseLineData.serie;
    let irrigationSerie = irrigationData.serie;

    let tickWaterPotential = 0;
    let formatWaterPotential = '';

    if (this.period.name == 'Semana') {
      formatWaterPotential = '{value:%e %b}';
      tickWaterPotential = 60 * 60 * 1000 * 24; // Cada 1 día
    } else if (this.period.name == '24 Horas') {
      formatWaterPotential = '{value:%H:%M}'
      tickWaterPotential = 60 * 60 * 1000 * 2; // Cada 2 horas.
    } else if (this.period.name == 'Mes') {
      formatWaterPotential = '{value:%e %b}';
      tickWaterPotential = 60 * 60 * 1000 * 24 * 7; // Cada 7 días
    } else {
      formatWaterPotential = '{value:%b %y}';
      tickWaterPotential = 60 * 60 * 1000 * 24 * 7; // Cada 30 días;
    }

    this.xAxis.chart1 = [{
      // categories: categories,
      type: 'datetime',
      labels: {
        style: this.commonService.style,
        format: '{value: %e %b %y}'
      },
      crosshair: true,
      tickInterval: 0
      //tickInterval: tickWaterPotential,
    }];
    let auxYAxisData = waterPotentialData.yAxis;
    let auxYAxisDatalb = baseLineData.yAxis;
    let auxYAxisDatairrigation = irrigationData.yAxis;

    //this.yAxis.chart1 = [auxYAxisData, auxYAxisDatalb, auxYAxisDatairrigation];
    this.yAxis.chart1 = [auxYAxisData, auxYAxisDatalb];
    this.chartWaterPotential = new ChartData(title, [waterPotentialSerie, baseLineSerie, irrigationSerie], this.xAxis.chart1, this.yAxis.chart1, this.period);
    //this.chartWaterPotential = new ChartData(title, [waterPotentialSerie, baseLineSerie], this.xAxis.chart1, this.yAxis.chart1, this.period);
    this.chartOptionsWaterPotential = this.commonService.createChart(this.chartWaterPotential, true, [], this);
    this.chartOptionsWaterPotential['chart']['renderTo'] = 'container-highchart-water-potential';


    Highcharts.chart(this.chartOptionsWaterPotential);
  }

  async updateChart() {
    let water_p = this.waterPotentials.filter(obj => obj.sector._id == this.activeSector._id);
    this.setWaterPotentialChart(water_p);
    // TODO:
    this.setWaterBalanceChart_();  //Llamar al grafico de balance hidrico
    // this.setWaterBalanceChart();
  }

  onValueChange(newValue) {
    console.log('onValueChange', newValue);
    this.period = newValue;
    this.updateChartPeriod(newValue);
  }

  customFrom(time){
    console.log('new time');
    console.log(time);
    let p_= new Period('Dia', 1, 1, time, new Date().getTime(), {
      name: 'Dia',
      value: 1
    }, {name: '30 Minutos', value: 30});
    p_.metric = 0;
    this.onValueChange(p_);
  }

  updateChartPeriod(newValue) {
    this.period = newValue;
    this.updateChart();
  }

  setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
  }

  async back() {
    this.tempDate = null;
    this.currentWaterPotential = null;
    this.formWaterPotential.reset();
    this.wpMode = 'home';
    this.formData = [];
    await this.getWaterPotentialsByField(this.field._id);
    await this.updateChart();
  }

  // Exportar Datos en Excel.
  onExporting(e) {
    e.component.beginUpdate();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Planta');
    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
    }).then(function () {
      workbook.xlsx.writeBuffer().then(function (buffer: BlobPart) {
        saveAs(new Blob([buffer], {type: 'application/octet-stream'}), 'Resumen Indicador Planta.xlsx');
      });
    }).then(function () {
      e.component.endUpdate();
    });

    e.cancel = true;
  }

  addData(sectorId, v) {

    let cont;
    let wpotencial

    if(v.target.value != null && v.target.value != '' && this.formWaterPotential.value.temperature != null
      &&this.formWaterPotential.value.relative_humidity != null
      &&this.formWaterPotential.value.eto != null){

      for(let i in this.formData){
        if(this.formData[i].sector==sectorId ){
          console.log('YA EXISTE SECTOR: '+ i);
          cont = parseInt(i);
          delete this.formData[cont];
        }
      }

      if(v.target.value > 0){
        wpotencial = -v.target.value;
      }
      else{
        wpotencial = v.target.value;
      }
      this.formData.push({
        water_potential: wpotencial,
        sector: sectorId,
        temperature: this.formWaterPotential.value.temperature,
        relative_humidity: this.formWaterPotential.value.relative_humidity,
        eto: this.formWaterPotential.value.eto,
        created_date: this.formWaterPotential.value.created_date,

      });
    }
    console.warn(this.formData);
  }


  // Gráfico balance hídrico
  async setWaterBalanceChart() {

    var lines = await this.getLinesCustom(this.field._id, this.period.from, this.period.to);
    // var linesMonitor = await this.getLinesFromMonitor(this.field._id, 'week');
    // lines = lines.concat(linesMonitor);
    this.linesData = lines;

    // TODO: fala filtrar por sector
    // this.activeSector.name

    console.log(' sector ->');
    console.log(this.activeSector);

    console.log('Create setWaterBalanceChart', lines);

    // serie of data of accumulated volume
    let volume = [];
    let volume_time = [];
    let volume_date = [];
    let cont_group = 0;

    for(let i=0;i<lines.length;i++){
      for(let j=0;j<lines[i].groups.length;j++){
        console.log(lines[i].groups[j]);
        // console.log(cont_group);
        if(this.activeSector._id==lines[i].groups[j].sector._id){

          if(cont_group==0){
            for(let k=0;k<lines[i].groups[j].groupedIrrigation.length;k++){
              volume.push(
                { "y": lines[i].groups[j].groupedIrrigation[k],
                "container": "container-highchart-water-balance" }
              );
              volume_time.push(new Date().getTime() - (k+1)*(60*60*24*1000));
              volume_date.push(new Date(volume_time[k]).toLocaleString());
            }
          }else{
            for(let k=0;k<lines[i].groups[j].groupedIrrigation.length;k++){
              volume[k].y = volume[k].y + lines[i].groups[j].groupedIrrigation[k];
            }
          }
          cont_group++;

        }

      }
    }

    console.log('data volume ->');
    console.log(volume);
    console.log(volume_time);
    console.log(volume_date);

    // console.log('water potentials ->');
    // console.log(this.waterPotentials);
    let categories = [];

    console.log('volume top limit');
    console.log(volume_time[volume.length-1]);

    for(let grid_ of this.waterPotentials){
      let dat_ = (new Date(grid_.createdDate).getTime());

      if(  (dat_>0) && (dat_>=volume_time[volume.length-1]) && (!categories.includes(dat_))  ){
        console.log('add dat_', dat_);
        categories.push(dat_);
      }

    }

    categories.sort((a, b)=> {
      return a - b;
    });

    console.log('volume categories ->');
    console.log(categories);

    let volume_serie = [];
    for(let cat_ of categories){

      console.log('test cat ->');
      console.log(new Date(cat_).toLocaleString());

      let sum_volume = 0;
      let volume_time_index = 0;
      for(let vol_ of volume){
        if(volume_time[volume_time_index]>=cat_){
          sum_volume = sum_volume + vol_.y;
        }
        volume_time_index++;
      }
      volume_serie.push(sum_volume);
    }

    console.log('volume series ->');
    volume_serie.sort((a, b)=> {
      return a - b;
    });
    console.log(volume_serie);




    let yAxisTitleVolume = 'Riego Acumulado (mm) ';
    let yAxisColorVolume = '#7BD9CE';
    let yAxisUnitVolume = ' ';

    // título, color, unidad, y data, 'spline', ...
    let volumeData = this.commonService.createChartTemplate(
      yAxisTitleVolume,
      yAxisColorVolume,
      yAxisUnitVolume,
      volume_serie,
      'spline',
      0, false, [], null, null);

    this.xAxis.chart2 = [{
      categories: categories,
      labels: {
        format: '{value: %b %e %Y}',
        style: this.commonService.style
      },
      crosshair: true,
      tickInterval: 1
    }];

    // volumeData.serie
    // chartOptionsVolume: Highcharts.Options = null;
    // chartVolume: ChartData = null;

    let auxYAxisData = volumeData.yAxis;
    this.yAxis.chart2 = [auxYAxisData];

    let title = 'Balance Hídrico - ' + this.activeSector.name;

    this.chartVolume = new ChartData( title, [volumeData.serie], this.xAxis.chart2, this.yAxis.chart2, this.period);
    this.chartVolume.title = title;
    this.chartOptionsVolume = this.commonService.createChart(this.chartVolume, true, [], this);

    this.chartOptionsVolume['chart']['renderTo'] = 'container-highchart-water-balance';

    Highcharts.chart(this.chartOptionsVolume);

  }

  async setWaterBalanceChart_() {

    var lines = await this.getLinesCustom(this.field._id, this.period.from, this.period.to);
    // var linesMonitor = await this.getLinesFromMonitor(this.field._id, 'week');
    // lines = lines.concat(linesMonitor);
    this.linesData = lines;

    // TODO: fala filtrar por sector
    // this.activeSector.name

    console.log(' sector ->');
    console.log(this.activeSector);

    console.log('Create setWaterBalanceChart', lines);

    // serie of data of accumulated volume
    let volume = [];
    let volume_time = [];
    let volume_date = [];
    let cont_group = 0;

    for(let i=0;i<lines.length;i++){
      for(let j=0;j<lines[i].groups.length;j++){
        console.log(lines[i].groups[j]);
        // console.log(cont_group);
        if(this.activeSector._id==lines[i].groups[j].sector._id){

          if(cont_group==0){
            for(let k=0;k<lines[i].groups[j].groupedIrrigation.length;k++){
              let date_ = new Date().getTime() - (k+1)*(60*60*24*1000);
              volume.push([date_ ,lines[i].groups[j].groupedIrrigation[k]]);
              volume_time.push(date_);
              volume_date.push(new Date(volume_time[k]).toLocaleString());
            }
          }else{
            for(let k=0;k<lines[i].groups[j].groupedIrrigation.length;k++){
              volume[k][1] = volume[k][1] + lines[i].groups[j].groupedIrrigation[k];
            }
          }
          cont_group++;

        }

      }
    }

    console.log('data volume ->');
    console.log(volume);
    let volume_serie = [];
    //--------------------------------------------------------------------
    //--------------------------------------------------------------------

    let categories = [];
    let etc_serie = [];

    console.log('volume top limit');
    let lmit_time_etc = this.period.from;

    for(let grid_ of this.waterPotentials){
      let date_ = (new Date(grid_.createdDate).getTime());

      if(  (date_>0) && (date_>=lmit_time_etc) && (!categories.includes(date_))  ){
        //console.log('add dat_', grid_);
        categories.push(date_);
        if(etc_serie.length==0){
          // [new Date(d.createdDate).getTime(), Number((d.irrigationLine))]
          etc_serie.push([date_, grid_.etc]);


          let sum_volume_serie = 0;
          for(let vol of volume){
            if(vol[0]<date_){
              sum_volume_serie = sum_volume_serie + vol[1];
            }
          }
          volume_serie.push([date_, sum_volume_serie]);

          //console.log('add -> ');
          //console.log(grid_.etc);
        }else{
          let add = (etc_serie[etc_serie.length-1][1] + grid_.etc);
          //console.log('anterior ->', etc_serie[etc_serie.length-1][1]);
          //console.log('actual ->', grid_.etc)
          etc_serie.push([date_, add]);
          //console.log('add -> ');
          //console.log(add);

          let sum_volume_serie = 0;
          for(let vol of volume){
            if(vol[0]<date_){
              sum_volume_serie = sum_volume_serie + vol[1];
            }
          }
          volume_serie.push([date_, sum_volume_serie]);


        }
      }

    }

    /*categories.sort((a, b)=> {
      return a - b;
    });

    etc_serie.sort((a, b)=> {
      return a - b;
    });*/



    console.log('etc categories ->');
    console.log(categories);

    console.log('etc series ->');
    console.log(etc_serie);




    let time_volume_series = [];
    let real_volume_series = [];
    for(let vol of volume_serie){
      time_volume_series.push(vol[0]);
    }
    time_volume_series.sort((a, b)=> {
      return a - b;
    });
    for(let vol of time_volume_series){
      for(let vol_ of volume_serie){
        if(vol==vol_[0]){
          real_volume_series.push([vol_[0],vol_[1]]);
        }
      }
    }

    console.log('volume series ->');
    console.log(real_volume_series);



    let yAxisTitleETC = 'ETC ';
    let yAxisColorETC = 'yellow';
    let yAxisUnitETC = ' ';

    let yAxisTitleVolume = 'AguaAplicada (mm) ';
    let yAxisColorVolume = '#7BD9CE';
    let yAxisUnitVolume = ' ';


    // título, color, unidad, y data, 'spline', ...
    let volumeData = this.commonService.createChartTemplate(
      yAxisTitleVolume,
      yAxisColorVolume,
      yAxisUnitVolume,
      real_volume_series,
      'spline',
      0, false, [], null, 0);

    let etcData = this.commonService.createChartTemplate(
      yAxisTitleETC,
      yAxisColorETC,
      yAxisUnitETC,
      etc_serie,
      'spline',
      0, false, [], null, 0);

    /*this.xAxis.chart2 = [{
      //categories: categories,
      labels: {
        format: '{value: %b %e %Y}',
        style: this.commonService.style
      },
      crosshair: true,
      tickInterval: 1
    }];*/

    this.xAxis.chart2 = [{
      // categories: categories,
      type: 'datetime',
      labels: {
        style: this.commonService.style,
        format: '{value: %e %b %y}'
      },
      crosshair: true,
      tickInterval: 0
    }];






    // volumeData.serie
    // chartOptionsVolume: Highcharts.Options = null;
    // chartVolume: ChartData = null;

    let auxYAxisData = volumeData.yAxis;
    this.yAxis.chart2 = [auxYAxisData];

    let title = 'Balance Hídrico - ' + this.activeSector.name;

    this.chartVolume = new ChartData( title, [volumeData.serie, etcData.serie], this.xAxis.chart2, this.yAxis.chart2, this.period);
    this.chartVolume.title = title;
    this.chartOptionsVolume = this.commonService.createChart(this.chartVolume, true, [], this);

    this.chartOptionsVolume['chart']['renderTo'] = 'container-highchart-water-balance';

    Highcharts.chart(this.chartOptionsVolume);

  }


  async getLinesCustom(field, from, to): Promise<any> {
    return new Promise((resolve, reject) => {
      this.indicatorService.getFieldLinesCustom(field, from, to).subscribe((response) => {
        // console.log('getFieldLinesCustom', response);
        let lines = []
        for (var i in response.data) {
          if (response.data[i].groups?.length) {
            lines.push(response.data[i]);
          }
        }
        resolve(lines)
      }, (error) => {
        console.log(error);
      });
    })
  }

}
