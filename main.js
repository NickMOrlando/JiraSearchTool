searchJira = function(word){
  var query = word.selectionText;
  var baseUrl =  localStorage['baseUrl'];
  var searchSuffix = localStorage['searchSuffix'];
  console.log(baseUrl+searchSuffix);
  chrome.tabs.create({url: baseUrl + searchSuffix + query});
};

  	chrome.contextMenus.create({
		id:"jirasearch",
		title: "Search JIRA",
		contexts:["selection"],
		onclick: searchJira
    });
