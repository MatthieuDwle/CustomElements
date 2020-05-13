export default class Carousel extends HTMLElement {
    /**
     * @callback moveCallback
     * @param {number} index
     */

    constructor() {
        super()
        /* Define var */
        this.isMobile = false
        this.moveCallbacks = []
        this.options = this.setOptions()
        this.items = [].slice.call(this.children)
        this.currentSlide = 0
        /* Bind this on each methods witch need it */
        this.previous = this.previous.bind(this)
        this.next = this.next.bind(this)
        this.onResize = this.onResize.bind(this)
        this.resetInfinite = this.resetInfinite.bind(this)
        /* Empty my-carousel */
        this.innerHTML = ''
        /* Create all elements and append them in my-carousel */
        this.createElements()
        /* Set up var to init infinite carousel  */
        if (this.options.infinite) this.setItemsInfinite()
        /* Refactor all items and append them in special div */
        this.items = this.setItems()
        /* Append all elements in my-carousel */
        this.appendElements()
        /* Set up pagination if is required */
        if (this.options.pagination) this.createPagination()
        /* Reformat image format */
        this.setStyle()
        /* Run onResize to reformat carousel if carousel is displayed on mobile */
        this.onResize()
        /* Run onMove method for each stored callbacks */
        this.moveCallbacks.forEach(cb => cb(this.currentSlide))
    }

    /**
     * Return slidesVisible in terms of isMobile
     * @returns {number} slidesVisible
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }

    /**
     * Return slidesStep in terms of isMobile
     * @returns {number} slidesStep
     */
    get slidesStep() {
        return this.isMobile ? 1 : this.options.slidesStep
    }

    /**
     * addEventListener when elements are connected to the DOM
     */
    connectedCallback() {
        this.carousel__previous.addEventListener('click', this.previous)
        this.carousel__next.addEventListener('click', this.next)
        window.addEventListener('resize', this.onResize)
        if (this.options.infinite) this.carousel__items.addEventListener('transitionend', this.resetInfinite)
        this.section.addEventListener('keyup', e => this.eventKey(e))
    }

    /**
     * removeEventListener when elements are disconnected from the DOM
     */
    disconnectedCallback() {
        this.carousel__previous.removeEventListener('click', this.previous)
        this.carousel__next.removeEventListener('click', this.next)
        window.removeEventListener('resize', this.onResize)
    }

    /**
     * Run next or previous in terms of key pressed
     * @param e
     */
    eventKey(e) {
        if (e.key === 'ArrowRight') this.next()
        if (e.key === 'ArrowLeft') this.previous()
    }

    /**
     * Return all options pass in custom component
     * @returns {{slidesStep: number, slidesVisible: number}}
     */
    setOptions() {
        return {
            slidesVisible: parseInt(this.getAttribute('data-slides-visible')) || 3,
            slidesStep: parseInt(this.getAttribute('data-slides-step')) || 3,
            backToStart: this.getAttribute('data-not-back-to-start') === null && this.getAttribute('data-slides-infinite') === null,
            pagination: this.getAttribute('data-slides-pagination') !== null && this.getAttribute('data-slides-infinite') === null,
            infinite: this.getAttribute('data-slides-infinite') !== null,
            slidesRatio: this.setRatio() || 16/9
        }
    }

    setRatio() {
        let ratio = this.getAttribute('data-slides-ratio')
        if (ratio) {
            ratio = ratio.split('/')
            console.log('xc')
            let reducer = (a,b) => parseInt(a)/parseInt(b)
            return ratio.reduce(reducer)
        }
    }

    /**
     * Create all carousel elements and store them
     */
    createElements() {
        this.section = this.createElementWithClass('section', 'carousel')
        this.section.setAttribute('aria-roledescription', 'carousel')
        this.section.setAttribute('tabindex', '0')
        this.carousel__container = this.createElementWithClass('div', 'carousel__container')
        this.carousel__controls = this.createElementWithClass('div', 'carousel__controls')
        this.carousel__previous = this.createElementWithClass('button', 'carousel__previous carousel__button')
        this.carousel__previous.setAttribute('aria-roledescription', 'carousel__items')
        this.carousel__next = this.createElementWithClass('button', 'carousel__next carousel__button')
        this.carousel__next.setAttribute('aria-roledescription', 'carousel__items')
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
     * create carousel pagination and insert into the DOM
     */
    createPagination() {
        this.pagination = this.createElementWithClass('div', 'carousel__pagination')
        let buttons = []
        for (let i = 0; i < this.items.length; i = i + this.slidesVisible) {
            let elem = this.createElementWithClass('div', `carousel__pagination-button`)
            elem.addEventListener('click', () => this.canGo(i))
            this.pagination.appendChild(elem)
            buttons.push(elem)
        }
        this.onMove(index => {
            if (!this.isMobile) {
                let activeButton = buttons[Math.ceil(index / this.slidesVisible)]
                buttons.forEach(el => el.classList.remove('carousel__pagination-button-active'))
                activeButton.classList.add('carousel__pagination-button-active')
            }
        })
        this.carousel__container.appendChild(this.pagination)
    }

    /**
     * Add clones to items to fake infinite carousel
     */
    setItemsInfinite() {
        this.offset = this.options.slidesVisible * 2 - 1
        this.items = [
            ...this.items.slice(this.items.length - this.offset).map(el => el.cloneNode(true)),
            ...this.items,
            ...this.items.slice(0, this.offset).map(el => el.cloneNode(true))
        ]
        this.currentSlide = this.offset
        this.canGo(this.currentSlide)
    }

    /**
     * Reset carousel position
     */
    resetInfinite() {
        if (this.currentSlide <= this.options.slidesVisible) {
            this.currentSlide += this.items.length - 2 * this.offset
        } else if (this.currentSlide >= this.items.length - this.offset) {
            this.currentSlide -= this.items.length - 2 * this.offset
        }
        this.goToSlide(-this.currentSlide, false)
    }

    /**
     * Resize and place each items in div
     * @returns {Array} items
     */
    setItems() {
        return this.items.map((item) => {
            item.setAttribute('style', 'width: 100%; height: 100%; object-fit: cover')
            let elem = this.createElementWithClass('div', 'carousel__item')
            elem.appendChild(item)
            elem.setAttribute('aria-roledescription', 'slide')
            elem.setAttribute('role', 'group')
            this.carousel__items.appendChild(elem)
            return elem
        })
    }

    /**
     * Append child all carousel elements
     */
    appendElements() {
        this.carousel__controls.appendChild(this.carousel__previous)
        this.carousel__controls.appendChild(this.carousel__next)
        this.carousel__container.appendChild(this.carousel__controls)
        this.carousel__container.appendChild(this.carousel__items)
        this.section.appendChild(this.carousel__container)
        this.appendChild(this.section)
    }

    /**
     * Set size of container and items
     */
    setStyle() {
        this.ratio = this.items.length / this.slidesVisible
        this.carousel__items.style.width = this.ratio * 100 + '%'
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / this.ratio) + '%')
        this.items.forEach(item => item.style.paddingTop = (((100 / this.slidesVisible) / this.ratio))/this.options.slidesRatio + '%')
        console.log(this.options.slidesRatio)
        if (this.options.pagination) this.isMobile ? this.pagination.classList.add('carousel__pagination-hidden') : this.pagination.classList.remove('carousel__pagination-hidden')
    }

    /**
     * Check on resize if page pass on mobile format
     */
    onResize() {
        let mobile = window.innerWidth < 900
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
        }
    }

    /**
     * CallBack items when carousel moves
     * @param {moveCallback} cb
     */
    onMove(cb) {
        this.moveCallbacks.push(cb)
    }

    /**
     * Show previous slides on click
     */
    previous() {
        this.canGo(this.currentSlide - this.slidesStep)
    }

    /**
     * Show next slides on click
     */
    next() {
        this.canGo(this.currentSlide + this.slidesStep)
    }

    /**
     * Move carousel to the target slide
     * @param {number} slide
     * @param {boolean} animation
     */
    goToSlide(slide, animation) {
        let translateX = slide * 100 / this.items.length
        if (!animation) this.carousel__items.style.transition = 'none'
        this.carousel__items.style.transform = 'translate3d(' + translateX + '%,0,0)'
        this.carousel__items.offsetHeight // to force the repaint
        if (!animation) this.carousel__items.style.transition = ''
    }

    /**
     * Test if can move the carousel items
     * @param {number} i
     * @param {boolean} [animation = true]
     */
    canGo(i, animation = true) {
        let slide
        if ((i < this.items.length - this.slidesVisible) && i >= 0) {
            slide = -i
            this.currentSlide = i
        } else if (this.items.length - i > 0 && i >= 0 && this.currentSlide !== this.items.length - this.slidesVisible) {
            slide = -this.items.length + this.slidesVisible
            this.currentSlide = this.items.length - this.slidesVisible
        } else if (this.currentSlide !== 0 && (i < this.currentSlide || this.options.backToStart)) {
            slide = 0
            this.currentSlide = 0
        }
        this.moveCallbacks.forEach(cb => cb(this.currentSlide))
        this.goToSlide(slide, animation)
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
    customElements.define('my-carousel', Carousel)
}