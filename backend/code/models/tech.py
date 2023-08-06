from enum import Enum

class tech(Enum):
    sBioFluel = 'Solid Biofuels'
    hydro = 'Hydropower'
    wind = 'Wind'
    lBioFluel = 'Liquid Biofuels'
    solar = 'Solar PV'
    geo = 'Geothermal'
    csp = 'Solar Thermal'
    biomass = 'Biogas'
    waste = 'RenWaste'
    coal = 'Charcoal'
  
    #pellet = 'Pellets' 
    #heat = 'Heat'
    #Electricity = 'Electricity'

class techChar(Enum):
    Production = 'Production' 
    Electricity_1 ='Electricity_1' 
    Electricity_2 ='Electricity_2' 
    Imports= 'Imports'
    Charcoal ='Charcoal'
    Residential ='Residential'
    DirectUse = 'DirectUse' 
    Exports ='Exports' 
    Distribution ='Distribution'
    Industry ='Industry'
    Commerce = 'Commerce'
    Other_1 ='Other_1' 
    Other_2 ='Other_2' 
    OwnUse ='OwnUse' 
    Transport ='Transport' 
    Differences = 'Differences'
    CHP = 'CHP' 
    Heat_1 = 'Heat_1'
    Heat_2 = 'Heat_2'
    Stock ='Stock'
    Pellets ='Pellets'


class techCharGroup(Enum):
  PrimaryEnergy = 'Energy production' 
  TransfLosses= 'Energy transf./loss' 
  UsageConsump = 'Energy utilization'
  finalConsump = 'Energy consumption'
