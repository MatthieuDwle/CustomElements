import '@testing-library/jest-dom'
import 'expect-puppeteer'


async function nextAnimationFrame (page) {
    return page.evaluate(
        () =>
            new Promise((resolve, reject) => {
                window.requestAnimationFrame(resolve)
            })
    )
}

describe('Scroll-top', () => {
    beforeAll(async () => {
        await page.goto('http://127.0.0.1:3000/scroll-top/')
        await page.$eval('*', el => el.setAttribute('style', 'scroll-behavior: unset !important'))
        //await console.log(await page.evaluate(() => document.body.innerHTML))
    })

    afterAll(async () => {
        page.close()
    })

    it('should not be visible by default', async () => {
        const box = await (await page.$('scroll-top')).boundingBox()
        expect(box).toBeNull()
    })

    it('should be visible when scrolling', async () => {
        await page.evaluate(async el => window.scrollBy(0, 100))
        await nextAnimationFrame(page)
        const box = await (await page.$('scroll-top')).boundingBox()
        expect(box).not.toBeNull()
    })

    it('should scroll top on click', async () => {
        await page.evaluate(async () => window.scrollBy(0, 100))
        await nextAnimationFrame(page)
        const scrollTop = await page.$('scroll-top')
        await scrollTop.click()
        const scrollY = await page.evaluate(_ => window.scrollY)
        expect(scrollY).toBe(0)
    })

    it('should clean listeners on remove', async () => {
        await page.$eval('scroll-top', el => el.remove())
       const client = await page.target().createCDPSession()
        const window = await client.send('Runtime.evaluate', {
            expression: 'window'
        })
        const listeners = (
            await client.send('DOMDebugger.getEventListeners', {
                objectId: window.result.objectId
            })
        ).listeners
        expect(listeners.filter(l => l.type === 'scroll')).toHaveLength(0)
    })

})