from flask import Flask, jsonify, request
from flask_cors import CORS

import psycopg2
from psycopg2.extras import RealDictCursor

from models.mat import Mat, MatChar, model_listIconMat
from models.country import commonCountries, matCountries



app = Flask(__name__)
CORS(app)

# database = "localhost"
database = "database"

# port=25432
port=5432


@app.route('/test')
def test_roue():
    return jsonify("test successfsfsaadful!")

############################## pieChart

@app.route('/pieChart', methods=['POST', 'GET']) 
def get_pieChart():
    print('get_pieChart works')
    data = request.get_json()
    myListTech = ['Productions','Imports', 'Exports', 'Stocks', 'Residential', 'Industry', 'Commerce','Transport', 'Other','DirectUse', 'Heat', 'Electricity' ]
    techs = str((data['techs'])).replace('[', '(').replace(']', ')')
    mats = str(data['mats']).replace('[', '(').replace(']', ')')
    if(data['cols'][0] in myListTech): 
        cols = str(data['cols']).replace('[', '(').replace(']', ')')
    else: 
        cols = []
        for i in data['cols']: cols.append(str((MatChar(i)).name))  #['refineriesAndSmelter', 'refineries', 'smelter', 'slab']
        cols = str(cols).replace('[', '(').replace(']', ')')

    queryTech = f"""select technologyandsource as slice, sum(ABS(value)) as sum
                from countrytechenergy
                where year='2020'  and 
 	                technologyandsource != 'GrandTotal' and technologyandsource in {techs} and
 	                maincategory in ('PrimaryEnergy', 'UsageConsump' , 'finalConsump') and
	                subcategory != 'Total'and subcategory != 'Supply' and subcategory != 'Differences' and subcategory in {cols}
                group by technologyandsource, maincategory
    """

    queryMat = f"""select mat as slice, sum(year2018) as sum
                from crmiep
                where eip in {cols} and 
                      mat in {mats}
                group by mat"""

    if(data['cols'][0] in myListTech): 
        query = queryTech
    else: 
        query= queryMat
    
    with psycopg2.connect(host=database, port=port, dbname="gis_db", user="gis_user", password="gis_pass") as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query)
            results = cursor.fetchall()

    output = []
    for result in results:

        if ((result['sum'] == None) or (result['sum'] <= 0)):
            values=0
        else: 
            values = float(result['sum'])
       
        output.append({
            "slices": str(result['slice']),
            "values": values
        })
    return jsonify(output), 200


############################### bubblePLot

@app.route('/bubblePlot', methods=['POST', 'GET'])
def get_bubblePlot():
    print('get_bubblePlot works')

    # get all variables from the frontend
    data = request.get_json()
    myListMat = [e.name for e in MatChar]
    myListTech = ['Productions','Imports', 'Exports', 'Stocks', 'Residential', 'Industry', 'Commerce','Transport', 'Other','DirectUse', 'Heat', 'Electricity' ]
    contr = str(data['countr']).replace('[', '(').replace(']', ')')
    mats = str(data['mats']).replace('[', '(').replace(']', ')')
    techs = str((data['techs'])).replace('[', '(').replace(']', ')')
    
    if(data['col'][0] in myListTech): 
        colArray = (data['col'])
        col = str(data['col']).replace('[', '(').replace(']', ')')
    else: 
        colArray = []
        for i in data['col']: colArray.append(str((MatChar(i)).name))  #['refineriesAndSmelter', 'refineries', 'smelter', 'slab']
        col = str(colArray).replace('[', '(').replace(']', ')')

    if(data['size'][0] in myListTech): 
        sizeArray = (data['size'])
        size = str(data['size']).replace('[', '(').replace(']', ')')
    else: 
        sizeArray = []
        for i in data['size']: sizeArray.append(str((MatChar(i)).name)) 
        size = str(sizeArray).replace('[', '(').replace(']', ')')
        
    if(data['x'][0] in myListTech): 
        xArray = (data['x'])
        x = str(data['x']).replace('[', '(').replace(']', ')')
    else: 
        xArray = []
        for i in data['x']: xArray.append(str((MatChar(i)).name))  
        x = str(xArray).replace('[', '(').replace(']', ')')

    if(data['y'][0] in myListTech): 
        yArray = (data['y'])
        y = str(data['y']).replace('[', '(').replace(']', ')')
    else: 
        yArray = []
        for i in data['y']: yArray.append(str((MatChar(i)).name)) 
        y = str(yArray).replace('[', '(').replace(']', ')')

    print(col, x, y, size)


    # defining functions to get query results
    # if the filter consider a techs characteristic, then select the countrytechenergy table
    def queryTech(filterOpt, query): 
        if (query == 'queryCol'): 
            sqlQuery = f"""
                    (select country, technologyandsource as slices, sum(ABS(value)) as {query}
                    from countrytechenergy
                    where year='2020' and 
                        subcategory != 'Total' and subcategory != 'Supply' and subcategory != 'Differences' and
                        technologyandsource != 'GrandTotal' and
                        
                        country in {contr} and
                        subcategory in {filterOpt} and
                        technologyandsource in {techs}
                    group by country, technologyandsource
                    order by country) {query}"""
        else: 
            sqlQuery = f"""
                    (select country, sum(ABS(value)) as {query}
                    from countrytechenergy
                    where year='2020' and 
                        subcategory != 'Total' and subcategory != 'Supply' and subcategory != 'Differences' and 
                        technologyandsource != 'GrandTotal' and
                        
                        country in {contr} and
                        subcategory in {filterOpt}  and
                        technologyandsource in {techs}
                    group by country
                    order by country) {query} """
        return sqlQuery
    # if the filter consider a mats characteristic, then select the crmiep table
    def queryMat(filterOpt, query):
        if (query == 'queryCol'): 
            sqlQuery = f"""
                    (select country, mat as slices, sum(year2018) as {query}
                    from crmiep
                    where country in {contr} and 
                        mat in {mats} and 
                        eip in {filterOpt}
                    group by country, mat
                    order by country) {query}"""
        else: 
            sqlQuery = f"""
                    (select country, sum(year2018) as {query}
                    from crmiep
                    where country in {contr} and 
                        mat in {mats} and 
                        eip in {filterOpt}
                    group by country
                    order by country) {query}"""
        return sqlQuery
    # if the filter consider a countries characteristic, then select the countriesaspects table
    def queryCount(filterOpt, query):
        print('queryCount', filterOpt, query)
        # TO-DO WHEN DATA AVAILABLE

    # create four queries respectively for the four filters: color, size, x, y
    # queryCol
    query = 'queryCol'
    filterOptArray = colArray
    filterOpt = col
    if(filterOptArray[0] in myListTech):
        q = queryTech(filterOpt, str(query))
    elif (filterOptArray[0] in myListMat):
        q = queryMat(filterOpt, str(query))
    else:
        q = queryCount(filterOpt, str(query))
    queryCol = q

    # querySize
    query = 'querySize'
    filterOptArray = sizeArray
    filterOpt = size
    if(filterOptArray[0] in myListTech):
        q = queryTech(filterOpt, str(query))
    elif (filterOptArray[0] in myListMat):
        q = queryMat(filterOpt, str(query))
    else:
        q = queryCount(filterOpt, str(query))
    querySize = q

    # queryX
    query = 'queryX'
    filterOptArray = xArray
    filterOpt = x
    if(filterOptArray[0] in myListTech):
        q = queryTech(filterOpt, str(query))
    elif (filterOptArray[0] in myListMat):
        q = queryMat(filterOpt, str(query))
    else:
        q = queryCount(filterOpt, str(query))
    queryX = q

    # queryY
    query = 'queryY'
    filterOptArray = yArray
    filterOpt = y
    if(filterOptArray[0] in myListTech):
        q = queryTech(filterOpt, str(query))
    elif (filterOptArray[0] in myListMat):
        q = queryMat(filterOpt, str(query))
    else:
        q = queryCount(filterOpt, str(query))
    queryY = q
    
    # join the queries querySize, queryX, queryY
    queryJoint = f""" select querySize.country, querySize as "querySize", queryX as "queryX", queryY as "queryY", slices, queryCol as "queryCol"
                FROM {querySize}
                FULL OUTER JOIN {queryX}
                ON querySize.country = queryX.country
                FULL OUTER JOIN {queryY}
                ON querySize.country = queryY.country
                FULL OUTER JOIN {queryCol}
                ON querySize.country = queryCol.country
        """
    # send query to database
    with psycopg2.connect(host=database, port=port, dbname="gis_db", user="gis_user", password="gis_pass") as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(queryJoint)
            resultsQueryJoint = cursor.fetchall()

    outputQueryJoint = []
    for result in resultsQueryJoint:
        if ((result['querySize'] == None) or (result['querySize'] <= 0)):
            Res_querySize=0
        else: 
            Res_querySize = float(result['querySize'])

        if ((result['queryX'] == None) or (result['queryX'] <= 0)):
            Res_queryX=0
        else: 
            Res_queryX = float(result['queryX'])

        if ((result['queryY'] == None) or (result['queryY'] <= 0)):
            Res_queryY=0
        else: 
            Res_queryY = float(result['queryY'])

        if (result['queryCol'] == None):
            Res_queryCol = 0
        elif (result['queryCol'] <= 0): 
            Res_queryCol = float(result['queryCol']) * (-1) # so that it can be visible in the piecharts
        else: 
            Res_queryCol = float(result['queryCol'])

        countryListShort = [e.name for e in commonCountries] #  rename the countries due to the axis values which have to be named the same way (in frontend it gived problems)
        coutryList = [str(e.value) for e in commonCountries]
        index = coutryList.index(str(result['country']))
        countr = countryListShort[index]
        
        outputQueryJoint.append({
            "countries": countr,
            "size": Res_querySize,
            "x": Res_queryX,
            "y": Res_queryY,
            "slices": str(result['slices']),
            'color' : Res_queryCol
        })
    return jsonify(outputQueryJoint), 200

############################################# spider

@app.route('/spider', methods=['POST', 'GET'])
def get_globalSpider():
    print('get_globalSpider works')
    data = request.get_json()
    techs = str(data['techs']).replace('[', '(').replace(']', ')')
    smallMats = data['mats']
    matsList = []
    for i in smallMats:
        matsList.append(i.capitalize())
    matsList.append('All')
    mats = str(matsList).replace('[', '(').replace(']', ')') # to add when we know which materials we also need -> update material dataset

    query = f"""select tech, mat, year2020
                from mattech
                where scenario = 'sps' and 
                    tech in {techs} and
                    mat in {mats}
                order by tech, mat
    """
    
    with psycopg2.connect(host=database, port=port, dbname="gis_db", user="gis_user", password="gis_pass") as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query)
            results = cursor.fetchall()

    output = []
    for result in results:
        
        if ((result['year2020'] == None) or (result['year2020'] <= 0)):
            values=0
        else: 
            values = float(result['year2020'])

        output.append({
            "arms": str(result['mat']),
            "polygons": str(result['tech']),
            "values": values
        })
    return jsonify(output), 200


############################### heatMap


@app.route('/heatMap', methods=['POST', 'GET'])
def get_heatMap():
    print('get_heatMap works')
    data = request.get_json()
    mats = str(data['mats']).replace('[', '(').replace(']', ')')
    eip = str(data['eip']).replace('[', '(').replace(']', ')')
    countr = str(data['countr']).replace('[', '(').replace(']', ')')

    query = f"""select country,mat, eip, sum(year2018)
                from crmiep
                where mat in {mats} and  eip in {eip} and country in {countr}
                group by country, mat, eip
            """
    
    with psycopg2.connect(host=database, port=port, dbname="gis_db", user="gis_user", password="gis_pass") as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query)
            results = cursor.fetchall()

    output = []
    for result in results:

        if ((result['sum'] == None) or (result['sum'] <= 0)):
            values=0
        else: 
            values = float(result['sum'])

        if (result['eip'] == 'p'): # rename the eips due to the axis values which have to be named the same way (in frontend it gived problems)
            chars='Prod.'
        elif (result['eip'] == 'i'):
            chars='Imp.'
        else: 
            chars = 'Exp.'

        matList = [e.name for e in Mat] #  rename the materials due to the axis values which have to be named the same way (in frontend it gived problems)
        index =matList.index(result['mat']) 
        mats = model_listIconMat[index]

        countryListShort = [e.name for e in matCountries] #  rename the countries due to the axis values which have to be named the same way (in frontend it gived problems)
        coutryList = [str(e.value) for e in matCountries]
        index = coutryList.index(str(result['country']))
        countr = countryListShort[index]
       
        output.append({
            "countries": countr,
            "mats": mats,
            "chars": chars,
            "squares": values
        })
    return jsonify(output), 200


