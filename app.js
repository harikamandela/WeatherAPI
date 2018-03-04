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
    // var DATE = req.body.DATE;
    // var TMAX = req.body.TMAX;
    // var TMIN = req.body.TMIN;
    // var newWeatherDate = {DATE:DATE,TMAX:TMAX,TMIN:TMIN};
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
                res.status(200).send(weatherRec);
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


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Weather Data server has started");
});