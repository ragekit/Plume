
const path = require('path');
const fs = require('fs').promises;
const electron = require('electron');

const datapath = (electron.app || electron.remote.app).getPath('desktop');

const userDataPath = (electron.app || electron.remote.app).getPath('userData');


class Editor {
    htmlElement;
    currentEditableDiv;
    data;
    day;
    year;
    month;
    moment;
    lastupdateTime;
    constructor(htmlelement){

        this.htmlElement = htmlelement;
        let date = new Date();

        this.day = date.getDate();
        this.month = date.getMonth()+1;
        this.year = date.getFullYear();
        this.moment = Date.now();
        this.lastupdateTime = Date.now();
        this.initListeners();
        this.prepareData(fullData);
        this.init(true);
    }

    save() {
        let saveData  = document.getElementById("current").innerHTML;
        if(saveData == "") return;
        fullData[this.year][this.month][this.day][this.moment] = saveData;
        fs.writeFile(savepath, JSON.stringify(fullData,null,'\t'),"utf8");
    }
    
    prepareData(data){
        var y,m,d;
        data[this.year]= y = data[this.year] ? data[this.year] : {};
        y[this.month] = m = y[this.month] ? y[this.month] : {};
        m[this.day] = d = m[this.day] ? m[this.day] : {};
        this.data = d;
    }

    updateTime(){
        var millis = Date.now() - this.lastupdateTime;
        var mn = millis / 60000.0;
        
        console.log(mn)
        if(mn > updateMaxTime){
            console.log("switchdiv");
            this.createEditableDiv();
            this.moment = Date.now();
        }
        this.lastupdateTime = Date.now();
    }

    updateData(clicked){
        console.log(this);
        this.htmlElement.innerHTML = "";

        if(clicked.latest){
            this.prepareData(fullData);
            this.init(true);
        }else {
            this.data = fullData[clicked.year][clicked.month][clicked.day];
            this.init(false);
        }
    }

    createEditableDiv(){

        var currentEditable = document.getElementById("current");
        if(currentEditable){
            if(currentEditable.innerHTML == "") return;
            currentEditable.contentEditable = "false";
            currentEditable.id = "";
        }
        var diveditable = document.createElement("div");
        diveditable.contentEditable = "true";
        diveditable.id = "current";
        this.htmlElement.append(diveditable);        
        diveditable.focus();
    }

    initListeners(){
        this.htmlElement.addEventListener('keydown', function (e) {
            if(e.keyCode == 9){
                e.preventDefault()
                
                document.execCommand('insertHTML', false, '&#009');
            }
            this.updateTime();
        }.bind(this));

        this.htmlElement.addEventListener('keyup',function(e){
            this.save();
        }.bind(this));
    }
    
    init(editable){
       
        for(let o of Object.entries(this.data)){
            var div = document.createElement("div");
            div.innerHTML = o[1];
            div.className = "entry";
            this.htmlElement.append(div);
        }
        if(editable){
            this.createEditableDiv();
        }
    }

}

class DayLink{
    element;
    year;
    month;
    day;

    onClick;
    latest = false;
    constructor(text,year,month,day){
        this.element = document.createElement("span");
        this.element.className = "daylink";
        this.element.innerHTML = text +"/";
        this.year = year;
        this.month = month;
        this.day = day;
        this.element.style.cursor = "pointer";
        // this.element.addEventListener("click",()=>{
        //    if(this.onClick) this.onClick(this);
        // });
    }



}

class History extends EventTarget {
    data;
    htmlElement;
    onClick;

    elements = [];

    constructor(htmlElemt){
        super();
        
        this.htmlElement = htmlElemt;
        this.constructHtml();
    }

  
    constructHtml(){
        let latest;
        for(let y of Object.entries(fullData)){
            this.htmlElement.innerHTML += y[0]+"/\n";

            for(let m of Object.entries(y[1])){
                this.htmlElement.innerHTML += m[0] +"/\n";
                for(let d of Object.entries(m[1])){
                    console.log(y[1]);
                    var dayElement = new DayLink(d[0],y[0],m[0],d[0]);
                    this.htmlElement.append(dayElement.element);
                   // dayElement.onClick = this.onClick;
                   this.elements.push(dayElement);
                    latest = dayElement;
                }
            }
        }
        latest.latest = true;
    }
    updateCallback(fun){
        this.elements.forEach(d => {
            d.element.addEventListener("click",(event)=>{ fun(d)});
        });{
            
        }
    }
}

let fullData;




let savepath;

const updateMaxTime = 1;

fs.readFile(userDataPath + "/config.json")
    .then(data => { 
        savepath = JSON.parse(data).dataPath;
    })
    .then(()=>{
        fs.readFile(savepath,"utf8")
        .catch(err => {
            return "{}";
        })
        .then(JSON.parse)
        .then(data => {
            fullData = data;
            let ed2 = new Editor(document.getElementById("scratchpad"));
            let history = new History(document.getElementById("history"));
    
            history.updateCallback((d)=>{ ed2.updateData(d) })
            
        });
    })



