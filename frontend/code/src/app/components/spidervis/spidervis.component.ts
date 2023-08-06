import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { firstValueFrom } from 'rxjs';
import { mat, model_listFullnameMat, model_listIconMat } from 'src/app/models/mat';
import { model_connectionTechMat, model_listColorTech, model_listFullnameTech, tech } from 'src/app/models/tech';
import { BackendService } from 'src/app/services/backend.service';
import { $enum } from 'ts-enum-util';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-spidervis',
  templateUrl: './spidervis.component.html',
  styleUrls: ['./spidervis.component.css']
})
export class SpidervisComponent {

  //// Local variables - from parent

  matList: mat[] = $enum(mat).getValues();
  connectionTechMat: any[] = model_connectionTechMat

  private _toFetchTech!: tech[];

  @Input()
  set toFetchTech(value: tech[]) {
    this._toFetchTech = value;
  }
  get toFetchTech(): tech[] {
    return this._toFetchTech;
  }

  @Input() toVisHeapMat: any = ''
  @Input() toVisHeapAct: any = ''

  //// Local variables - for the parent

  infoNameTabel: any[] = [
    [],
    [
      { position: 1, material: model_listIconMat[0] + ' (' + model_listFullnameMat[0] + ')', value: 0 },
      { position: 2, material: model_listIconMat[1] + ' (' + model_listFullnameMat[1] + ')', value: 0 },
      { position: 3, material: model_listIconMat[2] + ' (' + model_listFullnameMat[2] + ')', value: 0 },
      { position: 4, material: model_listIconMat[3] + ' (' + model_listFullnameMat[3] + ')', value: 0 },
      { position: 5, material: model_listIconMat[4] + ' (' + model_listFullnameMat[4] + ')', value: 0 },
      { position: 6, material: model_listIconMat[5] + ' (' + model_listFullnameMat[5] + ')', value: 0 },
      { position: 7, material: model_listIconMat[6] + ' (' + model_listFullnameMat[6] + ')', value: 0 }
    ]
  ];

  @Output() spiderNameTable = new EventEmitter<any[]>();


  //// Local variables - for html 

  initialized = false;
  onceTrue = true;
  blockedVis = false;
  blockedIcon = ['unblocked', 'blocked']
  toppTioIcon = this.blockedIcon[0]
  blockIconList = ['bookmark_border', 'bookmark']
  blockIcon = this.blockIconList[0]

  techList: tech[] = $enum(tech).getValues();

  //// LOcal variables - for svg
  svg_1!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>

  tooltip!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
  tooltipText!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>


  spiderDiagrData: any[] | null = null;
  @ViewChild('spiderDiagr') spiderDiagrHTML!: ElementRef;

  //// constructor
  constructor(private backendService: BackendService) { }

  //// ngOnInit
  async ngOnInit() { }

  //// ngOnDestroy
  async ngOnDestroy() { }

  ///// ngAfterViewInit - (since ngOnInit would not read the html properties in time)
  async ngAfterViewInit() {
    //create SVGs
    this.createSVG1()
    //set data and create visualization direct after initialization
    this.callSQLfunk('createSpiderDiagr').then((data) => {
      this.spiderDiagrData = data;
      this.createSpiderDiagr(true)
    });

    // set initialized to true, so that ngOnChanges can be run in the next steps
    this.initialized = true;
  }

  //// onBubblePlotResize
  onSpiderDiagrResize(event: any) {
    d3.select("#spiderDiagr_svg").selectChildren().remove();
    this.createSVG1()
    this.createSpiderDiagr(true)
  }

  //// block the visualization
  async blockVis() {
    if (this.blockedVis === false) {  // if not blocked, then block
      this.blockedVis = true;
      this.blockIcon = this.blockIconList[1]
      this.toppTioIcon = this.blockedIcon[1]
    }
    else { // if blocked, then create vis
      this.blockedVis = false;
      this.blockIcon = this.blockIconList[0]
      this.toppTioIcon = this.blockedIcon[0]
      this.createSpiderDiagr(false)
    }
  }

  //// ngOnChanges
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.initialized) {
      // if not blocked
      if (this.blockedVis === false) {
        // if not empty
        if (this.toFetchTech.length !== 0) {
          this.callSQLfunk('createSpiderDiagr').then((data) => {
            this.spiderDiagrData = data;
            this.createSpiderDiagr(false)
          });
        } else {
          this.svg_1.selectAll("path").remove();
        }
      }
      // if blocked
      else {
        // if not empty
        if (this.toFetchTech.length !== 0) {
          this.callSQLfunk('createSpiderDiagr').then((data) => {
            this.spiderDiagrData = data;
          });
        } else {
          this.svg_1.selectAll("path").remove();
        }
      }
    }
  }

  //// callSQLfunk
  async callSQLfunk(funkName: string): Promise<any[]> {
    var data!: any[];
    if (funkName === 'createSpiderDiagr') {
      data = await firstValueFrom(this.backendService.fetchSpiderDiagr(this.toFetchTech, this.matList))
    }
    return data;
  }

  createSVG1() {
    var width = this.spiderDiagrHTML.nativeElement.offsetWidth
    var height = this.spiderDiagrHTML.nativeElement.offsetHeight

    this.svg_1 = d3.select('#spiderDiagr_svg')
      .attr("width", width)
      .attr("height", height)

    this.tooltip = d3.select("#spiderDiagr_toolTip")
      .style("color", "white")
      .style("background", "#6b6b6b")
      .style("border-radius", "5px").style("padding", "5px")

    this.tooltipText = d3.select("#spiderDiagr_toolTipText")
      .style("color", "white")
      .style("background", "#6b6b6b")
      .style("border-radius", "5px").style("padding", "5px")
  }

  async createSpiderDiagr(createtructure: boolean) {

    // assigne global variables to local variables in the function createBubblePot()

    const data = this.spiderDiagrData;
    const svg = this.svg_1
    const tooltip = this.tooltip
    const tooltipText = this.tooltipText
    const margin = Math.min(this.spiderDiagrHTML.nativeElement.offsetWidth, this.spiderDiagrHTML.nativeElement.offsetHeight) / 10
    const width = this.spiderDiagrHTML.nativeElement.offsetWidth - (margin * 2);
    const height = this.spiderDiagrHTML.nativeElement.offsetHeight - (margin * 2);

    // check if data is empty - if not create data grouped by technologies for the creation of spider diagram

    if (data === null) {
      return;
    }

    // functions - transform data 

    var helpFeatures: any[] = ["All", "Silver", "Manganese", "Chromium", "Copper", "Zinc", "Nickel", "Molybdenum",]
    const groupedData: any[] = transformData(data, helpFeatures);
    let features = model_listFullnameMat

    function transformData(oldData: any[], arms: string[]): any[] {
      const groupedData = d3.group(oldData, (d: any) => d.polygons);
      const newData = Array.from(groupedData, ([line, group], index) => {
        let SumValue = 1;
        const lineData: any = {};
        arms.forEach((arm) => {  // Initialize lineData object with arms as keys (except 'All')
          if (arm !== 'All') {
            lineData[arm] = 0;
          }
        });
        group.forEach((entry: any) => {   // Populate lineData with arms and values
          const arm = entry.arms;
          const value = parseFloat(entry.values);
          if (arm === 'All') {
            SumValue = parseFloat(entry.values);
          }
          if (arms.includes(arm) && arm !== 'All') {  // Check if the arm is in the provided arms array
            lineData[arm] = value / SumValue * 100;
          }
        });
        const namedLine: any = ({ [`${line}`]: lineData })
        return namedLine;
      });
      return newData;
    }

    // functions - create coordinates, scale, lines, and colors of the structure

    let radialScale = d3.scalePow().exponent(.3).domain([0, 100]).range([0, Math.min((width / 2), (height / 2))]);
    let ticks_main = [5, 25, 50, 75, 100];

    function angleToCoordinate(angle: any, value: any) {
      let x = Math.cos(angle) * radialScale(value);
      let y = Math.sin(angle) * radialScale(value);
      return { "x": width / 2 + margin - x, "y": height / 2 + margin - y };
    }

    let line = d3.line<{ x: number; y: number; }>()
      .x(d => d.x)
      .y(d => d.y);

    var colTech = model_listColorTech
    const techTOcolor = (d: any) => {
      const index = this.techList.indexOf(d)
      return colTech[index] + 1 + ')'
    }

    function getPathCoordinates(data_point: any) {
      let coordinates = [];
      for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        let coordinate = angleToCoordinate(angle, data_point[0][ft_name]);
        coordinates.push(coordinate);
      }
      return coordinates;
    }

    // functions - mouse functions

    const mouseover = (event: any, _: any) => {
      tooltip.style("visibility", "visible")
      const nameId = event.target.id
      const strokeCol = event.target.attributes[3].value
      const helpName = event.target.attributes[1].value
      const index = this.techList.indexOf(helpName)
      const nameTool = model_listFullnameTech[index]
      // tooltip
      tooltip.html('Technology: ' + nameTool)
      // informationBox        
      this.infoNameTabel[0] = nameTool
      let objValuesArray: number[]
      for (let i = 0; i < groupedData.length; i++) {
        const obj = Object.keys(groupedData[i])[0]
        if (obj === helpName) {
          var objValues: any = Object.values(groupedData[i])[0]
          objValuesArray = Object.values(objValues)
          for (let j = 0; j < objValuesArray.length; j++) {
            this.infoNameTabel[1][j].value = Math.round(objValuesArray[j] * 100) / 100 + '%'
          }
        }
      }
      this.spiderNameTable.emit(this.infoNameTabel)
      // spiderDiagram
      svg.select("#" + nameId).raise().attr("fill", strokeCol).attr("fill-opacity", .7) // set attributes spider chart - color
      // sankeyDiagram
      d3.select('.sankeyDiagr_svg').selectAll("#" + nameId.toString().replace(/\s/g, '')).raise().attr("stroke-opacity", 1) // set attributes sankeydiagram
      // pieChartPlot
      if (!d3.select("#pieChartPlot_svg").select('#' + nameId.toString().replace(/\s/g, '')).empty()) {
        d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", .4)
        d3.select("#pieChartPlot_svg").select('#' + nameId.toString().replace(/\s/g, '')).attr("fill-opacity", 1)
      }
    }

    const mouseoverText = (event: any, _: any) => {
      tooltipText.style("visibility", "visible")
      const nameId = event.explicitOriginalTarget.data
      const index = model_listIconMat.indexOf(nameId)
      const helpName = this.matList[index]
      // tooltip
      tooltipText.html('Material: ' + helpName)
      // spiderDiagram
      this.connectionTechMat.forEach((elem: any) => { // set attributes spider chart
        if (elem.mat.includes(helpName)) {
          const name = elem.tech
          const index = this.techList.indexOf(name)
          const col = model_listColorTech[index] + .7 + ')'
          const helpName2 = name.toString().replace(/\s/g, '')
          d3.select("#spiderDiagr_svg").select("#" + helpName2).attr("fill", col).raise() //.attr("stroke-width", 10)
        }
      })
      // sankeyDiagram
      d3.select('.sankeyDiagr_svg').selectAll("." + helpName.toString().replace(/\s/g, '')).raise().attr("stroke-opacity", 1) // set attributes sankeydiagram
      // pieChartPlot
      if (!d3.select("#pieChartPlot_svg").select('#' + helpName.toString().replace(/\s/g, '')).empty()) {
        d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", .4)
        d3.select("#pieChartPlot_svg").select('#' + helpName.toString().replace(/\s/g, '')).attr("fill-opacity", 1)
      }
      // heatmap
      const heatMapView = d3.select('#heatMap_svg').select('#xAxis').attr("perspect")
      const height: any = d3.select('#heatMap_svg').attr("height")
      const widthSVGspiderheat: any = d3.select('#heatMap_svg').attr("width")
      const marginLeft: any = d3.select('#heatMap_svg').attr("marginLeft")
      const marginRight: any = d3.select('#heatMap_svg').attr("marginRight")
      const marginTop: any = d3.select('#heatMap_svg').attr("marginTop")
      var paddingValue = 0.1
      if (heatMapView === 'Mat' && this.toVisHeapMat.indexOf(nameId) > -1) {
        var actLentght = this.toVisHeapAct.length
        var x = d3.scaleBand().range([0, widthSVGspiderheat - marginLeft - marginRight]).domain(this.toVisHeapMat).padding(paddingValue)
        var xForXmat: any = x(nameId)
        var widthForXmat: any = x.bandwidth() / actLentght
        d3.select("#heatMap_svg").append('rect').attr("class", 'heatMap_hoveringRect')
          .attr("x", xForXmat + (+marginLeft))
          .attr("y", 0 + marginTop * 0.2)
          .attr("width", (widthForXmat * actLentght))
          .attr("height", height)
          .style("fill", 'rgb(192,192,192, .5)')
      }
    }

    const mouseleave = (event: any, _: any) => {
      const nameId = event.target.id
      const nameId2 = event.target.attributes[1].value
      // tooltip
      tooltip.style("visibility", "hidden");
      // spiderDiagram
      svg.select("#" + nameId).transition().duration(100).attr("fill", 'none') // set attributes spider chart
      // sankeyDiagram
      d3.select('.sankeyDiagr_svg').selectAll("#" + nameId2.toString().replace(/\s/g, '')).raise().attr("stroke-opacity", .2) // set attributes sankeydiagram
      // piePlotChart
      d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", 1)
    }

    const mouseleaveText = (event: any, _: any) => {
      const nameId = event.originalTarget.__data__.name
      const index = model_listIconMat.indexOf(nameId)
      const nameId2 = this.matList[index]
      // tolltip
      tooltipText.style("visibility", "hidden");
      // tooltip - rect
      svg.select('.spiderChart_tooltipRect').remove()
      // spiderDiagram
      this.connectionTechMat.forEach((elem: any) => { // set attributes spider chart
        if (elem.mat.includes(nameId2)) {
          const name = elem.tech
          const nameId3 = name.toString().replace(/\s/g, '')
          d3.select("#spiderDiagr_svg").select("#" + nameId3).lower() // set attributes sankeydiagram
          d3.select("#spiderDiagr_svg").select("#" + nameId3).attr("fill", 'none') //.attr("stroke-width", 10) // set attributes sankeydiagram
        }
      })
      // sankeyDiagram
      d3.select('.sankeyDiagr_svg').selectAll("." + nameId2.toString().replace(/\s/g, '')).raise().attr("stroke-opacity", .2) // set attributes sankeydiagram
      // piePlotChart
      d3.select("#pieChartPlot_svg").selectAll('path').attr("fill-opacity", 1)
      // heatmap
      d3.select("#heatMap_svg").select('.heatMap_hoveringRect').remove()
    }

    const mousemove = (event: any, _: any) => {
      tooltip.style("top", (event.pageY) + "px").style("left", (event.pageX + 10) + "px"); // set tooltip spider chart
    };

    const mousemoveText = (event: any, _: any) => {
      tooltipText.style("top", (event.pageY) + "px").style("left", (event.pageX + 10) + "px"); // set tooltip spider chart
    };


    // plott the structure

    if (createtructure) { // only if initialized run this code and create the gridlines, axes, lables

      svg.selectAll("circle") // plotting th gridlines
        .data(ticks_main)
        .join(
          enter => enter.append("circle")
            .attr("cx", width / 2 + margin)
            .attr("cy", height / 2 + margin)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 1)
            .attr("r", function (d) { return radialScale(d) })
        );

      svg.selectAll(".ticklabel") // plotting the labels 
        .data(ticks_main)
        .join(
          enter => enter.append("text")
            .attr("class", "ticklabel")
            .attr("x", width / 2 + margin)
            .attr("y", d => height / 2 + margin - radialScale(d))
            .style("font-size", "70%")
            .attr('text-anchor', 'middle')
            .text(d => d.toString() + '%')
        );

      let featureData = features.map((f, i) => { // help-function for plotting the axes 
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        const index = this.matList.indexOf(f.toLowerCase())
        const textAnchorList = ['middle', 'start', 'end']
        let techAnchor
        if (i === 0) {
          techAnchor = textAnchorList[0]
        } else if (i < Math.round(this.matList.length / 2)) {
          techAnchor = textAnchorList[1]
        } else {
          techAnchor = textAnchorList[2]
        }
        return {
          "name": model_listIconMat[index],
          "angle": angle,
          "line_coord": angleToCoordinate(angle, 100),
          "label_coord": angleToCoordinate(angle, 130),
          "textAnchor": techAnchor
        };
      });

      svg.selectAll("line") // draw axis line
        .data(featureData)
        .join(
          enter => enter.append("line")
            .attr("class", 'axisLines')
            .attr("x1", width / 2 + margin)
            .attr("y1", height / 2 + margin)
            .attr("x2", d => d.line_coord.x)
            .attr("y2", d => d.line_coord.y)
            .attr("stroke-width", '1px')
            .attr("stroke", "black")
        );

      svg.selectAll(".axislabel")  // draw axis label
        .data(featureData)
        .join(
          enter => enter.append("text")
            .attr("class", 'axisLabels')
            .attr("x", function (d) { return d.label_coord.x })
            .attr("y", function (d) { return d.label_coord.y })
            .attr('text-anchor', function (d) { return d.textAnchor })
            .text(function (d) { return d.name })
            .on("mouseover", mouseoverText)
            .on("mouseleave", mouseleaveText)
            .on("mousemove", mousemoveText)
        );
    }


    // plott the data

    var cols: string[] = [] // help-function
    groupedData.forEach((item) => {
      const keys = Object.keys(item);
      cols.push(techTOcolor(keys[0]));
    });

    svg.selectAll("path")
      .data(groupedData)
      .join(
        function (enter) {
          return enter
            .append("path")
            .attr('id', function (d) { return Object.keys(d).toString().replace(/\s/g, '') })
            .attr('name', function (d) { return Object.keys(d) })
            .datum(function (d) { return getPathCoordinates(Object.values(d)) })
            .attr("d", function (d) { return line(d) })
            .attr("stroke", function (_, i) { return cols[i] })
        },
        function (update) {
          return update
            .attr('id', function (d) { return Object.keys(d).toString().replace(/\s/g, '') })
            .attr('name', function (d) { return Object.keys(d) })
            .datum(function (d) { return getPathCoordinates(Object.values(d)) })
            .attr("d", function (d) { return line(d) })
            .attr("stroke", function (_, i) { return cols[i] })
        },
        function (exit) {
          return exit.remove();
        }
      )
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .attr("stroke-width", 3)
      .attr("fill", 'none')
      .attr("stroke-opacity", 1)
  }


}





