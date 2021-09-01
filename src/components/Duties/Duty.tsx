import { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';

import swal from 'sweetalert';

import Subtask from '../Tasks/Task';
import SpecialInput from './SpecialInput';
import { eraseDuty, updateDoneStatus, getPricesTotal } from '../../service/api';

type DutyProps = { 
    id: string
    name: String
    done: boolean
    description: String
    type: String
    specialInput: Object
    displayDone?: string 
    price: Number
    childUpdate: React.Dispatch<React.SetStateAction<object>>
    subtask: []
}

const Duty: FunctionComponent<DutyProps> = ({ 
    id,
    name,
    done,
    description,
    type,
    specialInput,
    price,
    childUpdate,
    displayDone,
    subtask
}) => {

    const history = useHistory();
    const handleRedirect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        history.push(`/add-subtask/${id}`);
    };

    const editPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        history.push(`/edit-task/${id}`);
    }

    const blockPropagation = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.stopPropagation();
    }

    const updateTask = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        if(e.target.parentElement?.parentElement?.parentElement?.classList.contains('duty__task')){
            e.target.parentElement?.parentElement?.parentElement?.classList.add('hide__duty');
        }

        setTimeout(async () => {
            await updateDoneStatus({ 
                id,
                done: checked
            });
    
            childUpdate({
                updateType: 'Done_Status',
                done: checked, 
                id
            })

        }, 250)

    };

    const handleDeleteSubmit = async (e: React.MouseEvent) => {
        e.stopPropagation();

        swal({
            title: `Are you sure you want to delete this duty?`,
            text: 'Once deleted, the duty cannot be recovered!',
            icon: 'warning',
            buttons: ['Cancel', true],
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    await eraseDuty(id);

                    childUpdate({
                        updateType: 'Erasure',
                        id
                    });

                    swal('Your duty has been deleted!', {
                        icon: 'success',
                    });
                } else {
                    swal('Your duty remains in memory!');
                }
            })
            .catch(err => {
                swal('Something went wrong.', `${err}`, 'error');
            })
    };

    const taskPage = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        history.push(`/task/${id}`);
    };

    return (
        <div className={ done ? `duty__task duty__concluded ${displayDone}` : "duty__task" } onClick={ taskPage }>
            <div className="duty__header">
                <div className="duty__name">
                    <input 
                        type="checkbox" 
                        onChange={updateTask} 
                        onClick={blockPropagation}
                        checked={done} 
                    />
                    { name }
                </div>
                { price !== null && <span className="duty__price">{ price }kr</span> }
            </div>

            <h3 className="duty__description">
                { description }
            </h3>

            <div className={`duty__type ${type}`}>
                <span>{ type }</span>
            </div>

            { Object.keys(specialInput).length > 0 && <SpecialInput inputs={specialInput} /> }

            <div className="duty__tasks">
                { subtask.length > 0 && <Subtask 
                    subtasks={subtask} 
                    subTaskTotalPrice={getPricesTotal(id)}
                /> }
            </div>

            <div className="button__actions__homepage">
                <button  className="add__btn" onClick={handleRedirect}>{'\u002B'} task</button> 
                <button className="edit__btn" onClick={editPage}>{'\u270E'} edit</button>
                <button name="task-erasure" className="delete__btn" onClick={handleDeleteSubmit} type="submit">{'\u232B'} delete</button>
                </div>
        </div>
    )
}

export default Duty;