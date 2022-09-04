import "../style/Main.css";
import { useNavigate } from "react-router-dom";
import { cleanPersonalData } from "../util/CertificateUtil.js";

export const Main = () => {
    let navigate = useNavigate();

    function goToLogInHandler() {
        cleanPersonalData();
        navigate("/login");
    }

    return (
        <button className="log-in-button" type="button" onClick={() => goToLogInHandler()}>Log in</button>
    )
}