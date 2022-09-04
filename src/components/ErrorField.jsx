import { IoMdCloseCircle, IoMdClose } from "react-icons/io";
import "../style/ErrorField.css";

export const ErrorField = (props) => {
    return (
        <section className="error-field">
            <span>
                <IoMdCloseCircle />
            </span>
            <section>
                {props.errorMessages.map((eM, index) => {
                    return (
                        <li key={index}>{eM}</li>
                    )
                })}
            </section>
            <span className="close-error" onClick={() => props.onClick()}>
                <IoMdClose />
            </span>
        </section>
    )
}