let ed1, ed2;

document.addEventListener("DOMContentLoaded", function (event) {
    ed1 = new Editor(document.getElementById("editor"), "data");
    ed2 = new Editor(document.getElementById("scratchpad"), "notes");
});

document.addEventListener("visibilitychange", function (e) {
    if (!document.hidden) {
        //reload text if tab is becoming visible
        ed1.load();
        ed2.load();
    }
});


class Editor {
    constructor(htmlElement, localStorageKey) {
        this.htmlElement = htmlElement;
        this.localStorageKey = localStorageKey;
        this.lines = [];
        this.data = {};
        this.htmlElement.addEventListener('keydown', function (e) {
            if (e.keyCode == 9) {
                e.preventDefault()
                //add tab
                document.execCommand('insertHTML', false, '&#009');
                //prevent focusing on next element       
            }

        }.bind(this));

        this.htmlElement.addEventListener('keyup', function (e) {
            this.format()
            this.save();

        }.bind(this));

        this.load();
        this.htmlElement.focus();
    }

    format() {
        console.log(this.htmlElement.textContent);
        this.lines = this.htmlElement.innerHTML.split("\n");
        
        console.log(this.lines);
        for (let index = 0; index < this.lines.length; index++) {
            let line = this.lines[index];

            line = "<p>" + line + "</p>";
            this.lines[index] = line;
        }
        console.log(this.lines);
        this.htmlElement.innerHTML = this.lines;
    }


    save() {
        this.data.content = this.htmlElement.innerHTML;
        this.data.edited = (new Date()).getTime();
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
    }

    load() {
        this.data = JSON.parse(localStorage.getItem(this.localStorageKey));

        //console.log(this.data.content);
        if (!this.data) {
            this.data = { edited: (new Date()).getTime(), content: '<p>Write Here</p>' };
        }
        this.htmlElement.innerHTML = this.data.content;
    }
}


