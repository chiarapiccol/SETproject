import os
import pandas as pd
import numpy as np
print('moin')
os.chdir(r'C:\Users\kikki\Dropbox\UNI\Sem12_Vorlesung 23\BAprojekt\Code\gis_project_template\database')
path = os.getcwd()
files = os.listdir(path)
csvFiles = [f for f in files if f[-3:] == 'csv']
df = pd.read_csv(r'CountryTechEnergy.csv', sep=';',  encoding='ISO-8859-1')
for col in df:
    df[col] = df[col].astype(str).replace(r'\s+$', '', regex=True)
print(df)