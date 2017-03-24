var gaAccount = 'UA-XXXXXXXX-X';

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', gaAccount]);
_gaq.push(['_trackPageview']);

searchJira = function(word){
  var query = word.selectionText;
  var baseUrl =  localStorage['baseUrl'] || '/options.html?'; //redirect to options if not provided
  var searchSuffix = localStorage['searchSuffix'];
  console.log(baseUrl+searchSuffix);
  chrome.tabs.create({url: baseUrl + searchSuffix + query});
  _gaq.push(['_trackEvent','searchJira','success']);  
};
chrome.runtime.onInstalled.addListener(function() {
  	chrome.contextMenus.create({
		id:"jirasearch",
		title: "Search JIRA",
		contexts:["selection"],
		onclick: searchJira
    });
});

	