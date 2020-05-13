export default class NavMenu extends HTMLElement {
    constructor() {
        super()
        this.toggleBurger = this.toggleBurger.bind(this)
        this.items = [].slice.call(this.children)
        this.innerHTML = ''
        this.createElements()
        this.items = this.setItems()
        this.appendElements()
    }

    connectedCallback() {
        this.burger.addEventListener('click', this.toggleBurger)
    }

    disconnectedCallback() {
        this.burger.addEventListener('click', this.toggleBurger)
    }

    toggleBurger () {
        this.burger.classList.toggle('nav-menu__burger-active')
        this.span.classList.toggle('nav-menu__span-active')
        this.container.classList.toggle('nav-menu__container-active')
    }

    /**
     * Refactor the DOM
     */
    createElements () {
        this.container = this.createElementWithClass('ul', 'nav-menu__container')
        this.list = this.createElementWithClass('ul', 'nav-menu__list')
        this.burger = this.createElementWithClass('button', 'nav-menu__burger')
        this.span = this.createElementWithClass('span', 'nav-menu__burger-span')
    }

    /**
     * Append all elements to the DOM
     */
    appendElements () {
        this.appendChild(this.container)
        this.container.appendChild(this.list)
        this.appendChild(this.burger)
        this.burger.appendChild(this.span)
    }

    setItems () {
        return this.items.map(item => {
            let elem = this.createElementWithClass('li', 'nav-menu__item')
            elem.appendChild(item)
            elem.addEventListener('click', this.toggleBurger)
            this.list.appendChild(elem)
            return elem
        })
    }

    /**
     * @param {string} tagName
     * @param {string} className
     * @return {HTMLElement} elem
     */
    createElementWithClass(tagName, className) {
        let elem = document.createElement(tagName)
        elem.setAttribute('class', className)
        return elem
    }
}

if (window.autoDefineComponent !== undefined) {
    customElements.define('nav-menu', NavMenu)
}