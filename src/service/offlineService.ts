import { submitCUDInfo } from './api';

export const allQueues = {
    newDutiesQueue: 'newDutiesQueue',
    eraseDutiesQueue: 'eraseDutiesQueue',
    updateDutiesQueue: 'updateDutiesQueue',
    newSubtasksQueue: 'newSubtasksQueue',
    eraseSubtasksQueue: 'eraseSubtasksQueue',
    updateSubtasksQueue: 'updateSubtasksQueue'
};

export const offlineService = {
    getQueue(queue: string) {
        return JSON.parse(localStorage.getItem(queue) || '[]');
    },

    updateQueue(queue: string, payload: Object) {
        const currentQueue = this.getQueue(queue);
        currentQueue.push(payload);

        localStorage.setItem(queue, JSON.stringify(currentQueue));
    },

    clearQueue(queue: string) {
        localStorage.removeItem(queue);
    },
};

//  When back online
window.addEventListener('online', () => clearQueues());

const clearQueues = () => {
    for(let queue in allQueues) {

        const pending = offlineService.getQueue(`${queue}`);

        if(pending.length > 0) {
            switch(`${queue}`){
                case 'newDutiesQueue':
                    pending.forEach(async (duty: Object) => await submitCUDInfo('/task/new-todo', duty, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'eraseDutiesQueue':
                    pending.forEach(async (duty: { id: string }) => await submitCUDInfo('/task/erase-task', duty, 'erasure'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateDutiesQueue':
                    pending.forEach(async (duty: Object) => await submitCUDInfo('/task/update-task', duty, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'newSubtasksQueue':
                    pending.forEach(async (subtask: Object) => await submitCUDInfo('/task/new-subtask', subtask, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateSubtasksQueue':
                    pending.forEach(async (subtask: Object) => await submitCUDInfo('/task/update-subtask', subtask, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                default:
                    pending.forEach(async (id: Object) => await submitCUDInfo('/task/remove-subtask', id, 'erasure'));
                    offlineService.clearQueue(`${queue}`);
            };
        };
    };
};