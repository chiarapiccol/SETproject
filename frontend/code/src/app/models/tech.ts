export enum tech {
  sBioFluel = 'Solid Biofuels',
  hydro = 'Hydropower',
  wind = 'Wind',
  lBioFluel = 'Liquid Biofuels',
  solar = 'Solar PV',
  geo = 'Geothermal',
  csp = 'Solar Thermal',
  biomass = 'Biogas',
  waste = 'RenWaste',
  pellet = 'Pellets',
}

export enum techChar {
  Production = 'Productions',
  Imports = 'Imports',
  Exports = 'Exports',
  Stock = 'Stocks',
  Residential = 'Residential',
  Industry = 'Industry',
  Commerce = 'Commerce',
  Transport = 'Transport',
  Other = 'Other',
  DirectUse = 'DirectUse',
  Heat = 'Heat',
  Electricity = 'Electricity',
}

export enum techCharGroup {
  PrimaryEnergy = 'Energy production',
  TransfLosses = 'Energy transf./loss',
  UsageConsump = 'Energy utilization',
  finalConsump = 'Energy consumption'

}

export const model_listColorTech: any[] = ['rgb(156, 117, 95,', 'rgb(128, 177, 211,', 'rgb(159, 216, 223,', 'rgb(144, 200, 172,', 'rgb(255, 217, 102,', 'rgb(253, 138, 138,', 'rgb(224, 143, 98,', 'rgb(73,115,109,', 'rgb(89, 161, 79,', 'rgb(186, 176, 171,']

export const model_listIconTech: any[] = ['spa', 'water', 'wind_power', 'water_drop','solar_power' , 'landscape', 'device_thermostat', 'gas_meter', 'recycling', 'area_chart']

export const model_listFullnameTech: any[] = ['Solid biofuels', 'Hydroelectric power plant', 'Wind turbine','Liquid biofuels', 'Solar photovoltaik', 'Geothermal plants', 'Thermal photovoltaik', 'Biogas plants', 'Waste-to-energy', 'Pellets']

export const model_listContentTech: any[] = [
  'Solid biofuels, such as wood pellets or chips, are derived from organic matter and can be used for heating or electricity generation. They are a renewable energy source that can replace fossil fuels and contribute to reduced greenhouse gas emissions. However, the combustion of solid biofuels can release particulate matter and other air pollutants, which can have negative impacts on air quality. Additionally, the production and transportation of solid biofuels may require significant land use and can compete with food production. In conclusion, solid biofuels offer a renewable alternative to fossil fuels but need to be produced and used with careful consideration of their environmental and social impacts. ',
  'Hydroelectric power plants generate electricity by utilizing the kinetic energy of flowing or falling water to drive turbines. Hydroelectricity is a clean and reliable energy source with a long lifespan. It does not produce greenhouse gas emissions during operation and can provide consistent power supply. However, the construction of large-scale dams can have significant environmental and social impacts, including the displacement of communities and alteration of aquatic ecosystems. Overall, hydroelectric power plants offer a sustainable energy solution but need to be carefully planned to minimize their environmental and social consequences.',
  'Wind turbines convert the kinetic energy of the wind into mechanical power, which is then transformed into electricity. Wind power is a renewable energy source that does not emit greenhouse gases and contributes to reducing reliance on fossil fuels. Wind farms can be built on land or offshore, taking advantage of strong and consistent wind patterns. However, wind turbines can be visually intrusive and generate noise pollution. Additionally, their efficiency depends on wind availability, which may vary over time. In summary, wind turbines provide a valuable renewable energy option but come with aesthetic and noise concerns, as well as dependency on wind conditions.',
  'Liquid biofuels, such as ethanol and biodiesel, are derived from biomass sources like crops, agricultural residues, or algae. They can be used as a substitute for gasoline and diesel, reducing greenhouse gas emissions and dependence on fossil fuels. Liquid biofuels can be blended with conventional fuels or used in dedicated engines. However, the cultivation of biofuel crops may compete with food production and lead to deforestation or increased water usage. Furthermore, the energy-intensive production processes for liquid biofuels can offset some of their environmental benefits. In summary, liquid biofuels offer a renewable energy option for transportation, but their production methods and potential land-use conflicts should be carefully managed.',
  'Solar photovoltaic technology harnesses sunlight to generate electricity using solar panels composed of photovoltaic cells. It is a clean and renewable energy source that does not produce greenhouse gas emissions during operation. Solar PV systems can be installed on rooftops or in large-scale solar farms, providing decentralized power generation and reducing transmission losses. However, the efficiency of solar panels can be affected by weather conditions, and the initial installation cost can be high. In conclusion, solar photovoltaic offers a sustainable energy solution with minimal environmental impact, albeit with some limitations related to efficiency and upfront costs.',
  'Geothermal plants generate electricity by harnessing the natural heat from the Earth`s interior. This renewable energy source taps into hot water or steam reservoirs deep underground to drive turbines and produce electricity. Geothermal power is reliable, available 24/7, and emits minimal greenhouse gases. However, it is limited to regions with geothermal resources, and the drilling required for extracting geothermal energy can be expensive. In conclusion, geothermal plants offer a sustainable energy option, especially in geologically active regions, but are restricted to specific locations and may have higher upfront costs.',
  'Thermal photovoltaic systems combine the generation of electricity with the collection of heat energy from the sun. These systems utilize solar panels that produce electricity while also capturing and utilizing the thermal energy generated. Thermal PV can be used for heating water, space heating, or even cooling through absorption refrigeration. This technology offers the advantage of dual energy production, but it can be less efficient in converting sunlight into electricity compared to traditional solar PV systems. In summary, thermal photovoltaic provides a versatile renewable energy solution but may have slightly lower electrical efficiency compared to standard solar PV.',
  'Biogas plants utilize organic materials, such as agricultural waste, food scraps, or animal manure, to produce biogas through anaerobic digestion. Biogas is a versatile energy source that can be used for heating, electricity generation, or even as a vehicle fuel. It helps reduce methane emissions from organic waste and provides a decentralized energy solution. However, biogas production can be affected by feedstock availability and requires efficient waste management systems. In conclusion, biogas plants offer a sustainable way to transform organic waste into energy, although they require proper waste collection and management infrastructure.',
  'Waste-to-energy technologies convert waste materials, such as municipal solid waste or agricultural residues, into energy through processes like incineration or anaerobic digestion. This approach helps reduce landfill waste and can generate electricity or heat. Waste-to-energy facilities can also capture and utilize methane emissions from landfills, which is a potent greenhouse gas. However, these technologies require proper waste management systems to ensure that hazardous or non-combustible materials are not incinerated and that air emissions are controlled. It is crucial to prioritize waste reduction, recycling, and composting before resorting to waste-to-energy solutions. In summary, waste-to-energy provides a means to recover energy from waste, but it should be integrated with comprehensive waste management strategies to minimize environmental and health impacts.',
  'Wood pellets are a type of solid biofuel made from compressed sawdust, wood chips, or other woody biomass materials. They are commonly used for heating residential and commercial spaces, as well as for power generation in some industrial applications. Wood pellets offer several advantages, including high energy density, easy handling and transportation, and efficient combustion. They are a renewable alternative to fossil fuels, contributing to reduced greenhouse gas emissions. However, the production of wood pellets requires a steady supply of sustainably sourced wood, which can pose challenges for deforestation and biodiversity conservation. It is important to ensure that wood pellet production follows responsible forestry practices to mitigate environmental impacts. In conclusion, wood pellets provide a convenient and sustainable fuel option for heating and power generation, but their production must be carefully managed to maintain ecological balance'
]

export const model_listFotoTech: any[] = [
  "/assets/t7.jpg", "/assets/t3.jpg", "/assets/t2.jpg", "/assets/t8.jpg", "/assets/t1.jpg",  "/assets/t6.jpg", "/assets/t5.jpg", "/assets/t4.jpg", "/assets/t10.jpg", "/assets/t9.jpg"
]

export const model_connectionTechMat: any[] = [
  { tech: 'Solid Biofuels', mat: ['zinc', 'nickel', 'copper'] },
  { tech: 'Hydropower', mat: ['chromium', 'copper', 'manganese', 'molybdenum', 'nickel', 'zinc'] },
  { tech: 'Wind', mat: ['chromium', 'copper', 'manganese', 'molybdenum', 'nickel', 'silver'] },
  { tech: 'Solar PV', mat: ['copper', 'zinc', 'silver'] },
  { tech: 'Geothermal', mat: ['chromium', 'copper', 'manganese', 'molybdenum', 'nickel'] },
  { tech: 'Solar Thermal', mat: ['chromium', 'copper', 'manganese', 'molybdenum', 'zinc', 'nickel'] }
]



