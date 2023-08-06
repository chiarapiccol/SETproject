import { Component, Input } from '@angular/core';
import { mat, model_listColorMat, model_listContentMat, model_listFotoMat, model_listFullnameMat, model_listIconMat } from 'src/app/models/mat';
import { model_listColorTech, model_listContentTech, model_listFotoTech, model_listFullnameTech, model_listIconTech, tech } from 'src/app/models/tech';
import { $enum } from 'ts-enum-util';

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})
export class InfoboxComponent {

   //// Local Variables - from the parent to visualize info about all components 
  show!: string
  @Input() showVis: any = ''
  @Input() showHoveredElement!: any
  showDataColumnsSpider = ['Material', 'Amount']
  showDataColumnsPieChart = ['Nothing', 'xElement', 'All'];
  showDataColumnsPiePlot = ['Nothing', 'xCountry']
  showDataColumnsHeatMap = ['Nothing', 'xMaterial']
  techODERmat:any
  amountToderM:any
  dimToderM:any
  minToderM:any
  maxToderM:any
  @Input() showDataSource!: any
  @Input() showOtherInfo!: any

  //// Local variables - lists

  techList: tech[] = $enum(tech).getValues();
  matList: mat[] = $enum(mat).getValues();

  listSubtitel: any[] = ['Sustainable energy Technology', 'Critical Raw Material']

  listFotoTech: any[] = model_listFotoTech
  listFotoMat: any[] = model_listFotoMat

  listContentTech: string[] = model_listContentTech
  listContentMat: string[] = model_listContentMat

  listColorTech: any[] = model_listColorTech
  listColorMat: any[] = model_listColorMat

  listIconTech: any[] = model_listIconTech
  listIconMat: any[] = model_listIconMat

  listFullnameTech: any[] = model_listFullnameTech
  listFullnameMat: any[] = model_listFullnameMat

  hovered_infoTitel: any
  hovered_infoSubtitel: any
  hovered_color: any
  hovered_foto: any
  hovered_content: any

  showFilterInfo(elem: any) {
    let o = 1
    if (this.techList.indexOf(elem) > -1) { // if a technology was clicked
      const index = this.techList.indexOf(elem)
      this.hovered_infoTitel = this.listFullnameTech[index]
      this.hovered_infoSubtitel = this.listSubtitel[0]
      this.hovered_foto = this.listFotoTech[index]
      this.hovered_content = this.listContentTech[index]
      this.hovered_color = this.listColorTech[index] + o + ')'
    } else { // if a material was clicked
      const index = this.matList.indexOf(elem)
      this.hovered_infoTitel = this.listFullnameMat[index]
      this.hovered_infoSubtitel = this.listSubtitel[1]
      this.hovered_foto = this.listFotoMat[index]
      this.hovered_content = this.listContentMat[index]
      this.hovered_color = this.listColorMat[index] + o + ')'
    }
  }

  showSpiderInfo() {
    this.hovered_infoTitel = this.showHoveredElement
    this.hovered_infoSubtitel = this.listSubtitel[0]
    const index = this.listFullnameTech.indexOf(this.showHoveredElement)
    this.hovered_color = this.listColorTech[index] + 1 + ')'
  }

  showPieChartInfo(){
    this.hovered_infoTitel = this.showHoveredElement
    this.techODERmat = this.showOtherInfo[0]
    if(this.showOtherInfo[0] === 'Technology'){
      this.hovered_infoSubtitel = this.listSubtitel[0]
      const index = this.listFullnameTech.indexOf(this.showHoveredElement)
      this.hovered_color = this.listColorTech[index] + 1 + ')'
    } else {
      this.hovered_infoSubtitel = this.listSubtitel[1]
      const index = this.listFullnameMat.indexOf(this.showHoveredElement)
      this.hovered_color = this.listColorMat[index] + 1 + ')'
    }
    
  }

  showPiePlotInfo(){
    this.hovered_infoTitel = this.showHoveredElement
    this.hovered_infoSubtitel = 'worldwide countries'
    console.log(this.showDataSource)
    this.techODERmat = 'Country'
    this.hovered_color = '#c0c0c0'
  }

  showHeatmapInfo(){
    this.hovered_infoTitel = this.showHoveredElement
    this.hovered_infoSubtitel = this.listSubtitel[1]
    this.techODERmat = 'Material'
    const index = this.listFullnameMat.indexOf(this.showHoveredElement)
    this.hovered_color = this.listColorMat[index] + 1 + ')'
  }

  /// for all 
  ngOnInit() {
    this.show = 'initialization'
    this.hovered_infoTitel = 'BA-Project'
    this.hovered_infoSubtitel = 'Country-based Visual Analysis of Sustainable Energy Technologies and their Critical Raw Materials'
    this.hovered_content = 'The primary objective of this BA-project is to create a comprehensive and interactive full-stack application for visualizing country-based production, trade, and utilization of the critical raw materials demanded for the construction of sustainable energy technologies.'
    this.hovered_color = 'rgb(192, 192, 192, 1)'
  }

  ngOnChanges() {
    if (this.showVis === 'filter') {
      this.show = this.showVis
      this.showFilterInfo(this.showHoveredElement)
    }
    if (this.showVis === 'spider') {
      this.show = this.showVis
      this.showSpiderInfo()
    }
    if (this.showVis === 'pieChart') {
      this.show = this.showVis
      this.showPieChartInfo()
    }
    if (this.showVis === 'piePlot') {
      this.show = this.showVis
      this.showPiePlotInfo()
    }
    if (this.showVis === 'heatMap') {
      this.show = this.showVis
      this.showHeatmapInfo()
    }
  }

}
