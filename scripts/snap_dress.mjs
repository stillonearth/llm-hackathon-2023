import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {


    const DRESS_PARTS = JSON.parse(fs.readFileSync("./selectors.json").toString())

    const bodice = DRESS_PARTS['bodice'][Math.floor(Math.random() * DRESS_PARTS['bodice'].length)]['id'];
    const sleeve = DRESS_PARTS['sleeves'][Math.floor(Math.random() * DRESS_PARTS['sleeves'].length)]['id'];
    const skirt = DRESS_PARTS['skirts'][Math.floor(Math.random() * DRESS_PARTS['skirts'].length)]['id'];
    const skirt_length = DRESS_PARTS['skirt_lengths'][Math.floor(Math.random() * DRESS_PARTS['skirt_lengths'].length)]['id'];
    const lace_overlay_on_bust = DRESS_PARTS['lace_overlay_on_bust'][Math.floor(Math.random() * DRESS_PARTS['lace_overlay_on_bust'].length)]['id'];
    const lace_overlay_on_skirt = DRESS_PARTS['lace_overlay_on_skirt'][Math.floor(Math.random() * DRESS_PARTS['lace_overlay_on_skirt'].length)]['id'];
    const extras_collar = DRESS_PARTS['extras_collar'][Math.floor(Math.random() * DRESS_PARTS['extras_collar'].length)]['id'];
    const extras_stash = DRESS_PARTS['extras_stash'][Math.floor(Math.random() * DRESS_PARTS['extras_stash'].length)]['id'];


    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the page you want to take a screenshot of
    await page.goto('https://www.digforvictoryclothing.com/design/your/own/dress');

    // Bodice
    const bodiceInput = await page.$("label[for='" + bodice + "']");
    await bodiceInput.click();

    // Sleeves
    const sleeveTab = await page.$("#sleeve-style-label");
    await sleeveTab.click()

    const sleeveInput = await page.$("label[for='" + sleeve + "']");
    await sleeveInput.click();

    // Skirt
    const skirtTab = await page.$("#skirt-style-label");
    await skirtTab.click();

    const skirtInput = await page.$("label[for='" + skirt + "']");
    await skirtInput.click();

    // Skirt Length
    const skirtLengthTab = await page.$("#skirt-length-label");
    await skirtLengthTab.click();

    const skirtLengthInput = await page.$("label[for='" + skirt_length + "']");
    await skirtLengthInput.click();

    // Lace overlays
    const laceOverlayTab = await page.$("#lace-overlay-label");
    await laceOverlayTab.click();

    const laceOverlayOnBust = await page.$("label[for='" + lace_overlay_on_bust + "']");
    await laceOverlayOnBust.click();

    const laceOverlayOnSkirt = await page.$("label[for='" + lace_overlay_on_skirt + "']");
    await laceOverlayOnSkirt.click();

    // Extras
    const extrasTab = await page.$("#extras-label");
    await extrasTab.click();

    const extrasCollar = await page.$("label[for='" + extras_collar + "']");
    await extrasCollar.click();

    const extrasStash = await page.$("label[for='" + extras_stash + "']");
    await extrasStash.click();

    await new Promise(resolve => setTimeout(resolve, 3000));

    const elementHandle = await page.$('div.small-8.medium-12.column.text-center img');
    const clip = await elementHandle.boundingBox();

    // Take the screenshot of the element using the clip option
    const screenshotBuffer = await page.screenshot({ clip });

    // Do something with the screenshot, like save it to a file
    fs.writeFileSync('screenshot.png', screenshotBuffer);

    await browser.close();
})();