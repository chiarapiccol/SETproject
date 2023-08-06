import os
import pandas as pd
import numpy as np

# List files
os.chdir(r'C:\Users\Chiara\Dropbox\UNI\Sem12_Vorlesung 23\BAprojekt\Code\gis_project_template\database')
path = os.getcwd()
files = os.listdir(path)
csvFiles = [f for f in files if f[-3:] == 'csv']
noCsvFiles = [f for f in files if f[-3:] != 'csv']
print(len(csvFiles), csvFiles)
print(len(noCsvFiles), noCsvFiles)

### Data cleaning
# some symbols must be replaced or delated (",", "#", " ")
# add id as first column
numVar = ['year2008', 'year2009', 'year2010', 'year2011', 'year2012', 'yar2013', 'year2014', 'year2015', 'year2016', 'year2017', 'year2018', 'year2020', 'year2030', 'year2040', 'year', 'month', 'phosphateRock', 'urea', 'potassiumChloride', 'aluminum', 'ironOre', 'copper', 'lead', 'urea', 'tin', 'nickel', 'zinc', 'gold', 'platinum', 'silver', 'mineralMetals', 'preciousMetals', 'ferrousMetals', 'allMetals', 'value']

for f in csvFiles:
    if 'CountryTechEnergy.csv'!= f:
        df = pd.read_csv(f, sep=';')
    else:
        df = pd.read_csv(r'CountryTechEnergy.csv', sep=';',  encoding='ISO-8859-1')
    if 'id' not in df.columns: 
         df.insert(0, 'id', range(1, len(df)+1))
    for col in df:
         df[col] = df[col].astype(str).replace(r'\s+$', '', regex=True)
         if col in numVar:
            df[col] = df[col].astype(str).str.replace(',', '.')
         else:
          df[col] = df[col].astype(str).str.replace('#', '')
          df[col] = df[col].astype(str).str.replace(' & ', '&')
    df.to_csv(f, sep=';', index=False)   

### Data overview
# for each file read table and get variables' type and statistics
for f in csvFiles:
    df = pd.read_csv(f, sep=';')
    print('######', f)
    print(df.dtypes, df.isnull().sum())