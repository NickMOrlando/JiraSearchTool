var UPDATE_INTERVAL = 2 * 60 * 60 * 1000; // Update after 2 hour

// Retrieve GA from storage
chrome.storage.local.get({
    lastUpdated: 0,
    code: ''
}, function(items) {
    if (Date.now() - items.lastUpdated > UPDATE_INTERVAL) {
        // Get updated file, and if found, save it.
        get('https://ssl.google-analytics.com/ga.js', function(code) {
            if (!code) return;
            chrome.storage.local.set({lastUpdated: Date.now(), code: code});
        });
    }
    if (items.code) // Cached GA is available, use it
        execute(items.code);
    else // No cached version yet. Load from extension
        get(chrome.extension.getURL('ga.js'), execute);
});

// Typically run within a few milliseconds
function execute(code) {
    try { window.eval(code); } catch (e) { console.error(e); }
    // Run the rest of your code.
    // If your extension depends on GA, initialize it from here.
    // ...
}

function get(url, callback) {
    var x = new XMLHttpRequest();
    x.onload = x.onerror = function() { callback(x.responseText); };
    x.open('GET', url);
    x.send();
}