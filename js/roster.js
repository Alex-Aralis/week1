RosterApp = {
    addEntry: function(input){
        var entry = document.createElement('div');
        var textContainer = document.createElement('div');
        var delButton = document.createElement('a');
        var promoteButton = document.createElement('a');
        var text = document.createElement('div');

        delButton.className = 'alert button roster_button roster_delete_button';
        delButton.type = 'button';
        delButton.innerText = 'Delete';
        delButton.setAttribute('data-roster_count', this.count);
        delButton.onclick = this.deleteEntry;
    
        promoteButton.className = 'success button roster_button roster_promote_button';
        promoteButton.type = 'button';
        promoteButton.innerText = 'Promote';
        promoteButton.setAttribute('data-roster_count', this.count);
        promoteButton.onclick = this.promoteEntry;

        text.innerText = input;

        textContainer.className = 'roster_list_item_text_container callout primary flex_container';
        textContainer.appendChild(text);

        entry.className = 'flex_container roster_entry';
        
        entry.appendChild(textContainer);
        entry.appendChild(promoteButton);
        entry.appendChild(delButton);

        this.roster.appendChild(entry);
        entry.id = 'roster_entry_' + this.count;
        this.count += 1;

        return entry;
        this.inputField.onkeyup = this.maintainButton;
    },

    deleteEntry: function(e){
        entry = document.getElementById('roster_entry_' + this.getAttribute("data-roster_count"));
        entry.parentNode.removeChild(entry);
    },


    promoteButton: function(button){
        RosterApp.addClasses(button, ['roster_promote_button', 'success']);
        RosterApp.removeClasses(button, ['roster_demote_button', 'secondary']);
        button.innerText = 'Promote';
        button.onclick = RosterApp.promoteEntry;
    },

    demoteButton: function(button){
        RosterApp.addClasses(button, ['roster_demote_button', 'secondary']);
        RosterApp.removeClasses(button, ['roster_promote_button', 'success']);
        button.innerText = 'Demote';
        button.onclick = RosterApp.demoteEntry;
    },

    demoteEntry: function(e){
        
        RosterApp.promoteButton(this)

        entry = document.getElementById('roster_entry_' + this.getAttribute("data-roster_count"));
        entry.classList.remove('roster_promoted');
    },

    promoteEntry: function(e){
        RosterApp.demoteButton(this)

        entry = document.getElementById('roster_entry_' + this.getAttribute("data-roster_count"));
        entry.classList.add('roster_promoted');
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
    
    hasClass(elem, cls){
        return (' ' + elem.className + ' ').indexOf(cls) > -1;
    },

/*
    removeClass: function(elem, cls){
        var len = elem.length;
        console.log(elem.className);
        elem.className = elem.className.replace(' ' + cls + ' ', ' ');
        elem.className = elem.className.replace(cls + ' ', ' ');
        elem.className = elem.className.replace(' ' + cls, ' ');
        console.log(elem.className);

        if (len > elem.length){
            return true;
        }else{
            return false;
        }
    },

    addClass: function(elem, cls){
        if (!RosterApp.hasClass(elem, cls)) {
            elem.classList.add(cls);
        }
    },
*/

    forEachCall: function(elem, items, call){
        items.forEach(function(item){
            call(item);
        }, elem);
    },

    addClasses: function(elem, classes){
        RosterApp.forEachCall(elem, classes, elem.classList.add.bind(elem.classList));
        /*
        classes.forEach(classes, function(cls){
            elem.classList.add(elem)
        })
        */
    },

    removeClasses: function(elem, classes){
        RosterApp.forEachCall(elem, classes, elem.classList.remove.bind(elem.classList));
    },
    

    maintainButton: function() {
        var inputButton = document.getElementById('roster_add_button');
        var isEmpty = /^\s*$/.test(this.value);

        if (isEmpty){
            inputButton.classList.add('disabled');
        }else{
            inputButton.classList.remove('disabled');
        }
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
