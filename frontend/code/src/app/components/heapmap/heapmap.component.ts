import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { firstValueFrom } from 'rxjs';
import { matCountries } from 'src/app/models/country';
import { mat, matChar, model_lisShortnameEIP, model_listColorMat, model_listFullnameMat, model_listIconMat } from 'src/app/models/mat';
import { model_connectionTechMat, model_listColorTech, tech } from 'src/app/models/tech';
import { BackendService } from 'src/app/services/backend.service';
import { $enum } from 'ts-enum-util';

@Component({
  selector: 'app-heapmap',
  templateUrl: './heapmap.component.html',
  styleUrls: ['./heapmap.component.css']
})
export class HeapmapComponent {


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

  //// local variables - html variables and functions

  initialized = false;
  blockedVis = false;

  showActPersp: boolean | undefined = false
  showMatPersp: boolean | undefined = true

  blockedToolTip = 'Unblocked'
  blockedToolTip_list = ['unblocked', 'Blocked']
  blockIcon = 'bookmark_border'
  blockIconList = ['bookmark_border', 'bookmark']

  matList: any[] = $enum(mat).getValues();
  listshortNameMat: any[] = model_listIconMat
  listfullNameMat: any[] = model_listFullnameMat
  eipList: any[] = $enum(matChar).getKeys()
  toFetchEIP: any[] = this.eipList
  listFullnameEIP: any[] = $enum(matChar).getValues();
  fullnameEIP!: any
  listIconEIP: any[] = model_lisShortnameEIP
  iconEIP!: any
  techList: tech[] = $enum(tech).getValues();
  connectionTechMat = model_connectionTechMat


  setAllIconVariables(value: any) {
    let index = this.eipList.indexOf(value);
    this.fullnameEIP = this.listFullnameEIP[index]
    this.iconEIP = this.listIconEIP[index]
  }

  getOpacityEIP(value: any) {
    let o;
    if (this.toFetchEIP.indexOf(value) == -1) {
      o = 0.2
    }
    else {
      o = 1
    }
    this.setAllIconVariables(value)
    return 'rgb(192, 192, 192,' + o + ')'
  }

  countries: matCountries[] = $enum(matCountries).getValues().sort((a, b) => a.localeCompare(b))
  selectedCountries: matCountries[] = this.countries;
  toFetchCountrs: matCountries[] = this.countries;

  onKey(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedCountries = this.search(value);
  }

  search(value: string) {
    const filter = value.toLowerCase();
    return this.countries.filter(option => option.toLowerCase().includes(filter));
  }

  //// local variables - variables and functions for svg

  margin!: any
  svg_1!: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  xAxis!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  yAxis!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  tooltip!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>

  heatMapData: any[] | null = null;
  heatMapData_old: any[] | null = null;
  showActPersp_old: boolean | undefined
  showMatPersp_old: boolean | undefined
  @ViewChild('heatMap') heatMapHTML!: ElementRef;

  //// local variables - variables fir parent 

  @Output() chosenActMat = new EventEmitter<any[]>();

  infoNameTableHeatmap = [[], []]
  tableDataHeatmap: any = [
    { position: 1, material: '', country: '', activity: 0, amount: '' },
  ];
  @Output() heatmapNameTable = new EventEmitter<any[]>();

  //// constructor
  constructor(private backendService: BackendService) { }

  //// ngOnInit
  async ngOnInit() { }

  //// ngOnDestroy
  async ngOnDestroy() { }

  ///// ngAfterViewInit - (ngOnInit would not read the html properties in time)
  async ngAfterViewInit() {
    this.createSVG1() //create SVGs
    this.callSQLfunk('createHeatMap').then((data) => { //set data and create visualization direct after initialization
      this.heatMapData = data;
      this.createHeatMap()
    });
    this.initialized = true; // set initialized to true, so that ngOnChanges can be run in the next steps
  }

  //// onBubblePlotResize
  onheatMapResize(event: any) {
    d3.select("#heatMap_svg").selectChildren().remove();
    this.createSVG1()
    if (this.blockedVis === true) {
      this.heatMapData = this.heatMapData_old
      this.showActPersp = this.showActPersp_old
      this.showMatPersp = this.showMatPersp_old
      console.log(this.showActPersp, this.showMatPersp)
    }
    this.createHeatMap()
    if(this.showActPersp === false && this.showMatPersp === false){
      d3.select("#heatMap_svg").selectChildren().remove();
      this.createSVG1()
    }
  }

  //// chooseVisAct
  chooseVisAct(selectPersp: any) {
    if (this.blockedVis === false) { // if it is not blocked
      if (selectPersp === true) { // selected ActPersp - no view choosen
        this.showActPersp = true
        this.showMatPersp = false
        if (this.toFetchEIP.length !== 0) { // if activities selection is not empty
          this.callSQLfunk('createHeatMap').then((data) => {
            this.heatMapData = data;
            this.createHeatMap()
          })
        }
        else {  // if activities selection is empty
          d3.select("#heatMap_svg").selectChildren().remove();
          this.createSVG1()
        }
      } else { // deselected ActPersp - no view choosen
        this.showActPersp = false
        this.showMatPersp = false
      }
    } else { // if it is blocked
      if (selectPersp === true) { // selected ActPersp - no view choosen
        this.showActPersp = true
        this.showMatPersp = false
      } else { // deselected ActPersp - no view choosen
        this.showActPersp = false
        this.showMatPersp = false
      }
    }
  }

  //// chooseVisMat
  chooseVisMat(selectPersp: any) {
    if (this.blockedVis === false) { // if it is not blocked
      if (selectPersp === true) { // selected ActPersp - no view choosen
        this.showActPersp = false
        this.showMatPersp = true
        if (this.toFetchEIP.length !== 0) { // if activities selection is not empty
          this.callSQLfunk('createHeatMap').then((data) => {
            this.heatMapData = data;
            this.createHeatMap()
          })
        }
        else {  // if activities selection is empty
          d3.select("#heatMap_svg").selectChildren().remove();
          this.createSVG1()
        }
      } else { // deselected ActPersp - no view choosen
        this.showActPersp = false
        this.showMatPersp = false
      }
    } else { // if it is blocked
      if (selectPersp === true) { // selected ActPersp - no view choosen
        this.showActPersp = false
        this.showMatPersp = true
      } else { // deselected ActPersp - no view choosen
        this.showActPersp = false
        this.showMatPersp = false
      }
    }
  }

  //// ngOnChanges
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.initialized) {
      if (this.blockedVis === false) { // if not blocked
        if (this.toFetchMat.length !== 0) { // if material selection is not empty
          this.callSQLfunk('createHeatMap').then((data) => {
            this.heatMapData = data;
            this.createHeatMap()
          });
        } else {  // if material selection is empty
          d3.select("#heatMap_svg").selectChildren().remove();
          this.createSVG1()
        }
      }
    }
  }

  //// changeFilters
  async changeFilters(): Promise<void> { // update for coutries!!!!!!!!!!!!!!!
    if (this.initialized) {
      if (this.blockedVis === false) { // if not blocked
        if (this.toFetchEIP.length !== 0 && this.toFetchCountrs.length !== 0) { // if material eip is not empty
          this.callSQLfunk('createHeatMap').then((data) => {
            this.heatMapData = data;
            this.createHeatMap()
          });
        } else {  // if eip selection is empty
          d3.select("#heatMap_svg").selectChildren().remove();
          this.createSVG1()
        }
      }
    }
  }

  //// blockVis
  async blockVis() {
    if (this.blockedVis === false) { // if not blocked, then block
      this.heatMapData_old = this.heatMapData
      this.showActPersp_old = this.showActPersp
      this.showMatPersp_old = this.showMatPersp
      this.blockedVis = true;
      this.blockIcon = this.blockIconList[1]
      this.blockedToolTip = this.blockedToolTip_list[1]
    }
    else { // if blocked, then sblock and create vis
      this.blockedVis = false;
      this.blockIcon = this.blockIconList[0]
      this.blockedToolTip = this.blockedToolTip_list[0]
      if (this.toFetchEIP.length !== 0 && this.toFetchCountrs.length !== 0 && this.toFetchMat.length !== 0 && (this.showActPersp !== false || this.showMatPersp !== false)) {  //if no one of the selections are empty
        this.callSQLfunk('createHeatMap').then((data) => {
          this.heatMapData = data;
          this.createHeatMap()
        });
      } else { // if one of the selections are empty
        d3.select("#heatMap_svg").selectChildren().remove();
        this.createSVG1()
      }
    }
  }

  //// callSQLfunk
  async callSQLfunk(funkName: string): Promise<any[]> {
    var data!: any[];
    if (funkName === 'createHeatMap') {
      data = await firstValueFrom(this.backendService.fetchHeatMap(this.toFetchMat, this.toFetchEIP, this.toFetchCountrs))
    }
    return data;
  }


  //// createSVG1
  async createSVG1() {
    var width = this.heatMapHTML.nativeElement.offsetWidth;
    var height = this.heatMapHTML.nativeElement.offsetHeight;
    this.margin = { top: height / 25, right: width / 25, bottom: height / 100, left: width / 10 }

    this.svg_1 = d3.select('#heatMap_svg')
      .attr("width", width)
      .attr("height", height)
      .attr("marginTop", this.margin.top)
      .attr("marginBottom", this.margin.bottom)
      .attr("marginLeft", this.margin.left)
      .attr("marginRight", this.margin.right)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")")

    this.xAxis = this.svg_1.append("g").attr("id", "xAxis")
    this.yAxis = this.svg_1.append("g").attr("id", "yAxis")

    this.tooltip = d3.select("#heatMap_toolTip")
      .style("color", "white")
      .style("background", "#6b6b6b")
      .style("border-radius", "5px").style("padding", "5px")

    this.svg_1.append("rect").attr("class", "heatMap_tooltipRect")
  }

  //// createHeatMap()
  async createHeatMap() {

    // assign global variables to local variables in the function createHeatMap()
    console.log(this.showActPersp, this.showMatPersp)
    const data = this.heatMapData;
    const svg = this.svg_1
    const tooltip = this.tooltip
    const xAxis = this.xAxis
    const yAxis = this.yAxis
    const margin = this.margin
    const width = this.heatMapHTML.nativeElement.offsetWidth - margin.left - margin.right;
    const height = this.heatMapHTML.nativeElement.offsetHeight - margin.top - margin.bottom;

    // check if data is empty

    if (data === null) {
      return;
    }

    // functions - transform data

    const order = ['Sl', 'Mn', 'Ch', 'Cp', 'Zn', 'Nc', 'Ml'];
    var orderedData = data.sort((a, b) => {
      const indexA = order.indexOf(a.mats);
      const indexB = order.indexOf(b.mats);

      if (indexA < indexB) {
        return -1;
      }
      if (indexA > indexB) {
        return 1;
      }
      return 0;
    });

    var groupedData = d3.group(orderedData, d => d.countries)

    // Functions for hovering and clicking of rectangles and labels

    const mouseover = (event: any, d: any) => {
      const indexChar = this.listIconEIP.indexOf(d.chars)
      const charName = this.listFullnameEIP[indexChar]
      const indexMat = this.listshortNameMat.indexOf(d.mats)
      const matName = this.listfullNameMat[indexMat]
      const nameId = matName.toLowerCase()
      const indexCountr = $enum(matCountries).getKeys().indexOf(d.countries)
      const countrName = $enum(matCountries).getValues()[indexCountr]
      // tooltip
      tooltip.style("visibility", "visible")
      tooltip.html('Material: ' + matName)
      // infobox
      this.tableDataHeatmap[0] = matName
      this.tableDataHeatmap[1] = countrName
      this.tableDataHeatmap[2] = charName
      this.tableDataHeatmap[3] = d.squares + ' (T)'
      this.infoNameTableHeatmap[0] = matName
      this.infoNameTableHeatmap[1] = this.tableDataHeatmap
      this.heatmapNameTable.emit(this.infoNameTableHeatmap)

      // tooltip - rectangle
      d3.select(event.target).style("stroke", "black").style("stroke-width", 1).raise()
      // pieChart
      if (!d3.select("#pieChartPlot_svg").select('#' + nameId.toString().replace(/\s/g, '')).empty()) {
        console.log('well yes')
        d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", .4)
        d3.select("#pieChartPlot_svg").select('#' + nameId.toString().replace(/\s/g, '')).attr("fill-opacity", 1)
      }
      // sankeyDiagram 
      d3.select('.sankeyDiagr_svg').selectAll("." + nameId).raise().attr("stroke-opacity", 1) // set attributes sankeydiagram
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
        if (f.toLowerCase() === nameId.toLowerCase()) {
          let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
          line_coord = angleToCoordinate(angle, 100)
        }
      })
      d3.select("#spiderDiagr_svg").append('line').attr("class", 'spiderChart_hoveringRect').attr("stroke", 'rgba(192, 192, 192, 0.5)')
        .attr("stroke-width", '20px').attr("stroke-linecap", "round")
        .attr("x1", widthSpider / 2 + marginSpider).attr("y1", heightSpider / 2 + marginSpider)
        .attr("x2", line_coord.x).attr("y2", line_coord.y)
    }

    const mouseleave = (event: any, d: any) => {
      const indexMat = this.listshortNameMat.indexOf(d.mats)
      const matName = this.listfullNameMat[indexMat]
      const nameId = matName.toLowerCase()
      // tooltip
      tooltip.style("visibility", "hidden");
      // tooltip - rectangle
      d3.select(event.target).style("stroke", "#c0c0c0").style("stroke-width", .5)
      // pieChart
      d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", 1)
      // piePlot
      d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("fill-opacity", .3)
      d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("stroke-opacity", .3)
      // sankeyDiagram
      d3.select('.sankeyDiagr_svg').selectAll("." + nameId).raise().attr("stroke-opacity", .2) // set attributes sankeydiagram
      // spiderDiagr
      d3.select("#spiderDiagr_svg").select('.spiderChart_hoveringRect').remove()
    }

    const mousemove = (event: any, d: any) => {
      tooltip.style("top", (event.pageY + 5) + "px").style("left", (event.pageX + 5) + "px");
    };


    const mouseoverText = (event: any, d: any) => {
      if ($enum(matCountries).getKeys().indexOf(d) > -1) { // if y-Axis
        const indexCountr = $enum(matCountries).getKeys().indexOf(d)
        const countrName = $enum(matCountries).getValues()[indexCountr]
        // tooltip
        tooltip.style("visibility", "visible")
        tooltip.html(countrName)
        // tooltip - rectangle
        svg.select('.heatMap_tooltipRect')
          .style("visibility", "visible")
          .attr("x", 0 - margin.left)
          .attr("y", y(d)!)
          .attr("width", width + margin.left + margin.right)
          .attr("height", y.bandwidth())
          .style("fill", 'rgb(192,192,192, .5)')
        // piePlot
        const plotCountr = d3.select("#pieChartPlot_svg").select('#' + d)
        if (Object.values(plotCountr)[0][0][0] !== undefined) {
          d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("fill-opacity", .3)
          d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("stroke-opacity", .3)
          plotCountr.selectAll("path").attr("fill-opacity", 1)
          plotCountr.selectAll("path").attr("stroke-opacity", 1)
        }
        if (Object.values(plotCountr)[0][0][0] === undefined) {
          d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("fill-opacity", 1)
          d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("stroke-opacity", 1)
        }

      }
      if (this.listIconEIP.indexOf(d) > -1) { // if x-Axis and activity
        const indexChar = this.listIconEIP.indexOf(d)
        const charName = this.listFullnameEIP[indexChar]
        // tooltip
        tooltip.style("visibility", "visible")
        tooltip.html(charName)
        // tooltip - rectangle
        svg.select('.heatMap_tooltipRect')
          .style("visibility", "visible")
          .attr("x", x(d)!)
          .attr("y", 0 - margin.top * 0.8)
          .attr("width", x.bandwidth())
          .attr("height", height + margin.top + margin.bottom)
          .style("fill", 'rgb(192,192,192, .5)')
        // piePlot
        d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("fill-opacity", 1)
        d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("stroke-opacity", 1)
      }
      if (this.listshortNameMat.indexOf(d) > -1) { // if x-Axis and materials
        const indexMat = this.listshortNameMat.indexOf(d)
        const matName = this.listfullNameMat[indexMat]
        // tooltip
        tooltip.style("visibility", "visible")
        tooltip.html(matName)
        // tooltip - rectangle
        svg.select('.heatMap_tooltipRect')
          .style("visibility", "visible")
          .attr("x", x(d)!)
          .attr("y", 0 - margin.top * 0.8)
          .attr("width", x.bandwidth())
          .attr("height", height + margin.top + margin.bottom)
          .style("fill", 'rgb(192,192,192, .5)')
        // sankeyDiagram 
        d3.select('.sankeyDiagr_svg').selectAll("." + matName.toLowerCase()).raise().attr("stroke-opacity", 1) // set attributes sankeydiagram
        // pieChart
        if (!d3.select("#pieChartPlot_svg").select('#' + matName.toLowerCase()).empty()) {
          console.log('well yes')
          d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", .4)
          d3.select("#pieChartPlot_svg").select('#' + matName.toLowerCase()).attr("fill-opacity", 1)
        }
        // piePlot
        d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("fill-opacity", 1)
        d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("stroke-opacity", 1)
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
          if (f.toLowerCase() === matName.toLowerCase()) {
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            line_coord = angleToCoordinate(angle, 100)
          }
        })
        d3.select("#spiderDiagr_svg").append('line').attr("class", 'spiderChart_hoveringRect').attr("stroke", 'rgba(192, 192, 192, 0.5)')
          .attr("stroke-width", '20px').attr("stroke-linecap", "round")
          .attr("x1", widthSpider / 2 + marginSpider).attr("y1", heightSpider / 2 + marginSpider)
          .attr("x2", line_coord.x).attr("y2", line_coord.y)
      }
    }
    const mousemoveText = (event: any, d: any) => {
      tooltip.style("top", (event.pageY + 5) + "px").style("left", (event.pageX + 5) + "px");
    }

    const mouseleaveSVG = (event: any, d: any) => {
      // tooltip
      tooltip.style("visibility", "hidden")
      // tooltip - rectangle
      svg.select('.heatMap_tooltipRect')
        .style("visibility", "hidden")
      // sankeyDiagram
      d3.select('.sankeyDiagr_svg').selectAll("path").raise().attr("stroke-opacity", .2) // set attributes sankeydiagram
      // piePlot
      d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("fill-opacity", 1)
      d3.select("#pieChartPlot_svg").selectAll("g.gs").selectAll("path").attr("stroke-opacity", 1)
      // pieChart
      d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", 1)
      // spiderDiagr
      d3.select("#spiderDiagr_svg").select('.spiderChart_hoveringRect').remove()
    }

    // functions - set the labels of rows and columns

    let visActMat: any = [[], [], []]
    var myMaterials = new Set();
    groupedData.forEach((elem) => {
      elem.forEach((country) => {
        myMaterials.add(country.mats);
      });
    });
    const myMaterials_array: any[] = Array.from(myMaterials);
    visActMat[1] = myMaterials_array

    var myMatChars = new Set();
    groupedData.forEach((elem) => {
      elem.forEach((country) => {
        myMatChars.add(country.chars);
      });
    });
    const myMatChars_array_notOrdered: any[] = Array.from(myMatChars);
    const myMatChars_array = myMatChars_array_notOrdered.sort((a, b) => b.localeCompare(a))
    visActMat[0] = myMatChars_array

    var myCountries = new Set();
    groupedData.forEach((elem) => {
      elem.forEach((country) => {
        myCountries.add(country.countries);
      });
    });
    const myCountries_array_notOrdered: any[] = Array.from(myCountries);
    const myCountries_array = myCountries_array_notOrdered.sort((a, b) => b.localeCompare(a))
    visActMat[2] = myCountries_array

    this.chosenActMat.emit(visActMat)

    // functions - create scales and axis:

    var xLabs: any
    var yLabs = myCountries_array
    var paddingValue = 0.1

    if (this.showActPersp === true) { // create xAxis for Activities view
      xLabs = myMatChars_array
    } else { // create xAxis for Materials view
      xLabs = myMaterials_array
    }

    var x = d3.scaleBand()
      .range([0, width])
      .domain(xLabs)
      .padding(paddingValue)

    var y = d3.scaleBand()
      .range([height, 0 + 3])
      .domain(yLabs)
      .padding(paddingValue);

    xAxis
      .transition()
      .call(d3.axisTop(x))

    xAxis.attr("perspect", this.showActPersp ? 'Act' : 'Mat')
    xAxis.selectAll('g.tick').select('text')
      .on("mouseover", mouseoverText)
      .on("mousemove", mousemoveText)

    yAxis
      .transition()
      .call(d3.axisLeft(y))

    yAxis.selectAll('g.tick').select('text')
      .on("mouseover", mouseoverText)
      .on("mousemove", mousemoveText)

    // variables to color and position the squares

    var ordScale = model_listColorMat

    const hueColors = (currentMat: any, value: any): any => {
      let color
      let heu_Max = 0
      let heu_Min = Infinity

      groupedData.forEach((country) => {
        country.forEach((elem) => {
          if (elem.mats === currentMat) {
            const minmax = elem.squares;
            if (minmax > heu_Max) {
              heu_Max = minmax;
            }
            if (minmax < heu_Min) {
              heu_Min = minmax;
            }
          }
        });
      });

      const index = this.listshortNameMat.indexOf(currentMat)
      color = ordScale[index].slice(0, -1) + ')'


      var myColor = d3.scalePow<string, number>().exponent(0.3)
        .range(["white", color])
        .domain([heu_Min, heu_Max])

      return myColor(value)
    }


    // add the rects

    var nrMats = myMaterials_array.length
    var nrActivities = myMatChars_array.length

    function computeExtraXY_act(rectSize: number, mat: any) {
      return myMaterials_array.indexOf(mat) * rectSize
    }

    function computeExtraXY_mat(rectSize: number, mat: any) {
      return myMatChars_array.indexOf(mat) * rectSize
    }

    svg.on("mouseleave", mouseleaveSVG)

    var gs = svg.selectAll("g.gs")
      .data(groupedData)
      .join(
        function (enter) {
          return enter.append("g")
            .attr("country", function (d) { return d[0] })
            .attr("class", "gs")
        },
        function (update) {
          return update
        },
        function (exit) {
          return exit.remove();
        }
      )

    if (this.showActPersp === true) { // xAxis with Activities
      gs.selectAll("rect")
        .data(function (d) { return d[1] })
        .join(
          function (enter) {
            return enter.append("rect")
              .attr("mat", function (d) { return d.mats })
              .attr("eip", function (d) { return d.chars })
              .attr("x", function (d) { return x(d.chars)! + computeExtraXY_act(x.bandwidth() / nrMats, d.mats) })
              .attr("y", function (d) { return y(d.countries)! })
              .attr("width", x.bandwidth() / nrMats)
              .attr("height", y.bandwidth())
              .style("fill", function (d) { return hueColors(d.mats, d.squares) })
          },
          function (update) {
            return update
              .attr("x", function (d) { return x(d.chars)! + computeExtraXY_act(x.bandwidth() / nrMats, d.mats) })
              .attr("y", function (d) { return y(d.countries)! })
              .attr("width", x.bandwidth() / nrMats)
              .attr("height", y.bandwidth())
              .style("fill", function (d) { return hueColors(d.mats, d.squares) })
          },
          function (exit) {
            return exit.remove();
          }
        )
        .style("stroke", "#c0c0c0")
        .style("stroke-width", .5)
        .style("opacity", 1)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }
    else { // xAxis with Materials
      gs.selectAll("rect")
        .data(function (d) { return d[1] })
        .join(
          function (enter) {
            return enter.append("rect")
              .attr("eip", function (d) { return d.chars })
              .attr("mat", function (d) { return d.mats })
              .attr("x", function (d) { return x(d.mats)! + computeExtraXY_mat(x.bandwidth() / nrActivities, d.chars) })
              .attr("y", function (d) { return y(d.countries)! })
              .attr("width", x.bandwidth() / nrActivities)
              .attr("height", y.bandwidth())
              .style("fill", function (d) { return hueColors(d.mats, d.squares) })
          },
          function (update) {
            return update
              .attr("x", function (d) { return x(d.mats)! + computeExtraXY_mat(x.bandwidth() / nrActivities, d.chars) })
              .attr("y", function (d) { return y(d.countries)! })
              .attr("width", x.bandwidth() / nrActivities)
              .attr("height", y.bandwidth())
              .style("fill", function (d) { return hueColors(d.mats, d.squares) })
          },
          function (exit) {
            return exit.remove();
          }
        )
        .style("stroke", "#c0c0c0")
        .style("stroke-width", .5)
        .style("opacity", 1)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }



  }






}