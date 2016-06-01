
RosterApp = {
    addEntry: function(input){
        var entry = document.createElement('div');
        var textContainer = document.createElement('div');
        var delButton = document.createElement('a');
        var promoteButton = document.createElement('a');
        var text = document.createElement('div');

        delButton.className = 'alert button roster_button roster_delete_button';
        delButton.type = 'button';
        delButton.innerText = 'Drop';
        delButton.setAttribute('data-roster_count', RosterApp.count);
        delButton.onclick = RosterApp.deleteEntry;
    
        promoteButton.className = 'success button roster_button roster_promote_button';
        promoteButton.type = 'button';
        promoteButton.innerText = 'Promote';
        promoteButton.setAttribute('data-roster_count', RosterApp.count);
        promoteButton.onclick = RosterApp.promoteEntry;

        text.innerText = input;

        textContainer.className = 'roster_list_item_text_container callout primary flex_container';
        textContainer.appendChild(text);

        entry.className = 'flex_container roster_entry';
        
        entry.appendChild(textContainer);
        entry.appendChild(promoteButton);
        entry.appendChild(delButton);

        RosterApp.roster.appendChild(entry);
        entry.id = 'roster_entry_' + RosterApp.count;
        RosterApp.count += 1;

        return entry;
        RosterApp.inputField.onkeyup = RosterApp.maintainButton;
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
        RosterApp.inputField.value = '';
    },

    rosterAdd: function() {
        if(!document.getElementById('roster_add_button').classList.contains('disabled')){
            RosterApp.addEntry(RosterApp.inputField.value);
            RosterApp.resetHead();
        }
    },
    
    forEachCall: function(elem, items, call){
        items.forEach(function(item){
            call(item);
        }, elem);
    },

    addClasses: function(elem, classes){
        RosterApp.forEachCall(elem, classes, elem.classList.add.bind(elem.classList));
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
        RosterApp.inputField = document.getElementById('roster_input');
        RosterApp.roster = document.getElementById('roster_list');
        RosterApp.addButton = document.getElementById('roster_add_button');
        RosterApp.count = 0;

        RosterApp.inputField.onkeyup = RosterApp.maintainButton;
        RosterApp.inputField.onkeypress = RosterApp.maintainButton;
        
        RosterApp.addButton.onclick = RosterApp.rosterAdd;

        RosterApp.addButton.onkeydown = function(e){
            //on space or enter
            if (e.keyCode === 13 || e.keyCode === 32){
                RosterApp.rosterAdd();
            }
        }

        RosterApp.inputField.onkeydown = function(e){
            //on enter
            if (e.keyCode === 13){
                RosterApp.rosterAdd();
            }
        }
    }
}

document.onload = RosterApp.init();
