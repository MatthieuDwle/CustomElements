import '@testing-library/jest-dom'
import 'expect-puppeteer'
import ''
import Carousel from './index.js'
jest.mock('./index.js')

describe('Carousel', () => {
    beforeAll(async () => {
        await page.goto('http://127.0.0.1:3000/carousel/')
    })
    describe('#Construction', () => {
        describe('should create carousel elements', () => {
            it('should create section',async () => {
                const section = await page.$('section.carousel')
                expect(section).not.toBeNull()
            });
            it('should create carousel__container',async () => {
                const carousel__container = await page.$('div.carousel__container')
                expect(carousel__container).not.toBeNull()
            });
            it('should create carousel__controls',async () => {
                const carousel__controls = await page.$('div.carousel__controls')
                expect(carousel__controls).not.toBeNull()
            })
            it('should create carousel__previous',async () => {
                const carousel__previous = await page.$('button.carousel__previous')
                expect(carousel__previous).not.toBeNull()
            })
            it('should create carousel__next',async () => {
                const carousel__next = await page.$('button.carousel__next')
                expect(carousel__next).not.toBeNull()
            })
            it('should create carousel__items',async () => {
                const carousel__items = await page.$('div.carousel__items')
                expect(carousel__items).not.toBeNull()
            })
        })
        describe('should have attributes',() => {
            it('should have aria-roledescription', async () => {
                const carouselCount = await page.$$eval('my-carousel', el => el.length)
                const carousel = (await page.$$('.carousel[aria-roledescription="carousel"]')).length
                expect(carousel).toBe(carouselCount)
                const items = (await page.$$('.carousel__item[aria-roledescription="slide"]')).length
                expect(items).toBeGreaterThanOrEqual(carouselCount)
            })

            it('should have valid aria-controls', async () => {
                const carouselCount = await page.$$eval('my-carousel', el => el.length)
                const previous = (await page.$$('.carousel__previous[aria-roledescription="carousel__items"]')).length
                expect(previous).toBe(carouselCount)
                const next = (await page.$$('.carousel__next[aria-roledescription="carousel__items"]')).length
                expect(next).toBe(carouselCount)
            })

            it('should have role', async  () => {
                const items = (await page.$$('.carousel__item[role="group"]')).length
                expect(items).toBeGreaterThanOrEqual(1)
            })
        })

        it('should resize images to the carousel',async () => {

        })

        it('should have pagination',async () => {

        })

        it('should be autoplay',async () => {

        })

        it('should not be autoplay', async () => {

        })
    })
    describe('#Keyboard-navigation', () => {
        it('should focus the carousel navigation button', async () => {

        });
        it('should slide right on space', () => {

        })

        it('should slide left on space', () => {

        })
        it('should slide right on enter', () => {

        })

        it('should slide left on enter', () => {

        })

    })
    describe('#Navigation', () => {
        it('should slide right on click', () => {
            const carousel = new Carousel
            console.log(carousel)
        })
        it('should slide left on click', () => {

        })
        it('should slide with correct step', () => {

        })
        it('should stop at the end', () => {

        })
        it('should be infinite', () => {

        })
    })
})