import "../style/Certificates.css";
import { getBearerToken, buildUrlRequest, buildSortParamsStr, processError } from "../util/CertificateUtil.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Footer } from "./Footer.jsx";
import { Header } from "./Header.jsx";
import { ErrorField } from "./ErrorField.jsx";
import { SearchField } from "./SearchField.jsx";
import { CertificateData } from "./CertificateData.jsx";
import { PaginationBlock } from "./PaginationBlock.jsx";
import { Certificate } from "./Certificate.jsx";
import { DeleteApproval } from "./DeleteApproval.jsx";

export const Certificates = () => {
    const url = "http://localhost:8081/labproject/api/v1/certificates";
    const emptyCertificate = {
        id: 0,
        name: "",
        description: "",
        duration: 0,
        price: 0,
        tags: []
    };

    let navigate = useNavigate();

    const [certificates, setCertificates] = useState([]);
    const [currentPage, setCurrentPage] = useState(sessionStorage.currentPage ? sessionStorage.currentPage : 1);
    const [currentLimit, setCurrentLimit] = useState(10);
    const [errorMessages, setErrorMessages] = useState([]);
    const [totalPages, setTotalPages] = useState(10);
    const [searchParam, setSearchParam] = useState("");
    const [currentCertificate, setCurrentCertificate] = useState(emptyCertificate);
    const [showDetais, setShowDetais] = useState(false);
    const [editable, setEditable] = useState(false);
    const [currentId, setCurrentId] = useState(0);
    const [sorting, setSorting] = useState({ name: "", createDate: "desc" });

    /*Loads a content after a certificates page is opened*/
    useEffect(() => {
        if (localStorage.username) {
            let urlRequest = buildUrlRequest(url, currentPage, currentLimit, searchParam, buildSortParamsStr(sorting));
            let promise = axios.get(urlRequest);
            promise.then((result) => {
                let certificates = result.data.content;
                let totalPages = result.data.totalPages;

                setCertificates(certificates);
                setTotalPages(totalPages);
            }).catch(error => {
                console.log(error);
                let errors = processError(error, errorMessages, "The request is not correct, please clarify provided data.");
                setErrorMessages(errors);
            });
        } else {
            navigate("/login");
        }
    }, [currentLimit, currentPage, errorMessages, navigate, searchParam, sorting]);

    /*Sends a request to load contend ecording to search and paganation parameters*/
    function sendGetRequest(page, limit, searchParam) {
        let urlRequest = buildUrlRequest(url, page, limit, searchParam, buildSortParamsStr(sorting));
        let promise = axios.get(urlRequest);
        promise.then((result) => {
            let certificates = result.data.content;
            let totalPages = result.data.totalPages;

            setCertificates(certificates);
            setTotalPages(totalPages);
        }).catch(error => {
            console.log(error);
            let errors = processError(error, errorMessages, "The request is not correct, please clarify provided data.");
            setErrorMessages(errors);
        });
    }

    /*Sends a request to delete a certificate*/
    function sendDeleteCertificateRequest(certificateId) {
        axios({
            url: [url, certificateId].join("/"),
            method: "delete",
            withCredentials: true,
            crossdomain: true,
            headers: { "Authorization": getBearerToken() }
        }).then(response => {
            sendGetRequest(currentPage, currentLimit, searchParam);
            alert("The certificate was successfully deleted.");

            console.log(response);
        }).catch(error => {
            console.log(error);
            let errors = processError(error, errorMessages, "The certificate is not found.");
            setErrorMessages(errors);
        });
    }

    /*Sends a request to save a certificate.*/
    function sendSaveCertificateRequest(certificate) {
        axios({
            url: url,
            method: "post",
            data: certificate,
            withCredentials: true,
            crossdomain: true,
            headers: { "Authorization": getBearerToken() }
        }).then(response => {
            sendGetRequest(currentPage, currentLimit, searchParam);
            alert("The certificate was successfully saved.");

            console.log(response);
        }).catch(error => {
            console.log(error);
            let errors = processError(error, errorMessages,
                "The certificate can't be saved, such a certificate exists.");
            setErrorMessages(errors);
        });
    }

    /*Sends a request to update a certificate.*/
    function sendEditCertificateRequest(certificate, certificateId) {
        axios({
            url: [url, certificateId].join("/"),
            method: "put",
            data: certificate,
            withCredentials: true,
            crossdomain: true,
            headers: { "Authorization": getBearerToken() }
        }).then(response => {
            sendGetRequest(currentPage, currentLimit, searchParam);
            alert("The certificate was successfully updated.");

            console.log(response);
        }).catch(error => {
            console.log(error);
            let errors = processError(error, errorMessages,
                "The certificate with id=" + certificateId + " is not updated, check provided data:" + certificate);
            setErrorMessages(errors);
        });
    }

    /*Updates the certificate*/
    function editCertificate(certificateId) {
        loadCerificate(certificateId);
        setShowDetais(true);
        setEditable(true);
    }

    /*Views a certificate*/
    function viewCertificate(certificateId) {
        loadCerificate(certificateId);
        setShowDetais(true);
        setEditable(false);
    }

    /*Sends a request to load a single certificate*/
    function loadCerificate(certificateId) {
        let promise = axios.get([url, certificateId].join("/"));
        promise.then((result) => {
            let certificate = result.data;

            setCurrentCertificate(certificate);
        }).catch(error => {
            console.log(error);
            processError(error, errorMessages, "The certificate with id=" + certificateId + " is not found");
        });
    }

    /*Processes events referenced with changing of the reseach parameters, a items limit or a page number.*/
    function loadContentHandler(page, limit, searchParams) {
        if (page !== currentPage || limit !== currentLimit || searchParams !== searchParam) {
            sessionStorage.currentPage = page;
            sendGetRequest(page, limit, searchParams);
        }

        setCurrentPage(page);
        setCurrentLimit(limit);
        setSearchParam(searchParams);
    }

    /*Processes the event referenced with closing of error massage*/
    function hideErrorHandler() {
        setErrorMessages([]);
    }

    /*Processes events referenced with clicking on the buttons 'delete', 'edit' and 'view'.*/
    function executeActionHandler(certificateId, actionType) {
        switch (actionType) {
            case "delete": setCurrentId(certificateId);
                break;
            case "edit": editCertificate(certificateId);
                break;
            default: viewCertificate(certificateId);
        }
    }

    /*Processses events referenced with clicking on the buttons 'yes' and 'cancel' when approvel is required.*/
    function approveDeletingHandler(actionType, certificateId) {
        if (actionType === "delete") {
            sendDeleteCertificateRequest(certificateId);
            setCurrentId(0);
        } else {
            setCurrentId(0);
        }
    }

    /*Processes the event referenced with clicking on the button 'add new'.*/
    function createNewCertificateHandler() {
        setCurrentCertificate(emptyCertificate);
        setShowDetais(true);
        setEditable(true);
    }

    /*Processes the event referenced with clicking on the buttons 'save' and 'cancel'.*/
    function processCertificateDataHandler(actionType, certificate) {
        setShowDetais(false);

        if (actionType === "cancel") {
            return;
        }
        if (!currentCertificate.id) {
            sendSaveCertificateRequest(certificate);
        } else {
            sendEditCertificateRequest(certificate, currentCertificate.id);
        }
    }
    /*Processes the event referenced with clicking on the sorting elements.*/
    function sortDataHandler(parameter, sortType) {
        let sortParams = { ...sorting };
        sortParams[parameter] = sortType;

        setSorting(sortParams);
        sendGetRequest(currentPage, currentLimit, searchParam);
    }

    return (
        <div>
            <Header onClick={() => createNewCertificateHandler()} />
            <article className="certificates-container">
                {errorMessages.length > 0 ? <ErrorField errorMessages={errorMessages} onClick={() => hideErrorHandler()} /> : null}
                {showDetais ? <Certificate certificate={currentCertificate} editable={editable} onClick={(actionType, certificate) => processCertificateDataHandler(actionType, certificate)} /> : null}
                {currentId ? <DeleteApproval certificateId={currentId} onClick={(actionType, certificateId) => approveDeletingHandler(actionType, certificateId)} /> : null}
                <SearchField onClick={(searchParams) => loadContentHandler(1, currentLimit, searchParams)} />
                <CertificateData certificatesData={certificates} onClick={(certificateId, actionType) => executeActionHandler(certificateId, actionType)} sorting={sorting} onSort={(parameter, sortType) => sortDataHandler(parameter, sortType)} />
                <PaginationBlock totalPages={totalPages ? totalPages : 1} onClick={(page, limit) => loadContentHandler(page, limit, searchParam)} />
            </article>
            <Footer />
        </div>
    )
}