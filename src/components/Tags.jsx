import "../style/Tags.css";
import { IoMdClose } from "react-icons/io";
import { Col, Input } from 'reactstrap';

export const Tags = (props) => {
    /*Processes the events referenced with deleting of the tag.*/
    function deleteTagHandler(tagName) {
        let tagArr = props.tags.slice().filter(t => t.name !== tagName);

        props.onClick(tagArr);
    }

    /*Processes the events referenced with adding of the tag.*/
    function addTagHandler() {
        const tagElem = document.querySelector("#tagName");
        let newTag = { name: tagElem.value };
        let tagArr = tagElem.value.trim() && !props.tags.some(t => t.name === newTag.name) ? [newTag, ...props.tags] : props.tags;

        props.onClick(tagArr);
    }

    return (
        <Col sm={10}>
            {props.editable ?
                <section className="tag-input">
                    <Input type="text" name="tagName" id="tagName" />
                    <button type="button" onClick={() => addTagHandler()}>Add</button>
                </section>
                : null}
            <section className="tags">
                {
                    props.tags.map((t, index) => {
                        let tagName = t.name;
                        return (
                            <section className="tag" key={index}>
                                <span>{tagName.length <= 10 ? tagName : tagName.slice(0, 11) + "..."}</span>
                                {props.editable ?
                                    <span onClick={() => deleteTagHandler(tagName)}>
                                        <IoMdClose />
                                    </span>
                                    : null}
                            </section>
                        )
                    })
                }
            </section>
        </Col>
    )
}