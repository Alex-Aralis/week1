RosterApp = 

(function() {
    var R = {
        init: function() {
            R.rosterObj = {length: 0, head: null, tail: null,};
            R.inputField = R.id('roster_input');
            R.roster = R.id('roster_list');
            R.promotedRoster = R.id('roster_promoted_list');
            R.addButton = R.id('roster_add_button');
            R.form = R.id('roster_head');
            R.count = 0;

            R.inputField.onkeyup = R.addInputKeyupHandler;
           
            R.form.onsubmit = R.rosterAdd; 
        },
        
        id: document.getElementById.bind(document),

        appendEntryObj: function(obj){
            if(R.rosterObj.length === 0){
                R.rosterObj.tail = obj;
            }

            obj.next = null;
            obj.prev = R.rosterObj.head;

            if (R.rosterObj.head !== null){
                R.rosterObj.head.next = obj;
            }
            
            R.rosterObj.head = obj;

            R.rosterObj.length++;
            R.rosterObj[obj.id] = obj;
        },

        rosterAdd: function(e) {
            e.preventDefault();

            if(!R.id('roster_add_button').classList.contains('disabled')){
                R.addEntry({id: R.count, 
                            value: R.inputField.value, 
                            promoted:false,
                            editing:false,});
                R.count += 1;
                R.resetHead();
            }
        },

        addEntry: function(obj){
            R.appendEntryObj(obj);

            var deleteButton = R.createButton('delete', obj.id);
            var promoteButton = R.createButton('promote', obj.id);
            var editButton = R.createButton('edit', obj.id);
            var upButton = R.createButton('up', obj.id);
            var downButton = R.createButton('down', obj.id);
            
            var field = R.createField(obj.value, obj.id);
            
            var entry = R.createEntry(field, obj.id, 
                [deleteButton, editButton, promoteButton, upButton, downButton]);
            
            if(obj.promoted){
                R.promoteEntry(entry);
            }else{
                R.demoteEntry(entry);
            }

            if(obj.editing){
                R.editEntry(entry);
            }else{
                R.saveEntry(entry);
            }

            R.roster.appendChild(entry);

            return entry;
        },

        createField: function(input, count){
            var field = document.createElement('input');

            field.className = 
                'roster_input roster_list_item_text_container primary flex_container';
            field.setAttributeNode(document.createAttribute("disabled"));
            field.type = 'text';

            field.value = input;
            field.dataset.rosterCount = count;

            field.onclick = R.entryFieldClickHandler;

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
            button.dataset.rosterCount = count;
            button.onclick = callback;
            
            return button;
        },

        addInputKeyupHandler: function(ev){
            R.maintainButton(R.inputField, R.addButton);
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

        entryFieldClickHandler: function(ev){
            ev.currentTarget.select();
        },

        saveEntryClickHandler: function(ev){
            R.saveEntry(R.getCount(ev.currentTarget));
        },

        entryFieldKeyupHandler: function(ev){
            var field = ev.currentTarget;
            R.rosterObj[R.getEntryId(field)].value = field.value;
            
            R.maintainButton(field, R.getButton(R.getEntry(field), 'save'));
        },

        saveEntryKeypressHandler: function(ev){
            var field = ev.currentTarget;

            if(ev.keyCode === 13){
                R.saveEntry(R.getCount(field));
            }
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

        restoreEntryKeydownHandler: function(ev){
                var field = ev.currentTarget;
                //R.rosterObj[R.getEntryId(field)].value = field.value;

                //on escape
                if (ev.keyCode === 27){
                    R.restoreEntry(R.getCount(field));
                }
        },

        getEntry: function(button){
            var entry;

            if(button.classList !== undefined && button.classList.contains('roster_entry')){
                entry = button;
            }else if (button.dataset !== undefined && button.dataset.rosterCount !== undefined){
                entry = R.id('roster_entry_' + button.dataset.rosterCount); 
            }else if (typeof button === 'number'){
                entry = R.id('roster_entry_' + button);               
            }
            
            entry.field = entry.querySelector('.roster_list_item_text_container');

            return entry;
        },

        upEntryObj: function(obj){
            var pp = obj.prev.prev;
            var prev = obj.prev;
            var cur = obj;
            var next = obj.next;
    
            prev.next = next;
            prev.prev = cur;

            cur.prev = pp;
            cur.next = prev;

            //if cur is not the bottom of the list
            if(next !== null){
                next.prev = prev;
            }else{
                R.rosterObj.head = prev;
            }
            
            //prev is not tail
            if(pp !== null){
                pp.next = cur;
            }else{
                R.rosterObj.tail = cur;
            }

            return obj;
        },

        downEntryObj: function(obj){
            upEntryObj(obj.next);
        },

        upEntry: function(count){
            var entry = R.getEntry(count); 
            
            if(entry.previousElementSibling !== null){
                R.upEntryObj(R.rosterObj[count]);
                
                entry.parentElement.insertBefore(entry, entry.previousElementSibling);
            }
        },

        downEntry: function(count){
            var entry = R.getEntry(count); 
    
            if(entry.nextElementSibling !== null){
                R.downEntryObj(R.rosterObj[count]);

                entry.parentElement.insertBefore(entry, entry.nextElementSibling.nextElementSibling);
            }
        },

        editButton: function(button){
            if( button === null ){
                return false;
            }

            button.classList.add('roster_edit_button');
            button.classList.remove('roster_save_button');

            button.innerText = 'Edit';

            button.onclick = R.editEntryHandler;
        },

        saveButton: function(button){
            if( button === null ){
                return false;
            }

            button.classList.add('roster_save_button');
            button.classList.remove('roster_edit_button');

            button.innerText = 'Save';

            button.onclick = R.saveEntryClickHandler;
        },

        deleteEntry: function(el){
            var entry = R.getEntry(el);
            var count = R.getCount(entry);

            var i = R.rosterObj[count].index; 
            R.rosterObj.ids.splice(i, i+1);
            delete R.rosterObj[count];

            for (j = i; j < R.rosterObj.ids.length; j++){
                R.rosterObj.ids[j].index--;
            }

            R.removeElement(entry);
        },

        promoteButton: function(button){
            if( button === null ){
                return false;
            }

            R.addClasses(button, ['roster_promote_button', 'success']);
            R.removeClasses(button, ['roster_demote_button', 'secondary']);
            button.innerText = 'Promote';
            button.onclick = R.promoteEntryHandler;
        },

        demoteButton: function(button){
            if( button === null ){
                return false;
            }

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

        hasContent: function(field){
            return !(/^\s*$/.test(field.value));
        },

        saveEntry: function(count){
            var entry = R.getEntry(count); 

            
            if(R.hasContent(entry.field)){
                R.rosterObj[R.getEntryId(entry)].editing = false;
                R.rosterObj[R.getEntryId(entry)].value = entry.field.value;

                entry.field.onkeypress = null;
                entry.field.onkeydown = null;
                entry.field.onkeyup = null;

                entry.field.setAttributeNode(document.createAttribute("disabled"));

                entry.field.removeAttribute('data-roster-backup-value');

                R.editButton(R.getButton(entry, 'save') || R.getButton(entry, 'edit'));
            }
        },

        restoreEntry: function(count){
            var entry = R.getEntry(count); 

            entry.field.onkeypress = null;
            entry.field.setAttributeNode(document.createAttribute("disabled"));
            entry.field.value = entry.field.dataset.rosterBackupValue;
            entry.field.removeAttribute('data-roster-backup-value');

            entry.field.onkeypress = null;
            entry.field.onkeydown = null;
            entry.field.onkeyup = null;

            R.editButton(entry.querySelector('.roster_save_button'));
        },

        getCount: function(elem){
            return parseInt(elem.dataset.rosterCount);
        },


        editEntry: function(count){
            var entry = R.getEntry(count); 

            R.rosterObj[R.getEntryId(entry)].editing = true;

            entry.field.dataset.rosterBackupValue = entry.field.value;

            entry.field.removeAttribute("disabled");
            
            entry.field.onkeydown = R.restoreEntryKeydownHandler; 
            entry.field.onkeypress = R.saveEntryKeypressHandler;
            entry.field.onkeyup = R.entryFieldKeyupHandler;

            R.saveButton(R.getButton(entry, 'edit') || R.getButton(edit, 'save'));                        

            entry.field.select();
        },
            
        getButton: function(entry, name){
            return entry.querySelector('.roster_' + name + '_button');
        },

        getInput: function(entry){
            return entry.querySelector('input.roster_list_item_text_container');
        },

        getEntryId(entry){
            return Number(entry.dataset.rosterCount);
        },

        demoteEntry: function(count){
            var entry = R.getEntry(count); 
            
            R.rosterObj[R.getEntryId(entry)].promoted = false;

            //R.removeElement(entry);
            //R.prependChild(R.roster, entry);
            
            R.promoteButton(R.getButton(entry, 'demote') || R.getButton(entry, 'promote'));

            R.getInput(entry).classList.remove('roster_promoted'); 
            entry.classList.remove('roster_promoted');
        },

        promoteEntry: function(count){
            var entry = R.getEntry(count); 

            R.rosterObj[R.getEntryId(entry)].promoted = true;
            
            //R.removeElement(entry);
            //R.prependChild(R.promotedRoster, entry);

            R.demoteButton(R.getButton(entry, 'promote') || R.getButton(enty, 'demote'));
            
            entry.classList.add('roster_promoted');
            R.getInput(entry).classList.add('roster_promoted');
        },

        resetHead: function(){
            R.inputField.value = '';
            R.maintainAddButton(R.inputField, R.addButton);
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

        maintainButton: function(field, button) {
            if (R.hasContent(field)){
                button.classList.remove('disabled');
            }else{
                button.classList.add('disabled');
            }
        },

        maintainAddButton: function() {
            if (R.hasContent(R.inputField)){
                R.addButton.classList.remove('disabled');
            }else{
                R.addButton.classList.add('disabled');
            }
        },
    };

    return R;
})();

document.onload = RosterApp.init();
