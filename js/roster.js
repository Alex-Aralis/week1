R = 

(function() {
    var R = {
        init: function() {
            try {
                R.rosterObj = JSON.parse(localStorage.getItem('rosterObj'));
            }catch (e){
                R.rosterObj = {length: 0, count: 0, addField: '', head: null, tail: null,};
            }

            R.inputField = R.id('roster_input');
            R.roster = R.id('roster_list');
            R.promotedRoster = R.id('roster_promoted_list');
            R.addButton = R.id('roster_add_button');
            R.form = R.id('roster_head');
                
            try{
                R.populateRoster(R.rosterObj);
                R.restoreInputField();
            }catch (e){
                console.log('load failed')
                localStorage.removeItem('rosterObj'); 
                R.rosterObj = {length: 0, count: 0, addField: '', head: null, tail: null,};
            }
            R.inputField.onkeyup = R.addInputKeyupHandler;
            onunload = R.unloadHandler;

            R.form.onsubmit = R.rosterAdd; 
        },
        
        id: document.getElementById.bind(document),
        
        genElem: document.createElement.bind(document),

        restoreInputField: function(){
            R.inputField.value = R.rosterObj.addField;
            R.maintainButton(R.inputField, R.addButton);
        },

        populateRoster: function(rosterObj){
            if( rosterObj.head === null ){
                return;
            }

            var obj = R.rosterObj[rosterObj.tail];
            do {
                R.roster.appendChild(R.createEntry(obj));
                obj = R.rosterObj[obj.next];
            } while (obj);
        },

        appendEntryObj: function(obj){
            if(R.rosterObj.tail === null){
                R.rosterObj.tail = obj.id;
            }

            obj.next = null;
            obj.prev = R.rosterObj.head;

            if (R.rosterObj.head !== null){
                R.rosterObj[R.rosterObj.head].next = obj.id;
            }
            
            R.rosterObj.head = obj.id;

            R.rosterObj.length++;
            R.rosterObj[obj.id] = obj;
        },

        rosterAdd: function(e) {
            e.preventDefault();

            if(!R.id('roster_add_button').classList.contains('disabled')){
                R.addEntry({id: R.rosterObj.count, 
                            value: R.inputField.value, 
                            restoreValue: null,
                            promoted:false,
                            editing:false,});
                R.rosterObj.count += 1;
                R.resetHead();
            }
        },

        addEntry: function(obj){
            R.appendEntryObj(obj);
            R.roster.appendChild(R.createEntry(obj));
        },

        createEntry: function(obj){
            var deleteButton = R.createButton('delete', obj.id);
            var promoteButton = R.createButton('promote', obj.id);
            var editButton = R.createButton('edit', obj.id);
            var upButton = R.createButton('up', obj.id);
            var downButton = R.createButton('down', obj.id);
            
            var field = R.createField(obj.value, obj.id);
            
            var entry = R.assembleEntry(field, obj.id, 
                [deleteButton, editButton, promoteButton, upButton, downButton]);
            
            if(obj.promoted){
                R.promoteEntry(entry);
            }else{
                R.demoteEntry(entry);
            }

            if(obj.editing){
                R.editEntry(entry);
                R.maintainButton(field, editButton);
            }else{
                R.saveEntry(entry);
            }


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

        assembleEntry: function(field, count, buttons){
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

        clearButton: function(button){
            button.className = 'button roster_button';

            var children = button.children

            children.forEach = [].forEach;
            button.children.forEach(function(child){
                button.removeChild(child);
            });
        },

        moldDeleteButton: function(button){
            R.clearButton(button);

            R.appendIcon(button, 'times');
            R.addClasses(button, ['alert', 'roster_delete_button']);

            button.onclick = R.deleteEntryHandler;
        },

        createButton: function(rosterButtonType, count){
            var button = document.createElement('a');
            button.type = 'button';
            button.dataset.rosterCount = count;

            switch (rosterButtonType) {
                case 'delete':
                    R.moldDeleteButton(button);
                    break;
                case 'promote':
                    R.promoteButton(button);
                    break;
                case 'demote':
                    R.demoteButton(button);
                    break;
                case 'edit':
                    R.editButton(button);
                    break;
                case 'up':
                    R.upButton(button);
                    break;
                case 'down':
                    R.downButton(button);
                    break;
            }
           
            return button;
        },

        unloadHandler: function(ev){
            localStorage.setItem('rosterObj', JSON.stringify(R.rosterObj));
        },

        loadHandler: function(ev){
        },

        addInputKeyupHandler: function(ev){
            R.rosterObj.addField = ev.currentTarget.value;
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
            var entry = R.getEntry(ev.currentTarget)

            if(R.hasContent(entry.field)){
                R.saveEntry(R.getCount(ev.currentTarget));
            }
        },

        entryFieldKeyupHandler: function(ev){
            var field = ev.currentTarget;
            R.rosterObj[R.getEntryId(field)].value = field.value;
            
            R.maintainButton(field, R.getButton(R.getEntry(field), 'save'));
        },

        saveEntryKeypressHandler: function(ev){
            var field = ev.currentTarget;

            if(ev.keyCode === 13 && R.hasContent(field)){
                R.saveEntry(R.getCount(field));
            }
        },

        editEntryHandler: function(ev){
            var entry = R.getEntry(ev.currentTarget);
            var obj = R.rosterObj[R.getEntryId(entry)];

            obj.restoreValue = entry.field.value;
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
            var pp = R.rosterObj[R.rosterObj[obj.prev].prev];
            var prev = R.rosterObj[obj.prev];
            var cur = obj;
            var next = R.rosterObj[obj.next];
   
            if( obj.id === R.rosterObj.head ) {
                prev.next = null;
                R.rosterObj.head = prev.id;
            } else {
                prev.next = next.id;
                next.prev = prev.id;
            }
            
            prev.prev = cur.id;

            if ( prev.id === R.rosterObj.tail ) {
                cur.prev = null;
                R.rosterObj.tail = cur.id;
            }else{
                cur.prev = pp.id;
                pp.next = cur.id;
            }

            cur.next = prev.id;

            //if cur is not the bottom of the list
            if(next !== null){
            }else{
            }
            
            //prev is not tail
            if(pp !== null){
            }else{
            }

            return obj;
        },

        downEntryObj: function(obj){
            R.upEntryObj(R.rosterObj[obj.next]);
        },

        removeEntryObj: function(obj){
            if (obj.id === R.rosterObj.head){
                R.rosterObj.head = obj.prev;
            }else{
                R.rosterObj[obj.next].prev = obj.prev;
            }

            if (obj.id === R.rosterObj.tail){
                R.rosterObj.tail = obj.next;
            }else{
                R.rosterObj[obj.prev].next = obj.next;
            }

            delete R.rosterObj[obj.id];

            return obj;
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

        upButton: function(button){
            R.clearButton(button);
            R.appendIcon(button, 'arrow-up');
        
            button.classList.add('roster_up_button');

            button.onclick = R.upEntryHandler;
        },

        downButton(button){
            R.clearButton(button);
            R.appendIcon(button, 'arrow-down');
       
            button.classList.add('roster_down_button');
             
            button.onclick = R.downEntryHandler;
        },

        editButton: function(button){
            R.clearButton(button);
            R.appendIcon(button, 'pencil-square-o');
            
            button.classList.add('roster_edit_button');
            
            button.onclick = R.editEntryHandler;
        },

        saveButton: function(button){
            R.clearButton(button);
            R.appendIcon(button, 'floppy-o');

            button.classList.add('roster_save_button');

            button.onclick = R.saveEntryClickHandler;
        },

        deleteEntry: function(el){
            var entry = R.getEntry(el);
            var count = R.getCount(entry);

            R.removeEntryObj(R.rosterObj[count]);
            R.removeElement(entry);
        },

        promoteButton: function(button){
            R.clearButton(button);
            R.appendIcon(button, 'star-o');

            R.addClasses(button, ['roster_promote_button', 'secondary']);

            button.onclick = R.promoteEntryHandler;
        },

        demoteButton: function(button){
            if( button === null ){
                return false;
            }

            R.clearButton(button);
            R.appendIcon(button, 'star');

            R.addClasses(button, ['roster_demote_button', 'success']);

            button.onclick = R.demoteEntryHandler;
        },

        appendIcon: function(button, iconString){
            var icon = R.addClasses(R.genElem('i'), ['fa', 'fa-' + iconString]);

            button.appendChild(icon);

            return icon;
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
            var obj = R.rosterObj[R.getEntryId(entry)];

            obj.editing = false;
            obj.value = entry.field.value;
            obj.restoreValue = null;

            entry.field.onkeypress = null;
            entry.field.onkeydown = null;
            entry.field.onkeyup = null;

            entry.field.setAttributeNode(document.createAttribute("disabled"));

            R.editButton(R.getButton(entry, 'save') || R.getButton(entry, 'edit'));
        },

        restoreEntry: function(count){
            var entry = R.getEntry(count); 
            var button = R.getButton(entry, 'save');
            var obj = R.rosterObj[R.getEntryId(entry)];
            
            entry.field.onkeypress = null;
            entry.field.setAttributeNode(document.createAttribute("disabled"));
            entry.field.value = obj.restoreValue;
            obj.restoreValue = null;
                
            entry.field.onkeypress = null;
            entry.field.onkeydown = null;
            entry.field.onkeyup = null;
            
            R.editButton(button);
            R.maintainButton(entry.field, button);
            
            obj.editing = false;
        },

        getCount: function(elem){
            return parseInt(elem.dataset.rosterCount);
        },


        editEntry: function(count){
            var entry = R.getEntry(count); 
            var obj = R.rosterObj[R.getEntryId(entry)];
     
            obj.editing = true;
            
            //obj.restoreValue = entry.field.value;
            
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
            var obj = R.rosterObj[R.getEntryId(entry)];

            obj.promoted = false;

            //R.removeElement(entry);
            //R.prependChild(R.roster, entry);
            
            R.promoteButton(R.getButton(entry, 'demote') || R.getButton(entry, 'promote'));

            R.getInput(entry).classList.remove('roster_promoted'); 
            entry.classList.remove('roster_promoted');
        },

        promoteEntry: function(count){
            var entry = R.getEntry(count); 
            var obj = R.rosterObj[R.getEntryId(entry)];

            obj.promoted = true;
            
            //R.removeElement(entry);
            //R.prependChild(R.promotedRoster, entry);

            R.demoteButton(R.getButton(entry, 'promote') || R.getButton(enty, 'demote'));
            
            entry.classList.add('roster_promoted');
            R.getInput(entry).classList.add('roster_promoted');
        },

        resetHead: function(){
            R.inputField.value = '';
            R.maintainButton(R.inputField, R.addButton);
        },

        
        forEachCall: function(elem, items, call){
            items.forEach(function(item){
                call(item);
            }, elem);
        },

        addClasses: function(elem, classes){
            R.forEachCall(elem, classes, elem.classList.add.bind(elem.classList));

            return elem;
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
    };

    return R;
})();

document.onload = R.init();
