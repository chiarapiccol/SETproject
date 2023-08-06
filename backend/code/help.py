from models.mat import MatChar;
from models.tech import techCharGroup;
from models.country import commonCountries, matCountries
import os
import pandas as pd
import numpy as np
import csv
import json


os.chdir(r'C:\Users\Chiara\Dropbox\UNI\Sem12_Vorlesung 23\BAprojekt\Code\gis_project_template\database')
path = os.getcwd()

#get all countries
df0 = pd.read_csv(r'crmIEP.csv', sep=';',  encoding='ISO-8859-1')
df1 = pd.read_csv(r'countryTechEnergy.csv', sep=';',  encoding='ISO-8859-1')
cMat = df0.country.unique()
cTech = df1.country.unique()
print(cMat)

def diff(list1, list2):
    c = set(list1).union(set(list2))  # or c = set(list1) | set(list2)
    d = set(list1).intersection(set(list2))  # or d = set(list1) & set(list2)
    return list(c - d)
def equ(list1, list2):
    c = set(list1).union(set(list2))
    e = c - set(diff(cMat, cTech))
    return list(e)
print('not',diff(cMat, cTech))
print('yes',equ(cMat, cTech))

