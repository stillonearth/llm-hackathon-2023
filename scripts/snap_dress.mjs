import puppeteer from 'puppeteer';
import fs from 'fs';
import minimist from 'minimist';

(async () => {

    var argv = minimist(process.argv.slice(2));

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the page you want to take a screenshot of
    await page.goto('https://www.digforvictoryclothing.com/design/your/own/dress');

    // Bodice
    const bodiceInput = await page.$("label[for='" + argv.bodice + "']");
    await bodiceInput.click();

    // Sleeves
    const sleeveTab = await page.$("#sleeve-style-label");
    await sleeveTab.click()

    const sleeveInput = await page.$("label[for='" + argv.sleeve + "']");
    await sleeveInput.click();

    // Skirt
    const skirtTab = await page.$("#skirt-style-label");
    await skirtTab.click();

    const skirtInput = await page.$("label[for='" + argv.skirt + "']");
    await skirtInput.click();

    // Skirt Length
    const skirtLengthTab = await page.$("#skirt-length-label");
    await skirtLengthTab.click();

    const skirtLengthInput = await page.$("label[for='" + argv.skirt_length + "']");
    await skirtLengthInput.click();

    // Lace overlays
    const laceOverlayTab = await page.$("#lace-overlay-label");
    await laceOverlayTab.click();

    const laceOverlayOnBust = await page.$("label[for='" + argv.lace_overlay_on_bust + "']");
    await laceOverlayOnBust.click();

    const laceOverlayOnSkirt = await page.$("label[for='" + argv.lace_overlay_on_skirt + "']");
    await laceOverlayOnSkirt.click();

    // Extras
    const extrasTab = await page.$("#extras-label");
    await extrasTab.click();

    const extrasCollar = await page.$("label[for='" + argv.extras_collar + "']");
    await extrasCollar.click();

    const extrasStash = await page.$("label[for='" + argv.extras_stash + "']");
    await extrasStash.click();

    await new Promise(resolve => setTimeout(resolve, 3000));

    const elementHandle = await page.$('div.small-8.medium-12.column.text-center img');
    const clip = await elementHandle.boundingBox();

    // Take the screenshot of the element using the clip option
    const screenshotBuffer = await page.screenshot({ clip });

    // Do something with the screenshot, like save it to a file
    fs.writeFileSync('./tmp/' + argv.uuid + '/screenshot.png', screenshotBuffer);

    await browser.close();
})();