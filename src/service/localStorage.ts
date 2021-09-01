export const localDuties = {
    getDuties() {
        return JSON.parse(localStorage.getItem('duties') || '[]');
    },

    makeFullList(payload: Object[]) {
        localStorage.setItem('duties', JSON.stringify(payload));
    },

    removeDutyFromList(element: { id: string }) {
        const current = this.getDuties();
        const newList = current.filter((duty: { _id: string }) => duty._id !== element.id);

        this.makeFullList(newList);
    },

    updateDutyFromList(element: { 
        id: string, 
        done: boolean 
    }) {
        const current = this.getDuties();
        let dutyToUpdate = current.find((duty: { _id: string }) => duty._id === element.id);

        dutyToUpdate = { ...dutyToUpdate, done: element.done };

        const newList = current.map((duty: { _id: string }) => {
            if(duty._id === dutyToUpdate._id) {
                return dutyToUpdate;
            } else {
                return duty;
            }
        });

        this.makeFullList(newList);
    },

    createSubtaskToList(subtask: { 
        done: boolean
        name: String
        parentId: String
        price: String
    }) {
        const current = this.getDuties();
        const parentDuty = current.find((duty: { _id: string }) => duty._id === subtask.parentId);
        parentDuty.subtask.push(subtask);

        const newList = current.map((duty: { _id: string }) => {
            if(duty._id === parentDuty._id) {
                return parentDuty;
            } else {
                return duty;
            }
        });

        this.makeFullList(newList);
    },

    updateSubtaskFromList(subtask: any) {
        const current = this.getDuties();

        let parentDuty: {
            description: string,
            done: boolean,
            name: string,
            price: Number,
            specialInput: Object,
            subtask: Object[],
            type: string
            _id: string
        } = current.find((duty: { _id: string }) => duty._id === subtask.parentId);

        const updatedSubtasks = parentDuty.subtask.map((sub: any) => {
            if(sub._id === subtask.taskId) {
                return { ...sub, done: subtask.done };
            } else {
                return sub;
            }
        });

        parentDuty.subtask = updatedSubtasks;

        const newList = current.map((duty: { _id: string }) => {
            if(duty._id === parentDuty._id) {
                return parentDuty;
            } else {
                return duty;
            }
        });

        this.makeFullList(newList);
    },

    clearList() {
        localStorage.removeItem('duties');
    }
}
