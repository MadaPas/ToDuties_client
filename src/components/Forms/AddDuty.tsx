import { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { formPath } from '../../service/api';
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
    price: String,
    done: boolean
}

const CreateDuty = () => {
    const [duty, setDuty] = useState<Partial<DutyProps>>({
        name: '',
        description: '',
        type: 'Other',
        specialInput: {},
        price: '',
        done: false
    });

    const history = useHistory();
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
                setDuty({ ...duty, price: inputInfo.value });
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
                    await formPath(duty, backToDashboard);
                }
                break;
            case 'Work':
                const validDeadline = workTypeValidation(duty.specialInput!);
                if(validDeadline) {
                    await formPath(duty, backToDashboard);
                }
                break;
            default:
                await formPath(duty, backToDashboard);
        }
    };

    return (
        <form className="form__create" onSubmit={handleSubmit}>
            <span className="exit__btn" onClick={backToDashboard}>{'\u2716'}</span>
            <h1 className="edit__header">Create a new duty</h1>
            <label>
                Name
                <input type="text" name="dutyName" onChange={handleChange} />
            </label>

            <label>
                Description (optional)
                <input type="text" name="dutyDesc" onChange={handleChange} />
            </label>

            <label>
                Type
                <select name="dutyType" defaultValue="Other" onChange={handleChange}>
                    <option value="Other">Other</option>
                    <option value="Food">Food</option>
                    <option value="Work">Work</option>
                </select>
            </label>

            {
                duty.type === 'Food' && 
                    <fieldset>
                        <label>Carbs
                            <input type="number" className="foodCarbs" name="foodCarbs" placeholder="Grams" onChange={handleChange} />
                        </label>

                        <label>Fat
                            <input type="number" className="foodFat" name="foodFat" placeholder="Grams" onChange={handleChange} />
                        </label>

                        <label>Protein
                            <input type="number" className="foodProtein" name="foodProtein" placeholder="Grams" onChange={handleChange} />
                        </label>
                    </fieldset>
            }

            {
                duty.type === 'Work' && 
                    <fieldset>
                        <label>Deadline
                            <input type="date" className="workDeadline" name="workDeadline" onChange={handleChange} />
                        </label>
                    </fieldset>
            }

            <label>
                Price (optional)
                <input type="number" name="dutyPrice" placeholder="Value in SEK" onChange={handleChange} />
            </label>

            <div className="submit__btn__container">
            <button className="submit__btn"><i className="fa fa-send"></i></button>
            </div>        </form>
    )
};

export default CreateDuty;