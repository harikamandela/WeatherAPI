Weather 
--------
URL

    GET/historical 
    Obtain list of all dates for which weather information is available.Format of date is YYYYMMDD
    GET/historical/:date
    Get weather information for a particular date
    POST/historical/
    Add weather information for a particular day
    DELETE/historical/:date
    Delete weather information for a particular day
    GET/forecast/:date
    Get weather forecast for an existing date or future date   
URL  Params 

     None

Data Params 

      {"DATE": "20130101","TMAX":34.0,"TMIN" :26.0}

SUCCESS Response 
 
  
                  GET -  Status:200 .
                  POST - Status:201,Content:{"DATE": "20130101"}             
ERROR  Response 

 
                   GET - Status: 404, Content: 404 not found.
                   DELETE - Status: 404,Content: 404 not found
    
