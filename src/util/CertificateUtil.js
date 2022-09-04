/**
 * This function validate certificate object and 
 * build array with error messages if any errors are. 
 * If there are no errors the function returns empty array.
 * 
 * @param {object} certificate 
 * @returns {Array} error messages
 */
export const validateCertificate = (certificate) => {
    let errors = [];

    if (certificate.id) {
        if (certificate.name && isNameNotValid(certificate.name)) {
            errors.push("The title should be from 6 to 30 characters.");
        }
        if (certificate.description && isDescriptionNotValid(certificate.description)) {
            errors.push("The description should be from 12 to 1000 characters");
        }
        if (certificate.duration && isDurationNotValid(certificate.duration)) {
            errors.push("The duration must be positive.");
        }
        if (certificate.price && isPriceNotValid(certificate.price)) {
            errors.push("The price must be more than 0");
        }
        if (certificate.tags && isTagsNotValid(certificate.tags)) {
            errors.push("Tags should be from 3 to 15 caracters and the certificate should contain at least one tag.")
        }
        if (Object.keys(certificate).length <= 1) {
            errors.push("Nothing was changed.");
        }
    } else {
        if (!certificate.name || isNameNotValid(certificate.name)) {
            errors.push("The title should be from 6 to 30 characters.");
        }
        if (!certificate.description || isDescriptionNotValid(certificate.description)) {
            errors.push("The description should be from 12 to 1000 characters");
        }
        if (!certificate.duration || isDurationNotValid(certificate.duration)) {
            errors.push("The duration must be positive.");
        }
        if (!certificate.price || isPriceNotValid(certificate.price)) {
            errors.push("The price must be more than 0");
        }
        if (!certificate.tags || isTagsNotValid(certificate.tags)) {
            errors.push("Tags should be from 3 to 15 caracters and the certificate should contain at least one tag.")
        }
    }

    return errors;

    function isNameNotValid(name) {
        return name.length < 6 || name.length > 30;
    }

    function isDescriptionNotValid(description) {
        return description.length < 12 || description.length > 1000;
    }

    function isDurationNotValid(duration) {
        return duration < 0;
    }

    function isPriceNotValid(price) {
        return price <= 0;
    }

    function isTagsNotValid(tags) {
        return tags.length === 0 || tags.some(t => (t.name.length < 3 || t.name.length > 15));
    }
}

/**
 * This function create from a tag array a string with tags that separated commas.
 * 
 * @param {Array} tags 
 * @returns {string} string with tags
 */
export const createTagsString = (tags) => {
    const commadelimeter = ", ";
    let tagsString = tags.map((t) => t.name).join(commadelimeter);

    return tagsString;
}

/**
 * This function returns a string variant depending on the provided parameters.
 * 
 * @param {boolean} editable 
 * @param {number} certificateId 
 * @returns {string} title
 */
export const getTitle = (editable, certificateId) => {
    return certificateId > 0
        ? (editable ? "Edit certificate with ID=" + certificateId : "View certificate")
        : "Add new certificate";
}

/**
 * This function parses entered string in the search field by a user 
 * and return a string with search parameters.
 * 
 * @param {string} string 
 * @returns string
 */
export const parseSearchString = (string) => {
    let searchParams = "";
    let tags = [];
    let text = "";
    let params = string.split("#");

    params.forEach((p) => {
        if (p.includes("(")) {
            let openBracketIndex = p.indexOf("(");
            let cloceBracketIndex = p.indexOf(")");
            let tag = cloceBracketIndex > 0 ? p.slice(openBracketIndex + 1, cloceBracketIndex) : p.slice(openBracketIndex + 1);
            tags.push(tag);
        } else {
            text = p.trim();
        }
    });

    if (tags.length && text) {
        searchParams = "tags=" + tags.join(", ") + "&partOfWord=" + text;
    } else {
        searchParams = tags.length ? "tags=" + tags.join(", ") : text ? "partOfWord=" + text : "";
    }

    return searchParams;
}

/**
 * This function builds a string with sorting parameters from an object 
 * that includes properties with sorting parameters.
 * 
 * @param {Object} object with sorting parameters 
 * @returns {string}
 */
export const buildSortParamsStr = (sortParamObj) => {
    let sortParamsStr = Object.keys(sortParamObj)
        .map((key) => {
            return (sortParamObj[key] ? key + " " + sortParamObj[key] : "")
        }).filter(el => Boolean(el))
        .join(", ");

    return sortParamsStr ? "sortParams=" + sortParamsStr : sortParamsStr;
}

/**
 * This function extracts a token from the localStorage.
 * 
 * @returns token
 */
export const getBearerToken = () => {
    return "Bearer " + localStorage.token;
}

/**
 * This function build a parametered request according to provided parameters.
 * @param {string} url 
 * @param {number} page 
 * @param {number} limit 
 * @param {Array} searchAndSortParams 
 * @returns parametered request
 */
export const buildUrlRequest = (url, page, limit, ...searchAndSortParams) => {
    let resultUrl = url + "?page=" + page + "&limit=" + limit;

    return searchAndSortParams.length ? resultUrl + "&" + searchAndSortParams.filter(p => Boolean(p)).join("&") : resultUrl;
}

/**
 * This function build a number array that includes number items.
 * 
 * @param {number} number 
 * @returns number array
 */
export const returnPageList = (number) => {
    let pages = [];

    for (let i = 1; i <= number; i++) {
        pages.push(i);
    }

    return pages;
}

/**
 * This function validates login and password and return error message array.
 * If there are no any errors the enpty array will be returned.
 * 
 * @param {string} login 
 * @param {string} password 
 * @returns {Array} error message array
 */
export const validateLoginParams = (login, password) => {
    let newErrors = [];

    if (isLoginNotValid(login)) {
        console.log("Login is not valid.");
        newErrors.push("The login must contain from 3 to 30 characters.");
    }
    if (isPasswordNotValid(password)) {
        console.log("Password is not valid.");
        newErrors.push("The password must contain from 4 to 30 characters.");
    }

    return newErrors;

    function isLoginNotValid(login) {
        return login.length < 3 || login.length > 30;
    }

    function isPasswordNotValid(password) {
        return password.length < 4 || password.length > 30;
    }
}

/**
 * This function encodes an object with data to a request.
 * 
 * @param {Object} requestData 
 * @returns {string} Encodered string
 */
export const encodeRequestData = (requestData) => {
    return Object.keys(requestData).map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(requestData[key])
    }).join("&");
}

/**
 * This function extracts a username from response data.
 * 
 * @param {string} responseData 
 * @returns {string} username
 */
export const getUserNameFromResponseData = (responseData) => {
    let paramArr = responseData.split("&");
    let username = "";
    paramArr.forEach(p => {
        if (p.startsWith("username=")) {
            username = p.slice(p.indexOf("=") + 1).replace("%40", "@");
        }
    })
    return username;
}

/**
 * This function transforms date to date string with format "yyyy-MM-dd HH:mm"
 * 
 * @param {Date} dateString 
 * @returns {String} dateString
 */
export const transformData = (dateString) => {
    let date = new Date(dateString);

    return date.getFullYear() + "-" +
        parseMonth(date.getMonth()) + "-" +
        date.getDate() + " " +
        date.getHours() + ":" +
        date.getMinutes();

    function parseMonth(monthNumber) {
        return monthNumber < 9 ? "0" + (monthNumber + 1) : String(monthNumber + 1);
    }
}

/**
 * This function processes a error object and 
 * adds an error message depending on its type.
 * 
 * @param {Object} error 
 * @param {Array} errors 
 * @param {string} errorMessage 
 * @returns {Array} error messages
 */
export const processError = (error, errors, errorMessage) => {
    let newErrors = errors.slice();
    if (error.response) {
        let errorText = error.response.data.errorMessage;
        newErrors.push(error.response.status < 500 ?  errorText ? errorText : "You are not authorized.": errorMessage);
    } else if (error.request) {
        newErrors.push("Server connection is failed.");
    } else {
        newErrors.push("Client error. Something went wrong.")
    }

    return newErrors;
}

/**
 * Cleaning of the personal data in the localStorage.
 */
export const cleanPersonalData = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
} 