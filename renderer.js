
const path = require('path');
const fs = require('fs').promises;
const electron = require('electron');

const userDataPath = (electron.app || electron.remote.app).getPath('desktop');
const savepath = path.join(userDataPath, "prout" + '.json');

function GetDay() {
    var d = new Date()
    d.setHours(0,0,0,0);
    return d;
}

function GetTime(){
    return Date.now();
}

function GetOrCreate(data,key){
    if(!data[key]){
        data[key] = {};
    }
    return data[key];
}

class Editor {
    htmlElement;
    currentEditableDiv;
    data;
    day;
    year;
    month;
    moment;
    constructor(htmlelement){

        this.htmlElement = htmlelement;
        let date = new Date();

        this.day = date.getDate();
        this.month = date.getMonth()+1;
        this.year = date.getFullYear();
        this.moment = GetTime();
        this.load().then(this.init.bind(this));
    }

    save() {
        let saveData  = document.getElementById("current").innerHTML;
        GetData().then((data) => {
            data[this.year][this.month][this.day][this.moment] = saveData;
            fs.writeFile(savepath, JSON.stringify(data),"utf8");
        });
    }
    load(){
       return GetData().then((data) => {
            let dayEntry = {[this.year] :{[this.month] :{[this.day] :{}}}}
            data = Object.assign(dayEntry,data);
            return data;
       });
    }

    
    init(data){
        this.data = data[this.year][this.month][this.day];
        console.log(this.data);
        this.htmlElement.addEventListener('keydown', function (e) {
                if(e.keyCode == 9){
                    e.preventDefault()
                    //add tab
                    document.execCommand('insertHTML', false, '&#009');
                }
        });

        this.htmlElement.addEventListener('keyup',function(e){
            this.save();
        }.bind(this));

        for(let o of Object.entries(this.data)){
            console.log(o);
            var div = document.createElement("div");
            div.innerHTML = o[1];
            div.className = "entry";
            this.htmlElement.append(div);
        }
        var diveditable = document.createElement("div");
        diveditable.contentEditable = "true";
        diveditable.id = "current";
        this.htmlElement.append(diveditable);        
        diveditable.focus();
    }
}

let fullDataPromise;

function GetData(){
fullDataPromise = fullDataPromise || fs.readFile(savepath,"utf8").then(JSON.parse);

    return fullDataPromise;
}


document.addEventListener("DOMContentLoaded", function (event) {
    //let ed1 = new Editor(document.getElementById("editor"),"data");
    let ed2 = new Editor(document.getElementById("scratchpad"));
});
