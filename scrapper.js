const puppeteer = require("puppeteer");
const C = require("./constants");
const TEST_NUMBER = "#Barcode";
const DATE_SELECTOR = "#BirthdaySingleOrderLoginInput";
const CTA_SELECTOR = "#singleOrderLoginBtn";

console.log(C.number)
console.log(C.date1)

async function startBrowser() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    return { browser, page };
}

async function closeBrowser(browser) {
    return browser.close();
}

async function playTest(url) {
    const { browser, page } = await startBrowser();
    page.setViewport({ width: 1366, height: 768 });
    await page.goto(url);
    await page.click(TEST_NUMBER);
    await page.keyboard.type(C.number);
    //await page.focus(DATE_SELECTOR);
    //await page.click(DATE_SELECTOR);
    //await page.keyboard.type(C.date1);
    await page.$eval(DATE_SELECTOR, el => el.value = "02011979")
    await page.click(CTA_SELECTOR);
    await page.waitForNavigation({waitUntil:"networkidle0"});
    //await page.screenshot({ path: 'example.png' });
}

(async () => {
    await playTest("https://www.wyniki.diag.pl/");
    process.exit(1);
})();