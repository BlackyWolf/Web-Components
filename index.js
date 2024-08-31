import { LinkElement, RouterElement } from "./components/index.js";

export const defaultComponentNames = {
    link: "link",
    router: "router",
};

export function initializeComponents(
    namespace = "app",
    { link, router } = defaultComponentNames
) {
    customElements.define(`${namespace}-${link}`, LinkElement);
    customElements.define(`${namespace}-${router}`, RouterElement);
}
