/**
 * @param {import("puppeteer").Page} page 
 */
module.exports = async function (page) {
    return page.evaluate(() => {
        return new Promise(resolve => {
            const scrollAmount = 100;
            const scrollDelay = 500;
            
            function scroll() {
                window.scrollBy({ top: scrollAmount });
                if (window.scrollY < document.body.scrollHeight - document.body.clientHeight ) {
                    setTimeout(scroll, scrollDelay);
                } else {
                    resolve();
                }
            }
            scroll();
        }) 
    })
}