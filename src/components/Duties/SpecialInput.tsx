import { FunctionComponent } from "react";

type SpecialInputProp = {
    inputs: {
        fooCarbs?: Number,
        foodFat?: Number,
        foodProtein?: Number,
        workDeadline?: string
    }
}

const SpecialInput: FunctionComponent<SpecialInputProp> = ({ inputs }) => {
    let toRender = '';

    const renderInputs = () => {
        for(let element in inputs) {
            switch(element) {
                case 'workDeadline':
                    toRender = toRender + `
                        <div className="special-input">
                            <span className="special-input-title">Deadline: </span>
                            ${inputs[element]}
                        </div>
                    `;
                    break;
                case 'fooCarbs':
                    toRender = toRender + `
                        <div className="special-input">
                            <span className="special-input-title">Carbs: </span>
                            ${inputs[element] + '  gr'}
                        </div> 
                    `;
                    break;
                case 'foodFat':
                    toRender = toRender + `
                        <div className="special-input">
                            <span className="special-input-title">Fat: </span>
                            ${inputs[element] + '  gr'}
                        </div>
                    `;
                    break;
                case 'foodProtein':
                    toRender = toRender + `
                        <div className="special-input">
                            <span className="special-input-title">Protein: </span>
                            ${inputs[element] + '  gr'}
                        </div>
                    `;
                    break;
                default:
                    return toRender;
            }
        }
    };

    renderInputs();

    return <div className="duty__special" dangerouslySetInnerHTML={{__html: toRender }} />
}

export default SpecialInput;