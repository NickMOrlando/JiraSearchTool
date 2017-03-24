//based on http://jsfiddle.net/7Vf5J/38/

var baseUrl = "http://jira.tmwsystems.com/browse/"

//Universal Jira ticket regexp
var jira_regex = /(?:\s|^)([A-Z]+-[0-9]+)(?=\s|$)/

// Reusable generic function
function surroundInElement(el, regex, surrounderCreateFunc) {
    // script and style elements are left alone
    if (!/^(script|style)$/.test(el.tagName)) {
        var child = el.lastChild;
        while (child) {
            if (child.nodeType == 1) {
                surroundInElement(child, regex, surrounderCreateFunc);
            } else if (child.nodeType == 3) {
                surroundMatchingText(child, regex, surrounderCreateFunc);
            }
            child = child.previousSibling;
        }
    }
}

// Reusable generic function
function surroundMatchingText(textNode, regex, surrounderCreateFunc) {
    var parent = textNode.parentNode;
	var result, surroundingNode, matchedTextNode, matchLength, matchedText;
    while ( textNode && (result = regex.exec(textNode.data))) {
    		textNode.data = textNode.data;
        matchedTextNode = textNode.splitText(result.index);
        matchedText = result[0];
        matchLength = matchedText.length;
        textNode = (matchedTextNode.length > matchLength) ?
            matchedTextNode.splitText(matchLength) : null;
        // Ensure searching starts at the beginning of the text node
        regex.lastIndex = 0;
        surroundingNode = surrounderCreateFunc(matchedTextNode.cloneNode(true));
		if(parent.nodeName=="A"){
			return;
		}
        parent.insertBefore(surroundingNode, matchedTextNode);
        parent.removeChild(matchedTextNode);
    }
}

// This function does the surrounding for every matched piece of text
function createAnchor(matchedTextNode) {
    var el = document.createElement("a");
    el.setAttribute('href', baseUrl+matchedTextNode.nodeValue);
    el.appendChild(matchedTextNode);
    return el;
}

// The main function
function wrapJiraTickets(container) {
        surroundInElement(container, new RegExp(jira_regex), createAnchor);
}
//on ready, wrap tickets oncellchange
(function(){
	wrapJiraTickets(document.body);
});

//then reset any links that may have been removed at 5 second intervals (e.g. Gmail)
setInterval(function(){
	wrapJiraTickets(document.body);	
},1000);