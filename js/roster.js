RosterApp = 

(function() {
    var _RosterApp = {
        init: function() {
            _RosterApp.inputField = document.getElementById('roster_input');
            _RosterApp.roster = document.getElementById('roster_list');
            _RosterApp.addButton = document.getElementById('roster_add_button');
            _RosterApp.form = document.getElementById('roster_head');
            _RosterApp.count = 0;

            _RosterApp.inputField.onkeyup = _RosterApp.maintainButton;
            _RosterApp.inputField.onkeypress = _RosterApp.maintainButton;
           
            _RosterApp.form.onsubmit = _RosterApp.rosterAdd; 
            //_RosterApp.addButton.onclick = _RosterApp.rosterAdd;
            
            /*
            _RosterApp.addButton.onkeydown = function(e){
                //on space or enter
                if (e.keyCode === 13 || e.keyCode === 32){
                    console.log('fosdfs');
                    //_RosterApp.form.onsubmit(new Event('submit-enter'));
                }
            }

            _RosterApp.inputField.onkeydown = function(e){
                //on enter
                if (e.keyCode === 13){
                    //_RosterApp.rosterAdd(new Event('keydown'));
                }
            }
            */
        },

        addEntry: function(input){
            var entry = document.createElement('div');
            var textContainer = document.createElement('div');
            var text = document.createElement('div');

            var deleteButton = _RosterApp.createButton('delete', _RosterApp.count);
            var promoteButton = _RosterApp.createButton('promote', _RosterApp.count);

            text.innerText = input;

            textContainer.className = 'roster_list_item_text_container callout primary flex_container';
            textContainer.appendChild(text);

            entry.className = 'flex_container roster_entry';

            entry.appendChild(textContainer);
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
                
            }
            
            button.type = 'button';
            button.innerText = innerText;
            button.className = classes;
            button.setAttribute('data-roster_count', count);
            button.onclick = callback;
            
            return button;
        },

        deleteEntry: function(e){
            var entry = document.getElementById('roster_entry_' + 
                this.getAttribute("data-roster_count"));
            entry.parentNode.removeChild(entry);
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

        demoteEntry: function(e){
            _RosterApp.promoteButton(this)

            var entry = document.getElementById('roster_entry_' + 
                this.getAttribute("data-roster_count"));
            var textContainer = entry.querySelector('div.roster_list_item_text_container');

            textContainer.classList.remove('roster_promoted'); 
            entry.classList.remove('roster_promoted');
        },

        promoteEntry: function(e){
            _RosterApp.demoteButton(this)

            var entry = document.getElementById('roster_entry_' + this.getAttribute("data-roster_count"));
            var textContainer = entry.querySelector('div.roster_list_item_text_container');
            entry.classList.add('roster_promoted');
            textContainer.classList.add('roster_promoted');
        },

        resetHead: function(){
            _RosterApp.inputField.value = '';
            console.log('skdfs');
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
