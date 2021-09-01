import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getDuty, editDuty } from '../../service/api'; // HERE
import { foodTypeValidation, workTypeValidation, emptyFields } from '../../service/validation';

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
    price: Number | null,
    done: boolean,
    _id: string
}

interface ParamTypes {
    taskId: string
}

const EditDuty = () => {
    const { taskId } = useParams<ParamTypes>();
    const history = useHistory();

    const [duty, setDuty] = useState<Partial<DutyProps>>({
        name: '',
        description: '',
        type: 'Other',
        specialInput: {},
        price: null,
        done: false,
        _id: ''
    });

    useEffect(() => {
        const fetchDuty = async () => {
            const dutyToEdit: any = await getDuty(taskId);
            setDuty(dutyToEdit);
        };
        
        fetchDuty();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const backToDashboard = () =>{
        history.push('/');
    };

    const handleChange = (userInput: ChangeEvent) => {
        const inputInfo = userInput.target as HTMLInputElement;

        switch(inputInfo.name) {
            case 'dutyName':
                setDuty({ ...duty, name: inputInfo.value });
                break;
            case 'dutyDesc':
                setDuty({ ...duty, description: inputInfo.value });
                break;
            case 'dutyType':
                const clearSpecialInput = { ...duty, specialInput: {} };
                setDuty({ ...clearSpecialInput, type: inputInfo.value });
                break;
            case 'dutyPrice':
                setDuty({ ...duty, price: +inputInfo.value });
                break;
            case 'foodCarbs':
                setDuty({ ...duty, specialInput: { ...duty.specialInput, fooCarbs: +inputInfo.value } });
                break;
            case 'foodFat':
                setDuty({ ...duty, specialInput: { ...duty.specialInput, foodFat: +inputInfo.value } });
                break;
            case 'foodProtein':
                setDuty({ ...duty, specialInput: { ...duty.specialInput, foodProtein: +inputInfo.value } });
                break;
            case 'workDeadline':
                setDuty({ ...duty, specialInput: { ...duty.specialInput, workDeadline: inputInfo.value } });
                break;
            default:
                return;
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if(!emptyFields(duty.name!.toString())){
            return false;
        };

        switch(duty.type) {
            case 'Food':
                const validFoodTypes = foodTypeValidation(duty.specialInput!);
                if(validFoodTypes) {
                    await editDuty(duty, backToDashboard);
                }
                break;
            case 'Work':
                const validDeadline = workTypeValidation(duty.specialInput!);
                if(validDeadline) {
                    await editDuty(duty, backToDashboard);
                }
                break;
            default:
                await editDuty(duty, backToDashboard);
        }
    };

    const renderTypeOptions = () => {
        let options = '';

        switch(duty.type) {
            case 'Other':
                options = ` <option value="Other">Other</option>
                            <option value="Food">Food</option>
                            <option value="Work">Work</option>
                            `;
                break;
            case 'Food':
                options = ` <option value="Food">Food</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                            `;
                break;
            default: 
                options = ` <option value="Work">Work</option>
                            <option value="Food">Food</option>
                            <option value="Other">Other</option>
                            `;
        }

        return options;
    }

    return (
        <form className="form__create" onSubmit={handleSubmit}>
            <span className="exit__btn" onClick={backToDashboard}>{'\u2716'}</span>
            <h1 className="edit__header">Edit this duty</h1>
            <label>
                Name

                <input type="text" name="dutyName" onChange={handleChange} value={ String(duty.name) } />
            </label>

            <label>
                Description (optional)
                <input type="text" name="dutyDesc" onChange={handleChange} value={ String(duty.description) } />
            </label>

            <label>
                Type
                <select name="dutyType" onChange={handleChange} dangerouslySetInnerHTML={{__html: renderTypeOptions() }}>
                </select>
            </label>

            {
                duty.type === 'Food' && 
                    <fieldset>
                        <label>Carbs
                            <input type="number" className="foodCarbs" name="foodCarbs" placeholder="Grams" value={ String(duty.specialInput?.fooCarbs) } onChange={handleChange} />
                        </label>

                        <label>Fat
                            <input type="number" className="foodFat" name="foodFat" placeholder="Grams" value={ String(duty.specialInput?.foodFat) } onChange={handleChange} />
                        </label>

                        <label>Protein
                            <input type="number" className="foodProtein" name="foodProtein" placeholder="Grams" value={ String(duty.specialInput?.foodProtein) } onChange={handleChange} />
                        </label>
                    </fieldset>
            }

            {
                duty.type === 'Work' && 
                    <fieldset>
                        <label>Deadline
                            <input type="date" className="workDeadline" name="workDeadline" value={ String(duty.specialInput?.workDeadline) } onChange={handleChange} />
                        </label>
                    </fieldset>
            }

            <label>
                Price (optional)
                <input type="number" name="dutyPrice" placeholder="Value in SEK" value={ String(duty.price) } onChange={handleChange} />
            </label>
            <div className="submit__btn__container">
            <button className="submit__btn"><i className="fa fa-send"></i></button>
            </div>
        </form>
    )
};

export default EditDuty;