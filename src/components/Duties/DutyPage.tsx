import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import swal from 'sweetalert';

import Subtask from '../Tasks/Task';
import SpecialInput from './SpecialInput';
import { eraseDuty, updateDoneStatus, getPricesTotal, getDuty } from '../../service/api';

interface DutyProps {
    name: String,
    description: String,
    type: String,
    specialInput: {
        fooCarbs?: Number,
        foodFat?: Number,
        foodProtein?: Number,
        workDeadline?: string
    },
    subtask: [],
    price: Number | null,
    done: boolean,
    _id: string
}

const DutyPage = () => {

    const [task, setTask] = useState<Partial<DutyProps>>({
        name: '',
        description: '',
        type: 'Other',
        specialInput: {},
        price: null,
        done: false,
        _id: ''
    });

    useEffect(() => {
        renderTask();
    }, []);

    const renderTask = async () => {
        console.log('Render Task');
        const path = window.location.pathname;
        const pathDivided = path.split('/');
        const taskId = pathDivided[pathDivided.length - 1];

        console.log(taskId);

        const selectedTask = await getDuty(taskId);
        setTask(selectedTask);
    };

    const history = useHistory();

    const backToDashboard = () =>{
        history.push('/');
    };

    const handleRedirect = () => {
        history.push(`/add-subtask/${task._id}`);
    };

    const editPage = () => {
        history.push(`/edit-task/${task._id}`);
    }

    const updateTask = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        await updateDoneStatus({ 
            id: task._id!,
            done: checked
        });
    };

    const handleDeleteSubmit = async () => {
        swal({
            title: `Are you sure you want to delete this duty?`,
            text: 'Once deleted, the duty cannot be recovered!',
            icon: 'warning',
            buttons: ['Cancel', true],
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    await eraseDuty(task._id!);


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

    return (
        <>
        <div className="task-view">
            <button 
                onClick={backToDashboard} 
                className="home__button">
                    Home
            </button>

            <div className="duty__task">
                <div className="duty__header">
                    <div className="duty__name">
                        <input 
                            type="checkbox" 
                            onChange={ updateTask } 
                            checked={ task.done } 
                        />
                        { task.name }
                    </div>
                    { task.price !== null && <span className="duty__price">{ task.price }kr</span> }
                </div>

                <h3 className="duty__description">
                    { task.description }
                </h3>

                <div className={`duty__type ${ task.type }`}>
                    <span>{ task.type }</span>
                </div>

                { Object.keys(task.specialInput!).length > 0 && <SpecialInput inputs={task.specialInput!} /> }

                <div className="duty__tasks">
                    { task.subtask !== undefined && task.subtask!.length > 0 && <Subtask 
                        subtasks={task.subtask!} 
                        subTaskTotalPrice={getPricesTotal(task._id!)}
                    /> }
                </div>
                <div className="button__actions">
                <button  className="add__btn__task" onClick={handleRedirect}>{'\u002B'}</button> 
                <button className="edit__btn__task" onClick={editPage}>{'\u270E'}</button>
                <button name="task-erasure" className="delete__btn__task" onClick={handleDeleteSubmit} type="submit">{'\u232B'}</button>
                </div>

            </div>
        </div>
        </>
    )
}

export default DutyPage;