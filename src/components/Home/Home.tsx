import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Duty from '../Duties/Duty';
import { collectDuties, convertSubToMain } from '../../service/api';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [childUpdate, setChildUpdate] = useState({});
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [displayDoneTasks, setDisplayDoneTasks] = useState(false);

    useEffect(() => {
        collectDuties((allDuties: any) => setData(allDuties));
    }, [childUpdate]);

    const history = useHistory();
    const changeRoute = () => {
        const path = '/new-todo';
        history.push(path);
    }

    const drop = async (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        const subtaskId = e.dataTransfer.getData('subtask_id');

        if (subtaskId === '') {
            return;
        } else {
            const response = await convertSubToMain(subtaskId);

            setChildUpdate({
                updateType: 'Subtask_To_Maintask',
                response
            });
        }
    }

    const dragOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
    }

    const filterDahsboard = (displayDone: boolean) => {
        setDisplayDoneTasks(displayDone)
    }

    const tasksDone = () => {
        const done = data.filter(
            (duty: { 
                _id: string,
                name: String,
                done: boolean,
                description: String,
                type: String,
                specialInput: Object,
                price: Number, 
                subtask: []
            }) => duty.done
        );

        if(done.length === 0) {
            return <div className="no-done-tasks">There are no duties here.</div>
        } else {
            return done.map(
                (duty: { 
                    _id: string,
                    name: String,
                    done: boolean,
                    description: String,
                    type: String,
                    specialInput: Object,
                    price: Number, 
                    subtask: []
                }) => (<Duty 
                        key={duty._id}
                        id={duty._id}
                        name={duty.name} 
                        description={duty.description}
                        price={duty.price}
                        specialInput={duty.specialInput}
                        type={duty.type}
                        done={duty.done}
                        childUpdate={setChildUpdate}
                        subtask={duty.subtask}
                        displayDone="filtered-display"
                    />)
                )
        }
    }

    return (
        <main className="dashboard" 
            onDrop={drop} 
            onDragOver={dragOver}>

            <header>
                <div className="filter-display">
                    <button 
                        onClick={ () => setShowFilterOptions(!showFilterOptions) } 
                        className="filter__dropdown">
                            {'\u2630'}
                    </button>

                    <div className={showFilterOptions ? "dropdown__content show__filter__options" : "dropdown__content"}>
                        <span className="menu__span" onClick={ () => {
                                filterDahsboard(true);
                                setShowFilterOptions(!showFilterOptions);
                            }
                        }>
                            Done {displayDoneTasks}
                        </span>

                        <span className="menu__span" onClick={ () => {
                                filterDahsboard(false);
                                setShowFilterOptions(!showFilterOptions);
                            }
                        }>
                            Todo {!displayDoneTasks}
                        </span>
                        <span className="menu__span" onClick={changeRoute}> {'\u002B'}  Add Duty</span>

                    </div>
                </div>


                <div className="title__container">
                <h1 className="header__title"> </h1>
                </div>
            </header>

            <div className="all__duties">
                { data.length > 0 && !displayDoneTasks &&
                    data.map(
                    (duty: { 
                        _id: string,
                        name: String,
                        done: boolean,
                        description: String,
                        type: String,
                        specialInput: Object,
                        price: Number, 
                        subtask: []
                    }) => (<Duty 
                            key={duty._id}
                            id={duty._id}
                            name={duty.name} 
                            description={duty.description}
                            price={duty.price}
                            specialInput={duty.specialInput}
                            type={duty.type}
                            done={duty.done}
                            childUpdate={setChildUpdate}
                            subtask={duty.subtask}
                        />)
                    )  
                }

                { data.length > 0 && displayDoneTasks && tasksDone() }
            </div>
        </main>
    )
}

export default Dashboard;