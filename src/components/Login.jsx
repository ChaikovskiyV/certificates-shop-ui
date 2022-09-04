import "../style/Login.css";
import { validateLoginParams, encodeRequestData, getUserNameFromResponseData, getBearerToken, processError } from "../util/CertificateUtil.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Footer } from "./Footer.jsx";
import { Header } from "./Header.jsx";

export const Login = () => {
    const tokenUrlReq = "http://localhost:8081/labproject/oauth/token";
    const usersUrlReq = "http://localhost:8081/labproject/api/v1/users";

    const [errors, setErrors] = useState([]);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    let navigate = useNavigate();

    /*Sends a login request.*/
    function sendLoginRequestHandler() {
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic dHV0b3JpYWxzcG9pbnQ6bXktc2VjcmV0LWtleQ=="
        }

        let errors = validateLoginParams(login, password);
        setErrors(errors);

        if (errors.length === 0) {
            let authData = {
                username: login,
                password: password,
                grant_type: "password"
            }
            axios({
                url: tokenUrlReq,
                method: "post",
                withCredentials: true,
                crossdomain: true,
                data: encodeRequestData(authData),
                headers: headers
            }).then(response => {
                console.log(response);
                localStorage.username = getUserNameFromResponseData(response.config.data);
                localStorage.token = response.data.access_token;
                localStorage.refreshToken = response.data.refresh_token;
                sendUserGetRequest(localStorage.username);
                navigate("/certificates");
            }).catch(err => {
                let newErrors = processError(err, errors, "Loging or password is not correct.");
                setErrors(newErrors);
            });
        }
    }

    /*Sends a request to get user's data.*/
    function sendUserGetRequest(username) {
        let userUrlReq = usersUrlReq + "?email=" + username;
        axios.get(userUrlReq, {
            withCredentials: true,
            crossdomain: true,
            headers: { "Authorization": getBearerToken() }
        }).then(response => {
            console.log(response);
            let user = response.data.content[0];
            localStorage.userRole = user.userRole;
        }).catch(err => {
            let newErrors = processError(err, errors, "User with login=" + username + " is not found.");
            setErrors(newErrors);
        });
    }

    /*Deletes errors messages.*/
    function cleanError() {
        setErrors([]);
    }

    /*Processes the events referenced with changes of inputs value.*/
    function changeValueHandler(event, parameterName) {
        switch (parameterName) {
            case "login": setLogin(event.target.value);
                break;
            default: setPassword(event.target.value);
        }
        cleanError();
    }

    return (
        <div>
            <Header loginPage />
            <div className="login-container">
                <h1>Login</h1>
                <form className="login-form">
                    <input name="login" id="login" type={"text"} placeholder="Username" onChange={(event) => changeValueHandler(event, "login")} />
                    <input name="password" id="password" type={"password"} placeholder="Password" onChange={(event) => changeValueHandler(event, "password")} />
                    <div className="error-message">
                        {
                            errors.map((err, index) => {
                                return (
                                    <li key={index}>{err}</li>
                                )
                            })
                        }
                    </div>
                    <button type="button" onClick={() => sendLoginRequestHandler()}>Login</button>
                </form>
            </div>
            <Footer />
        </div>
    )
}