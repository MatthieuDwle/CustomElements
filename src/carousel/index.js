export default class Carousel extends HTMLElement {
    /**
     * @callback moveCallback
     * @param {number} index
     */

    constructor() {
        super()
        this.isMobile = false
        this.moveCallbacks = []
        this.previous = this.previous.bind(this)
        this.next = this.next.bind(this)
        this.onResize = this.onResize.bind(this)
        /**/
        this.items = [].slice.call(this.children)
        this.innerHTML = ''
        /**/
        this.options = this.setOptions()
        this.createElements()
        this.items = this.setItems()
        this.setStyle()
        this.appendElements()
        if (this.options.pagination) this.createPagination()
        /**/
        this.currentSlide = 0
        this.moveCallbacks.forEach( cb => cb(this.currentSlide))
        this.onResize()
    }

    connectedCallback() {
        this.carousel__previous.addEventListener('click', this.previous)
        this.carousel__next.addEventListener('click', this.next)
        window.addEventListener('resize', this.onResize)
    }
    disconnectedCallback () {
    }

    /**
     *
     * @param {moveCallback} cb
     */
    onMove (cb) {
        this.moveCallbacks.push(cb)
    }


    /**
     * Check on resize if page pass on mobile format
     */
    onResize () {
        let mobile = window.innerWidth < 900
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
        }
    }

    get slidesVisible () {
        return this.isMobile ? 1 : this.options.slidesVisible
    }

    get slidesStep () {
        return this.isMobile ? 1 : this.options.slidesStep
    }


    /**
     * Show previous slides on click
     */
    previous () {
        this.canGo(this.currentSlide - this.slidesStep)
    }
    /**
     * Show next slides on click
     */
    next () {
        this.canGo(this.currentSlide + this.slidesStep)
    }
    /**
     * Move carousel to the target slide
     * @param {number} translateX
     */
    goToSlide (translateX) {
        this.carousel__items.style.transform = 'translate3d('+ translateX +'%,0,0)'
    }
    /**
     * Test if can move the carousel items
     * @param {number} i
     */
    canGo (i) {
        let translateX
        if ((i < this.items.length - this.slidesVisible) && i >= 0) {
            translateX = (-i * 100 / this.items.length)
            this.currentSlide = i
        }
        else if (this.items.length - i > 0 && i >= 0 && this.currentSlide !== this.items.length - this.slidesVisible) {
            translateX = (-(this.items.length - this.slidesVisible) * 100 / this.items.length)
            this.currentSlide = this.items.length - this.slidesVisible
        }
        else if (this.currentSlide !== 0 && (i < this.currentSlide || this.options.backToStart)){
            translateX = 0
            this.currentSlide = 0
        }
        this.moveCallbacks.forEach( cb => cb(this.currentSlide))
        this.goToSlide(translateX)
    }
    /**
     * Return all options pass in custom component
     * @returns {{slidesStep: number, slidesVisible: number}}
     */
    setOptions () {
        return {
            slidesVisible: parseInt(this.getAttribute('data-slides-visible')),
            slidesStep: parseInt(this.getAttribute('data-slides-step')),
            backToStart: this.getAttribute('data-not-back-to-start') === null,
            pagination: this.getAttribute('data-pagination') !== null
        }
    }
    /**
     * Resize and place each items in div
     * @returns {Array} items
     */
    setItems () {
        return this.items.map((item) => {
            item.setAttribute('style', 'width: 100%; height: 100%; object-fit: cover')
            let elem = this.createElementWithClass('div', 'carousel__item')
            elem.appendChild(item)
            elem.setAttribute('aria-roledescription','slide')
            elem.setAttribute('role','group')
            this.carousel__items.appendChild(elem)
            return elem
        })
    }
    /**
     * Set size of container and items
     */
    setStyle () {
        this.ratio = this.items.length / this.slidesVisible
        this.carousel__items.style.width = this.ratio * 100 + '%'
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / this.ratio) +'%')
    }
    /**
     * Create all carousel elements and store them
     */
    createElements () {
        this.section = this.createElementWithClass('section', 'carousel')
        this.section.setAttribute('aria-roledescription', 'carousel')
        this.carousel__container = this.createElementWithClass('div', 'carousel__container')
        this.carousel__controls = this.createElementWithClass('div', 'carousel__controls')
        this.carousel__previous = this.createElementWithClass('button', 'carousel__previous carousel__button')
        this.carousel__previous.setAttribute('aria-roledescription','carousel__items')
        this.carousel__next = this.createElementWithClass('button', 'carousel__next carousel__button')
        this.carousel__next.setAttribute('aria-roledescription','carousel__items')
        this.carousel__items = this.createElementWithClass('div', 'carousel__items')
        this.onMove(index => {
            if (index === 0) {
                this.carousel__previous.classList.add('carousel__previous-hidden')
            } else {
                this.carousel__previous.classList.remove('carousel__previous-hidden')
            }
            if (index >= this.items.length - this.slidesVisible && !this.options.backToStart) {
                this.carousel__next.classList.add('carousel__next-hidden')
            } else {
                this.carousel__next.classList.remove('carousel__next-hidden')
            }
        })
    }
    /**
     * Append child all carousel elements
     */
    appendElements () {
        this.carousel__controls.appendChild(this.carousel__previous)
        this.carousel__controls.appendChild(this.carousel__next)
        this.carousel__container.appendChild(this.carousel__controls)
        this.carousel__container.appendChild(this.carousel__items)
        this.section.appendChild(this.carousel__container)
        this.appendChild(this.section)
    }
    /**
     * @param {string} tagName
     * @param {string} className
     * @return {HTMLElement} elem
     */
    createElementWithClass (tagName, className) {
        let elem = document.createElement(tagName)
        elem.setAttribute('class', className)
        return elem
    }
    createPagination () {
        this.pagination = this.createElementWithClass('div', 'carousel__pagination')
        let buttons = []
        for (let i = 0; i <= this.items.length; i = i + this.slidesVisible) {
            let elem = this.createElementWithClass('div', `carousel__pagination-button`)
            elem.addEventListener('click', () => this.canGo(i))
            this.pagination.appendChild(elem)
            buttons.push(elem)
        }
        this.onMove(index => {
            let activeButton = buttons[Math.ceil(index / this.slidesStep)]
            buttons.forEach(el => el.classList.remove('carousel__pagination-button-active'))
            activeButton.classList.add('carousel__pagination-button-active')
        })
        this.carousel__container.appendChild(this.pagination)
    }
}
if (window.autoDefineComponent !== undefined) {
    customElements.define('my-carousel', Carousel)
}