export class LinkElement extends HTMLElement {
    static observedAttributes = ["href"];

    constructor() {
        super();
    }

    async connectedCallback() {
        navigation.addEventListener("navigate", async (event) => {
            const url = new URL(event.destination.url);
            const pathname = url.pathname;

            if (this.href === pathname) {
                this.classList.add("active-link");
            } else {
                this.classList.remove("active-link");
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
