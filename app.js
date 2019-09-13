const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const fs = require("fs").promises;
let jsonparser = bodyParser.json();
app.use(express.static('public'));

app.get('/', (req, res) => res.send("index.html"))

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




