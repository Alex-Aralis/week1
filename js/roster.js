RosterApp = {
    addEntry: function(input){
        var entry = document.createElement('div');
        var textContainer = document.createElement('div');
        var delButton = document.createElement('a');
        var text = document.createElement('div');

        delButton.className = 'alert button roster_button roster_delete_button';
        delButton.type = 'button';
        delButton.innerText = 'Delete';
        delButton.setAttribute('data-roster_count', this.count);
        delButton.onclick = this.deleteEntry;

        text.innerText = input;

        textContainer.className = 'roster_list_item_text_container callout primary flex_container';
        textContainer.appendChild(text);

        entry.className = 'flex_container roster_entry';
        
        entry.appendChild(textContainer);
        entry.appendChild(delButton);

        this.roster.appendChild(entry);
        entry.id = 'roster_entry_' + this.count;
        this.count += 1;

        return entry;
    },

    deleteEntry: function(e){
        entry = document.getElementById('roster_entry_' + this.getAttribute("data-roster_count"))
        entry.parentNode.removeChild(entry);
    },

    resetHead: function(){
        this.inputField.value = '';
    },

    roster_add: function() {
        if(!this.hasClass(document.getElementById('roster_add_button'), 'disabled')){
            this.addEntry(this.inputField.value);
            this.resetHead();
        }
    },
    
    hasClass(ele, cls){
        return (' ' + ele.className + ' ').indexOf(cls) > -1;
    },

    maintainButton: function() {
        var inputButton = document.getElementById('roster_add_button');
        var isEmpty = /^\s*$/.test(this.value);
        if (isEmpty && !RosterApp.hasClass(inputButton, 'disabled')){
            inputButton.classList.add('disabled');            
        }else if (!isEmpty){
            inputButton.className = inputButton.className.replace(/\bdisabled\b/,'');
        }

        console.log(this)
    },

    init: function() {
        this.inputField = document.getElementById('roster_input');
        this.roster = document.getElementById('roster_list');
        this.addButton = document.getElementById('roster_add_button');
        this.count = 0;

        this.inputField.onkeyup = this.maintainButton;
        this.inputField.onkeypress = this.maintainButton;
        
        this.addButton.onclick = this.roster_add.bind(this);

        this.addButton.onkeydown = function(e){
            //on space or enter
            if (e.keyCode === 13 || e.keyCode === 32){
                this.roster_add();
            }
        }.bind(this)

        this.inputField.onkeydown = function(e){
            //on enter
            if (e.keyCode === 13){
                this.roster_add();
            }
        }.bind(this)
    }
}

RosterApp.init();
