function validateUnique(input, field, minLength, maxLength, form) {
    let errorMes = '';

    // Check if the input is empty
    if (input.trim() === "") {
        errorMes = `${field} cannot be empty`;
    }
    // Check if the input length is within the valid range
    else if (input.length < minLength || input.length > maxLength) {
        errorMes = `${field} must be between ${minLength} and ${maxLength} characters long`;
    }
    // Check if the input contains spaces (if necessary for your use case)
    else if (input.includes(' ')) {
        errorMes = `${field} cannot contain spaces`;
    }

    // Display error message if there is any
    if (errorMes) {
        document.getElementById(`${form}error`).innerHTML = errorMes;
        return false; // Validation failed
    }
    return true; // Validation passed
}
function validateNumber(input, field, minLength, maxLength, form) {
    let errorMes = '';

    // Check if the input is empty
    if (input.trim() === "") {
        errorMes = `${field} cannot be empty`;
    }
    // Check if the input is a valid number
    else if (isNaN(input)) {
        errorMes = `${field} must be a valid number`;
    }
    else if (input.length < minLength || input.length > maxLength) {
        errorMes = `${field} must be between ${minLength} and ${maxLength} characters long`;
    }
    // Display error message if there is any
    if (errorMes) {
        document.getElementById(`${form}error`).innerHTML = errorMes;
        return false; // Validation failed
    }
    return true; // Validation passed
}
function validateString(input, field, minLength, maxLength, form) {
    let errorMes = '';

    // Check if the input is empty
    if (input.trim() === "") {
        errorMes = `${field} cannot be empty`;
    }
    // Check if the input is a valid number
    else if (!isNaN(input)) {
        errorMes = `${field} cannot be number`;
    }
     else if (input.length < minLength || input.length > maxLength) {
        errorMes = `${field} must be between ${minLength} and ${maxLength} characters long`;
    }
    // Display error message if there is any
    if (errorMes) {
        document.getElementById(`${form}error`).innerHTML = errorMes;
        return false; // Validation failed
    }
    return true; // Validation passed
}
function validateRadioButton(radioName, fieldName, errorElementId) {
    const radios = document.getElementsByName(radioName);
    let isSelected = false;
    
    // Check if any radio button is selected
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            isSelected = true;
            break;
        }
    }

    if (!isSelected) {
        document.getElementById(`${errorElementId}error`).innerHTML = `${fieldName} must be selected.`;
        return false; // Validation failed
    } else {
        document.getElementById(`${errorElementId}error`).innerHTML = ""; // Clear error message
        return true; // Validation passed
    }
}
function validateEmail(input, field, minLength, maxLength, form) {
    let errorMes = '';

    // Check if the input is empty
    if (input.trim() === "") {
        errorMes = `${field} cannot be empty`;
    }
    // Check if the input length is within the valid range
    else if (input.length < minLength || input.length > maxLength) {
        errorMes = `${field} must be between ${minLength} and ${maxLength} characters long`;
    }
    // Check if the input contains spaces (if necessary for your use case)
    else if (input.includes(' ')) {
        errorMes = `${field} cannot contain spaces`;
    }
    // Additional validation for email format
    else if (field === "Email") {
        if (!input.includes('@') || !input.includes('.')) {
            errorMes = `${field} must be a valid email address`;
        }
    }

    // Display error message if there is any
    if (errorMes) {
        document.getElementById(`${form}error`).innerHTML = errorMes;
        return false; // Validation failed
    }
    return true; // Validation passed
}


