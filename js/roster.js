RosterApp = 

(function() {
    var R = {
        init: function() {
            R.inputField = R.id('roster_input');
            R.roster = R.id('roster_list');
            R.promotedRoster = R.id('roster_promoted_list');
            R.addButton = R.id('roster_add_button');
            R.form = R.id('roster_head');
            R.count = 0;

            R.inputField.onkeyup = R.maintainButton;
            R.inputField.onkeypress = R.maintainButton;
           
            R.form.onsubmit = R.rosterAdd; 
        },
        
        id: document.getElementById.bind(document),

        /*
        selector: function(elem, selector){
            return elem.querySelector(selector);
        },
        */

        addEntry: function(input){
            var deleteButton = R.createButton('delete', R.count);
            var promoteButton = R.createButton('promote', R.count);
            var editButton = R.createButton('edit', R.count);
            var upButton = R.createButton('up', R.count);
            var downButton = R.createButton('down', R.count);

            var field = R.createField(input);
            
            var entry = R.createEntry(field, R.count, 
                [deleteButton, editButton, promoteButton, upButton, downButton]);
            R.count += 1;

            R.roster.appendChild(entry);
            return entry;
        },

        createField: function(input){
            var field = document.createElement('input');

            field.className = 
                'roster_input roster_list_item_text_container primary flex_container';
            field.setAttributeNode(document.createAttribute("disabled"));
            field.type = 'text';

            field.value = input;

            return field;
        },

        createEntry: function(field, count, buttons){
            var entry = document.createElement('div');

            entry.className = 'flex_container roster_entry';
            entry.dataset.rosterCount = count;

            entry.appendChild(field);

            buttons.forEach(function(button){
                entry.appendChild(button);                
            });

            entry.id = 'roster_entry_' + count;

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
                    callback = R.deleteEntryHandler;
                    break;
                case 'promote':
                    classes += ' success roster_promote_button';
                    innerText = 'Promote';
                    callback = R.promoteEntryHandler;
                    break;
                case 'demote':
                    classes += ' secondary roster_delete_button';
                    innerText = 'Demote';
                    callback = R.demoteEntryHandler;
                    break;
                case 'edit':
                    classes += ' roster_edit_button';
                    innerText = 'Edit';
                    callback = R.editEntryHandler;
                    break;
                case 'up':
                    classes += ' roster_up_button';
                    innerText = '▲';
                    callback = R.upEntryHandler;
                    break;
                case 'down':
                    classes += ' roster_down_button';
                    innerText = '▼';
                    callback = R.downEntryHandler;
                    break;
            }
            
            button.type = 'button';
            button.innerText = innerText;
            button.className = classes;
            button.dataset.rosterCount = count
            button.onclick = callback;
            
            return button;
        },

        deleteEntryHandler: function(ev){
            R.deleteEntry(ev.currentTarget);
        },

        promoteEntryHandler: function(ev){
            R.promoteEntry(R.getCount(ev.currentTarget));
        },

        demoteEntryHandler: function(ev){
            R.demoteEntry(R.getCount(ev.currentTarget));
        },

        saveEntryHandler: function(ev){
            R.saveEntry(R.getCount(ev.currentTarget));
        },

        editEntryHandler: function(ev){
            R.editEntry(R.getCount(ev.currentTarget));
        },

        upEntryHandler: function(ev){
            R.upEntry(R.getCount(ev.currentTarget));
        },

        downEntryHandler: function(ev){
            R.downEntry(R.getCount(ev.currentTarget));
        },
        getEntry: function(button){
            var entry;

            if(typeof button === 'number'){
                entry = R.id('roster_entry_' + button);               
            }else{
                var entry = R.id('roster_entry_' + button.dataset.rosterCount); 
            }
            
            entry.field = entry.querySelector('.roster_list_item_text_container');

            return entry;
        },

        upEntry: function(count){
            var entry = R.getEntry(count); 
    
            if(entry.previousElementSibling !== null){
                entry.parentElement.insertBefore(entry, entry.previousElementSibling);
            }
        },

        downEntry: function(count){
            var entry = R.getEntry(count); 
    
            if(entry.nextElementSibling !== null){
                entry.parentElement.insertBefore(entry, entry.nextElementSibling.nextElementSibling);
            }
        },

        editButton: function(button){
            button.classList.add('roster_edit_button');
            button.classList.remove('roster_save_button');

            button.innerText = 'Edit';

            button.onclick = R.editEntryHandler;
        },

        saveButton: function(button){
            button.classList.add('roster_save_button');
            button.classList.remove('roster_edit_button');

            button.innerText = 'Save';

            button.onclick = R.saveEntryHandler;
        },

        deleteEntry: function(count){
            R.removeElement(R.getEntry(count));
        },

        promoteButton: function(button){
            R.addClasses(button, ['roster_promote_button', 'success']);
            R.removeClasses(button, ['roster_demote_button', 'secondary']);
            button.innerText = 'Promote';
            button.onclick = R.promoteEntryHandler;
        },

        demoteButton: function(button){
            R.addClasses(button, ['roster_demote_button', 'secondary']);
            R.removeClasses(button, ['roster_promote_button', 'success']);
            button.innerText = 'Demote';
            button.onclick = R.demoteEntryHandler;
        },
            
        removeElement: function(elem){
            elem.parentElement.removeChild(elem);
             
            return elem;
        },

        prependChild: function(par, chld){
            par.insertBefore(chld, par.firstChild);
            
            return chld;
        },

        saveEntry: function(count){
            var entry = R.getEntry(count); 

            entry.field.onkeypress = null;
            entry.field.setAttributeNode(document.createAttribute("disabled"));

            entry.field.removeAttribute('data-roster-backup-value');

            R.editButton(entry.querySelector('.roster_save_button'));
        },

        restoreEntry: function(count){
            var entry = R.getEntry(count); 

            entry.field.onkeypress = null;
            entry.field.setAttributeNode(document.createAttribute("disabled"));
            entry.field.value = entry.field.dataset.rosterBackupValue;
            entry.field.removeAttribute('data-roster-backup-value');

            entry.field.onkeypress = null;

            R.editButton(entry.querySelector('.roster_save_button'));
        },

        getCount: function(elem){
            return parseInt(elem.dataset.rosterCount);
        },

        restoreEntryHandler: function(ev){
                
        },

        editEntry: function(count){
            var entry = R.getEntry(count); 

            entry.field.dataset.rosterBackupValue = entry.field.value;

            entry.field.removeAttribute("disabled");
            
            entry.field.onkeydown = function(e){
                //on escape
                if (e.keyCode === 27){
                    R.restoreEntry(count);
                }
            };

            entry.field.onkeypress = function(e){
                //on enter
                if (e.keyCode === 13) {
                    entry.querySelector('.roster_save_button').click();
                }
            };
            R.saveButton(entry.querySelector('.roster_edit_button'));
                        
            entry.field.select();
        },
            
        getButton: function(entry, name){
            return entry.querySelector('.roster_' + name + '_button');
        },

        getInput: function(entry){
            return entry.querySelector('input.roster_list_item_text_container');
        },

        demoteEntry: function(count){
            var entry = R.getEntry(count); 
            
            //R.removeElement(entry);
            //R.prependChild(R.roster, entry);
            
            R.promoteButton(R.getButton(entry, 'demote'));

            R.getInput(entry).classList.remove('roster_promoted'); 
            entry.classList.remove('roster_promoted');
        },

        promoteEntry: function(count){
            var entry = R.getEntry(count); 

            
            //R.removeElement(entry);
            //R.prependChild(R.promotedRoster, entry);

            R.demoteButton(R.getButton(entry, 'promote'));
            
            entry.classList.add('roster_promoted');
            R.getInput(entry).classList.add('roster_promoted');
        },

        resetHead: function(){
            R.inputField.value = '';
            R.maintainButton();
        },

        rosterAdd: function(e) {
            e.preventDefault();

            if(!R.id('roster_add_button').classList.contains('disabled')){
                R.addEntry(R.inputField.value);
                R.resetHead();
            }
        },
        
        forEachCall: function(elem, items, call){
            items.forEach(function(item){
                call(item);
            }, elem);
        },

        addClasses: function(elem, classes){
            R.forEachCall(elem, classes, elem.classList.add.bind(elem.classList));
        },

        removeClasses: function(elem, classes){
            R.forEachCall(elem, classes, elem.classList.remove.bind(elem.classList));
        },

        maintainButton: function() {
            var inputButton = R.id('roster_add_button');
            var isEmpty = /^\s*$/.test(R.inputField.value);

            if (isEmpty){
                inputButton.classList.add('disabled');
            }else{
                inputButton.classList.remove('disabled');
            }
        },
    };

    return R;
})();

document.onload = RosterApp.init();
