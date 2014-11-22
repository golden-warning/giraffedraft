// insert arrive into page html
var arrive = document.createElement('script');
arrive.src = chrome.extension.getURL('lib/arrive-2.0.0.min.js');
(document.head||document.documentElement).appendChild(arrive);

// Insert iFrame referencing popup.html
function insertSidebar(src, isInternalUrl) {
  var iframe = document.createElement('iframe');

  if (isInternalUrl) iframe.src = chrome.extension.getURL(src);
  else iframe.src = src;

  iframe.id = 'giraffedraft';
  iframe.align = 'right';
  iframe.width = '300';
  iframe.height = '100%';
  iframe.style.position = "fixed";
  iframe.style.top = '0px';
  iframe.style.right = '0px';
  iframe.style.zIndex = '10000000000';
  iframe.style.backgroundColor = 'white';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
}

// Insert button to toggle showing the iFrame
function insertSidebarButton() {
  var toggler = document.createElement('button');
  toggler.id = 'giraffedraft-toggle';
  toggler.className = 'giraffedraft-toggle-closed';

  toggler.innerText = "Shot Caller";
  //toggler.style.fontSize = '20px';

  toggler.onclick = function() {
    var display = document.querySelector('#giraffedraft').style.display;
    if (display === '') {
      document.querySelector('#giraffedraft').style.display = 'none';
      toggler.className = 'giraffedraft-toggle-closed';
    }
    else {
      document.querySelector('#giraffedraft').style.display = '';
      toggler.className = 'giraffedraft-toggle-open';
    }
  };
  document.body.appendChild(toggler);
}



var undrafted = [];
var suggestions = [];
var drafted = [];
var state = {};
var allStats = {};
var queue = {};

// Check if current page is Yahoo Draft page.
var onDraftPage = function() {
  return !!(document.querySelector('.ys-draftclient'));
};

// Check if current page is the main drafting interface.
var onDraftMainPage = function() {
  return !!(document.querySelector('#draft-controls'));
};

var closeSidebar = function() {
  document.querySelector('#giraffedraft').className = 'giraffedraft-closed';
};

var openSidebar = function() {
  document.querySelector('#giraffedraft').className = 'giraffedraft-open';
};

var sendState = function() {
  var w = document.querySelector('#giraffedraft').contentWindow;
  ////console.log(JSON.stringify(state));
  w.postMessage({state: state}, '*');
};

var sendUser = function() {
  var w = document.querySelector('#giraffedraft').contentWindow;

  var user = document.querySelector('.ys-order-user').querySelector('.Ell').innerText;

  //console.log("sending user:", user);
  w.postMessage({user: user}, '*');
};

var sendQueue = function() {
  var w = document.querySelector('#giraffedraft').contentWindow;

  //console.log("sending queue:", queue);
  w.postMessage({queue: queue}, '*');
};

var clickPlayers = function() {
  document.querySelector('.NavTabs').childNodes[1].click();
};

var clickTeams = function() {
  document.querySelector('.NavTabs').children[1].click();
};

var clickDraftResults = function() {
  // Select the draft results tab
  document.querySelector('.NavTabs').childNodes[5].click();
  document.querySelector('.SubNavTabs').children[0].click();
};

var clickDraftGrid = function() {
  // Select the draft results tab
  document.querySelector('.NavTabs').childNodes[5].click();
  document.querySelector('.SubNavTabs').children[1].click();
};

var getPlayers = function(cb) {
  clickDraftGrid();
  // problem is here somewhere================================================
  function scrapePlayers() {
    var players = document.querySelector('.ys-results-grid').querySelectorAll('.ys-team');
    //console.log(players);

    Array.prototype.slice.call(players).forEach(function(player) {
      var draftPosition = player.getAttribute('data-id');

      state[player.innerText.trim()] = {draftPosition: draftPosition, team: {}};
    });
  }
  scrapePlayers();
 //console.log('============== scraped players and positions =================');
 //console.log(state);
  cb();
};


var updateState = function() {
  clickDraftResults();
  var playerNode = document.querySelector('#results-by-round').querySelector('tbody').children[1];
  scrapePlayerFromRBR(playerNode);
  clickPlayers();
  sendState();
};

var getPlayerStats = function(cb) {
  // select player tab
  clickPlayers();

  // click 'show drafted'
  // should check if already clicked.
  document.querySelector('#show-drafted').checked = true;


  // get players list
  //var players = document.querySelector('.player-listing-table').querySelector('tbody').children;
  var players = document.querySelector('.Col2c').querySelectorAll('.ys-player');
  // get stat categories
  var statCategoriesNode = document.querySelector('.player-listing-table').querySelector('thead').children[0].children;

  var statCategories = [];
  for (var i = 2; i < statCategoriesNode.length-1; i++) {
    //debugger;
    var stat = statCategoriesNode[i].querySelector('div').innerText;
    statCategories.push(stat);
  }

 //console.log(statCategories);

  // fill out allStats table
  Array.prototype.slice.call(players).forEach(function(player) {
    //console.log(player);
    var stats = {injured: false};
    // get player name
    var playerName = player.children[1].innerText;
    // check if player injured
    if (playerName.indexOf('Injured') >= 0) {
      stats.injured = true;
    }
    //remove 'Injured' text and any unicode, trim
    playerName = playerName.replace('Injured', '').replace(/[\uE000-\uF8FF]/g, '').trim();
    // first index is ID
    var playerRanking = player.children[0].innerText;
    // second index is player name
    // last index is extra td
    for (var i = 2; i < player.children.length-1; i++) {
      stats[statCategories[i-2]] = player.children[i].innerText;
    }
    stats.playerName = playerName;
    allStats[playerRanking] = stats;
  });

  // Optional: save stats to chrome.storage,
  // re-save when out of date?
 //console.log(allStats);
  // console.log(allStats.length);
  // chrome.storage.local.set({allStats: allStats},
  //   function() {chrome.storage.local.get('allStats',
  //     function(data) {
  //       console.log(data);
  //     });
  //   });
  // chrome.storage.local.set({allStatsTimestamp: Date.now()}, function() {});
  cb();
};

function scrapePlayerFromRBR(playerNode) {
  //console.log(playerNode.children[1].innerText);
  //console.log(stats);

  var fantasyPlayer = playerNode.children[2].innerText.trim();        // Need to trim because of leading space before each player's name
  //console.log('Fantasy player:', fantasyPlayer);
  var draftedPlayer = playerNode.children[1].innerText;
  var draftedPlayerRank = playerNode.children[3].innerText;

  var stats = allStats[draftedPlayerRank];

  state[fantasyPlayer]['team'][draftedPlayerRank] = stats;
}

var scrapeDraftState = function(cb) {
  clickDraftResults();

  var draft = document.querySelector('#results-by-round').querySelector('tbody').getElementsByClassName('Fz-s');

  Array.prototype.slice.call(draft).forEach(scrapePlayerFromRBR);
};


// Scrapes queue state. Should be run on load.
var scrapeQueue = function() {
  queue = {};
  var currentQueue = document.querySelector('.ys-queue-container').querySelectorAll('.ys-player');
  Array.prototype.slice.call(currentQueue).forEach(function(playerNode) {
    var playerRank = playerNode.children[0].innerText;
    queue[playerRank] = allStats[playerRank];
  });
 //console.log('================queue================');
 //console.log(queue);
  sendQueue();
};


var initialize = function(cb) {
  // Populates fantasy players into state
  //debugger;
  getPlayerStats(function() {
    getPlayers(function() {
     //console.log(state);
      setTimeout(function() {
        scrapeDraftState();
        scrapeQueue();
        cb();
      }, 2000);
    });
  });
};

// from smack talk
// Get the player's name
// Get the teams
function sync() {
 //console.log('*************** calling sync ******************')
  initialize(function() {
    sendUser();
    sendState();
    //sendQueue();
    clickPlayers();
    //console.log('here');
    // set a listener to watch the draft.
    watchDraftAndUpdateState();
    // set a listener on ys-queue-table to scrape queue whenever it updates.
    // use actionOnLoad because every time queue is changed, ys-queue-table reloads.
    actionOnLoad(scrapeQueue, '.ys-queue-table');
  });
 //console.log('****************** sending state *******************');
}

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
  //console.log("=======================message received in content.js!======================");
  //console.log(event.data);
  if (event.data.command === 'init') {
    //console.log('initializing');
    initialize(function() {});
  }
  if (event.data.command === 'sync') {
    sync();
  }
  if (event.data.command === 'players') {
    getPlayerStats();
  }
}

// Check if draft page loaded. If so, sync.
if (onDraftPage()) {
  // watch for main draft page
  insertSidebar("popup.html", true);
  //console.log('in a draft');
  openSidebar();
  // ys-order-list-container seems to load last/late enough that everything else is loaded.
  actionOnLoad(sync, '#ys-order-list-container');
}
else {
  insertSidebar('http://giraffedraft.azurewebsites.net');
  //console.log('not in draft');
}

insertSidebarButton();

// var target = document.querySelector('body');

// var observer = new MutationObserver(function (mutations) {
//     // Whether you iterate over mutations..
//     mutations.forEach(function (mutation) {
//       // or use all mutation records is entirely up to you
//       var entry = {
//         mutation: mutation,
//         el: mutation.target,
//         value: mutation.target.textContent,
//         oldValue: mutation.oldValue
//       };
//       console.log('Recording mutation:', entry);
//     });
//   });
//
// var config = { attributes: true, childList: true, characterData: true };
//
// observer.observe(target, config);


// Setup sync on draft pick. Should only update new draft picks, not do
// full sync.

// This can't be in a function for some reason. If in a function, the
// event listener doesn't register???
// actionOnLoad(function() {
//   actionOnChange(function() {
//     updateState();
//     console.log('booga');
//   },'#ys-order-list-container');
// }, '#ys-order-list-container');

function watchDraftAndUpdateState() {
  actionOnChange(function() {
    updateState();
    //console.log('booga');
  },'#ys-order-list-container');
}

// sets a mutation observer on an element.
// if element doesn't exist, waits for it to be loaded with
// actionOnLoad.

// Need to test when draft is first starting.
// This works when joining a draft in progress, but NOT
// when draft first starts
function actionOnChange(action, selector, parent) {
  function watch() {
    var observer = new MutationObserver(function(mutations) {
      //console.log(mutations);
      action();
    });
    var config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(target, config);
    //console.log(observer);
  }

  var target = document.querySelector(selector);

  if (!target) {
    actionOnLoad(watch, selector, parent);
  }
  else {
    watch();
  }
}

// actionOnLoad: uses arrive.js to watch for arrival of DOM element
// at selector, and calls action() when it arrives.
// To fix: Should check for existence of
function actionOnLoad(action, selector, parent) {
  if (parent) {
    document.querySelector(parent).arrive(selector, function() {
      //console.log(this);
      action();
      //document.unbindArrive(selector);
    });
  }
  else {
    document.arrive(selector, function() {
      //console.log(this);
      action();
      //document.unbindArrive(selector);
    });
  }
}
