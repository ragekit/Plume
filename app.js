const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const fs = require("fs").promises;
const session = require('express-session')

let jsonparser = bodyParser.json();
let urlencodedparser = bodyParser.urlencoded({extended:false});
let harcorepassword = "putain";
app.use(session({
    secret :'asd;fojasdj;e',
    resave:false,
    saveUninitialized :false
}))

app.use(unless("/login",checkUser));
app.use(express.static('public'));


function checkUser(req,res,next){
    if(req.session.user){
        next();
    }else {
       res.redirect("/login");
    }
  
}
function unless(path, middleware) {
    
    return function(req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};


app.get('/', (req, res) => {
    if(req.session.user){
        console.log("index");
        res.sendFile(__dirname+"/app.html")

   }else {
       console.log("redirect");
      res.redirect("/login");
   }
   
});

app.get("/login",(req,res)=>{
   res.sendFile(__dirname+"/login.html");
})

app.post("/login",urlencodedparser,(req,res)=>{
   if(req.body.password  == harcorepassword){
       req.session.user = true;
       res.redirect("/");
       return;
   }
   res.redirect("/login");

});

app.post("/update",jsonparser,(req,res)=>{
    var dto = req.body;
    prepareData(fullData,dto.year,dto.month,dto.day);
    fullData[dto.year][dto.month][dto.day][dto.moment] = dto.data;

    fs.writeFile(__dirname+"/data/plume.json", JSON.stringify(fullData,null,'\t'),"utf8");
    res.send('updated');
})

app.get('/data',(req,res) =>{
    fullData = fs.readFile(__dirname+"/data/plume.json","utf8")
        .then(data => {
            fullData = JSON.parse(data);
            res.send(fullData)
    });
} );

function prepareData(data,year,month,day){
    var y,m,d;
    data[year]= y = data[year] ? data[year] : {};
    y[month] = m = y[month] ? y[month] : {};
    m[day] = d = m[day] ? m[day] : {};
}

let fullData;
app.listen(port, () => console.log(`Plume listening on port ${port}!`))




