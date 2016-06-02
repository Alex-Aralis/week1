RosterApp = 

(function() {
    var _RosterApp = {
        init: function() {
            _RosterApp.inputField = document.getElementById('roster_input');
            _RosterApp.roster = document.getElementById('roster_list');
            _RosterApp.promotedRoster = document.getElementById('roster_promoted_list');
            _RosterApp.addButton = document.getElementById('roster_add_button');
            _RosterApp.form = document.getElementById('roster_head');
            _RosterApp.count = 0;

            _RosterApp.inputField.onkeyup = _RosterApp.maintainButton;
            _RosterApp.inputField.onkeypress = _RosterApp.maintainButton;
           
            _RosterApp.form.onsubmit = _RosterApp.rosterAdd; 
        },

        addEntry: function(input){
            var entry = document.createElement('div');
            var textContainer = document.createElement('input');
            //var text = document.createElement('div');

            var deleteButton = _RosterApp.createButton('delete', _RosterApp.count);
            var promoteButton = _RosterApp.createButton('promote', _RosterApp.count);
            var editButton = _RosterApp.createButton('edit', _RosterApp.count);

            textContainer.className = 
                'roster_input roster_list_item_text_container primary flex_container';
            textContainer.setAttributeNode(document.createAttribute("disabled"));
            textContainer.type = 'text';

            textContainer.value = input;

            entry.className = 'flex_container roster_entry';

            entry.appendChild(textContainer);
            entry.appendChild(editButton);
            entry.appendChild(promoteButton);
            entry.appendChild(deleteButton);

            _RosterApp.roster.appendChild(entry);
            entry.id = 'roster_entry_' + _RosterApp.count;
            _RosterApp.count += 1;

            return entry;
        },

        createButton: function(rosterButtonType, count){
            var button = document.createElement('a');
            var classes = 'button roster_button';
            var innerText = 'DEFAULT';
            var callback;

            switch (rosterButtonType) {
                case 'delete':
                    classes += ' alert roster_delete_button';
                    innerText = 'Drop';
                    callback = _RosterApp.deleteEntry;
                    break;
                case 'promote':
                    classes += ' success roster_promote_button';
                    innerText = 'Promote';
                    callback = _RosterApp.promoteEntry;
                    break;
                case 'demote':
                    classes += ' secondary roster_delete_button';
                    innerText = 'Demote';
                    callback = _RosterApp.demoteEntry;
                    break;
                case 'edit':
                    classes += ' roster_edit_button';
                    innerText = 'Edit';
                    callback = _RosterApp.editEntry;
                    break;
            }
            
            button.type = 'button';
            button.innerText = innerText;
            button.className = classes;
            button.setAttribute('data-roster_count', count);
            button.onclick = callback;
            
            return button;
        },

        getEntry: function(button){
            var entry = document.getElementById('roster_entry_' + 
                button.getAttribute("data-roster_count"));
            
            entry.field = entry.querySelector('.roster_list_item_text_container');

            return entry;
        },

        editButton: function(button){
            button.classList.add('roster_edit_button');
            button.classList.remove('roster_save_button');

            button.innerText = 'Edit';

            button.onclick = _RosterApp.editEntry;
        },

        saveButton: function(button){
            button.classList.add('roster_save_button');
            button.classList.remove('roster_edit_button');

            button.innerText = 'Save';

            button.onclick = _RosterApp.saveEntry;
        },

        deleteEntry: function(e){
            _RosterApp.removeElement(_RosterApp.getEntry(e.currentTarget));
        },

        promoteButton: function(button){
            _RosterApp.addClasses(button, ['roster_promote_button', 'success']);
            _RosterApp.removeClasses(button, ['roster_demote_button', 'secondary']);
            button.innerText = 'Promote';
            button.onclick = _RosterApp.promoteEntry;
        },

        demoteButton: function(button){
            _RosterApp.addClasses(button, ['roster_demote_button', 'secondary']);
            _RosterApp.removeClasses(button, ['roster_promote_button', 'success']);
            button.innerText = 'Demote';
            button.onclick = _RosterApp.demoteEntry;
        },
            
        removeElement: function(elem){
            elem.parentElement.removeChild(elem);
             
            return elem;
        },

        prependChild: function(par, chld){
            par.insertBefore(chld, par.firstChild);
            
            return chld;
        },

        saveEntry: function(e){
            var entry = _RosterApp.getEntry(this); 

            entry.field.setAttributeNode(document.createAttribute("disabled"));

            _RosterApp.editButton(e.currentTarget);
        },

        editEntry: function(e){
            var entry = _RosterApp.getEntry(this); 

            entry.field.removeAttribute("disabled");

            _RosterApp.saveButton(e.currentTarget);

            entry.field.select();
        },
            
        demoteEntry: function(e){
            var entry = _RosterApp.getEntry(this); 
            
            _RosterApp.removeElement(entry);
            _RosterApp.prependChild(_RosterApp.roster, entry);
            
            _RosterApp.promoteButton(this)

            var textContainer = entry.querySelector('input.roster_list_item_text_container');

            textContainer.classList.remove('roster_promoted'); 
            entry.classList.remove('roster_promoted');
        },

        promoteEntry: function(e){
            var entry = _RosterApp.getEntry(this); 

            _RosterApp.removeElement(entry);
            _RosterApp.prependChild(_RosterApp.promotedRoster, entry);

            _RosterApp.demoteButton(this)
            
            var textContainer = entry.querySelector('input.roster_list_item_text_container');
            entry.classList.add('roster_promoted');
            textContainer.classList.add('roster_promoted');
        },

        resetHead: function(){
            _RosterApp.inputField.value = '';
            _RosterApp.maintainButton();
        },

        rosterAdd: function(e) {
            e.preventDefault();

            if(!document.getElementById('roster_add_button').classList.contains('disabled')){
                _RosterApp.addEntry(_RosterApp.inputField.value);
                _RosterApp.resetHead();
            }
        },
        
        forEachCall: function(elem, items, call){
            items.forEach(function(item){
                call(item);
            }, elem);
        },

        addClasses: function(elem, classes){
            _RosterApp.forEachCall(elem, classes, elem.classList.add.bind(elem.classList));
        },

        removeClasses: function(elem, classes){
            _RosterApp.forEachCall(elem, classes, elem.classList.remove.bind(elem.classList));
        },

        maintainButton: function() {
            var inputButton = document.getElementById('roster_add_button');
            var isEmpty = /^\s*$/.test(_RosterApp.inputField.value);

            if (isEmpty){
                inputButton.classList.add('disabled');
            }else{
                inputButton.classList.remove('disabled');
            }
        },
    };

    return _RosterApp;
})();

document.onload = RosterApp.init();
