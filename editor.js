document.addEventListener("DOMContentLoaded", function (event) {
    var ed1 = new Editor(document.getElementById("editor"),"data");
    var ed2 = new Editor(document.getElementById("scratchpad"),"notes");
});


function Editor(htmlelement, localStorageKey) {
    this.htmlElement = htmlelement;
    this.data = JSON.parse(localStorage.getItem(localStorageKey));
    if (!this.data) {
        this.data = { edited: (new Date()).getTime(), content: '' };
    }
    this.save = function () {
        this.data.content = this.htmlElement.innerHTML;
        this.data.edited = (new Date()).getTime();
        localStorage.setItem(localStorageKey, JSON.stringify(this.data));
    }

    this.htmlElement.addEventListener('keydown', function (e) {
        console.log(e);
        if(e.keyCode == 9){
            e.preventDefault()
            //add tab
            document.execCommand('insertHTML', false, '&#009');
            //prevent focusing on next element
               
        }
        this.save();
    }.bind(this));

    this.htmlElement.innerHTML = this.data.content;
    this.htmlElement.focus();
}


