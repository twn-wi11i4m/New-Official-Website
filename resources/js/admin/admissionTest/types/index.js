import { post } from "@/submitForm";

let submitting = 'loading';

const submitButtons = document.getElementsByClassName('submitButton')

function disableSubmitting(){
    for(let button of submitButtons) {
        button.disabled = true;
    }
}

function enableSubmitting(){
    submitting = '';
    for(let button of submitButtons) {
        button.disabled = false;
    }
}

const tableBody = document.getElementById('tableBody');
const dataRows = document.getElementsByClassName('dataRow');
const editDisplayOrder = document.getElementById('editDisplayOrder');
const saveDisplayOrder = document.getElementById('saveDisplayOrder');
const cancelDisplayOrder = document.getElementById('cancelDisplayOrder');
const savingDisplayOrder = document.getElementById('savingDisplayOrder');

let row;

let displayOrder;

function dragOver(event) {
    event.preventDefault();
    let children = Array.from(event.target.parentNode.parentNode.children);
    if(children.indexOf(event.target.parentNode)>children.indexOf(row)) {
        event.target.parentNode.after(row);
    } else {
        event.target.parentNode.before(row);
    }
}

function dragStart(event) {
    row = event.target;
}

function closeEditDisplayOrder(){
    saveDisplayOrder.hidden = true;
    cancelDisplayOrder.hidden = true;
    savingDisplayOrder.hidden = true;
    for(let id of displayOrder) {
        let row = document.getElementById('dataRow'+id);
        row.removeEventListener('dragstart', dragStart);
        row.removeEventListener('dragover', dragOver);
        row.draggable = false;
        row.classList.remove('draggable');
        tableBody.appendChild(row);
    }
    editDisplayOrder.hidden = false;
}

cancelDisplayOrder.addEventListener(
    'click', closeEditDisplayOrder
);

function updataDisplayOrderSuccessCallback(response) {
    bootstrapAlert(response.data.success);
    displayOrder = response.data.display_order;
    closeEditDisplayOrder();
    enableSubmitting();
}

function updataDisplayOrderFailCallback(error) {
    if(error.status == 422) {
        bootstrapAlert(error.data.errors.display_order);
    }
    savingDisplayOrder.hidden = true;
    saveDisplayOrder.hidden = false;
    cancelDisplayOrder.hidden = false;
    enableSubmitting();
}

saveDisplayOrder.addEventListener(
    'click', function(event) {
        if(submitting == '') {
            let submitAt = Date.now();
            submitting = 'updateDisplayOrder'+submitAt;
            disableSubmitting();
            if(submitting == 'updateDisplayOrder'+submitAt) {
                saveDisplayOrder.hidden = true;
                cancelDisplayOrder.hidden = true;
                savingDisplayOrder.hidden = false;
                let data = {display_order: []};
                for(let row of dataRows) {
                    data.display_order.push(row.id.replace('dataRow', ''));
                }
                post(
                    route('admin.admission-test.types.display-order.update'),
                    updataDisplayOrderSuccessCallback, updataDisplayOrderFailCallback,
                    'put', data
                );
            }
        }
    }
);

editDisplayOrder.addEventListener(
    'click', function(event) {
        displayOrder = [];
        for(let row of dataRows) {
            row.addEventListener('dragstart', dragStart);
            row.addEventListener('dragover', dragOver);
            row.classList.add('draggable');
            row.draggable = true;
            displayOrder.push(row.id.replace('dataRow', ''));
        }
        event.target.hidden = true;
        saveDisplayOrder.hidden = false;
        cancelDisplayOrder.hidden = false;
    }
);

submitting = '';
