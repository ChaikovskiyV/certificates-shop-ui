import "../style/Certificate.css";
import { validateCertificate, getTitle } from "../util/CertificateUtil.js";
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useState } from "react";
import { Tags } from "./Tags.jsx";
import { ErrorField } from "./ErrorField.jsx";


export const Certificate = (props) => {
    const [tags, setTags] = useState();
    const [certificateData, setCertificateData] = useState();
    const [errorMessages, setErrorMessages] = useState([]);

    /*Processes the events referenced with changes of inputs value.*/
    function changePropertyHandler(event, propertyName) {
        let certificate = certificateData ? { ...certificateData } : {};
        certificate[propertyName] = event.target.value;

        setCertificateData(certificate);
    }

    /*Processes the events referenced with clicking on the 'save' button.*/
    function saveCertificateHandler() {
        let newCertificate = certificateData ? { id: props.certificate.id, ...certificateData } : { id: props.certificate.id };

        if (tags) {
            newCertificate.tags = tags;
        }

        let errors = validateCertificate(newCertificate);
        setErrorMessages(errors);

        if (errors.length === 0) {
            props.onClick("save", newCertificate);
        }
    }

    /*Processes the events referenced with clicking on the 'cancel' button.*/
    function cancelHandler() {
        hideErrorHandler();
        setTags(null);
        props.onClick("cancel");
    }

    /*Processes the events referenced with tags changes.*/
    function changeTagsHandler(newTags) {
        setTags(newTags);
    }

    /*Processes the events referenced with closing of the error messages aria.*/
    function hideErrorHandler() {
        setErrorMessages([]);
    }

    return (
        <div key={props.certificate.id}>
            <div className="add-new-container">
                <h1>{getTitle(props.editable, props.certificate.id)}</h1>
                <Form className="add-new-form" name="certificateForm">
                    <FormGroup row>
                        <Label for="certificateTitle" sm={2}>Title</Label>
                        <Col sm={10}>
                            {props.editable
                                ? <Input type="text" name="title" id="certificateTitle"
                                    defaultValue={certificateData ? certificateData.name : props.certificate.name}
                                    onChange={(event) => changePropertyHandler(event, "name")} />
                                : <Input type="text" name="title" id="certificateTitle" value={props.certificate.name} readOnly />}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="description" sm={2}>Description</Label>
                        <Col sm={10}>
                            {props.editable
                                ? <Input type="textarea" name="description" id="description"
                                    defaultValue={certificateData ? certificateData.description : props.certificate.description}
                                    onChange={(event) => changePropertyHandler(event, "description")} />
                                : <Input type="textarea" name="description" id="description" value={props.certificate.description} readOnly />}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="duration" sm={2}>Duration</Label>
                        <Col sm={10}>
                            {props.editable
                                ? <Input type="number" name="duration" id="duration" min="0"
                                    defaultValue={certificateData ? certificateData.duration : props.certificate.duration}
                                    onChange={(event) => changePropertyHandler(event, "duration")} />
                                : <Input type="number" name="duration" id="duration" min="0" value={props.certificate.duration} readOnly />}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="price" sm={2}>Price</Label>
                        <Col sm={10}>
                            {props.editable
                                ? <Input type="number" name="price" id="price" min="1" step="0.01"
                                    defaultValue={certificateData ? certificateData.price : props.certificate.price}
                                    onChange={(event) => changePropertyHandler(event, "price")} />
                                : <Input type="number" name="price" id="price" min="1" step="0.01" value={props.certificate.price} readOnly />}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="tags" sm={2}>Tags</Label>
                        <Tags tags={tags ? tags : props.certificate.tags} onClick={(tags) => changeTagsHandler(tags)} editable={props.editable} />
                    </FormGroup>
                    <FormGroup check row >
                        <Col sm={10} className="certificate-button-group">
                            {props.editable ? <Button type="button" onClick={() => saveCertificateHandler()}>Save</Button> : null}
                            <Button type="button" onClick={() => cancelHandler()}>Cancel</Button>
                        </Col>
                    </FormGroup>
                </Form>
                {errorMessages.length > 0 ? <ErrorField errorMessages={errorMessages} onClick={() => hideErrorHandler()} className="certificate-error" /> : null}
            </div>
        </div>
    )
}