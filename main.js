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
  chrome.storage.sync.get(['baseUrl', 'searchSuffix'], function(items) {
	var baseUrl =  items['baseUrl'] || '/options.html?'; //redirect to options if not provided
	var searchSuffix = items['searchSuffix'];
	console.log(baseUrl+searchSuffix);
	chrome.tabs.create({url: baseUrl + searchSuffix + query});
  });
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


//redirection
 
var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};

function redirect(){
	var jira = getQueryString('jira');
	if(jira){
		try{
			//Quick-Fixes #1 (eliminate any parens from the Jira string)
			jira = jira.replace(/[()]/g, '');
			chrome.storage.sync.get('baseUrl', function(items) {
			var baseurl, browseurl;
			baseurl = items['baseUrl'] || chrome.extension.getURL("options.html")+"?";
			  browseurl = baseurl+'browse/';
			_gaq.push(['_trackEvent','clickLinkToJira','success']);  
			_gaq.push(function(){ 
				window.location.href = browseurl+jira;
				});
			});
		} catch(ex) {
			_gaq.push(['_trackEvent','clickLinkToJira','failure']);  	
		}
	}else{
			_gaq.push(['_trackEvent','backgroundInitialized','success']);  	
	}
}
document.addEventListener('DOMContentLoaded', redirect);
