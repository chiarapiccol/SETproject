
import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import * as d3 from 'd3';
import { firstValueFrom } from 'rxjs';
import { commonCountries, matCountries } from 'src/app/models/country';
import { mat, matChar, model_listColorMat, model_listFullnameMat, model_listIconMat } from 'src/app/models/mat';
import { model_connectionTechMat, model_listColorTech, model_listFullnameTech, tech, techChar, techCharGroup } from 'src/app/models/tech';
import { BackendService } from 'src/app/services/backend.service';
import { $enum } from 'ts-enum-util';


@Component({
  selector: 'app-pievis',
  templateUrl: './pievis.component.html',
  styleUrls: ['./pievis.component.css']
})
export class PievisComponent {

  //// local variables -  from parent component

  private _toFetchTech!: tech[];
  private _toFetchMat!: mat[];

  @Input()
  set toFetchTech(value: tech[]) {
    this._toFetchTech = value;
  }
  get toFetchTech(): tech[] {
    return this._toFetchTech;
  }

  @Input()
  set toFetchMat(value: mat[]) {
    this._toFetchMat = value;
  }
  get toFetchMat(): mat[] {
    return this._toFetchMat;
  }

  @Input() toVisHeapMat: any = ''
  @Input() toVisHeapAct: any = ''
  @Input() toVisHeatCountr: any = ''

  //// local variables - html variables and functions

  selectedColor: string[] = ['Material Activities', matChar.p, matChar.i, matChar.e]
  checkedColor: string[] = [matChar.p, matChar.i, matChar.e]
  selectedSize: string[] = ['Material Activities', matChar.p, matChar.i, matChar.e]
  chekedSize: string[] = [matChar.p, matChar.i, matChar.e]
  selectedX: string[] = [matChar.p]
  checkedX: string[] = [matChar.p]
  selectedY: string[] = [matChar.i,matChar.e ]
  checkedY: string[] = [matChar.i, matChar.e]

  countries: commonCountries[] = $enum(commonCountries).getValues();
  selectedCountries: commonCountries[] = this.countries;
  toFetchCountrs: commonCountries[] = this.countries;

  fullNameListExtraTech: string[] = ['Other sustainable Technology', 'Sustainable Electricity', 'Sustainable Heat']
  listExtraTech: string[] = ['Other RE', 'Electricity', 'Heat']
  selectedExtraTech: any[] = this.listExtraTech

  techFilters: string[] = [techChar.Production, techChar.Imports, techChar.Exports, techChar.Stock, techChar.Residential, techChar.Industry, techChar.Commerce, techChar.Transport, techChar.Other, techChar.DirectUse, techChar.Heat, techChar.Electricity]
  matFilters: string[] = [matChar.p, matChar.i, matChar.e]
  techList: tech[] = $enum(tech).getValues();
  matList: mat[] = $enum(mat).getValues();
  connectionTechMat = model_connectionTechMat

  chartFiltersOptions: any[] = [
    {
      name: "Energy Suppy",
      subCat: ['Energy Suppy', techChar.Production, techChar.Imports, techChar.Exports, techChar.Stock]
    },
    {
      name: "Energy Use",
      subCat: ['Energy Use', techChar.Residential, techChar.Industry, techChar.Commerce, techChar.Transport, techChar.Other]
    },
    {
      name: "Energy Consumption",
      subCat: ['Energy Consumption', techChar.DirectUse, techChar.Heat, techChar.Electricity]
    },
    {
      name: "Material Activities",
      subCat: ['Material Activities', matChar.p, matChar.i, matChar.e]
    },
    {
      name: "Countries Population",
      subCat: []
    },
    {
      name: "Countries Politics",
      subCat: []
    },
    {
      name: "Countries Economies",
      subCat: []
    }
  ]

  //// local variables - html variables and functions  - filters 

  setMarginsFilterOptions(last: any) { // set margin distance to distinguish the levels
    const mainNames: string[] = this.chartFiltersOptions.map(option => option.name);
    if (mainNames.indexOf(last) > -1) {
      return { 'margin-left': '0px' }
    } else {
      return { 'margin-left': '10px' }
    }
  }

  lastCkick = '' // help-variable

  returnLastClick(last: any) { // function to save the last selected filter into the local variable lastCkick - necessary to all the other helpfunctions 
    this.lastCkick = last
  }

  sameGroup(selList: any, last: any) { // help-function called by the function 'check' to verify if the last selected filter is in the same group as the ones already selected
    let selGroup
    let lastGroup
    selList = selList.filter((item: any) => item != last);
    for (let i = 0; i < this.chartFiltersOptions.length; i++) {
      if (this.chartFiltersOptions[i].subCat.includes(selList[0]) || this.chartFiltersOptions[i].name === selList[0]) {
        selGroup = i;
      }
    }
    for (let i = 0; i < this.chartFiltersOptions.length; i++) {
      if (this.chartFiltersOptions[i].subCat.includes(last) || this.chartFiltersOptions[i].name === last) {
        lastGroup = i;
      }
    }
    return (selGroup === lastGroup ? true : false)
  }

  selectAllVar(last: string): any[] { // help-function called by the function 'check' to select all filters within the group of the last selected filter
    let lastGroup = 999
    for (let i = 0; i < this.chartFiltersOptions.length; i++) {
      if (this.chartFiltersOptions[i].name === last) {
        lastGroup = i;
      }
    }
    let toRet: string[] = this.chartFiltersOptions[lastGroup].subCat
    return toRet
  }

  retGroup(last: string): string[] { // help-function called by the function 'check' to return the group of the last selected filter
    let lastGroup = 999;
    for (let i = 0; i < this.chartFiltersOptions.length; i++) {
      if (this.chartFiltersOptions[i].subCat.includes(last)) {
        lastGroup = i;
      }
    }
    let toRet = this.chartFiltersOptions[lastGroup].subCat
    return toRet
  }

  check(selList: any[]) { // help-function called by other 'check'-functions to administrate the filters selection for all cases
    const mainNames: string[] = this.chartFiltersOptions.map(option => option.name);
    const last = this.lastCkick
    let selectedVar = selList

    if (selectedVar.indexOf(last) > -1) { // if lastClicked actually selected
      if (!this.sameGroup(selectedVar, last)) { // if not same group - reselect
        if (mainNames.indexOf(last) > -1) { // if a main catagory 
          selectedVar = this.selectAllVar(last)
        } else { // if not a main catagory 
          selectedVar = [last]
        }
      }
      else { // if same group
        if (mainNames.indexOf(last) > -1) { // if a main catagory 
          selectedVar = this.selectAllVar(last)
        } else { // if not main category
          var mainC = this.retGroup(last)
          if (selectedVar.length + 1 === mainC.length) { // if it is 1 of all subs
            selectedVar = mainC
          }
        }
      }
    } else { // if lastClicked deselected
      if (mainNames.indexOf(last) > -1) { // if a main catagory 
        selectedVar = []
      } else { // if not main category
        var mainC = this.retGroup(last)
        if (selectedVar.length + 1 === mainC.length) { // if it is 1 of all subs
          selectedVar = selectedVar.filter((item: any) => item != mainC[0]);
        }
      }
    }
    return selectedVar
  }

  checkCol(selList: any[]) {  // function calling the function 'check' to administrate the filters selection for all cases regarding the 'col'-filters
    const mainNames: string[] = this.chartFiltersOptions.map(option => option.name);
    let result = this.check(selList)
    this.selectedColor = result // set selectedColor - which are dispayed in html
    mainNames.forEach(function (e) {
      if (result.includes(e)) {
        result = result.filter((item: any) => item != e)
      }
    })
    this.checkedColor = result // set checkedColor - which are used for http request (only consider mainNames and not the grouptitels)
    this.updatePieChartPlot()
  }

  checkSize(selList: any[]) { // function calling the function 'check' to administrate the filters selection for all cases regarding the 'size'-filters
    const mainNames: string[] = this.chartFiltersOptions.map(option => option.name);
    let result = this.check(selList)
    this.selectedSize = result // set selectedSize - which are dispayed in html
    mainNames.forEach(function (e) {
      if (result.includes(e)) {
        result = result.filter((item: any) => item != e)
      }
    })
    this.chekedSize = result // set chekedSize - which are used for http request (only consider mainNames and not the grouptitels)
    this.updatePieChartPlot()
  }

  checkX(selList: any[]) { // function calling the function 'check' to administrate the filters selection for all cases regarding the 'x'-filters
    const mainNames: string[] = this.chartFiltersOptions.map(option => option.name);
    let result = this.check(selList)
    this.selectedX = result // set selectedX - which are dispayed in html
    mainNames.forEach(function (e) {
      if (result.includes(e)) {
        result = result.filter((item: any) => item != e)
      }
    })
    this.checkedX = result // set checkedX - which are used for http request (only consider mainNames and not the grouptitels)
    this.updatePieChartPlot()
  }

  checkY(selList: any[]) { // function calling the function 'check' to administrate the filters selection for all cases regarding the 'y'-filters
    const mainNames: string[] = this.chartFiltersOptions.map(option => option.name);
    let result = this.check(selList)
    this.selectedY = result // set selectedY - which are dispayed in html
    mainNames.forEach(function (e) {
      if (result.includes(e)) {
        result = result.filter((item: any) => item != e)
      }
    })
    this.checkedY = result // set checkedY - which are used for http request (only consider mainNames and not the grouptitels)
    this.updatePieChartPlot()
  }

  onKey(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedCountries = this.search(value);
  }

  search(value: string) {
    const filter = value.toLowerCase();
    return this.countries.filter(option => option.toLowerCase().includes(filter));
  }

  checkCountr() {
    this.chooseVisCountries(true)
  }

  checkExtraTech() {
    this.ngOnChanges()
  }

  //// local variables - variables and functions for svg

  showVisWorld = true
  showVisContries = false
  hideFilterWorld = false
  hideFilterCountries = true

  initialized = false;

  blockedVis = false;
  toppTioIcon = 'unblocked'
  blockedIcon = ['unblocked', 'blocked']
  blockIconList = ['bookmark_border', 'bookmark']
  blockIcon = 'bookmark_border'

  pieChartData: any[] | null = null;
  pieChartData_old: any[] | null = null;
  piePlotData: any[] | null = null;
  piePlotData_old: any[] | null = null;
  @ViewChild('pieChartPlot') pieChartPlotHTML!: ElementRef;

  margin!: any
  svg_1!: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  colTech = model_listColorTech
  colMat = model_listColorMat
  xAxis_plot!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  yAxis_plot!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  //// local variables - for parent component

  @Output() pieVisView = new EventEmitter<string>()

  infoNameTableChart = [[], [], []]
  infoNameTablePlot = [[], []]

  techODERmat: any = ''
  dimToderM: any
  minToderM: any
  maxToderM: any

  tooltip!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
  tableDataChart: any = [
    { position: 1, name: '', loc: 'worldwide', amount: 0, perc: 0 },
    { position: 2, name: '', loc: 'worldwide', amount: 0, perc: '100%' },
  ];
  @Output() pieChartNameTable = new EventEmitter<any[]>();


  tableDataPlot: any = [
    { position: 1, countr: '', size: '', x: 0, y: '' },
  ];
  @Output() piePlotNameTable = new EventEmitter<any[]>();

  //// constructor
  constructor(private backendService: BackendService) { }

  //// ngOnInit
  async ngOnInit() { }

  //// ngOnDestroy
  async ngOnDestroy() { }

  ///// ngAfterViewInit - (ngOnInit would not read the html properties in time)
  async ngAfterViewInit() {
    this.createSVG1() //create SVGs
    this.callSQLfunk('createPieChart').then((data) => { //set data and create visualization direct after initialization
      this.pieChartData = data;
      this.createPieChart()
    });
    this.initialized = true;   // set initialized to true, so that ngOnChanges can be run in the next steps
  }

  //// onPieResize
  onPieResize(event: ResizedEvent) {
    d3.selectAll("#pieChartPlot_svg").selectChildren().remove();
    this.createSVG1()
    if (this.showVisWorld === true) {
      if (this.blockedVis === true) {
        this.pieChartData = this.pieChartData_old
        console.log(this.pieChartData_old)
      }
      this.createPieChart()
    }
    if (this.showVisContries === true) {
      if (this.blockedVis === true) {
        this.piePlotData = this.piePlotData_old
      }
      this.createPiePlot()
    }
  }

  checkChartFilter(): boolean {
    return (this.selectedColor.length !== 0)
  }

  checkPlotFilter(): boolean {
    return (this.selectedColor.length !== 0 && this.selectedSize.length !== 0 && this.selectedX.length !== 0 && this.selectedY.length !== 0 && this.selectedCountries.length != 0) // if selections have been made - in this or the other view
  }

  //// updatePieChartPlot
  async updatePieChartPlot() {
    if (this.initialized) {
      if (this.showVisWorld === true) { // if selected showVisWorld
        this.chooseVisWorld(true)
      } else { // if selected showVisCountr
        this.chooseVisCountries(true)
      }
    }
  }


  //// function - set views formats
  chooseVisWorld(selWorldPersp: any) {
    this.pieVisView.emit('pieChart')
    if (this.blockedVis === false) { // if it is not blocked
      d3.selectAll("#pieChartPlot_svg").selectChildren().remove(); // remove svg since this is either replaced or not displayed
      if (selWorldPersp === true) { // selected WorldView - one view choosen
        this.showVisWorld = true
        this.showVisContries = false
        this.hideFilterWorld = false
        this.hideFilterCountries = true
        if (this.checkChartFilter()) { // if selections have been made - in this or the other view
          this.callSQLfunk('createPieChart').then((data) => {
            this.pieChartData = data;
            this.createSVG1()
            this.createPieChart()
          });
        } else {
          this.createSVG1()
        }
      }
      else { //deselect WorldView - no view choosen
        this.showVisWorld = false
        this.showVisContries = false
        this.hideFilterWorld = true
        this.hideFilterCountries = true
        this.createSVG1()
      }
    } //if it is blocked
    else {
      if (selWorldPersp === true) {  // selected WorldView - one view choosen
        this.showVisWorld = true
        this.showVisContries = false
        this.hideFilterWorld = false
        this.hideFilterCountries = true
      }
      else { //deselect WorldView - no view choosen
        this.showVisWorld = false
        this.showVisContries = false
        this.hideFilterWorld = true
        this.hideFilterCountries = true
      }
    }
  }

  chooseVisCountries(selConuntrPersp: any) {
    this.pieVisView.emit('piePlot')
    if (this.blockedVis === false) { // if not blocked
      d3.selectAll("#pieChartPlot_svg").selectChildren().remove(); // remove svg since this is either replaced or not displayed
      if (selConuntrPersp === true) { // selected WorldView - one view choosen
        this.showVisWorld = false
        this.showVisContries = true
        this.hideFilterWorld = true
        this.hideFilterCountries = false
        if (this.checkPlotFilter()) { // if selections have been made - in this or the other view
          this.callSQLfunk('createPiePlot').then((data) => {
            this.piePlotData = data;
            this.createSVG1()
            this.createPiePlot()
          });
        } else {
          this.createSVG1()
        }
      }
      else { //deselect WorldView - no view choosen
        this.showVisWorld = false
        this.showVisContries = false
        this.hideFilterWorld = true
        this.hideFilterCountries = true
        this.createSVG1()
      }
    } //if blocked
    else {
      if (selConuntrPersp === true) {  // selected WorldView - one view choosen
        this.showVisWorld = false
        this.showVisContries = true
        this.hideFilterWorld = true
        this.hideFilterCountries = false
      }
      else { //deselect WorldView - no view choosen
        this.showVisWorld = false
        this.showVisContries = false
        this.hideFilterWorld = true
        this.hideFilterCountries = true
      }
    }
  }

  //// ngOnChanges
  async ngOnChanges(changes?: SimpleChanges): Promise<void> {
    if (this.initialized) {
      if (this.blockedVis === false) {
        if (this.toFetchMat.length !== 0 && this.toFetchTech.length !== 0) { // if it is not blocked
          if ((this.showVisWorld === true && this.showVisContries === false) || (this.showVisWorld === false && this.showVisContries === true)) { // selected WorldView - one view choosen
            if (this.showVisWorld === true) {
              this.callSQLfunk('createPieChart').then((data) => {
                this.pieChartData = data;
                this.createPieChart()
              });
            } else {
              this.callSQLfunk('createPiePlot').then((data) => {
                this.piePlotData = data;
                this.createPiePlot()
              });
            }
          }
        } else { //deselect WorldView - no view choosen
          d3.selectAll("#pieChartPlot_svg").selectChildren().remove(); // remove svg since this is either replaced or not displayed
          this.createSVG1()
        }
      }
    }
  }

  //// function - blockVis
  async blockVis() {
    if (this.blockedVis === false) {  // if not blocked, then block
      if (this.showVisWorld === true) {
        this.pieChartData_old = this.pieChartData
      }
      if (this.showVisContries === true) {
        this.piePlotData_old = this.piePlotData
      }
      this.blockedVis = true;
      this.blockIcon = this.blockIconList[1]
      this.toppTioIcon = this.blockedIcon[1]
    }
    else {   // if blocked, then sblock and create vis
      this.blockedVis = false;
      this.blockIcon = this.blockIconList[0]
      this.toppTioIcon = this.blockedIcon[0]
      if (this.showVisWorld === true) {
        this.chooseVisWorld(true)
      }
      if (this.showVisContries === true) {
        this.chooseVisCountries(true)
      }
    }
  }

  //// callSQLfunk
  async callSQLfunk(funkName: string): Promise<any[]> {
    var data!: any[];
    if (funkName === 'createPiePlot') {
      data = await firstValueFrom(this.backendService.fetchpiePlot(this.toFetchCountrs, this.checkedColor, this.chekedSize, this.checkedX, this.checkedY, this.toFetchTech.concat(this.selectedExtraTech), this.toFetchMat))
    }
    if (funkName === 'createPieChart') {
      data = await firstValueFrom(this.backendService.fetchpieChart(this.checkedColor, this.toFetchTech.concat(this.selectedExtraTech), this.toFetchMat))
    }
    return data;
  }


  //// createSVG
  createSVG1() {
    var width = this.pieChartPlotHTML.nativeElement.offsetWidth
    var height = this.pieChartPlotHTML.nativeElement.offsetHeight
    this.margin = { top: height / 10, right: width / 10, bottom: height / 10, left: width / 10 }

    if (this.showVisWorld === true) { // if we want to display pieChart
      this.svg_1 = d3.select('#pieChartPlot_svg')
        .attr("width", width).attr("height", height)
        .append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    }
    else { // if we want to display piePlot
      this.svg_1 = d3.select('#pieChartPlot_svg')
        .attr("width", width).attr("height", height)
        .append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      this.xAxis_plot = this.svg_1.append("g").attr("id", "xAxis")
      this.xAxis_plot.append("text").attr("class", "xLabel")
      this.yAxis_plot = this.svg_1.append("g").attr("id", "yAxis")
      this.yAxis_plot.append("text").attr("class", "yLabel")
    }

    this.tooltip = d3.select("#pieChartPlot_tooltip")
      .style("color", "white")
      .style("background", "#6b6b6b")
      .style("border-radius", "5px").style("padding", "5px")
  }

  //// createPieChart
  async createPieChart() {

    // assign global variables to local variables in the function createPieChart()

    const data = this.pieChartData;
    const svg = this.svg_1
    const tooltip = this.tooltip
    const width = this.pieChartPlotHTML.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    const height = this.pieChartPlotHTML.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;
    const radius = Math.min(width, height) / 2;

    // check if data is empty

    if (data === null) {
      return;
    }

    // functions - calculate and create coordinates, scale, lines, and colors

    let valuesMinMax: [any, any] = d3.extent(data.map(function (d) { return d.values }))  // set pie and arcs
    let myScale = d3.scalePow().exponent(1).domain(valuesMinMax).range(valuesMinMax);
    var pie = d3.pie<any>().value(function (d) { return Math.max(myScale(d.values), valuesMinMax.slice(1)[0] / 30) })
    var arc = d3.arc<d3.PieArcDatum<any>>().innerRadius(0).outerRadius(radius)

    const techPie: boolean = (this.techFilters.indexOf(this.checkedColor[0])) > -1 // set colors
    let ordScale = techPie ? this.colTech : this.colMat;
    const ordscaleTOcolor = (d: any) => {
      if (techPie) {
        const name = d.data.slices
        const index = this.techList.indexOf(name)
        return ordScale[index] + 1 + ')'
      }
      else {
        const name = d.data.slices
        const index = this.matList.indexOf(name)
        return ordScale[index] + 1 + ')'
      }
    }

    // functions - mouse functions

    const mouseover = (event: any, d: any) => {
      tooltip.style("visibility", "visible")
      let varCol: string = ''
      for (let i = 0; i < this.checkedColor.length; i++) {
        if (i < this.checkedColor.length - 1) {
          varCol = varCol + this.checkedColor[i] + ', '
        } else {
          varCol = varCol + this.checkedColor[i]
        }
      }
      const nameId = d.data.slices
      const sumSelectedValues_oneSlice = Math.round(d.data.values)
      const sumSelectedValues_allSlices = data.reduce((acc, obj) => acc + obj.values, 0); //(tj) kt

      if (techPie) { // if technologies has been selected
        const index = this.techList.indexOf(nameId)
        const fullName = index > -1 ? model_listFullnameTech[index] : nameId
        const strokeCol = ordScale[index] + 1 + ')'
        this.techODERmat = 'Technology'
        // tooltip
        tooltip.html('Technology: ' + fullName)
        // informationBox        
        this.tableDataChart[0].name = fullName // set table values
        this.tableDataChart[0].amount = sumSelectedValues_oneSlice + ' (tj)'// set table values
        this.tableDataChart[0].perc = Math.round(sumSelectedValues_oneSlice / sumSelectedValues_allSlices * 10000) / 100 + '%' // set table values
        this.tableDataChart[1].name = 'All Technologies' // set table values
        this.tableDataChart[1].amount = Math.round(sumSelectedValues_allSlices * 100) / 100 // set table values
        this.infoNameTableChart[0] = fullName
        this.infoNameTableChart[2] = this.techODERmat
        this.infoNameTableChart[1] = this.tableDataChart
        this.pieChartNameTable.emit(this.infoNameTableChart)
        // pieChart
        if (!svg.select("#" + nameId.toString().replace(/\s/g, '')).empty()) {
          svg.selectAll('path').attr("fill-opacity", .4)
          svg.select("#" + nameId.toString().replace(/\s/g, '')).attr("fill-opacity", 1)
        }
        // spiderDiagram
        d3.select("#spiderDiagr_svg").selectAll('#' + nameId.toString().replace(/\s/g, '')).raise().transition().duration(100).attr("fill", strokeCol).attr("fill-opacity", .7) // set attributes spider chart - color
        // sankeyDiagram        
        d3.select('.sankeyDiagr_svg').selectAll("#" + nameId.toString().replace(/\s/g, '')).raise().attr("stroke-opacity", 1) // set attributes sankeydiagram
      }
      else { // if materials has been selected
        const index = this.matList.indexOf(nameId)
        const fullName = index > -1 ? model_listFullnameMat[index] : nameId
        const shortName = model_listIconMat[index]
        this.techODERmat = 'Material'
        // tooltip
        tooltip.html('Material: ' + fullName )
        // informationBox        
        this.tableDataChart[0].name = fullName // set table values
        this.tableDataChart[0].amount = sumSelectedValues_oneSlice + ' (tT)' // set table values
        this.tableDataChart[0].perc = Math.round(sumSelectedValues_oneSlice / sumSelectedValues_allSlices * 10000) / 100 + '%' // set table values
        this.tableDataChart[1].name = 'All Materials' // set table values
        this.tableDataChart[1].amount = Math.round(sumSelectedValues_allSlices * 100) / 100  // set table values
        this.tableDataChart
        this.infoNameTableChart[0] = fullName
        this.infoNameTableChart[2] = this.techODERmat
        this.infoNameTableChart[1] = this.tableDataChart
        this.pieChartNameTable.emit(this.infoNameTableChart)
        // pieChart
        if (!svg.select("#" + nameId.toString().replace(/\s/g, '')).empty()) {
          svg.selectAll('path').attr("fill-opacity", .4)
          svg.select("#" + nameId.toString().replace(/\s/g, '')).attr("fill-opacity", 1)
        }
        // sankeyDiagram 
        d3.select('.sankeyDiagr_svg').selectAll("." + nameId.toString().replace(/\s/g, '')).raise().attr("stroke-opacity", 1) // set attributes sankeydiagram
        // heatmap
        const heatMapView = d3.select('#heatMap_svg').select('#xAxis').attr("perspect")
        const height: any = d3.select('#heatMap_svg').attr("height")
        const widthSVGspiderheat: any = d3.select('#heatMap_svg').attr("width")
        const marginLeft: any = d3.select('#heatMap_svg').attr("marginLeft")
        const marginRight: any = d3.select('#heatMap_svg').attr("marginRight")
        const marginTop: any = d3.select('#heatMap_svg').attr("marginTop")
        var paddingValue = 0.1
        if (heatMapView === 'Mat' && this.toVisHeapMat.indexOf(shortName) > -1) {
          var actLentght = this.toVisHeapAct.length
          var x = d3.scaleBand().range([0, widthSVGspiderheat - marginLeft - marginRight]).domain(this.toVisHeapMat).padding(paddingValue)
          var xForXmat: any = x(shortName)
          var widthForXmat: any = x.bandwidth() / actLentght
          d3.select("#heatMap_svg").append('rect').attr("class", 'heatMap_hoveringRect')
            .attr("x", xForXmat + (+marginLeft))
            .attr("y", 0 + marginTop * 0.2)
            .attr("width", (widthForXmat * actLentght))
            .attr("height", height)
            .style("fill", 'rgb(192,192,192, .5)')
        }
        // spiderDiagr
        var widthSVGspider: any = d3.select("#spiderDiagr_svg").attr('width')
        var heightSVG: any = d3.select("#spiderDiagr_svg").attr('height')
        const marginSpider: any = Math.min(widthSVGspider, heightSVG) / 10
        var widthSpider = widthSVGspider - (marginSpider * 2);
        var heightSpider = heightSVG - (marginSpider * 2);
        let features = model_listFullnameMat
        let line_coord: any
        let radialScale = d3.scalePow().exponent(.3).domain([0, 100]).range([0, Math.min((widthSpider / 2), (heightSpider / 2))]);
        function angleToCoordinate(angle: any, value: any) {
          let x = Math.cos(angle) * radialScale(value);
          let y = Math.sin(angle) * radialScale(value);
          return { "x": widthSpider / 2 + marginSpider - x, "y": heightSpider / 2 + marginSpider - y };
        }
        features.map((f, i) => {
          if (f.toLowerCase() === fullName.toLowerCase()) {
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            line_coord = angleToCoordinate(angle, 100)
          }
        })
        d3.select("#spiderDiagr_svg").append('line').attr("class", 'spiderChart_hoveringRect').attr("stroke", 'rgba(192, 192, 192, 0.5)')
          .attr("stroke-width", '20px').attr("stroke-linecap", "round")
          .attr("x1", widthSpider / 2 + marginSpider).attr("y1", heightSpider / 2 + marginSpider)
          .attr("x2", line_coord.x).attr("y2", line_coord.y)

      };
    }

    const mouseleave = (event: any, d: any) => {
      tooltip.style("visibility", "hidden");
      const nameId = d.data.slices

      if (techPie) { // if technologies has been selected
        const index = this.techList.indexOf(nameId)
        // pieChart
        svg.selectAll('path').attr("fill-opacity", 1)
        // spiderDiagram
        d3.select("#spiderDiagr_svg").selectAll('#' + nameId.toString().replace(/\s/g, '')).transition().duration(100).attr("fill", 'none') // set attributes spider chart - color
        // sankeyDiagram
        d3.select('.sankeyDiagr_svg').selectAll("#" + nameId.toString().replace(/\s/g, '')).raise().attr("stroke-opacity", .2) // set attributes sankeydiagram
      }
      else { // if materials has been selected 
        const index = this.matList.indexOf(nameId)
        // pieChart
        svg.selectAll('path').attr("fill-opacity", 1)
        // sankeyDiagram
        d3.select('.sankeyDiagr_svg').selectAll("." + nameId.toString().replace(/\s/g, '')).raise().attr("stroke-opacity", .2) // set attributes sankeydiagram
        // spiderDiagr
        d3.select("#spiderDiagr_svg").select('.spiderChart_hoveringRect').remove()
        // heatmap
        d3.select("#heatMap_svg").select('.heatMap_hoveringRect').remove()
      }
    }

    const mousemove = (event: any, d: any) => {
      tooltip.style("top", (event.pageY + 10) + "px").style("left", (event.pageX + 10) + "px");
    };

    // plot global pie chart for selected technologies/materials

    svg.selectAll("path")
      .data(pie(data))
      .join(
        function (enter) {
          return enter.append("path")
            .attr('d', arc)
        },
        function (update) {
          return update.transition().duration(1000).attr('d', arc)
        },
        function (exit) {
          return exit.remove();
        }
      )
      .attr('fill', ordscaleTOcolor)
      .attr("id", function (d) { return d.data.slices.toString().replace(/\s/g, '') })
      .attr("tech", function (d: any) { return d.data.slices })
      .attr("value", function (d: any) { return d.data.values })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  }


  async createPiePlot() {

    // assign global variables to local variables in the function createPiePlot()

    const data = this.piePlotData;
    const svg = this.svg_1
    const margin = this.margin
    const tooltip = this.tooltip
    const width = this.pieChartPlotHTML.nativeElement.offsetWidth - margin.left - margin.right;
    const height = this.pieChartPlotHTML.nativeElement.offsetHeight - margin.top - margin.bottom;
    const xAxis = this.xAxis_plot
    const yAxis = this.yAxis_plot

    // check if data is empty

    if (data === null) {
      return;
    }

    // functions - create data grouped by countries necessary for the creation of piecharts 

    var noZeroCountries: any[] = [] // consider only countries having either size or x and y coordinated unequal zero
    data.forEach(function (elem) {
      if (!(elem.size === 0 || (elem.x + elem.y === 0))) {
        noZeroCountries.push(elem)
      }
    })

    noZeroCountries.sort((a, b) => (a.size > b.size ? -1 : 1)); // sort the data

    var groupedData = d3.group(noZeroCountries, d => d.countries)  // group the data

    // functions - calculate max and min for axis and create axes

    let x_Max = 0;
    let x_Min = Infinity;

    groupedData.forEach((country) => {
      country.forEach((elem) => {
        const minmax = elem.x;
        if (minmax > x_Max) {
          x_Max = minmax;
        }
        if (minmax < x_Min) {
          x_Min = minmax;
        }
      });
    });

    let y_Max = 0;
    let y_Min = Infinity;

    groupedData.forEach((country) => {
      country.forEach((elem) => {
        const minmax = +elem.y;
        if (minmax > y_Max) {
          y_Max = minmax;
        }
        if (minmax < y_Min) {
          y_Min = minmax;
        }
      });
    });

    let size_Max = 0;
    let size_Min = Infinity;

    groupedData.forEach((country) => {
      country.forEach((elem) => {
        const minmax = elem.size;
        if (minmax > size_Max) {
          size_Max = minmax;
        }
        if (minmax < size_Min) {
          size_Min = minmax;
        }
      });
    });

    let col_Max = 0;
    let col_Min = Infinity;

    groupedData.forEach((country) => {
      country.forEach((elem) => {
        const minmax = elem.color;
        if (minmax > col_Max) {
          col_Max = minmax;
        }
        if (minmax < col_Min) {
          col_Min = minmax;
        }
      });
    });

    var x = d3.scalePow().exponent(0.30)
      .domain([0, x_Max + (x_Max / 5)])
      .range([0, width])

    var y = d3.scalePow().exponent(0.30)
      .domain([0, y_Max + (y_Max / 5)])
      .range([height, 0])

    var z = d3.scalePow().exponent(0.30)
      .domain([size_Min, size_Max])
      .range([5, 50]);

    xAxis
      .select("text.xLabel").remove()

    xAxis
      .attr("transform", "translate(0," + height + ")")
      .transition()
      .call(d3.axisBottom(x))

    xAxis
      .selectAll("g .tick").select("text")
      .style('text-anchor', 'start')
      .attr('transform', 'rotate(90 0 15)');


    const helpCheckedX = this.checkedX

    xAxis.append("text")
      .attr("class", "xLabel")
      .attr("y", - width - this.margin.right / 4 - helpCheckedX.length * 10)
      .style("text-anchor", "start")
      .attr("fill", "black")
      .attr('transform', 'rotate(90 0 15)')
      .html(function () {
        let line = "<tspan x='0' dy='1.2em'>" + "(" + helpCheckedX[0] + "</tspan>"
        for (let i = 1; i < helpCheckedX.length; i++) {
          const newLine = "<tspan x='0' dy='1.2em'>" + helpCheckedX[i] + "</tspan>"
          line = line + newLine
        }
        return line + ")"
      })

    yAxis
      .select("text.yLabel").remove()

    yAxis
      .transition()
      .call(d3.axisLeft(y))

    const helpCheckedY = this.checkedY

    yAxis.append("text")
      .attr("class", "yLabel")
      .attr("y", - this.margin.top / 4 - helpCheckedY.length * 10)
      .style("text-anchor", "end")
      .attr("fill", "black")
      .html(function () {
        let line = "<tspan x='0' dy='1.2em'>" + "(" + helpCheckedY[0] + "</tspan>"
        for (let i = 1; i < helpCheckedY.length; i++) {
          const newLine = "<tspan x='0' dy='1.2em'>" + helpCheckedY[i] + "</tspan>"
          line = line + newLine
        }
        return line + ")"
      })


    // functions - calculate pie and colors 

    const techPie: boolean = this.techFilters.indexOf(this.checkedColor[0]) > -1 // set colors
    let ordScale = techPie ? this.colTech : this.colMat;
    const ordscaleTOcolor = (d: any) => {
      if (techPie) {
        const name = d.data.slices
        const index = this.techList.indexOf(name)
        return ordScale[index] + 1 + ')'
      }
      else {
        const name = d.data.slices
        const index = this.matList.indexOf(name)
        return ordScale[index] + 1 + ')'
      }
    }

    let myScale = d3.scalePow().exponent(1).domain([col_Min, col_Max]).range([col_Min, col_Max]);
    let pie = d3.pie<any>().value(function (d) { return myScale(d.color) })

    function colcArc(d: d3.PieArcDatum<any>): any {
      const arc = d3.arc<d3.PieArcDatum<any>>().innerRadius(0).outerRadius(z(d.data.size))
      return arc(d)
    }

    // functions - mouse functions over dots

    const mouseoverDot = (event: any, d: any) => {
      tooltip.style("visibility", "visible")
      const country = d[1][0].countries
      const infoCountry: any = groupedData.get(country)
      const nameId = event.target.id
      let varCol: string = ''
      for (let i = 0; i < this.checkedColor.length; i++) {
        if (i < this.checkedColor.length - 1) {
          varCol = varCol + this.checkedColor[i] + ', '
        } else {
          varCol = varCol + this.checkedColor[i]
        }
      }
      let sumColValues = 0;
      let minColValues = Infinity
      let maxColValues = 0
      groupedData.forEach((country) => {
        for (let i = 0; i < country.length; i++) {
          sumColValues += country[i].color;
          if (sumColValues > maxColValues) {
            maxColValues = sumColValues
          }
          if (sumColValues < minColValues) {
            minColValues = sumColValues
          }
        }
      });

      let varSize: string = ''
      for (let i = 0; i < this.chekedSize.length; i++) {
        if (i < this.chekedSize.length - 1) {
          varSize = varSize + this.chekedSize[i] + ', '
        } else {
          varSize = varSize + this.chekedSize[i]
        }
      }
      const hoveredSize = Math.round(infoCountry[0].size * 100) / 100
      let varX: string = ''
      for (let i = 0; i < this.checkedX.length; i++) {
        if (i < this.checkedX.length - 1) {
          varX = varX + this.checkedX[i] + ', '
        } else {
          varX = varX + this.checkedX[i]
        }
      }
      const hoveredX = Math.round(infoCountry[0].x * 100) / 100
      let varY: string = ''
      for (let i = 0; i < this.checkedY.length; i++) {
        if (i < this.checkedY.length - 1) {
          varY = varY + this.checkedY[i] + ', '
        } else {
          varY = varY + this.checkedY[i]
        }
      }
      const hoveredY = Math.round(infoCountry[0].y * 100) / 100

      // piePlot
      svg.selectAll(".gs").selectAll("path").attr("fill-opacity", .3)
      svg.selectAll(".gs").selectAll("path").attr("stroke-opacity", .3)
      svg.select("g#" + country + ".gs").selectAll("path").attr("fill-opacity", 1)
      svg.select("g#" + country + ".gs").selectAll("path").attr("stroke-opacity", 1)
      // heatmap
      const heightSVGspider: any = d3.select('#heatMap_svg').attr("height")
      const widthSVGspider: any = d3.select('#heatMap_svg').attr("width")
      const marginLeft: any = d3.select('#heatMap_svg').attr("marginLeft")
      const marginRight: any = d3.select('#heatMap_svg').attr("marginRight")
      const marginBottom: any = d3.select('#heatMap_svg').attr("marginBottom")
      const marginTop: any = d3.select('#heatMap_svg').attr("marginTop")
      var paddingValue = 0.1
      var y = d3.scaleBand().range([heightSVGspider - +marginTop - +marginBottom, 0 + 3]).domain(this.toVisHeatCountr).padding(paddingValue);
      d3.select("#heatMap_svg").select('.heatMap_tooltipRect').style("visibility", "visible")
        .attr("x", 0 - marginLeft)
        .attr("y", y(country)!)
        .attr("width", widthSVGspider + +marginLeft)
        .attr("height", y.bandwidth())
        .style("fill", 'rgb(192,192,192, .5)')
      // tooltip
      const indexCountr: any = $enum(matCountries).getKeys().indexOf(country)
      const countrName: any = $enum(matCountries).getValues()[indexCountr]
      tooltip.html('Geo. location: ' + countrName)
      // infobox
      this.tableDataPlot[0] = country
      this.tableDataPlot[1] = hoveredSize
      this.tableDataPlot[2] = hoveredX
      this.tableDataPlot[3] = hoveredY
      this.infoNameTablePlot[0] = countrName
      this.infoNameTablePlot[1] = this.tableDataPlot
      this.piePlotNameTable.emit(this.infoNameTablePlot)

    }



    const mouseleaveDot = (event: any, d: any) => {
      tooltip.style("visibility", "hidden");
      // piePlot
      svg.selectAll(".gs").selectAll("path").attr("fill-opacity", 1)
      svg.selectAll(".gs").selectAll("path").attr("stroke-opacity", 1)
      // heatmap
      d3.select("#heatMap_svg").select('.heatMap_tooltipRect').style("visibility", "hidden")
    }

    const mousemoveDot = (event: any, d: any) => {
      tooltip.style("top", (event.pageY + 10) + "px").style("left", (event.pageX + 10) + "px");
    };


    // plott dots

    var gs = svg.selectAll("g.gs")
      .data(groupedData)
      .join(
        function (enter) {
          return enter
            .append("g")
            .attr("class", "gs")
            .attr("id", function (d: any) { return d[1][0].countries })
            .attr("transform", function (d: any) {
              return "translate(" + x(d[1][0].x) + "," + y(d[1][0].y) + ")";
            })
        },
        function (update) {
          return update
            .attr("class", "gs")
            .attr("id", function (d: any) { return d[1][0].countries })
            .attr("transform", function (d: any) {
              return "translate(" + x(d[1][0].x) + "," + y(d[1][0].y) + ")";
            })
        },
        function (exit) {
          return exit.remove();
        }
      )
      .on("mouseover", mouseoverDot)
      .on("mousemove", mousemoveDot)
      .on("mouseleave", mouseleaveDot)
      .call(createPieCharts)

    // plott piecharts replacing dots

    function createPieCharts(arg0: any) {
      const data = arg0._groups[0]
      data.forEach((element: any) => { appendPie(element) })

      function appendPie(d: any) {
        const country = d.__data__
        const countryData = country[1]
        const countryName = country[1][0].countries

        svg.select("g#" + countryName + ".gs")
          .selectAll("path")
          .data(pie(countryData))
          .join(
            function (enter) {
              return enter.append("path")
                .attr("id", function (d: any) { return d.data.slices })
                .attr('d', function (d) { return colcArc(d) })


            },
            function (update) {
              return update
                .attr("id", function (d: any) { return d.data.slices })
                .transition().duration(1000).attr('d', function (d) { return colcArc(d) })

            },
            function (exit) {
              return exit.remove();
            }
          )
          .attr('fill', ordscaleTOcolor)
          .attr("value", function (d: any) { return d.data.color })
          .attr("stroke", 'rgb(255, 255, 255, 1)')
          .style("stroke-width", "2px")
          .style("opacity", 1)
      }
    }
  }
}





