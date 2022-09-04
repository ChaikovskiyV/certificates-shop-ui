import "../style/Header.css"
import { Link } from "react-router-dom";
import { cleanPersonalData } from "../util/CertificateUtil.js";


export const Header = (props) => {
    /*Deletes user's data from the localStorage*/
    function removeUserDataHandel() {
        cleanPersonalData();
    }

    return (
        localStorage.username && !props.loginPage
            ? <header>
                <span>{localStorage.userRole ? localStorage.userRole : "Guest"} UI</span>
                {localStorage.userRole === "ADMIN" ? <button type="button" className="addNew" onClick={() => props.onClick()}>Add new</button> : null}
                <section className="userLogin">
                    <span>{localStorage.username ? localStorage.username : "Guest"}</span>
                </section>
                <div className="logout">
                    <Link to={"/login"} onClick={() => removeUserDataHandel()}>
                        Logout
                    </Link>
                </div>
            </header>
            : <header>
                <span>{localStorage.userRole ? localStorage.userRole : "Guest"} UI</span>
            </header>
    )
}