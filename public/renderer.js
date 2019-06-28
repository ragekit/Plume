class Editor {
    htmlElement;
    currentEditableDiv;
    data;
    day;
    year;
    month;
    moment;
    lastupdateTime;
    timer;
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

        if(this.timer) clearTimeout(this.timer);
        
        this.timer = setTimeout(()=>{
            let saveData  = document.getElementById("current").innerHTML;
            if(saveData == "") return;
            let dto = {year : this.year, month:this.month, day : this.day, moment : this.moment, data : saveData};
            fetch("/update", {
                method: 'POST',
                body: JSON.stringify(dto), // data can be `string` or {object}!
                headers:{
                  'Content-Type': 'application/json'
            }
        })
         //   fs.writeFile(savepath, JSON.stringify(fullData,null,'\t'),"utf8");
        },1000);

       
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
            this.moment = Date.now();
            this.createEditableDiv();
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

        var momentDiv = document.createElement("div");
            var momentDate = new Date(parseInt(this.moment,10));
            momentDiv.innerHTML = String(momentDate.getHours()).padStart(2,"0")+ ":" + String(momentDate.getMinutes()).padStart(2,"0");
            momentDiv.className = "momentTitle";
            this.htmlElement.append(momentDiv);

        var diveditable = document.createElement("div");
        diveditable.contentEditable = "true";
        diveditable.id = "current";
        diveditable.className = "entry";
        diveditable.innerHTML = this.data[this.moment] || "";
        this.htmlElement.append(diveditable);
       // diveditable.focus();
        let range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(diveditable);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        let selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }

    initListeners(){
        this.htmlElement.addEventListener('keydown', (e) =>{
            if(e.keyCode == 9){
                e.preventDefault()
                
                document.execCommand('insertHTML', false, '&#009');
            }
            this.updateTime();
        });

        this.htmlElement.addEventListener('keyup',(e)=>{
            this.save();
        });
    }
    
    init(editable){
       
        for(let o of Object.entries(this.data)){
            if(o[0]== this.moment) continue;

            var momentDiv = document.createElement("div");
            var momentDate = new Date(parseInt(o[0],10));
            momentDiv.innerHTML = String(momentDate.getHours()).padStart(2,"0")+ ":" + String(momentDate.getMinutes()).padStart(2,"0");
            momentDiv.className = "momentTitle";
            this.htmlElement.append(momentDiv);
            
            var div = document.createElement("div");
            div.innerHTML = o[1];
            div.id = o[0];
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

    latest = false;
    constructor(text,year,month,day){
        this.element = document.createElement("span");
        this.element.className = "daylink";
        this.element.innerHTML = text +"/";
        this.year = year;
        this.month = month;
        this.day = day;
        this.element.style.cursor = "pointer";
    }



}

class DiaryHistory {
    data;
    htmlElement;
    elements = [];
    test;
    constructor(htmlElemt){
        
        this.htmlElement = htmlElemt;
        this.constructHtml();
    }

  
    constructHtml(){
        let latest;
        for(let y of Object.entries(fullData)){
            this.htmlElement.append(y[0]+"/\n");

            for(let m of Object.entries(y[1])){
                this.htmlElement.append(m[0] +"/\n");
                for(let d of Object.entries(m[1])){
                    var dayElement = new DayLink(d[0],y[0],m[0],d[0]);
                   this.htmlElement.appendChild(dayElement.element);
                    this.elements.push(dayElement);
                    latest = dayElement;
                }
                this.htmlElement.append("\n");
            }
        }
        
        latest.latest = true;
    }
    updateCallback(fun){
        
        this.elements.forEach(d => {
            d.element.addEventListener("click",()=>{ 
                fun(d);
            });

        });
    }
}

let fullData;

let savepath;

const updateMaxTime = 1;

// fetch("data/config.json")
//     .then(data => { 
//         savepath = JSON.parse(data).dataPath;
//     })
//     .then(()=>{
//         fs.readFile(savepath,"utf8")
//         .catch(err => {
//             return "{}";
//         })
//         .then(JSON.parse)
//         .then(data => {
//             fullData = data;
//             let ed2 = new Editor(document.getElementById("scratchpad"));
//             let history = new DiaryHistory(document.getElementById("history"));
//             //console.log(history.elements[0].element)

//           //  history.elements[0].element.addEventListener("click",() => console.log("test"))
//             history.updateCallback((d)=>{
//                 ed2.updateData(d) })
            
//         });
//     })



fetch("data",{
    credentials: 'include'  
  })
    .then(data => {return data.json()})
    .then((json)=> {
        fullData = json;
        let ed2 = new Editor(document.getElementById("scratchpad"));
        let history = new DiaryHistory(document.getElementById("history"));
        //console.log(history.elements[0].element)

        //  history.elements[0].element.addEventListener("click",() => console.log("test"))
        history.updateCallback((d)=>{
            ed2.updateData(d) })
    })