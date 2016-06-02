RosterApp = {
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
    },

    addEntry: function(input){
        var entry = document.createElement('div');
        var textContainer = document.createElement('div');
        var text = document.createElement('div');

        var deleteButton = RosterApp.createButton('demote', RosterApp.count);
        var promoteButton = RosterApp.createButton('promote', RosterApp.count);

        text.innerText = input;

        textContainer.className = 'roster_list_item_text_container callout primary flex_container';
        textContainer.appendChild(text);

        entry.className = 'flex_container roster_entry';

        entry.appendChild(textContainer);
        entry.appendChild(promoteButton);
        entry.appendChild(deleteButton);

        RosterApp.roster.appendChild(entry);
        entry.id = 'roster_entry_' + RosterApp.count;
        RosterApp.count += 1;

        return entry;
    },

    createButton: function(rosterButtonType, count){
        var button = document.createElement('a');
        var classes = 'button roster_button';
        var innerText = 'DEFAULT';
        var callback;

        switch (rosterButtonType) {
            case 'promote':
                classes += ' success roster_promote_button';
                innerText = 'Promote';
                callback = RosterApp.promoteEntry;
                break;
            case 'demote':
                classes += ' alert roster_delete_button';
                innerText = 'Demote';
                callback = RosterApp.deleteEntry;
                break;
        }
        
        button.type = 'button';
        button.innerText = innerText;
        button.className = classes;
        button.setAttribute('data-roster_count', count);
        button.onclick = callback;
        
        return button;
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
        textContainer = entry.querySelector('div.roster_list_item_text_container');
        textContainer.classList.remove('roster_promoted'); 
        entry.classList.remove('roster_promoted');
    },

    promoteEntry: function(e){
        RosterApp.demoteButton(this)

        entry = document.getElementById('roster_entry_' + this.getAttribute("data-roster_count"));
        textContainer = entry.querySelector('div.roster_list_item_text_container');
        entry.classList.add('roster_promoted');
        textContainer.classList.add('roster_promoted');
    },

    resetHead: function(){
        RosterApp.inputField.value = '';
        RosterApp.maintainButton();
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
}

document.onload = RosterApp.init();
