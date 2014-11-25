// Export modules to global scope as necessary (only for testing)
if ("undefined" !== typeof process) {
    if ("node" === process.title) {
        // We are in node. Require modules.
        global.isBrowser = false;
    }
    else {
        //  Machineto and sinon already exported globally in the browser.
        window.isBrowser = true;
    }
}
else {
    //  Machineto and sinon already exported globally in the browser.
    window.isBrowser = true;
}