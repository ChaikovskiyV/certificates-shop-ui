import "../style/PaginationBlock.css";
import { returnPageList } from "../util/CertificateUtil.js";
import { useState } from "react";
import { Pagination, PaginationItem, PaginationLink, } from "reactstrap";

export const PaginationBlock = (props) => {
    const visiblePagesNumber = 10;

    const [currentPage, setCurrentPage] = useState(sessionStorage.currentPage);
    const [itemsLimit, setItemsLimit] = useState(10);
    const [startPage, setStartPage] = useState(1);

    const colors = new Array(props.totalPages).fill("");
    colors[currentPage - 1] = "blue";
    const [backgroundColor, setBackgroundColor] = useState(colors);

    /*Calls the perent's function to load data.*/
    function loadContent(currentPage, itemsLimit) {
        props.onClick(currentPage, itemsLimit);
        setHighlighting(currentPage);
    }

    /*Changes the backgrond color property.*/
    function setHighlighting(pageNumber) {
        const colors = backgroundColor.slice();
        for (let i = 0; i < props.totalPages; i++) {
            colors[i] = i === pageNumber - 1 ? "blue" : "";
        }

        setBackgroundColor(colors);
    }

    /*Processes the events referenced with changes of the select value.*/
    function changeLimitHandler(event) {
        let currentLimit = event.target.value;
        setItemsLimit(+currentLimit);

        if (currentLimit !== itemsLimit) {
            loadContent(currentPage, currentLimit);
        }
    }

    /*Processes the events referenced with clicking on a page button.*/
    function goToPageNumberHandler(pageNumber) {
        setCurrentPage(pageNumber);

        if (pageNumber !== currentPage) {
            loadContent(pageNumber, itemsLimit);
        }
    }

    /*Processes the events referenced with clicking on the 'go to next page' button.*/
    function goToNextHandler() {
        let newCurrentPage = currentPage < props.totalPages ? currentPage + 1 : currentPage;
        console.log("current page=" + newCurrentPage);
        let newStartPage = (newCurrentPage >= startPage + visiblePagesNumber && props.totalPages - visiblePagesNumber >= startPage) ? startPage + 1 : startPage;
        console.log("start page=" + newStartPage);

        setStartPage(newStartPage);
        setCurrentPage(newCurrentPage);

        if (newCurrentPage !== currentPage) {
            loadContent(newCurrentPage, itemsLimit);
        }
    }

    /*Processes the events referenced with clicking on the 'go to previous page' button.*/
    function goToPreviousHandler() {
        let newCurrentPage = currentPage > 1 ? currentPage - 1 : currentPage;
        console.log("current page=" + newCurrentPage);
        let newStartPage = currentPage <= startPage && startPage > 1 ? startPage - 1 : startPage;
        console.log("start page=" + newStartPage);

        setStartPage(newStartPage);
        setCurrentPage(newCurrentPage);

        if (newCurrentPage !== currentPage) {
            loadContent(newCurrentPage, itemsLimit);
        }
    }

    /*Processes the events referenced with clicking on the 'go to the first page' button.*/
    function goToFirstHandler() {
        setCurrentPage(1);
        setStartPage(1);

        if (currentPage !== 1) {
            loadContent(1, itemsLimit);
        }
    }

    /*Processes the events referenced with clicking on the 'go to the last page' button.*/
    function goToLastHandler() {
        let newStartPage = props.totalPages > visiblePagesNumber ? props.totalPages - visiblePagesNumber : 1;

        setCurrentPage(props.totalPages);
        setStartPage(newStartPage + 1);

        if (currentPage !== props.totalPages) {
            loadContent(props.totalPages, itemsLimit);
        }
    }

    const VisibleBlock = () => {
        let visible;
        if (props.totalPages <= visiblePagesNumber) {
            visible = returnPageList(props.totalPages);
        } else {
            visible = returnPageList(props.totalPages).slice(startPage - 1, startPage + (visiblePagesNumber - 1));
        }
        return (
            <Pagination className="numbered-buttons">
                {
                    visible.map((p, index) => {
                        return (
                            <PaginationItem key={index} onClick={() => goToPageNumberHandler(p)}>
                                <PaginationLink style={{ backgroundColor: backgroundColor[p - 1] }}>
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })
                }
            </Pagination>
        )
    }

    return (
        <section className="pagination-block">
            <section className="page-buttons">
                <Pagination size="">
                    <PaginationItem disabled onClick={() => goToFirstHandler()}>
                        <PaginationLink
                            first
                        />
                    </PaginationItem>
                    <PaginationItem disabled onClick={() => goToPreviousHandler()}>
                        <PaginationLink
                            previous
                        />
                    </PaginationItem>
                    <VisibleBlock />
                    <PaginationItem disabled onClick={() => goToNextHandler()}>
                        <PaginationLink
                            next
                        />
                    </PaginationItem>
                    <PaginationItem disabled onClick={() => goToLastHandler()}>
                        <PaginationLink
                            last
                        />
                    </PaginationItem>
                </Pagination>
            </section>
            <select id="items-limit" defaultValue={10} onChange={(event) => changeLimitHandler(event)}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
        </section>
    )
}