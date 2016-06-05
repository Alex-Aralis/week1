R = 

(function() {
    var R = {
        init: function() {
            try {
                R.rosterObj = JSON.parse(localStorage.getItem('rosterObj'));
            }catch (e){
                R.rosterObj = {length: 0, count: 0, addField: '', head: null, tail: null,};
            }

            R.rosterEntryElems = {};

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

            var entry = null;
            do {
                var entry = R.createEntry(obj);
                R.roster.appendChild(entry);
                R.rosterEntryElems[obj.id] = entry;
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
                R.addEntry({
                    id: R.rosterObj.count, 
                    value: R.inputField.value, 
                    restoreValue: null,
                    promoted:false,
                    editing:false,
                });

                R.rosterObj.count += 1;
                R.resetHead();
            }
        },

        addEntry: function(obj){
            R.appendEntryObj(obj);
            entry = R.createEntry(obj);

            R.rosterEntryElems[obj.id] = entry;
            R.roster.appendChild(entry);
        },

        createEntry: function(obj){
            var entry = R.genElem('div');
            var field = R.createField(obj.value, obj.id);

            entry.buttons = {};
            entry.entryObj = obj;
            entry.field = field;
            R.rosterEntryElems[obj.id] = entry;

            var deleteButton = R.createButton({
                rosterButtonType: 'delete', 
                rosterButtonName: 'delete', 
                entryCount: obj.id
            });

            var promoteButton = R.createButton({
                rosterButtonType: 'promote', 
                rosterButtonName: 'promote', 
                entryCount: obj.id
            });

            var editButton = R.createButton({
                rosterButtonType: 'edit', 
                rosterButtonName: 'edit', 
                entryCount: obj.id
            });

            var upButton = R.createButton({
                rosterButtonType: 'up', 
                rosterButtonName: 'up', 
                entryCount: obj.id
            });

            var downButton = R.createButton({
                rosterButtonType: 'down', 
                rosterButtonName: 'down', 
                entryCount: obj.id
            });
            
            R.assembleEntry(entry, field, [
                deleteButton, 
                editButton, 
                promoteButton, 
                upButton, 
                downButton
            ]);
            
            if(obj.promoted){
                R.promoteEntry(obj.id);
            }else{
                R.demoteEntry(obj.id);
            }

            if(obj.editing){
                R.editEntry(obj.id);
                R.maintainButton(field, editButton);
            }else{
                R.saveEntry(obj.id);
            }

            return entry;
        },

        createField: function(input, count){
            var field = R.genElem('input');

            field.className = 
                'roster_input roster_list_item_text_container primary flex_container';
            field.setAttributeNode(document.createAttribute("disabled"));
            field.type = 'text';

            field.value = input;
            //field.dataset.rosterCount = count;
            field.rosterCount = count;

            field.onclick = R.entryFieldClickHandler;

            return field;
        },

        assembleEntry: function(entry, field, buttons){
            entry.className = 'flex_container roster_entry';
            
            entry.appendChild(field);

            buttons.forEach(function(button){
                entry.appendChild(button);                
                entry.buttons[button.rosterButtonName] = button;
            });

            return entry;
        },

        clearButton: function(button){
            var entry = R.rosterEntryElems[button.rosterCount];

            button.className = 'button roster_button';
            button.buttonObj.rosterButtonType = null;

            var children = button.children

            children.forEach = [].forEach;
            button.children.forEach(function(child){
                button.removeChild(child);
            });
        },

        moldDeleteButton: function(button){
            R.appendIcon(button, 'times');
            R.addClasses(button, ['alert', 'roster_delete_button']);

            button.onclick = R.deleteEntryHandler;
        },

        moldRosterButton: function(button, rosterButtonType){
            var entry = R.rosterEntryElems[button.buttonObj.entryCount];
            R.clearButton(button);

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
                case 'save':
                    R.saveButton(button);
                    break;
                case 'up':
                    R.upButton(button);
                    break;
                case 'down':
                    R.downButton(button);
                    break;
            }
           
            entry.buttons[button.buttonObj.rosterButtonName] = button;
            return button;
        },

        createButton: function(buttonObj){
            var button = R.genElem('a');
            button.type = 'button';
            button.buttonObj = buttonObj;

            R.moldRosterButton(button, buttonObj.rosterButtonType);
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
            R.deleteEntry(R.getCount(ev.currentTarget));
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
            R.rosterObj[R.getEntry(field).entryObj.id].value = field.value;
            
            R.maintainButton(field, R.getEntry(field).buttons['edit']);
        },

        saveEntryKeypressHandler: function(ev){
            var field = ev.currentTarget;

            if(ev.keyCode === 13 && R.hasContent(field)){
                R.saveEntry(R.getCount(field));
            }
        },

        editEntryHandler: function(ev){
            var entry = R.getEntry(ev.currentTarget);
            var obj = entry.entryObj;

            obj.restoreValue = entry.field.value;
            R.editEntry(R.getCount(ev.currentTarget));
        },
        
        upEntryHandler: function(ev){
            R.upEntry(R.getEntry(ev.currentTarget).entryObj.id);
        },

        downEntryHandler: function(ev){
            R.downEntry(R.getEntry(ev.currentTarget).entryObj.id);
        },
        
        restoreEntryKeydownHandler: function(ev){
            var field = ev.currentTarget;

            //on escape
            if (ev.keyCode === 27){
                R.restoreEntry(R.getEntry(field).entryObj.id);
            }
        },
        
        getEntry: function(el){
            var entry;
            
            if(el.entryObj !== undefined){
                entry = el;
            }else if (el.rosterCount !== undefined){
                entry = R.rosterEntryElems[el.rosterCount];
            }else if (el.buttonObj !== undefined){
                entry = R.rosterEntryElems[el.buttonObj.entryCount];
            }else if (typeof el === 'number'){
                entry = R.rosterEntryElems[el];
           } 
        
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

            return obj;
        },

        downEntryObj: function(obj){
            R.upEntryObj(R.rosterObj[obj.next]);
        },

        insertAfterEntryObj: function(obj){
            if (obj === null){
                //insert at head
                R.rosterObj.head = obj;
                
            }
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
            var entry = R.rosterEntryElems[count];
            
            if(entry.entryObj.id !== R.rosterObj.tail){
                R.upEntryObj(entry.entryObj);
                
                entry.parentElement.insertBefore(entry, entry.previousElementSibling);
            }
        },

        downEntry: function(count){
            var entry = R.rosterEntryElems[count];
    
            if(entry.entryObj.id !== R.rosterObj.head){
                R.downEntryObj(entry.entryObj);

                entry.parentElement.insertBefore(entry, entry.nextElementSibling.nextElementSibling);
            }
        },

        deleteEntry: function(count){
            var entry = R.rosterEntryElems[count];

            R.removeElement(entry);
            delete R.rosterEntryElems[count];
            R.removeEntryObj(entry.entryObj);
            R.rosterObj.length--;
        },

        upButton: function(button){
            R.appendIcon(button, 'arrow-up');
        
            button.classList.add('roster_up_button');

            button.onclick = R.upEntryHandler;
        },

        downButton(button){
            R.appendIcon(button, 'arrow-down');
       
            button.classList.add('roster_down_button');
             
            button.onclick = R.downEntryHandler;
        },

        editButton: function(button){
            R.appendIcon(button, 'pencil-square-o');
            
            button.classList.add('roster_edit_button');
            
            button.onclick = R.editEntryHandler;
        },

        saveButton: function(button){
            R.appendIcon(button, 'floppy-o');

            button.classList.add('roster_save_button');

            button.onclick = R.saveEntryClickHandler;
        },

        promoteButton: function(button){
            R.appendIcon(button, 'star-o');

            R.addClasses(button, ['roster_promote_button', 'secondary']);

            button.onclick = R.promoteEntryHandler;
        },

        demoteButton: function(button){
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
            var entry = R.rosterEntryElems[count];
            //var entry = R.getEntry(count); 
            var obj = entry.entryObj;

            obj.editing = false;
            obj.value = entry.field.value;
            obj.restoreValue = null;

            entry.field.onkeypress = null;
            entry.field.onkeydown = null;
            entry.field.onkeyup = null;

            entry.field.setAttributeNode(document.createAttribute("disabled"));

            R.moldRosterButton(entry.buttons['edit'], 'edit');
        },

        restoreEntry: function(count){
            var entry = R.rosterEntryElems[count];
            //var entry = R.getEntry(count); 
            var button = entry.buttons['edit'];
            //var button = R.getButton(entry, 'save');
            var obj = entry.entryObj;
            //var obj = R.rosterObj[R.getEntryId(entry)];
            
            entry.field.onkeypress = null;
            entry.field.setAttributeNode(document.createAttribute("disabled"));
            entry.field.value = obj.restoreValue;
            obj.restoreValue = null;
                
            entry.field.onkeypress = null;
            entry.field.onkeydown = null;
            entry.field.onkeyup = null;
            
            //R.editButton(button);
            R.moldRosterButton(button, 'edit');
            R.maintainButton(entry.field, button);
            
            obj.editing = false;
        },

        getCount: function(elem){
            return R.getEntry(elem).entryObj.id;
            //return parseInt(elem.dataset.rosterCount);
        },


        editEntry: function(count){
            var entry = R.rosterEntryElems[count];
            //var entry = R.getEntry(count); 
            var obj = entry.entryObj;
            //var obj = R.rosterObj[R.getEntryId(entry)];
     
            obj.editing = true;
            
            //obj.restoreValue = entry.field.value;
            
            entry.field.removeAttribute("disabled");
            
            entry.field.onkeydown = R.restoreEntryKeydownHandler; 
            entry.field.onkeypress = R.saveEntryKeypressHandler;
            entry.field.onkeyup = R.entryFieldKeyupHandler;

            R.moldRosterButton(entry.buttons['edit'], 'save');                        

            entry.field.select();
        },
            

        /*
        getButton: function(entry, name){
            return entry.querySelector('.roster_' + name + '_button');
        },
        */

        /*
        getInput: function(entry){
            return entry.querySelector('input.roster_list_item_text_container');
        },
        */

        /*
        getEntryId(entry){
            return Number(entry.dataset.rosterCount);
        },
        */

        demoteEntry: function(count){
            var entry = R.rosterEntryElems[count];
            //var entry = R.getEntry(count); 
            //var obj = R.rosterObj[R.getEntryId(entry)];
            var obj = entry.entryObj;

            obj.promoted = false;

            //R.removeElement(entry);
            //R.prependChild(R.roster, entry);
           
            R.moldRosterButton(entry.buttons['promote'], 'promote');
             
            //R.promoteButton(R.getButton(entry, 'demote') || R.getButton(entry, 'promote'));

            //R.getInput(entry).classList.remove('roster_promoted'); 
            entry.field.classList.remove('roster_promoted');
            entry.classList.remove('roster_promoted');
        },

        promoteEntry: function(count){
            var entry = R.rosterEntryElems[count];
            //var entry = R.getEntry(count); 
            //var obj = R.rosterObj[R.getEntryId(entry)];
            var obj = entry.entryObj;

            obj.promoted = true;
            
            //R.removeElement(entry);
            //R.prependChild(R.promotedRoster, entry);

            R.moldRosterButton(entry.buttons['promote'], 'demote');
            //R.demoteButton(R.getButton(entry, 'promote') || R.getButton(enty, 'demote'));
            
            entry.classList.add('roster_promoted');
            entry.field.classList.add('roster_promoted');
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
