var gaAccount = 'UA-XXXXXXXX-X';

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', gaAccount]);
_gaq.push(['_trackPageview']);

//Universal Jira ticket regexp
var jira_regex = /(?:\(|\s|^)([A-Z]+-[0-9]+)(?=\s*|\)|$)/


////based on http://jsfiddle.net/7Vf5J/38/

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
		if(parent.nodeName=="A"){
			return;
		}
        matchedTextNode = textNode.splitText(result.index);
        matchedText = result[0];
        matchLength = matchedText.length;
        textNode = (matchedTextNode.length > matchLength) ?
            matchedTextNode.splitText(matchLength) : null;
        // Ensure searching starts at the beginning of the text node
        regex.lastIndex = 0;
        surroundingNode = surrounderCreateFunc(matchedTextNode.cloneNode(true));
        parent.insertBefore(surroundingNode, matchedTextNode);
        parent.removeChild(matchedTextNode);
		_gaq.push(['_trackEvent','addLinkToJira','success']);  
    }
}

// This function does the surrounding for every matched piece of text
function createAnchor(matchedTextNode) {
    var el = document.createElement("a");
	var redirectUrl = chrome.extension.getURL("background.html")+"?jira="+matchedTextNode.nodeValue.trim();
    el.setAttribute('href', redirectUrl);
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

//then add any links that may have been added at 1 second intervals (e.g. from Gmail navigation or new inbound messages)
setInterval(function(){
	wrapJiraTickets(document.body);	
},1000);