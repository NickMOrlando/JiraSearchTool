var gaAccount = 'UA-XXXXXXXX-X';

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', gaAccount]);
_gaq.push(['_trackPageview']);


function save_options() {
	var searchUrl = document.getElementById('searchUrl').value;
	var suffix = document.getElementById('searchSuffix').value;
	console.log(searchUrl);
	console.log(suffix);
  
	// localStorage['baseUrl'] = searchUrl;
	// localStorage['searchSuffix'] = suffix;
	 chrome.storage.sync.set({'baseUrl': searchUrl, 'searchSuffix': suffix	}, function() {    
		
		_gaq.push(['_trackEvent','saveOptions','success']);  
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 2000);
    });
  
}

function restore_options() {
	 chrome.storage.sync.get(['baseUrl', 'searchSuffix','jiraProjects'], function(items) {
		document.getElementById('searchUrl').value = items['baseUrl'] || 'http://my-jira-url/';
		document.getElementById('searchSuffix').value = items['searchSuffix'] || 'secure/QuickSearch.jspa?searchString=';	
		
		// Update status to let user know options were loaded.
		_gaq.push(['_trackEvent','loadOptions','success']);  
		var status = document.getElementById('status');
		if (items['baseUrl']){
			status.textContent = 'Options loaded successfully.';
		}else{
			status.textContent = 'A Jira server URL is required.';
			_gaq.push(['_trackEvent','firstTimeLoad','success']);  
		}
		setTimeout(function() {
			status.textContent = '';
		}, 2000);
	});
	
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);