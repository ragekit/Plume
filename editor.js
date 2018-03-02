var browser = browser || chrome;

document.addEventListener("DOMContentLoaded", function (event) {
    var ed1 = new Editor(document.getElementById("editor"),"data");
    var ed2 = new Editor(document.getElementById("scratchpad"),"notes");
});


function Editor(htmlelement, localStorageKey) {
   
    this.htmlElement = htmlelement;
    this.localStorageKey = localStorageKey;
    this.data = {};
    this.save = function () {
        this.data.content = this.htmlElement.innerHTML;
        this.data.edited = (new Date()).getTime();
        localStorage.setItem(this.localStorageKey,JSON.stringify(this.data));
    }
    this.load = function(){
       this.data = JSON.parse(localStorage.getItem(this.localStorageKey));

       //console.log(this.data.content);
            if (!this.data) {
                this.data = { edited: (new Date()).getTime(), content: '' };
            }
            this.htmlElement.innerHTML = this.data.content;
    }

    this.htmlElement.addEventListener('keydown', function (e) {
        //console.log(e);
        if(e.keyCode == 9){
            e.preventDefault()
            //add tab
            document.execCommand('insertHTML', false, '&#009');
            //prevent focusing on next element
               
        }
        
    }.bind(this));

    this.htmlElement.addEventListener('keyup',function(e){
        this.save();

    }.bind(this));

    document.addEventListener("visibilitychange",function(e){
        if(!document.hidden){
            //reload text if tab is becoming visible
            this.load();
        }
    }.bind(this));

    
    this.load();
    
    
    this.htmlElement.focus();
}


