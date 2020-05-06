export default class ScrollTop extends HTMLElement {
    constructor() {
        super()
        this.checkOffset()
        this.checkOffset = this.checkOffset.bind(this)
    }

    connectedCallback() {
        window.addEventListener('scroll', this.checkOffset)
        this.addEventListener('click', this.goToTheTop)
    }

    disconnectedCallback () {
        window.removeEventListener('scroll', this.checkOffset)
        this.removeEventListener('click', this.goToTheTop)
    }

    /**
     * Check if window scroll is on top
     */
    checkOffset () {
        window.pageYOffset < 100 ? this.setAttribute('hidden', 'hidden') : this.removeAttribute('hidden')
    }

    /**
     * Scroll window to the top
     */
    goToTheTop () {
        window.scrollTo(0, 0)
    }
}
if (window.autoDefineComponent !== undefined) {
    customElements.define('scroll-top', ScrollTop)
}