import swal from 'sweetalert';

export const emptyFields = (name: string) => {
    // actually required for RegEx
    // eslint-disable-next-line no-useless-escape
    const whiteSpaces = new RegExp('^\s+$');

    if(name ===  '') {
        swal('Could not submit!', 'The Name fiels is required.', 'error');
        return false;
    } else if(whiteSpaces.test(name)) {
        swal('Could not submit!', 'The Name fiels is required.', 'error');
        return false;
    } else {
        return true; 
    }
}

interface SpecialInputs {
    fooCarbs?: Number,
    foodFat?: Number,
    foodProtein?: Number,
    workDeadline?: string
}

export const foodTypeValidation = (inputs: SpecialInputs) => {
    const allInputs = Object.keys(inputs);

    if(!allInputs.includes('fooCarbs')){
        swal('Could not submit!', 'The amount of carbs is a required field and has to be specified in grams.', 'error');
        return false;
    } else if(!allInputs.includes('foodFat')){
        swal('Could not submit!', 'The amount of fat is a required field and has to be specified in grams.', 'error');
        return false;
    } else if(!allInputs.includes('foodProtein')){
        swal('Could not submit!', 'The amount of protein is a required field and has to be specified in grams.', 'error');
        return false;
    } else {
        return true;
    }
};

export const workTypeValidation = (inputs: SpecialInputs) => {
    if(!Object.keys(inputs).includes('workDeadline')) {
        swal('Could not submit!', 'Please provide a valid deadline date.', 'error');
        return false;
    } else {
        const currentDate = new Date();
        const dateProvided = new Date(inputs.workDeadline!);
    
        if(currentDate.getTime() > dateProvided.getTime()) {
            swal('Could not submit!', 'The date provided is prior to today. Try again with a valid date.', 'error');
            return false;
        } else {
            return true;
        }
    }
};