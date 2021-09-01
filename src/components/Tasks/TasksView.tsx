import { FunctionComponent, useState } from 'react';

type SubtaskViewProps = {
    done: boolean
    id:  string
    name: String
    price: Number
    parentId: String
    update: React.Dispatch<React.SetStateAction<{}>>
}

const SubtaskView: FunctionComponent<SubtaskViewProps> = ({
    done,
    id,
    name,
    price,
    parentId,
    update
}) => {
    const [concluded, setConcluded] = useState(done);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await update({
            taskId: id,
            done: e.target.checked,
            parentId
        });

        setConcluded(e.target.checked);
    };

    const dragStart = (e: any) => {
        const target = e.target!;
        e.dataTransfer.setData('subtask_id', target.id );
    };

    const dragOver = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div id={id}
            className="tasks"
            draggable
            onDragStart={dragStart} 
            onDragOver={dragOver}
        >
            <div>
                <input type="checkbox" defaultChecked={done} onChange={handleChange} />
                <span className={concluded ? "tasks__name concluded" : "tasks__name"}>{name}</span>
            </div>
            { price !== null && <span className={concluded ? "tasks__price concluded" : "tasks__price"}>{price}kr</span> }
        </div>
    );
};

export default SubtaskView;