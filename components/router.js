function fixInitialUrlRoute() {
    const path = location.pathname.endsWith(".html")
        ? location.pathname.slice(0, -5)
        : location.pathname;

    const pathParts = path.split("/").filter(Boolean);

    const routePath = pathParts[pathParts.length - 1] === "index"
        ? pathParts.length === 1
            ? "/"
            : pathParts.slice(0, -1).join("/")
        : pathParts.join("/");

    history.replaceState({}, "", routePath);
}

/**
 *
 * @param {string} pagesDirectory The directory to look for page templates.
 * @param {string} routePath The URL route used to find a page.
 */
async function getRoutePageHtml(pagesDirectory, routePath) {
    let pageFilePath = `/${pagesDirectory}`;

    if (routePath === "/") {
        pageFilePath += "/index";
    } else if (routePath.startsWith("/")) {
        pageFilePath += routePath;
    } else {
        pageFilePath += `/${routePath}`;
    }

    let response = await fetch(`${pageFilePath}.html`)

    let responseText = "";

    if (response.ok) {
        responseText = await response.text();
    } else {
        const indexedPageFilePath = pageFilePath.endsWith("/")
            ? pageFilePath + "index.html"
            : pageFilePath + "/index.html";

        response = await fetch(indexedPageFilePath);

        if (response.ok) {
            responseText = await response.text();
        }
    }

    if (responseText === "") {
        response = await fetch(`${pagesDirectory}/404.html`);

        if (response.ok) {
            responseText =  await response.text();
        } else {
            return `<h1>404 Not Found</h1><p>The page <code>${routePath}</code> could not be found.</p>`;
        }
    }

    const parser = new DOMParser();

    const templateHtml = parser.parseFromString(responseText, "text/html");

    const templateNode = templateHtml.querySelector("template");

    return templateNode.innerHTML;
}

export class RouterElement extends HTMLElement {
    static observedAttributes = ["pages", "link"];

    link = "app-link";
    pages = "pages";

    constructor() {
        super();

        fixInitialUrlRoute();
    }

    async connectedCallback() {
        this.innerHTML = await getRoutePageHtml(this.pages, location.pathname);

        document.addEventListener("click", async event => {
            event.preventDefault();

            if (event.target.tagName === "A" || event.target.tagName === this.link.toUpperCase()) {
                const routePath = event.target.pathname || event.target.href;

                const pageHtml = await getRoutePageHtml(this.pages, routePath);

                history.pushState({}, "", routePath);

                this.innerHTML = pageHtml;
            }
        });
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
}
