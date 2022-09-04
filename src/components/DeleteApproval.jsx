import "../style/DeleteApproval.css"

export const DeleteApproval = (props) => {
    return (
        <div>
            <div className="approval-container">
                <h1>Delete confirmation</h1>
                <p>Do you really want to delete the certificate with id={props.certificateId}?</p>
                <section className="approval-buttons">
                    <button type="button" className="yes-button" onClick={() => props.onClick("delete", props.certificateId)}>Yes</button>
                    <button type="button" className="cancel-button" onClick={() => props.onClick("cancel")}>Cancel</button>
                </section>
            </div>
        </div>
    )
}