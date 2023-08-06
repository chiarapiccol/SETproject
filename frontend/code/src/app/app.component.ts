import { Component, ElementRef, ViewChild } from '@angular/core';
import { $enum } from 'ts-enum-util';

import { mat, model_listIconMat, model_listFullnameMat, model_listContentMat, model_listFotoMat, model_listColorMat } from 'src/app/models/mat'
import { tech, model_listIconTech, model_listFullnameTech, model_listContentTech, model_listFotoTech, model_listColorTech, model_connectionTechMat } from 'src/app/models/tech';
import { MatMenuTrigger } from '@angular/material/menu';
import * as d3 from 'd3';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() { }

  //// Local variables - Lists

  techList: tech[] = $enum(tech).getValues();
  matList: mat[] = $enum(mat).getValues();

  listColorTech: any[] = model_listColorTech
  listColorMat: any[] = model_listColorMat

  listIconTech: any[] = model_listIconTech
  listIconMat: any[] = model_listIconMat

  listFullnameTech: any[] = model_listFullnameTech
  listFullnameMat: any[] = model_listFullnameMat

  connectionTechMat: any[] = model_connectionTechMat

  //// Local Variables - variables for html

  checkedTech: tech[] = $enum(tech).getValues();
  checkedMat: mat[] = $enum(mat).getValues();

  checked_allnone_Tech = true
  checked_allnone_Mat = true

  o = 1
  color_allnone_Tech = 'rgb(192, 192, 192,' + this.o + ')'
  color_allnone_Mat = 'rgb(192, 192, 192,' + this.o + ')'

  colorTech: any
  colorMat: any

  iconTech: any
  iconMat: any

  fullnameTech: any
  fullnameMat: any

  techToShow: any = 'nothing'
  techNotToShow: any = 'nothing'
  matToShow: any = 'nothing'
  matNotToShow: any = 'nothing'

  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedByLeftClick: any

  //// Local Variables - variables from children components to other child components

  viewTypePie: string ='pieChart'
  setVisView(viewType: string){
    this.viewTypePie = viewType
  }

  heatVisMat: any
  heatVisAct: any
  heatVisCountr: any

  chooseVis!: any
  hoveredElem!: any
  tableInfo!: any[]
  otherInfo!: any[]

  verticalFormatInputRow(type: string, row: any, inputColumns: any, inputData: any) {
    const output: any = {};
    const rowPos = inputColumns.indexOf(row) + 1
    output[0] = row;
    if(type === 'mult'){
      for (let i = 0; i < inputData.length; ++i) {
        const position = inputData[i].position;
        const values = Object.values(inputData[i]);
        output[position] = values[rowPos];
      }
    } else {
        const values = inputData[rowPos-1];
        output[1] = values;
    }
    return output;
  }

  createNameTable_Spider(table: any[]) {
    this.chooseVis = 'spider'
    this.hoveredElem = table[0]
    this.tableInfo = table[1]
  }

  createNameTable_pieChart(table: any[]) {
    this.chooseVis = 'pieChart'
    this.hoveredElem = table[0]
    let inputColumns = ['Name', 'Location', 'Amount', 'Percentage'];
    let inputData = table[1]
    this.tableInfo = inputColumns.map(x => this.verticalFormatInputRow('mult', x, inputColumns, inputData));
    this.otherInfo = [table[2]]
  }

  createNameTable_piePlot(table: any[]) {
    this.chooseVis = 'piePlot'
    this.hoveredElem = table[0]
    let inputColumns: string[] = ['Name', 'Size', 'X-coord.', 'Y-coord'];
    let inputData = table[1]
    this.tableInfo = inputColumns.map(x => this.verticalFormatInputRow('sing', x, inputColumns, inputData));
  }

  createNameTable_heatMap(table: any){
    this.chooseVis = 'heatMap'
    this.hoveredElem = table[0]
    let inputColumns: string[] = ['Name', 'Location', 'Activity', 'Amount'];
    let inputData = table[1]
    this.tableInfo = inputColumns.map(x => this.verticalFormatInputRow('sing', x, inputColumns, inputData));
  }


  //// Local Variables - variables for svg

  svg_1!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  tooltip!: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
  heatMapData: any[] | null = null;
  @ViewChild('sankeyDiagr') sankeyDiagrHTML!: ElementRef;

  //// ngOnInit

  async ngOnInit(): Promise<void> { }

  ///// ngAfterViewInit - (ngOnInit would not read the html properties in time)
  async ngAfterViewInit() {
    this.createSVG1()
    this.createSankey()
  }

  //// allnone buttons - select all or none of the technologies and materials 
  check_allnone_Tech() {
    if (this.checked_allnone_Tech === true) { // by deselecting everything
      this.checked_allnone_Tech = false
      this.checkedTech = []
      this.color_allnone_Tech = 'rgb(192, 192, 192,' + .2 + ')'
    }
    else { // by selecting everything
      this.checked_allnone_Tech = true
      this.checkedTech = this.techList

      this.color_allnone_Tech = 'rgb(192, 192, 192,' + 1 + ')'
    }
  }

  reCheck_allnone_Tech() {
    if (this.checkedTech.length === this.techList.length) { // when all buttons are selected
      this.checked_allnone_Tech = true
      this.color_allnone_Tech = 'rgb(192, 192, 192,' + 1 + ')'
    }
    else { // when not all buttons are selected
      this.checked_allnone_Tech = false
      this.color_allnone_Tech = 'rgb(192, 192, 192,' + .2 + ')'
    }
  }

  check_allnone_Mat() {
    if (this.checked_allnone_Mat === true) { // by deselecting everything
      this.checked_allnone_Mat = false
      this.checkedMat = []
      this.color_allnone_Mat = 'rgb(192, 192, 192,' + .2 + ')'
    }
    else { // by selecting everything
      this.checked_allnone_Mat = true
      this.checkedMat = this.matList
      this.color_allnone_Mat = 'rgb(192, 192, 192,' + 1 + ')'
    }
  }

  reCheck_allnone_Mat() {
    if (this.checkedMat.length === this.matList.length) { // when all buttons are selected
      this.checked_allnone_Mat = true
      this.color_allnone_Mat = 'rgb(192, 192, 192,' + 1 + ')'
    }
    else { // when not all buttons are selected
      this.checked_allnone_Mat = false
      this.color_allnone_Mat = 'rgb(192, 192, 192,' + .2 + ')'
    }
  }


  //// whatever buttons - set all variables for the icons when creating the elements

  setAllIconVariables(type: string, vlaue: any) {
    if (type === 'tech') { // if it is a tech element
      let index = this.techList.indexOf(vlaue) // find the index to use on all other arrays
      this.iconTech = this.listIconTech[index]
      this.fullnameTech = this.listFullnameTech[index]
      this.colorTech = this.listColorTech[index] + 1 + ')'
    }
    else { // if it is a mat element     
      let index = this.matList.indexOf(vlaue) // find the index to use on all other arrays
      this.iconMat = this.listIconMat[index]
      this.fullnameMat = this.listFullnameMat[index]
      this.colorMat = this.listColorMat[index] + 1 + ')'
    }
  }

  //// whatever buttons - set opacity for the technology and material buttons when clicked and not clicked
  getOpacityTech(value: tech, darker?: any) {
    let o;
    let index = this.techList.indexOf(value)
    if (this.checkedTech.indexOf(value) == -1) {
      o = 0.2
    }
    else {
      o = 1
    }
    this.setAllIconVariables('tech', value)
    return this.listColorTech[index] + o + ')'
  }

  getOpacityMat(value: mat) {
    let o;
    let index = this.matList.indexOf(value)
    if (this.checkedMat.indexOf(value) == -1) {
      o = 0.2
    }
    else {
      o = 1
    }
    this.setAllIconVariables('mat', value)
    return this.listColorMat[index] + o + ')'
  }


  //// whatever buttons - set attributes of the spiders when hovering and nothovering over its icon 

  createRectTooltip(actmat: any[]) {
    this.heatVisMat = actmat[1]
    this.heatVisAct = actmat[0]
    this.heatVisCountr = actmat[2]
  }

  hoveredTech(hoveredTech: any) {
    this.techToShow = hoveredTech
    this.techNotToShow = 'nothing'
    // info
    this.hoveredElem = hoveredTech
    this.chooseVis = 'filter'
    // sankey
    this.svg_1.selectAll("#" + hoveredTech.toString().replace(/\s/g, '')).raise()
    this.svg_1.selectAll("#" + hoveredTech.toString().replace(/\s/g, '')).attr("stroke-opacity", 1)
    // spiderDiagr
    const index = this.techList.indexOf(hoveredTech)
    const col = this.listColorTech[index] + .7 + ')'
    const nameId = hoveredTech.toString().replace(/\s/g, '')
    d3.select("#spiderDiagr_svg").select("#" + nameId).attr("fill", col).raise()
    // pieChartPlot
    if (!d3.select("#pieChartPlot_svg").select('#' + hoveredTech.toString().replace(/\s/g, '')).empty() && this.viewTypePie === 'pieChart') {
      d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", .4)
      d3.select("#pieChartPlot_svg").select('#' + hoveredTech.toString().replace(/\s/g, '')).attr("fill-opacity", 1)
    }
  }

  notHoveredTech(notHoveredTech: any) {
    this.techNotToShow = notHoveredTech
    this.techToShow = 'nothing'
    // sankey
    this.svg_1.selectAll("#" + notHoveredTech.toString().replace(/\s/g, '')).lower()
    this.svg_1.selectAll("#" + notHoveredTech.toString().replace(/\s/g, '')).attr("stroke-opacity", .2)
    // spiderDiagr
    const index = this.techList.indexOf(notHoveredTech)
    const nameId = notHoveredTech.toString().replace(/\s/g, '')
    d3.select("#spiderDiagr_svg").select("#" + nameId).attr("fill", 'none')
    // piePlotChart
    d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", 1)
  }

  hoveredMat(hoveredMat: any) {
    this.techToShow = hoveredMat
    this.techNotToShow = 'nothing'
    const index = this.matList.indexOf(hoveredMat)
    const shortNameHoveretMat = this.listIconMat[index]
    // info
    this.hoveredElem = hoveredMat
    this.chooseVis = 'filter'
    // sankey
    this.svg_1.selectAll("." + hoveredMat).raise()
    this.svg_1.selectAll("." + hoveredMat).attr("stroke-opacity", 1)
    // pieChartPlot
    if (!d3.select("#pieChartPlot_svg").select('#' + hoveredMat).empty() && this.viewTypePie === 'pieChart') {
      d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", .4)
      d3.select("#pieChartPlot_svg").select('#' + hoveredMat).attr("fill-opacity", 1)
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
      if (f.toLowerCase() === hoveredMat.toLowerCase()) {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        line_coord = angleToCoordinate(angle, 100)
      }
    })
    d3.select("#spiderDiagr_svg").append('line').attr("class", 'spiderChart_hoveringRect').attr("stroke", 'rgba(192, 192, 192, 0.5)')
      .attr("stroke-width", '20px').attr("stroke-linecap", "round")
      .attr("x1", widthSpider / 2 + marginSpider).attr("y1", heightSpider / 2 + marginSpider)
      .attr("x2", line_coord.x).attr("y2", line_coord.y)
    // heatmap
    const heatMapView = d3.select('#heatMap_svg').select('#xAxis').attr("perspect")
    const height: any = d3.select('#heatMap_svg').attr("height")
    const widthSVGspiderheat: any = d3.select('#heatMap_svg').attr("width")
    const marginLeft: any = d3.select('#heatMap_svg').attr("marginLeft")
    const marginRight: any = d3.select('#heatMap_svg').attr("marginRight")
    const marginTop: any = d3.select('#heatMap_svg').attr("marginTop")
    var paddingValue = 0.1
    if (heatMapView === 'Mat' && this.heatVisMat.indexOf(shortNameHoveretMat) > -1) {
      var actLentght = this.heatVisAct.length
      var x = d3.scaleBand().range([0, widthSVGspiderheat - marginLeft - marginRight]).domain(this.heatVisMat).padding(paddingValue)
      var xForXmat: any = x(shortNameHoveretMat)
      var widthForXmat: any = x.bandwidth() / actLentght
      d3.select("#heatMap_svg").append('rect').attr("class", 'heatMap_hoveringRect')
        .attr("x", xForXmat + (+marginLeft))
        .attr("y", 0 + marginTop * 0.2)
        .attr("width", (widthForXmat * actLentght))
        .attr("height", height)
        .style("fill", 'rgb(192,192,192, .5)')
    }
  }

  notHoveredMat(notHoveredMat: any) {
    this.techNotToShow = notHoveredMat
    this.techToShow = 'nothing'
    // sankey
    this.svg_1.selectAll("." + notHoveredMat).lower()
    this.svg_1.selectAll("." + notHoveredMat).attr("stroke-opacity", .2)
    // pieChartPlot
    d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", 1)
    // spiderDiagr
    d3.select("#spiderDiagr_svg").select('.spiderChart_hoveringRect').remove()
    // heatmap
    d3.select("#heatMap_svg").select('.heatMap_hoveringRect').remove()
  }

  //// whatever buttons and info box -  create the menu when right-clicking and set all variables for the info box 

  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = item;
    this.selectedByLeftClick = item
    this.contextMenu.menu!.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  deactivateSelectRelated(): boolean {
    const selElem = this.selectedByLeftClick;
    var boolValue: boolean = true
    if (this.matList.indexOf(selElem) > -1) {
      boolValue = true
    }
    if (this.techList.indexOf(selElem) > -1) {
      boolValue = this.connectionTechMat.some(function (elem: any) {
        return elem.tech.indexOf(selElem) > -1;
      });
    }
    return !boolValue;
  }

  selectRelated() {
    const elem = this.selectedByLeftClick
    if (this.techList.indexOf(elem) > -1) { // if a technology was clicked
      this.checkedTech = [elem]
      this.checkedMat = this.connectionTechMat.find(entry => entry.tech === elem).mat
    } else { // if a material was clicked
      this.checkedMat = [elem]
      this.checkedTech = this.connectionTechMat.filter(entry => entry.mat.includes(elem)).map(entry => entry.tech);
    }
  }

  createSVG1() {
    var width_1 = this.sankeyDiagrHTML.nativeElement.offsetWidth
    var height_1 = this.sankeyDiagrHTML.nativeElement.offsetHeight

    this.svg_1 = d3.select('#sankeyDiagr')
      .append("svg")
      .attr("class", "sankeyDiagr_svg")
      .attr("width", width_1)
      .attr("height", height_1)

    this.tooltip = d3.select("#sankeyDiagr")
      .append("div")
      .style("position", "absolute").style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "white")
      .style("border", "solid").style("border-width", "2px").style("border-radius", "5px").style("padding", "5px")

  }

  onSankeyRezise() {
    d3.select("#sankeyDiagr").selectChildren().remove();
    this.createSVG1()
    this.createSankey()
  }

  async createSankey() {
    const svg = this.svg_1
    const cTech = this.techList
    const cMat = this.matList
    const width = this.sankeyDiagrHTML.nativeElement.offsetWidth
    const height = this.sankeyDiagrHTML.nativeElement.offsetHeight

    const data = this.connectionTechMat.filter(item => {
      const techList = cTech.map(tech => tech.toString());
      return techList.includes(item.tech);
    })

    const mouseover = (event: any) => {
      const nameId = event.target.id
      svg.selectAll("#" + nameId).raise()
      svg.selectAll("#" + nameId).attr("stroke-opacity", 1)
    }

    const mouseleave = (event: any) => {
      const nameId = event.target.id
      svg.selectAll("#" + nameId).lower()
      svg.selectAll("#" + nameId).attr("stroke-opacity", .2)

    }

    var Gen = d3.line()
      .x((p) => p[0])
      .y((p) => p[1])
      .curve(d3.curveBasis);

    let help_techList = this.techList
    let help_listColorTech = this.listColorTech

    data.forEach(function (elem: any) {
      let i = cTech.indexOf(elem.tech)
      let firstPos = [0, i * height / 10 - i * height / 1000 + height / 20 - height / 2000]
      let index = help_techList.indexOf(elem.tech)
      let color = help_listColorTech[index] + 1 + ')'

      elem.mat.forEach(function (matElem: mat) {
        let j = cMat.indexOf(matElem)
        let lastPos = [width, j * height / 7 - j * height / 700 + height / 14 - j * height / 1400]
        var points: any[] = [firstPos, lastPos]
        svg
          .append("path")
          .attr("id", elem.tech.toString().replace(/\s/g, ''))
          .attr("class", matElem)
          .attr("d", Gen(points))
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 5)
          .attr("stroke-opacity", .2)
          .on("mouseover", mouseover)
          .on("mouseleave", mouseleave)
      })
    })




  }








}
