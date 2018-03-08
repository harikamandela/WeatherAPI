var express = require("express"),
        app = express(),
  bodyParser= require("body-parser"),  
   mongoose = require("mongoose"),
   Weather  = require("./models/weather");
   
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//Setting up and checking database connection   
mongoose.connect("mongodb://localhost/weatherDB");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to Database");
});


//Routes
app.get("/weather",function(req,res){
    Weather.find({},'-_id DATE',function(err,allWeatherData){
        if(err){
            console.log(err);
        }
        else{
          res.status(200).send(allWeatherData);
        }
    });
});

app.get("/weather/historical",function(req,res){
    
    Weather.find({},'-_id DATE',function(err,allWeatherData){
        if(err){
            console.log(err);
        }
        else{
         res.status(200).send(allWeatherData);
        }
    });
});


app.post("/weather/historical",function(req,res){
    var newWeatherDate = req.body;
    console.log(newWeatherDate);
    Weather.create(newWeatherDate,function(err,newWeather){
        if(err){
            console.log(err);
        }
        else{
            console.log(newWeather);
          res.status(201).send(newWeather);
        }
    });
});


//Get weather record for a specific date
app.get("/weather/historical/:id",function(req,res){
    
    Weather.find({'DATE': req.params.id},'-_id',function(err,weatherRec){
        if(err){
          console.log(err);
        }
        else{
            if(weatherRec.length>0){
                res.status(200).send(weatherRec[0]);
            }
            else{
              res.status(404).send(" 404 Not Found");
            }
        }
    });
});

//delete route
app.delete("/weather/historical/:id",function(req,res){
    Weather.remove({'DATE': req.params.id},function(err,callback){
        if(err){
            console.log(err);
        }
        else{
                res.status(200).send(callback);

            }
    });
});

//forecast route
app.get("/weather/forecast/:id",function(req,res){
    var completeDate=req.params.id;
    var year =completeDate.substring(0,4);
    var month = completeDate.substring(4,6);
    var stringDate= completeDate.substring(6,8);
    var intDate = parseInt(stringDate);
    
    var forecastYearMonth = year+month;
    
    //fetch last year's weather record of same date
    var lastyear= year-1;
    var queryLastYear =lastyear+month;
    
    
    //fetching 7 weather records from last year during the same month
    Weather.find({'DATE':{$regex : "^" + queryLastYear}},'-_id',{sort: {'DATE': 1},limit: 7},function(err,weatherRec){
        if(err){
          console.log(err);
        }
        else{
            var futuredates =[];
            futuredates[0]=completeDate;
            var nextDate= intDate;
            
            for(var i=1;i<=6;i++)
            {
                nextDate+=1;
                var nextDate=nextDate.toString();
                console.log(nextDate);
                if(nextDate.length==1){
                    var formDate = forecastYearMonth+'0'+nextDate;
                }
                else{
                    var formDate = forecastYearMonth+nextDate;
                }
                
                futuredates.push(formDate);
                nextDate = parseInt(nextDate);
            }
            
            var forecastFinal = [];
            for(var i=0;i<=6;i++){
                var date =futuredates[i];
                var tmax =weatherRec[i]["TMAX"];
                var tmin = weatherRec[i]["TMIN"];
                var addToForecast={DATE:date,TMAX:tmax,TMIN:tmin};
                forecastFinal.push(addToForecast);
            }
          if(forecastFinal.length>0){
                res.status(200).send(forecastFinal);
            }
        }
    });
});

app.listen(3000,function(){
    console.log("Weather Data server has started");
});
