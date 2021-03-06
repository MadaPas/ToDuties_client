import { FunctionComponent, useState } from 'react';

import SubtaskView from './TasksView';
import { updateSubTaskDone } from '../../service/api';

type SubtaskProps = {
    subtasks: []
    subTaskTotalPrice: Number
}

const Subtask: FunctionComponent<SubtaskProps> = ({ 
    subtasks,
    subTaskTotalPrice
}) => {
    const [done, setDone] = useState({});

    const updateSubtask = async () => {
        await updateSubTaskDone(done);
        setDone({});
    };

    const dragOver = (e: any) => {
        e.preventDefault();
    };

    if(Object.keys(done).length > 0) {
        updateSubtask();
    };

    return (
        <div className="tasks__area" onDragOver={dragOver}>
            { subTaskTotalPrice > 0 && 
                <div className="task__total__price">
                    <span>Total: {subTaskTotalPrice}kr</span>
                </div> 
            }
            
            {
                subtasks.map((elements: {
                    done: boolean
                    name: String
                    parentId: String 
                    _id: string
                    price: Number
                }, i) => {
                    return <SubtaskView 
                        key={elements._id ? elements._id : i} 
                        id={elements._id}
                        done={elements.done} 
                        name={elements.name} 
                        price={elements.price}
                        parentId={elements.parentId} 
                        update={setDone}
                    />
                })
            }
        </div>
    )
}

export default Subtask;