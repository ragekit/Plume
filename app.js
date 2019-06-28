const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const fs = require("fs").promises;
let jsonparser = bodyParser.json();
app.use(express.static('public'));
app.use((req, res, next) => {

    // -----------------------------------------------------------------------
    // authentication middleware
  
    const auth = {login: 'yourlogin', password: 'yourpassword'} // change this
  
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  
    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password) {
      // Access granted...
      return next()
    }
  
    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="401"') // change this
    res.status(401).send('Authentication required.') // custom message
  
    // -----------------------------------------------------------------------
  
  })



app.get('/', (req, res) => res.send("index.html"))

app.post("/update",jsonparser,(req,res)=>{
    var dto = req.body;
    prepareData(fullData,dto.year,dto.month,dto.day);
    fullData[dto.year][dto.month][dto.day][dto.moment] = dto.data;

    fs.writeFile(__dirname+"/data/plume.json", JSON.stringify(fullData,null,'\t'),"utf8");
})

app.get('/data',(req,res) =>{
    res.sendFile(__dirname+"/data/plume.json")
    console.log(req.header("Host"))
    console.log(req.header("Origin"))
} );

function prepareData(data,year,month,day){
    var y,m,d;
    data[year]= y = data[year] ? data[year] : {};
    y[month] = m = y[month] ? y[month] : {};
    m[day] = d = m[day] ? m[day] : {};
    this.data = d;
}

let fullData;
fs.readFile(__dirname+"/data/plume.json","utf8")
.then((data,err) => fullData = JSON.parse(data))
.then(()=>{
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})



