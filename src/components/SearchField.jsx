import { useState } from "react"
import "../style/SearchField.css"
import { parseSearchString } from "../util/CertificateUtil.js";

export const SearchField = (props) => {
    const [searchStr, setSearchStr] = useState("");

    /*Processes the events referenced with changes of the input value.*/
    function changeSearchStrHandler(event) {
        let newSearchStr = event.target.value;

        setSearchStr(newSearchStr);
    }

    return (
        <section className="search-field">
            <input id="search" type={"text"} placeholder="Search..." value={searchStr} onChange={(event) => changeSearchStrHandler(event)} />
            <button type="button" onClick={() => props.onClick(parseSearchString(searchStr))}>Go!</button>
        </section>
    )
}