import "../style/CertificateData.css";
import { createTagsString, transformData } from "../util/CertificateUtil.js";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { Table } from "reactstrap";
import { ActionButtonGroup } from "./ActionButtonGroup.jsx";

export const CertificateData = (props) => {
    return (
        <section className="certificates-data">
            <Table bordered hover>
                <thead>
                    <tr>
                        <th className="width-150">{props.sorting.createDate === "desc"
                            ? <FaSortUp onClick={() => props.onSort("createDate", "asc")} />
                            : <FaSortDown onClick={() => props.onSort("createDate", "desc")} />}
                            DateTime</th>
                        <th className="width-150">{props.sorting.name === "desc"
                            ? <FaSortUp onClick={() => props.onSort("name", "asc")} />
                            : <FaSortDown onClick={() => props.onSort("name", "desc")} />}
                            Title</th>
                        <th className="width-150">Tags</th>
                        <th>Description</th>
                        <th className="width-80">Price</th>
                        <th className="width-250">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {props.certificatesData.map((c, index) => {
                        return (
                            <tr className="data-row" key={index}>
                                <td>{transformData(c.createDate)}</td>
                                <td>{c.name}</td>
                                <td>{createTagsString(c.tags)}</td>
                                <td className="description-data">{c.description}</td>
                                <td>{c.price}</td>
                                <td><ActionButtonGroup onClick={(actionType) => props.onClick(c.id, actionType)} /></td>
                            </tr>
                        )
                    })
                    }
                </tbody>
            </Table>
        </section>
    )
}