export default class PageScroller extends HTMLElement {
    /**
     * @callback moveCallback
     * @param {number} index
     */

    constructor() {
        super()
        /*Define var*/
        this.items = [].slice.call(this.children)
        this.moveCallbacks = []
        this.isMobile = false
        this.canScroll = true
        this.currentOffset = 0
        /*Empty page-scroller*/
        this.innerHTML = ''
        /* Create all elements and append them in page-scroller */
        this.createElements()
        this.createPagination()
        this.appendElements()
        /* Run onResize to reformat carousel if carousel is displayed on mobile */
        this.onResize()
        /* Refactor all items and append them in special div */
        this.items = this.setItems()
        /* Force repaint for each reload */
        this.repaint()
        /* Run onMove method for each stored callbacks */
        this.moveCallbacks.forEach(cb => cb(this.currentOffset))
    }

    /**
     * addEventListener when elements are connected to the DOM
     */
    connectedCallback() {
        this.addEventListener('wheel', (e) => this.mouseWheelHandler(e))
        this.addEventListener('transitionend', () => this.setScroll())
    }

    /**
     * removeEventListener when elements are disconnected from the DOM
     */
    disconnectedCallback() {
        this.addEventListener('wheel', (e) => this.mouseWheelHandler(e))
    }

    /**
     * detect scroll direction
     * @param e
     */
    mouseWheelHandler(e) {
        if (!this.isMobile && this.canScroll) e.deltaY < 0 ? this.scrollUp() : this.scrollDown()
    }

    /**
     * reset scroll value to true
     */
    setScroll() {
        this.canScroll = true
    }

    /**
     * Refactor the DOM
     */
    createElements() {
        this.container = this.createElementWithClass('div', 'page-scroller__container')
    }

    /**
     * create page pagination
     */
    createPagination() {
        this.pagination = this.createElementWithClass('div', 'page-scroller__pagination')
        let buttons = []
        for (let i = 0; i < this.items.length; i++) {
            let elem = this.createElementWithClass('div', 'page-scroller__pagination-button')
            elem.addEventListener('click', () => {
                if (this.canScroll) this.goToThePage(i)
            })
            this.pagination.appendChild(elem)
            buttons.push(elem)
        }
        this.onMove(index => {
            if (!this.isMobile) {
                let activeButton = buttons[index]
                buttons.forEach(el => el.classList.remove('page-scroller__button-active'))
                activeButton.classList.add('page-scroller__button-active')
            }
        })
        this.appendChild(this.pagination)
    }

    /**
     * Append all elements to the DOM
     */
    appendElements() {
        this.appendChild(this.container)
    }

    /**
     * Create item element un put items in container
     * @returns {array}
     */
    setItems() {
        return this.items.map(item => {
            let elem = this.createElementWithClass('div', 'page-scroller__item')
            elem.appendChild(item)
            this.container.appendChild(elem)
        })
    }

    /**
     * scroll to the previous page
     */
    scrollUp() {
        if (this.currentOffset > 0) {
            this.currentOffset--
            this.goToThePage()
        }
    }

    /**
     * scroll to the next page
     */
    scrollDown() {
        if (this.currentOffset < this.items.length - 1) {
            this.currentOffset++
            this.goToThePage()
        }
    }

    /**
     * go to the page depending of offset value
     * @param {number} offset
     */
    goToThePage(offset = this.currentOffset) {
        this.container.style.transform = `translate3d(0,${-offset * (100 / this.items.length)}%,0)`
        this.canScroll = false
        this.moveCallbacks.forEach(cb => cb(offset))
    }

    /**
     * CallBack items when carousel moves
     * @param {moveCallback} cb
     */
    onMove(cb) {
        this.moveCallbacks.push(cb)
    }


    /**
     * set isMobile on resize
     */
    onResize() {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
        }
    }

    /**
     * Force repaint because chrome have bug about repainting
     */
    repaint() {
        this.container.style.display = 'none'
        setTimeout(() => this.container.style.display = '', 200)
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
    customElements.define('page-scroller', PageScroller)
}

