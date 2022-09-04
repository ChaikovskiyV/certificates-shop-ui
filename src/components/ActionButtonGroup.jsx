import "../style/ActionButtonGroup.css"

export const ActionButtonGroup = (props) => {
    return (
        <section className="button-group">
            <button className="view-button" onClick={() => props.onClick("view")}>View</button>
            {localStorage.userRole === "ADMIN" ? <button className="edit-button" onClick={() => props.onClick("edit")}>Edit</button> : null}
            {localStorage.userRole === "ADMIN" ? <button className="delete-button" onClick={() => props.onClick("delete")}>Delete</button> : null}
        </section>
    )
}