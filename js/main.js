function buildColorDiv(color){
    return '<il><dt>Hair Color</dt><dd style="color:'+
        color+'; background-color:'+
        color+'">'+ 
        color+'</dd></il>'
}

function buildList(list){
    return '<div class="ticket" style="position:relative; padding: 10px; border-width:2px 0 '+
        (list.isFirst ? '2px' : '0')+
        ' 0; border-color:grey; border-style:dashed solid dashed solid;"><il><dt>Name</dt><dd>' + 
        list.name + '</dd></il>' +
        buildColorDiv(list.hair_color) +
        '<il><dt>Age</dt><dd>' + list.age + '</dd></il>' +
        '<il><dt>Birth Place</dt><dd>' + list.birthplace + '</dd></il></div>' +
        document.querySelector('#details_list').innerHTML;
}

function resetForm(form){
    form.name.value = '';
    form.hair_color.value = '#000000';
    form.age.value = '';
    form.birthplace.value = '';
    
}
function personSubmit(e) {
    if (e != null ){
        e.preventDefault();
    }

    document.querySelector('#details_list').innerHTML = buildList({
        'name': this.name.value,
        'hair_color': this.hair_color.value,
        'age': this.age.value,
        'birthplace': this.birthplace.value,
        'isFirst': document.querySelector('#details_list').innerHTML == ''
    });

    resetForm(this);
}

document.querySelector('#person_form').onsubmit = personSubmit;

document.querySelector('#normal_button').onkeydown = function(e){
    if(e.keyCode === 13 || e.keyCode === 32){
        document.querySelector("#invisible_button").click()             
    }
}
