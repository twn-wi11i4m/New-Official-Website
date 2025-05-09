import { post } from "@/submitForm";
import stringToBoolean from "@/stringToBoolean";

let submitting = 'loading';
const submitButtons = document.getElementsByClassName('submitButton');
const showCandidateLink = document.getElementsByClassName('showCandidateLink');
const disableDShowCandidateLink = document.getElementsByClassName('showCandidateLink');

function disableSubmitting(){
    for(let button of submitButtons) {
        button.disabled = true;
    }
    for(let link of showCandidateLink) {
        link.hidden = true;
    }
    for(let link of disableDShowCandidateLink) {
        link.hidden = false;
    }
}

function enableSubmitting(){
    submitting = '';
    for(let button of submitButtons) {
        if(
            button.id.startsWith('resultPassButton') ||
            button.id.startsWith('resultFailButton') ||
            button.id.startsWith('presentButton')
        ) {
            button.disabled = stringToBoolean(button.dataset.disabled);
        } else {
            button.disabled = false;
        }
    }
    for(let link of disableDShowCandidateLink) {
        link.hidden = true;
    }
    for(let link of showCandidateLink) {
        link.hidden = false;
    }
}

const editForm = document.getElementById('form');
const savingButton = document.getElementById('savingButton');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const editButton = document.getElementById('editButton');
const showType = document.getElementById('showType');
const showTestingAt = document.getElementById('showTestingAt');
const showExpectEndAt = document.getElementById('showExpectEndAt');
const showLocation = document.getElementById('showLocation');
const showDistrict = document.getElementById('showDistrict');
const showAddress = document.getElementById('showAddress');
const showMaximumCandidates = document.getElementById('showMaximumCandidates');
const showIsPublic = document.getElementById('showIsPublic');
const typeInput = document.getElementById('validationType');
const testingAtInput = document.getElementById('validationTestingAt');
const testingAtFeedback = document.getElementById('testingAtFeedback');
const expectEndAtInput = document.getElementById('validationExpectEndAt');
const expectEndAtFeedback = document.getElementById('expectEndAtFeedback');
const locationInput = document.getElementById('validationLocation');
const typeFeedback = document.getElementById('typeFeedback');
const locationFeedback = document.getElementById('locationFeedback');
const districtInput = document.getElementById('validationDistrict');
const districtFeedback = document.getElementById('districtFeedback');
const addressInput = document.getElementById('validationAddress');
const addressFeedback = document.getElementById('addressFeedback');
const maximumCandidatesInput = document.getElementById('validationMaximumCandidates');
const maximumCandidatesFeedback = document.getElementById('maximumCandidatesFeedback');
const isPublicInput = document.getElementById('isPublic');

if(editForm) {

    const inputs = [typeInput, testingAtInput, expectEndAtInput, locationInput, districtInput, addressInput, maximumCandidatesInput, isPublicInput];

    const feedbacks = [typeFeedback, testingAtFeedback, expectEndAtFeedback, locationFeedback, districtFeedback, addressFeedback, maximumCandidatesFeedback];

    const showInfos = [showType, showTestingAt, showExpectEndAt, showLocation, showDistrict, showAddress, showMaximumCandidates, showIsPublic];

    let districts = {};

    for(let district of districtInput) {
        if(! district.disabled) {
            districts[district.value] = district.innerText.trim();
        }
    }

    function fillInputValues() {
        for(let input of inputs) {
            input.hidden = true;
            input.disabled = false;
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
        for(let feedback of feedbacks) {
            feedback.className = 'valid-feedback';
            feedback.innerText = 'Looks good!'
        }
        typeInput.value = typeInput.dataset.value;
        testingAtInput.value = testingAtInput.dataset.value;
        expectEndAtInput.value = expectEndAtInput.dataset.value;
        locationInput.value = locationInput.dataset.value;
        districtInput.value = districtInput.dataset.value;
        addressInput.value = addressInput.dataset.value;
        maximumCandidatesInput.value = maximumCandidatesInput.dataset.value;
        isPublicInput.checked = stringToBoolean(isPublicInput.dataset.value);
        for(let showDiv of showInfos) {
            showDiv.hidden = false;
        }
    }

    function hasError() {
        for(let feedback of feedbacks) {
            if(feedback.className == 'invalid-feedback') {
                return true;
            }
        }
        return false;
    }

    function validation() {
        for(let input of inputs) {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
        for(let feedback of feedbacks) {
            feedback.className = 'valid-feedback';
            feedback.innerText = 'Looks good!'
        }
        if(typeInput.validity.valueMissing) {
            typeInput.classList.add('is-invalid');
            typeFeedback.className = 'invalid-feedback';
            typeFeedback.innerText = 'The type field is required.';
        }
        if(testingAtInput.validity.valueMissing) {
            testingAtInput.classList.add('is-invalid');
            testingAtFeedback.className = 'invalid-feedback';
            testingAtFeedback.innerText = 'The testing at field is required.';
        }
        if(expectEndAtInput.validity.valueMissing) {
            expectEndAtInput.classList.add('is-invalid');
            expectEndAtFeedback.className = 'invalid-feedback';
            expectEndAtFeedback.innerText = 'The expect end at field is required.';
        } else if(testingAtInput.value > expectEndAtInput.value) {
            expectEndAtInput.classList.add('is-invalid');
            expectEndAtFeedback.className = 'invalid-feedback';
            expectEndAtFeedback.innerText = 'The expect end at field must be a date after testing at.';
        }
        if(locationInput.validity.valueMissing) {
            locationInput.classList.add('is-invalid');
            locationFeedback.className = 'invalid-feedback';
            locationFeedback.innerText = 'The location field is required.';
        } else if(locationInput.validity.tooLong) {
            locationInput.classList.add('is-invalid');
            locationFeedback.className = 'invalid-feedback';
            locationFeedback.innerText = 'The location field must not be greater than 255 characters.';
        }
        if(districtInput.validity.valueMissing) {
            districtInput.classList.add('is-invalid');
            districtFeedback.className = 'invalid-feedback';
            districtFeedback.innerText = 'The district field is required.';
        }
        if(addressInput.validity.valueMissing) {
            addressInput.classList.add('is-invalid');
            addressFeedback.className = 'invalid-feedback';
            addressFeedback.innerText = 'The address field is required.';
        } else if(addressInput.validity.tooLong) {
            addressInput.classList.add('is-invalid');
            addressFeedback.className = 'invalid-feedback';
            addressFeedback.innerText = 'The address field must not be greater than 255 characters.';
        }
        if(maximumCandidatesInput.validity.valueMissing) {
            maximumCandidatesInput.classList.add('is-invalid');
            maximumCandidatesFeedback.className = 'invalid-feedback';
            maximumCandidatesFeedback.innerText = 'The maximum candidates field is required.';
        } else if(maximumCandidatesInput.validity.rangeUnderflow) {
            maximumCandidatesInput.classList.add('is-invalid');
            maximumCandidatesFeedback.className = 'invalid-feedback';
            maximumCandidatesFeedback.innerText = 'The maximum candidates field must be at least 1.';
        }
        for(let input of inputs) {
            if(
                input != isPublicInput &&
                !input.classList.contains('is-invalid')
            ) {
                input.classList.add('is-valid');
            }
        }
        return !hasError();
    }

    function saveSuccessCallback(response) {
        bootstrapAlert(response.data.success);
        typeInput.dataset.value = response.data.type_id;
        testingAtInput.dataset.value = response.data.testing_at;
        expectEndAtInput.dataset.value = response.data.expect_end_at;
        locationInput.dataset.value = response.data.location;
        districtInput.dataset.value = response.data.district_id;
        addressInput.dataset.value = response.data.address;
        maximumCandidatesInput.dataset.value = response.data.maximum_candidates;
        isPublicInput.dataset.value = response.data.is_public;
        fillInputValues();
        showType.innerText = typeInput.options[typeInput.selectedIndex].text;
        showTestingAt.innerText = response.data.testing_at;
        showExpectEndAt.innerText = response.data.expect_end_at;
        showLocation.innerText = response.data.location;
        showDistrict.innerText = districts[response.data.district_id];
        showAddress.innerText = response.data.address;
        showMaximumCandidates.innerText = response.data.maximum_candidates;
        showIsPublic.innerText = response.data.is_public ? 'Public' : 'Private';
        enableSubmitting();
        for(let showDiv of showInfos) {
            showDiv.hidden = false;
        }
        savingButton.hidden = true;
        editButton.hidden = false;
    }

    function saveFailCallback(error) {
        for(let input of inputs) {
            input.classList.remove('is-valid');
        }
        for(let feedback of feedbacks) {
            feedback.className = 'valid-feedback';
            feedback.innerText = 'Looks good!'
        }
        if(error.status == 422) {
            for(let key in error.response.data.errors) {
                let value = error.response.data.errors[key];
                let feedback;
                let input;
                switch(key) {
                    case 'type_id':
                        input = typeInput;
                        feedback = typeFeedback;
                        break;
                    case 'testing_at':
                        input = testingAtInput;
                        feedback = testingAtFeedback;
                        break;
                    case 'expect_end_at':
                        input = expectEndAtInput;
                        feedback = expectEndAtFeedback;
                        break;
                    case 'location':
                        input = locationInput;
                        feedback = locationFeedback;
                        break;
                    case 'location':
                        input = locationInput;
                        feedback = locationFeedback;
                        break;
                    case 'district':
                        input = districtInput;
                        feedback = districtFeedback;
                        break;
                    case 'address':
                        input = addressInput;
                        feedback = addressFeedback;
                        break;
                    case 'maximum_candidates':
                        input = maximumCandidatesInput;
                        feedback = maximumCandidatesFeedback;
                        break;
                }
                if(feedback) {
                    input.classList.add('is-invalid');
                    feedback.className = "invalid-feedback";
                    feedback.innerText = value;
                } else {
                    alert('undefine feedback key');
                }
            }
        }
        for(let input of inputs) {
            if(
                input != isPublicInput &&
                !input.classList.contains('is-invalid')
            ) {
                input.classList.add('is-valid');
            }
            input.disabled = false;
        }
        enableSubmitting();
        savingButton.hidden = true;
        saveButton.hidden = false;
        cancelButton.hidden = false;
    }

    editForm.addEventListener(
        'submit', function(event) {
            event.preventDefault();
            if(submitting == '') {
                let submitAt = Date.now();
                submitting = 'updateAdmissionTest'+submitAt;
                disableSubmitting();
                if(submitting == 'updateAdmissionTest'+submitAt) {
                    if(validation()) {
                        saveButton.hidden = true;
                        cancelButton.hidden = true;
                        for(let input of inputs) {
                            input.disabled = true;
                        }
                        let data = {
                            type_id: typeInput.value,
                            testing_at: testingAtInput.value,
                            expect_end_at: expectEndAtInput.value,
                            location: locationInput.value,
                            district_id: districtInput.value,
                            address: addressInput.value,
                            maximum_candidates: maximumCandidatesInput.value,
                            is_public: isPublicInput.checked,
                        }
                        post(editForm.action, saveSuccessCallback, saveFailCallback, 'put', data);
                    } else {
                        enableSubmitting();
                    }
                }
            }
        }
    );

    cancelButton.addEventListener(
        'click', function() {
            saveButton.hidden = true;
            cancelButton.hidden = true;
            for(let input of inputs) {
                input.hidden = true;
                input.classList.remove('is-valid');
                input.classList.remove('is-invalid');
            }
            for(let feedback of feedbacks) {
                feedback.className = 'valid-feedback';
                feedback.innerText = 'Looks good!'
            }
            fillInputValues();
            for(let showDiv of showInfos) {
                showDiv.hidden = false;
            }
            editButton.hidden = false;
        }
    );

    editButton.addEventListener(
        'click', function() {
            editButton.hidden = true;
            for(let showSpan of showInfos) {
                showSpan.hidden = true;
            }
            for(let input of inputs) {
                input.hidden = false;
            }
            saveButton.hidden = false;
            cancelButton.hidden = false;
        }
    );
}

let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

function userIdValidation(input)
{
    if(input.validity.valueMissing) {
        bootstrapAlert('The user id field is required.');
        return false;
    }
    if(input.validity.patternMismatch) {
        bootstrapAlert('The user id field must be an integer.');
        return false;
    }
    return true;
}

const proctor = document.getElementById('proctor');

if(proctor) {
    function urlGetProctorID(url) {
        return (new URL(url).pathname).match(/^\/admin\/admission-tests\/([0-9]+)\/proctors\/([0-9]+).*/i)[2];
    }

    function saveProctorSuccessCallback(response) {
        bootstrapAlert(response.data.success);
        let id = urlGetProctorID(response.request.responseURL);
        let form = document.getElementById('editProctorForm'+id);
        form.hidden = true;
        form.id = 'editProctorForm'+response.data.user_id;
        form.action = response.data.update_proctor_url;
        let savingButton = document.getElementById('savingProctor'+id);
        savingButton.hidden = true;
        savingButton.id = 'savingProctor'+response.data.user_id;
        let saveButton = document.getElementById('saveProctor'+id);
        saveButton.hidden = false;
        saveButton.id = 'saveProctor'+response.data.user_id;
        let cancelButton = document.getElementById('cancelEditProctor'+id)
        cancelButton.disabled = false;
        cancelButton.id = 'cancelEditProctor'+response.data.user_id;
        let input = document.getElementById('proctorUserIdInput'+id)
        input.value = response.data.user_id;
        input.dataset.value = input.value;
        input.id = 'proctorUserIdInput'+response.data.user_id;
        let proctorName = document.getElementById('proctorName'+id);
        proctorName.id = 'proctorName'+response.data.user_id;
        proctorName.innerText = response.data.name;
        let showProctorId = document.getElementById('showProctorId'+id);
        showProctorId.id = 'showProctorId'+response.data.user_id;
        showProctorId.innerText = response.data.user_id;
        let showProctorName = document.getElementById('showProctorName'+id);
        showProctorName.id = 'showProctorName'+response.data.user_id;
        showProctorName.innerText = response.data.name;
        let showProctorLink = document.getElementById('showProctorLink'+id);
        showProctorLink.id = 'showProctorLink' + response.data.user_id;
        showProctorLink.href = response.data.show_user_url;
        let editButton = document.getElementById('editProctor'+id);
        editButton.id = 'editProctor'+response.data.user_id;
        let deleteForm = document.getElementById('deleteProctorForm'+id);
        deleteForm.id = 'deleteProctorForm'+response.data.user_id;
        deleteForm.action = response.data.delete_proctor_url;
        let deleteButton = document.getElementById('deleteProctor'+id);
        deleteButton.id = 'deleteProctor'+response.data.user_id;
        deleteButton.setAttribute('form', deleteForm.id);
        let showProctor = document.getElementById('showProctor'+id);
        showProctor.id = 'showProctor'+response.data.user_id;
        showProctor.hidden = false;
        enableSubmitting();
    }

    function saveProctorFailCallback(error) {
        let id = urlGetProctorID(error.request.responseURL);
        if(error.status == 422) {
            bootstrapAlert(error.response.data.errors.user_id);
        }
        document.getElementById('savingProctor'+id).hidden = true;
        document.getElementById('saveProctor'+id).hidden = false;
        document.getElementById('cancelEditProctor'+id).disabled = false;
        enableSubmitting();
    }

    function saveProctor(event) {
        event.preventDefault();
        if(submitting == '') {
            let submitAt = Date.now();
            submitting = 'updateProctor'+submitAt;
            let id = event.target.id.replace('editProctorForm', '');
            let input = document.getElementById('proctorUserIdInput'+id);
            disableSubmitting();
            if(submitting == 'updateProctor'+submitAt) {
                if(userIdValidation(input)) {
                    input.disabled = true;
                    document.getElementById('saveProctor'+id).hidden = true;
                    document.getElementById('savingProctor'+id).hidden = false;
                    document.getElementById('cancelEditProctor'+id).disabled = true;
                    let data = {user_id: input.value};
                    post(event.target.action, saveProctorSuccessCallback, saveProctorFailCallback, 'put', data);
                } else {
                    enableSubmitting();
                }
            }
        }
    }

    function cancelEditProctor(event) {
        let id = event.target.id.replace('cancelEditProctor', '');
        document.getElementById('editProctorForm'+id).hidden = true;
        let input = document.getElementById('proctorUserIdInput'+id);
        input.value = input.dataset.value;
        document.getElementById('showProctor'+id).hidden = false;
    }

    function editProctor(event) {
        let id = event.target.id.replace('editProctor', '');
        document.getElementById('showProctor'+id).hidden = true;
        document.getElementById('editProctorForm'+id).hidden = false;
    }

    function deleteProctorSuccessCallback(response) {
        bootstrapAlert(response.data.success);
        let id =  urlGetProctorID(response.request.responseURL);
        document.getElementById('showProctor'+id).remove();
        document.getElementById('editProctorForm'+id).remove();
        enableSubmitting();
    }

    function deleteProctorFailCallback(error) {
        let id = urlGetProctorID(error.request.responseURL);
        let editButton = document.getElementById('editProctor'+id);
        editButton.addEventListener('click', editProctor);
        editButton.disabled = false;
        enableSubmitting();
    }

    function confirmedDeleteProctor(event) {
        if(submitting == '') {
            let submitAt = Date.now();
            submitting = 'deleteProctor'+submitAt;
            disableSubmitting();
            let id = event.target.id.replace('deleteProctorForm', '');
            let editButton = document.getElementById('editProctor'+id)
            editButton.removeEventListener('click', editProctor);
            editButton.disabled = true;
            if(submitting == 'deleteProctor'+submitAt) {
                post(
                    event.target.action,
                    deleteProctorSuccessCallback,
                    deleteProctorFailCallback,
                    'delete'
                );
            } else {
                editButton.addEventListener('click', editContact);
                editButton.disabled = false;
            }
        }
    }

    function deleteProctor(event) {
        event.preventDefault();
        let id = event.target.id.replace('deleteProctorForm', '');
        let showProctorName = document.getElementById('showProctorName'+id);
        let message = `Are you sure to delete the proctor of ${showProctorName.innerText}?`;
        bootstrapConfirm(message, confirmedDeleteProctor, event);
    }

    function setProctorEventListeners(loader) {
        let id = loader.id.replace('proctorLoader', '');
        document.getElementById('editProctorForm'+id).addEventListener(
            'submit', saveProctor
        )
        document.getElementById('cancelEditProctor'+id).addEventListener(
            'click', cancelEditProctor
        )
        let editButton = document.getElementById('editProctor'+id);
        editButton.addEventListener('click', editProctor);
        document.getElementById('deleteProctorForm'+id).addEventListener(
            'submit', deleteProctor
        );
        loader.remove();
        editButton.hidden = false;
        document.getElementById('deleteProctor'+id).hidden = false;
    }

    document.querySelectorAll('.proctorLoader').forEach(
        (loader) => {
            setProctorEventListeners(loader);
        }
    );

    const createProctorForm = document.getElementById('createProctorForm');
    const proctorUserIdInput = document.getElementById('proctorUserIdInput');
    const addProctorButton = document.getElementById('addProctorButton');
    const addingProctorButton = document.getElementById('addingProctorButton');

    function createProctorSuccessCallback(response) {
        bootstrapAlert(response.data.success);
        let formElement = document.createElement('form');
        formElement.className = 'row g-3';
        formElement.id = 'editProctorForm'+response.data.user_id;
        formElement.method = 'POST';
        formElement.noValidate = true;
        formElement.hidden = true;
        formElement.action = response.data.update_proctor_url;
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        formElement.innerHTML = `
            <input type="hidden" name="_token" value="${token}">
            <input type="hidden" name="_method" value="put">
            <input type="text" id="proctorUserIdInput${response.data.user_id}" class="col-md-1" name="user_id" value="${response.data.user_id}" data-value="${response.data.user_id}" required />
            <div class="col-md-2" id="proctorName${response.data.user_id}">${response.data.name}</div>
            <button class="btn btn-primary col-md-1 submitButton" id="saveProctor${response.data.user_id}">Save</button>
            <button class="btn btn-primary col-md-1 submitButton" id="savingProctor${response.data.user_id}" disabled hidden>Save</button>
            <button class="btn btn-danger col-md-1" id="cancelEditProctor${response.data.user_id}" onclick="return false">Cancel</button>
        `;
        proctor.insertBefore(formElement, createProctorForm);
        let rowElement = document.createElement('div');
        rowElement.id = 'showProctor'+response.data.user_id;
        rowElement.className = 'row g-3';
        rowElement.innerHTML = `
            <form method="POST" id="deleteProctorForm${response.data.user_id}" action="${response.data.delete_proctor_url}" hidden>
                <input type="hidden" name="_token" value="${token}">
                <input type="hidden" name="_method" value="DELETE">
            </form>
            <div class="col-md-1" id="showProctorId${response.data.user_id}">${response.data.user_id}</div>
            <div class="col-md-2" id="showProctorName${response.data.user_id}">${response.data.name}</div>
            <a id="showProctorLink${response.data.user_id}" href="${response.data.show_user_url}" class="btn btn-primary col-md-1">Show</a>
            <span class="spinner-border spinner-border-sm proctorLoader" id="proctorLoader${response.data.user_id}" role="status" aria-hidden="true"></span>
            <button class="btn btn-primary col-md-1" id="editProctor${response.data.user_id}" hidden>Edit</button>
            <button class="btn btn-danger col-md-1" id="deleteProctor${response.data.user_id}" form="deleteProctorForm${response.data.user_id}" hidden>Delete</button>
        `;
        proctor.insertBefore(rowElement, formElement);
        setProctorEventListeners(document.getElementById('proctorLoader'+response.data.user_id));
        addingProctorButton.hidden = true;
        addProctorButton.hidden = false;
        proctorUserIdInput.value = '';
        proctorUserIdInput.disabled = false;
        enableSubmitting();
    }

    function createProctorFailCallback(error) {
        if(error.status == 422) {
            bootstrapAlert(error.response.data.errors.user_id);
        }
        addingProctorButton.hidden = true;
        addProctorButton.hidden = false;
        proctorUserIdInput.disabled = false;
        enableSubmitting();
    }

    createProctorForm.addEventListener(
        'submit', function(event) {
            event.preventDefault();
            if(submitting == '') {
                let submitAt = Date.now();
                submitting = 'addProctor'+submitAt;
                disableSubmitting();
                if(submitting == 'addProctor'+submitAt) {
                    if(userIdValidation(proctorUserIdInput)) {
                        proctorUserIdInput.disabled = true;
                        addProctorButton.hidden = true;
                        addingProctorButton.hidden = false;
                        let data = {user_id: proctorUserIdInput.value};
                        post(event.target.action, createProctorSuccessCallback, createProctorFailCallback, 'post', data);
                    } else {
                        enableSubmitting();
                    }
                }
            }
        }
    );
}

function urlGetCandidateID(url) {
    return (new URL(url).pathname).match(/^\/admin\/admission-tests\/([0-9]+)\/candidates\/([0-9]+).*/i)[2];
}

function updatePresentStatueSuccessCallback(response) {
    let id = urlGetCandidateID(response.request.responseURL);
    let button = document.getElementById('presentButton'+id);
    button.value = !response.data.status;
    if(response.data.status) {
        button.innerText = 'Present';
        if(button.classList.contains('btn-danger')) {
            button.classList.remove('btn-danger');
        }
        if(!button.classList.contains('btn-success')) {
            button.classList.add('btn-success');
        }
        if(Date.parse(showExpectEndAt.innerText) <= Date.now()) {
            let passButton = document.getElementById('resultPassButton'+id);
            let failButton = document.getElementById('resultFailButton'+id);
            if(passButton) {
                passButton.dataset.disabled = false;
                failButton.dataset.disabled = false;
            }
        }
    } else {
        button.innerText = 'Absent';
        if(button.classList.contains('btn-success')) {
            button.classList.remove('btn-success');
        }
        if(!button.classList.contains('btn-danger')) {
            button.classList.add('btn-danger');
        }
        if(passButton) {
            passButton.dataset.disabled = true;
            failButton.dataset.disabled = true;
        }
    }
    enableSubmitting();
}

function updatePresentStatueFailCallback(error) {
    if(error.status == 422) {
        if(error.response.data.errors.status) {
            bootstrapAlert(error.response.data.errors.status);
        } else {
            alert('undefine feedback key');
        }
    }
    enableSubmitting();
}

function updatePresentStatue(event) {
    event.preventDefault();
    if(submitting == '') {
        let submitAt = Date.now();
        submitting = 'updatePresentStatue'+submitAt;
        disableSubmitting();
        if(submitting == 'updatePresentStatue'+submitAt) {
            let data = {status: stringToBoolean(event.submitter.value)};
            post(event.target.action, updatePresentStatueSuccessCallback, updatePresentStatueFailCallback, 'put', data);
        }
    }
}

function updateResultSuccessCallback(response) {
    let id = urlGetCandidateID(response.request.responseURL);
    document.getElementById('resultPassButton'+id).dataset.disabled = response.data.status;
    document.getElementById('resultFailButton'+id).dataset.disabled = ! response.data.status;
    document.getElementById('presentButton'+id).dataset.disabled = true;
    enableSubmitting();
}

function updateResultFailCallback(error) {
    if(error.status == 422) {
        if(error.response.data.errors.status) {
            bootstrapAlert(error.response.data.errors.status);
        } else {
            alert('undefine feedback key');
        }
    }
    enableSubmitting();
}

function confirmedUpdateResult(event) {
    if(submitting == '') {
        let submitAt = Date.now();
        submitting = 'updateResult'+submitAt;
        disableSubmitting();
        if(submitting == 'updateResult'+submitAt) {
            let data = {status: stringToBoolean(event.submitter.value)};
            post(event.target.action, updateResultSuccessCallback, updateResultFailCallback, 'put', data);
        }
    }
}

function updateResult(event) {
    event.preventDefault();
    let message = `Are you sure to update candidate of ${event.submitter.dataset.name}(${event.submitter.dataset.passport}) result to `;
    if(stringToBoolean(event.submitter.value)) {
        message += 'pass?'
    } else {
        message += 'fail?'
    }
    bootstrapConfirm(message, confirmedUpdateResult, event);
}

function deleteCandidateSuccessCallback(response) {
    bootstrapAlert(response.data.success);
    let id = urlGetCandidateID(response.request.responseURL);
    document.getElementById('candidateRow'+id).remove();
    enableSubmitting();
}

function deleteCandidateFailCallback(error) {
    enableSubmitting();
}

function confirmedDeleteCandidate(event) {
    if(submitting == '') {
        let submitAt = Date.now();
        submitting = 'deleteCandidate'+submitAt;
        let id = event.target.id.replace('deleteCandidateForm', '');
        disableSubmitting();
        if(submitting == 'deleteCandidate'+submitAt) {
            document.getElementById('deleteCandidate'+id).hidden = true;
            document.getElementById('deletingCandidate'+id).hidden = false;
            post(event.target.action, deleteCandidateSuccessCallback, deleteCandidateFailCallback, 'delete');
        }
    }
}

function deleteCandidate(event) {
    event.preventDefault();
    let message = `Are you sure to delete candidate of ${event.submitter.dataset.name}(${event.submitter.dataset.passport})?`;
    bootstrapConfirm(message, confirmedDeleteCandidate, event);
}

function setCandidateEventLister(loader) {
    let id = loader.id.replace('candidateLoader', '');
    document.getElementById('presentForm'+id).addEventListener(
        'submit', updatePresentStatue
    );
    let resultPassButton = document.getElementById('resultPassButton'+id);
    let resultFailButton = document.getElementById('resultFailButton'+id);
    let deleteButton = document.getElementById('deleteCandidate'+id);
    if(resultPassButton) {
        document.getElementById('resultForm'+id).addEventListener(
            'submit', updateResult
        );
        document.getElementById('deleteCandidateForm'+id).addEventListener(
            'submit', deleteCandidate
        );
    }
    loader.remove();
    document.getElementById('presentButton'+id).hidden = false;
    if(resultPassButton) {
        resultPassButton.hidden = false;
        resultFailButton.hidden = false;
        deleteButton.hidden = false;
    }
}

document.querySelectorAll('.candidateLoader').forEach(
    (loader) => {
        setCandidateEventLister(loader);
    }
);

const candidate = document.getElementById('candidate');

if(candidate) {
    const createCandidateForm = document.getElementById('createCandidateForm');
    if(createCandidateForm) {
        const candidateUserIdInput = document.getElementById('candidateUserIdInput');
        const addCandidateButtons = document.getElementsByClassName('addCandidateButton');
        const addingCandidateButton = document.getElementById('addingCandidateButton');
        const showCurrentCandidates = document.getElementById('showCurrentCandidates');

        function createCandidateSuccessCallback(response) {
            let rowElement = document.createElement('div');
            rowElement.id = 'candidateRow'+response.data.user_id;
            rowElement.className = 'row g-3';
            let html = `
                <form id="presentForm${response.data.user_id}" hidden method="POST"
                    action="${response.data.present_url}">
                    <input type="hidden" name="_token" value="${token}">
                    <input type="hidden" name="_method" value="put">
                </form>
                <form id="resultForm${response.data.user_id}" hidden method="POST"
                    action="${response.data.result_url}">
                    <input type="hidden" name="_token" value="${token}">
                    <input type="hidden" name="_method" value="put">
                </form>
                <form method="POST" id="deleteCandidateForm${response.data.user_id}" hidden method="POST"
                    action="${response.data.delete_url}">
                    <input type="hidden" name="_token" value="${token}">
                    <input type="hidden" name="_method" value="put">
                </form>
                <div class="col-md-1">${response.data.user_id}</div>
                <div class="col-md-2">${response.data.name}</div>
                <div class="col-md-2">${response.data.passport_type}</div>
            `;
            if(response.data.has_same_passport) {
                html += `<div class="col-md-2 text-warning">${response.data.passport_number}</div>`;
            } else {
                html += `<div class="col-md-2">${response.data.passport_number}</div>`;
            }
            html += `
                <a class="btn btn-primary col-md-1 showCandidateLink" href="${response.data.show_user_url}">Show</a>
                <button class="btn btn-primary col-md-1 disabledShowCandidateLink" hidden disabled>Show</button>
                <span class="spinner-border spinner-border-sm candidateLoader" id="candidateLoader${response.data.user_id}" role="status" aria-hidden="true"></span>
                <button name="status" id="presentButton${response.data.user_id}" form="presentForm${response.data.user_id}" value="true"
            `;
            if(! response.data.in_testing_time_range) {
                html += 'disabled data-disabled="1"';
            } else {
                html += 'data-disabled="0"';
            }
            html += `
                    class="btn btn-danger col-md-1 submitButton" hidden>Absent</button>
                <button name="status" id="resultPassButton${response.data.user_id}" form="resultForm${response.data.user_id}"
                    value="1" data-disabled="1" hidden disabled data-name="${response.data.name}" data-passport="${response.data.passport_number}"
                    class="btn btn-success col-md-1 submitButton">Pass</button>
                <button name="status" id="resultFailButton${response.data.user_id}" form="resultForm${response.data.user_id}"
                    value="0"  data-disabled="1" hidden disabled data-name="${response.data.name}" data-passport="${response.data.passport_number}"
                    class="btn btn-danger col-md-1 submitButton">Fail</button>
                <button name="status" id="deleteCandidate${response.data.user_id}" form="deleteCandidateForm${response.data.user_id}" hidden
                    data-name="${response.data.name}" data-passport="${response.data.passport_number}" class="btn btn-danger col-md-1 submitButton">Delete</button>
                <button class="btn btn-danger col-md-1" id="deletingCandidate${response.data.user_id}" hidden disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Deleting...
                </button>
            `;
            rowElement.innerHTML = html;
            candidate.insertBefore(rowElement, createCandidateForm);
            setCandidateEventLister(document.getElementById('candidateLoader'+response.data.user_id));
            showCurrentCandidates.innerText = + showCurrentCandidates.innerText + 1;
            addingCandidateButton.hidden = true;
            for(let addCandidateButton of addCandidateButtons) {
                addCandidateButton.hidden = false;
            }
            candidateUserIdInput.value = '';
            candidateUserIdInput.disabled = false;
            enableSubmitting();
        }

        function createCandidateFailCallback(error) {
            if(error.status == 422) {
                bootstrapAlert(error.response.data.errors.user_id);
            }
            addingCandidateButton.hidden = true;
            for(let addCandidateButton of addCandidateButtons) {
                addCandidateButton.hidden = false;
            }
            candidateUserIdInput.disabled = false;
            enableSubmitting();
        }

        createCandidateForm.addEventListener(
            'submit', function(event) {
                event.preventDefault();
                if(submitting == '') {
                    let submitAt = Date.now();
                    submitting = 'addCandidate'+submitAt;
                    disableSubmitting();
                    if(submitting == 'addCandidate'+submitAt) {
                        if(userIdValidation(candidateUserIdInput)) {
                            candidateUserIdInput.disabled = true;
                            for(let addCandidateButton of addCandidateButtons) {
                                addCandidateButton.hidden = true;
                            }
                            addingCandidateButton.hidden = false;
                            let data = {
                                user_id: candidateUserIdInput.value,
                                function: event.submitter.value,
                            };
                            event.target.action
                            post(event.target.action, createCandidateSuccessCallback, createCandidateFailCallback, 'post', data);
                        } else {
                            enableSubmitting();
                        }
                    }
                }
            }
        );
    }
}

submitting = '';
