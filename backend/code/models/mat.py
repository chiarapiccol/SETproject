from enum import Enum

class Mat(Enum):
    chromium = 'chromium', 
    copper = 'copper', 
    manganese = 'manganese',
    molybdenum = 'molybdenum', 
    nickel ='nickel',
    silver = 'silver',
    zinc = 'zinc'

class MatChar(Enum):
    p = 'Production'
    i = 'Import'
    e = 'Export'


model_lisShortnameEIP = ['Prod.','Imp.', 'Exp.']

model_listIconMat= [ 'Ch', 'Cp',  'Mn', 'Ml', 'Nc', 'Sl', 'Zn']

model_listFullnameMat = [ 'Chromium', 'Copper', 'Manganese', 'Molybdenum', 'Nickel', 'Silver', 'Zinc']