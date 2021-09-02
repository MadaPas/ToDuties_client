import swal from 'sweetalert';

import { offlineService, allQueues } from './offlineService';
import { localDuties } from './localStorage';

const localHost = 'https://madapas-to-duties.herokuapp.com';

// Post Requests for create, update and delete
const handlePostWhenOffline = async (
    details: any, 
    url: string, 
    requestObj: Object
) => {

    if (!navigator.onLine) {
        const direction = url.split('/');

        switch(direction[direction.length - 1]) {
            case 'new-todo':
                offlineService.updateQueue(allQueues.newDutiesQueue, details);
                return details;
            case 'remove-subtask':
                offlineService.updateQueue(allQueues.eraseSubtasksQueue, details);
                break;
            case 'erase-task':
                offlineService.updateQueue(allQueues.eraseDutiesQueue, details);
                break;
            case 'update-task':
                offlineService.updateQueue(allQueues.updateDutiesQueue, details);
                break;
            case 'new-subtask':
                offlineService.updateQueue(allQueues.newSubtasksQueue, details);
                break;
            case 'update-subtask':
                offlineService.updateQueue(allQueues.updateSubtasksQueue, details);
                break;
            default:
                return;
        }

        return localDuties.getDuties();
    } 
    else {
        return await fetch(url, requestObj);
    }
}

export const submitCUDInfo = async (
    url: string, 
    data: object, 
    type: 'erasure' | 'createUpdate'
) => {

    let request: Object = {};

    if(type === 'createUpdate') {
        request = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    } else if(type === 'erasure') {
        request = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-HTTP-Method-Override': 'DELETE'
            },
            body: JSON.stringify(data)
        };
    }

    const response = await handlePostWhenOffline(data, url, request);

    if(response?.status === 400 || response?.status === 404 || response?.status === 500) {
        const { message } = await response.json();

        throw Error(message);
    }

    return response;
};

export const formPath = (userData: object, cb: Function) => {
    submitCUDInfo(`${localHost}/task/new-todo`, userData, 'createUpdate')
        .then(data => {
            if(Object.keys(data).length > 0) {
                return { message: `Your duty will be added to the database once you're back online` };
            } else {
                return data.json();
            }
        })
        .then(res => {
            if(res.message) {
                swal('Success!', res.message, 'success');
            }

            cb();
        }) 
        .catch(err => swal('Could not submit!', `${err}`, 'error'));
};


// No CUD
export const collectDuties = async (cb: Function) => {
    cb(localDuties.getDuties());

    try {
        const response = await fetch(`${localHost}/task/all-tasks`);
        const data = await response.json();

        if(response.status === 500 || response.status === 400 || response.status === 404){
            throw Error(data.message);
        } else {
            localDuties.makeFullList(data);        
            cb(localDuties.getDuties());
        }
    } catch(err){
        swal('Something went wrong.', `${err}`, 'error');
    }
    
};

// To double check
export const convertSubToMain = async (id: string) => {
    try {
        const converted: any = submitCUDInfo(`${localHost}/task/remove-subtask`, { id }, 'erasure')
            .then(res => res.json())
            .then(data => {
                const { price, name, done } = data;
                return {
                    name,
                    description: '',
                    type: 'Other',
                    specialInput: {},
                    price,
                    done
                }
            })
            .catch(err => console.error(err))
    
        return await submitCUDInfo(`${localHost}/task/new-todo`, converted, 'createUpdate');

    } catch(err) {
        console.error(err);
    }
};


export const eraseDuty = async (id: string) => {
    localDuties.removeDutyFromList({ id });

    try {
        const response = await submitCUDInfo(`${localHost}/task/erase-task`, { id }, 'erasure');
        return response;
    } catch(err) {
        throw Error('Failed to delete the duty!');
    }
};

export const updateDoneStatus = async (dataUpdated: { 
    id: string, 
    done: boolean
}) => {
    localDuties.updateDutyFromList(dataUpdated);

    try {
        const response = await submitCUDInfo(`${localHost}/task/update-task`, dataUpdated, 'createUpdate');
        return response.status;
    } catch(err) {
        console.error(err);
    }
}

export const createSubTask = async (subtask: { 
    done: boolean
    name: String
    parentId: String
    price: String
}) => {

    localDuties.createSubtaskToList(subtask);

    try {
        await submitCUDInfo(`${localHost}/task/new-subtask`, subtask, 'createUpdate');

        swal('Success!', `The task has been assigned successfully`, 'success');    
    }  catch(err) {
        console.error(err);
    }
}

export const updateSubTaskDone = async (subtask: Object) => {
    localDuties.updateSubtaskFromList(subtask);

    try { 
        await submitCUDInfo(`${localHost}/task/update-subtask`, subtask, 'createUpdate');
    }  catch(err) {
        console.error(err);
    }
}

export const getPricesTotal = (taskId: String) => {
    const currentDuties = localDuties.getDuties();

    const selectedDuty = currentDuties.find((duty: { _id: string }) => duty._id === taskId);
    let totalPrice = 0;

    if(selectedDuty === undefined) {
        return totalPrice;
    } else {
        selectedDuty.subtask.forEach((subtask: { price: string }) => {
            if(subtask.price !== null) {
                totalPrice = totalPrice + +subtask.price;
            }
        })
    
        return totalPrice;
    }
}

export const getDuty = async (taskId: String) => {
    try {
        const response = await fetch(`${localHost}/task/${taskId}`);
        const data = await response.json();

        if(response.status === 500 || response.status === 404 || response.status === 400) {
            throw Error(data);
        }

        return data;
    } catch(err) {
        console.error(err);
    }
}


export const editDuty = async (duty: Object,  cb: Function) => {
    try {
        const response = await fetch(`${localHost}/task/edit`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(duty)
        });

        if(response.status === 500 || response.status === 404 || response.status === 400) {
            throw Error('Could not update');
        }
        swal('Success!', 'The duty has been updated successfully', 'success');
    } catch(err) {
        console.error(err);
    }

    cb();
}