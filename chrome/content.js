var pageslideDirective = angular.module("pageslide-directive", []);

pageslideDirective.directive('pageslide', [
    function (){
        var defaults = {};

        /* Return directive definition object */

        return {
            restrict: "EA",
            replace: false,
            transclude: false,
            scope: {
                psOpen: "=?",
                psAutoClose: "=?"
            },
            link: function ($scope, el, attrs) {
                /* Inspect */
                //console.log($scope);
                //console.log(el);
                //console.log(attrs);

                /* parameters */
                var param = {};

                param.side = attrs.psSide || 'right';      // change default to slide from left because passing in a parameter isn't working
                param.speed = attrs.psSpeed || '0.5';
                param.size = attrs.psSize || '300px';
                param.zindex = attrs.psZindex || 1000;
                param.className = attrs.psClass || 'ng-pageslide';

                /* DOM manipulation */
                var content = null;
                var slider = null;

                if (!attrs.href && el.children() && el.children().length) {
                    content = el.children()[0];
                } else {

                    var targetId = (attrs.href || attrs.psTarget).substr(1);
                    content = document.getElementById(targetId);
                    slider = document.getElementById('pageslide-target-' + targetId);

                    if (!slider) {
                        slider = document.createElement('div');
                        slider.id = 'pageslide-target-' + targetId;
                    }
                }

                // Check for content
                if (!content)
                    throw new Error('You have to elements inside the <pageslide> or you have not specified a target href');

                slider = slider || document.createElement('div');
                slider.className = param.className;

                /* Style setup */
                slider.style.transitionDuration = param.speed + 's';
                slider.style.webkitTransitionDuration = param.speed + 's';
                slider.style.zIndex = param.zindex;
                slider.style.position = 'fixed';
                slider.style.width = 0;
                slider.style.height = 0;
                slider.style.transitionProperty = 'width, height';
                // put background color here - move to styles.css?
                slider.style.backgroundColor= 'white';

                switch (param.side){
                    case 'right':
                        slider.style.height = attrs.psCustomHeight || '100%';
                        slider.style.top = attrs.psCustomTop ||  '0px';
                        slider.style.bottom = attrs.psCustomBottom ||  '0px';
                        slider.style.right = attrs.psCustomRight ||  '0px';
                        break;
                    case 'left':
                        slider.style.height = attrs.psCustomHeight || '100%';
                        slider.style.top = attrs.psCustomTop || '0px';
                        slider.style.bottom = attrs.psCustomBottom || '0px';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        break;
                    case 'top':
                        slider.style.width = attrs.psCustomWidth || '100%';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        slider.style.top = attrs.psCustomTop || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                        break;
                    case 'bottom':
                        slider.style.width = attrs.psCustomWidth || '100%';
                        slider.style.bottom = attrs.psCustomBottom || '0px';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                        break;
                }


                /* Append */
                document.body.appendChild(slider);
                slider.appendChild(content);

                /* Closed */
                function psClose(slider,param){
                    if (slider && slider.style.width !== 0 && slider.style.width !== 0){
                        content.style.display = 'none';
                        switch (param.side){
                            case 'right':
                                slider.style.width = '0px';
                                break;
                            case 'left':
                                slider.style.width = '0px';
                                break;
                            case 'top':
                                slider.style.height = '0px';
                                break;
                            case 'bottom':
                                slider.style.height = '0px';
                                break;
                        }
                    }
                    $scope.psOpen = false;
                }

                /* Open */
                function psOpen(slider,param){
                    if (!$scope.psOpen ) {//(slider.style.width !== 0 && slider.style.width !== 0){
                        switch (param.side){
                            case 'right':
                                slider.style.width = param.size;
                                break;
                            case 'left':
                                slider.style.width = param.size;
                                break;
                            case 'top':
                                slider.style.height = param.size;
                                break;
                            case 'bottom':
                                slider.style.height = param.size;
                                break;
                        }
                        setTimeout(function(){
                            content.style.display = 'block';
                        },(param.speed * 1000));

                    }
                    else {
                        content.style.display = 'none';
                        switch (param.side){
                            case 'right':
                                slider.style.width = '0px';
                                break;
                            case 'left':
                                slider.style.width = '0px';
                                break;
                            case 'top':
                                slider.style.height = '0px';
                                break;
                            case 'bottom':
                                slider.style.height = '0px';
                                break;
                        }
                    $scope.psOpen = false;
                  }
                }

                function isFunction(functionToCheck){
                    var getType = {};
                    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
                }

                /*
                * Watchers
                * */

                if(attrs.psSize){
                    $scope.$watch(function(){
                        return attrs.psSize;
                    }, function(newVal,oldVal) {
                        param.size = newVal;
                        if($scope.psOpen) {
                            psOpen(slider,param);
                        }
                    });
                }

                $scope.$watch("psOpen", function (value){
                    if (!!value) {
                        // Open
                        psOpen(slider,param);
                    } else {
                        // Close
                        psClose(slider,param);
                    }
                });

                // close panel on location change
                if($scope.psAutoClose){
                    $scope.$on("$locationChangeStart", function(){
                        psClose(slider, param);
                        if(isFunction($scope.psAutoClose)) {
                            $scope.psAutoClose();
                        }
                    });
                    $scope.$on("$stateChangeStart", function(){
                        psClose(slider, param);
                        if(isFunction($scope.psAutoClose)) {
                            $scope.psAutoClose();
                        }
                    });
                }



                /*
                * Events
                * */

                $scope.$on('$destroy', function() {
                    document.body.removeChild(slider);
                });

                var close_handler = (attrs.href) ? document.getElementById(attrs.href.substr(1) + '-close') : null;
                if (el[0].addEventListener) {
                    el[0].addEventListener('click',function(e){
                        e.preventDefault();
                        psOpen(slider,param);
                    });

                    if (close_handler){
                        close_handler.addEventListener('click', function(e){
                            e.preventDefault();
                            psClose(slider,param);
                        });
                    }
                } else {
                    // IE8 Fallback code
                    el[0].attachEvent('onclick',function(e){
                        e.returnValue = false;
                        psOpen(slider,param);
                    });

                    if (close_handler){
                        close_handler.attachEvent('onclick', function(e){
                            e.returnValue = false;
                            psClose(slider,param);
                        });
                    }
                }

            }
        };
    }
]);
//==============================================================================================

// get the yahoo top menu bar
var topBar = document.getElementById('yucs-top-list');
console.log(topBar);

// create an element to open the slider
var toggler = document.createElement('li');
var a = document.createElement('a');
var linkText = document.createTextNode("GiraffeDraft");
a.appendChild(linkText);
a.title = "Giraffe Draft";
a.href = "#slider";
a.style.position = 'fixed';
a.style.right = '30px';
a.style.top = '30px';
a.style.zIndex = '100000000';
a.setAttribute('pageslide', 'left');
a.setAttribute('ps-zindex', '100000001');
//a.setAttribute('ng-click', 'calculate()');
toggler.appendChild(a);

console.log(toggler);

// add the slider toggler to the yahoo menu bar
document.body.appendChild(toggler);

// Add angular to the root HTML node
(document.documentElement).setAttribute('ng-app','gDraft');
// Add angular controller to body
(document.body).setAttribute('ng-controller', 'gDController');

// Add the slider element
var slider = document.createElement('div');
slider.id = "slider";
<<<<<<< HEAD
slider.style.height='100%';

var url = chrome.extension.getURL("popup.html");
console.log(typeof url);
console.log(url);
slider.innerHTML = '<object type="text/html" data="' + url + '" height="100%"></object>';
document.body.appendChild(slider);


angular.module('gDraft', ['pageslide-directive'])
.controller('gDController', function($scope, $http){});
=======
//slider.innerHTML = '<div ng-include="app.html"></div>';
//slider.setAttribute('ng-include', "'app.html'");
slider.innerHTML = "<h1>GIRAFFE DRAFT</h1> \
  <div> \
  <button ng-click='initialize()'>INITIALIZE</button> \
  </div> \
   <div style='overflow:scroll; font-color:black  '> \
    SUGGESTIONS \
    <ol> \
      <li class='suggested' ng-repeat='suggested in suggestions'> \
        {{suggested.NAME}} \
      </li> \
    </ol> \
  </div> \
  <script src='slider.js'></script>";
document.body.appendChild(slider);


var click = function(){
  document.querySelector('.NavTabs').childNodes[5].click();
};

angular.module('gDraft', ['pageslide-directive'])

.controller('gDController', function($scope, $http){
  $scope.undrafted = [];
  $scope.suggestions = [];
  $scope.drafted = [];
  $scope.state = {};

  $http.get('http://giraffedraft.azurewebsites.net/api/init').
  success(function(data, status, headers, config){
    $scope.undrafted = data;
    $scope.calculate();

  }).
  error(function(data, status, headers, config){
    console.log('failed!!!!!!!!!!!')
  })

  // $http.post('http://giraffedraft.azurewebsites.net/api/suggest', $scope.undrafted).
  //   success(function(data, status, headers, config) {
  //     $scope.suggestions = data;
  //     console.log('initialized suggestions')
  //   }).
  //   error(function(data, status, headers, config) {
  //     console.log('does not work');
  //  });

  $scope.calculate = function(){
    $http.post('http://giraffedraft.azurewebsites.net/api/suggest', $scope.undrafted).
    success(function(data, status, headers, config) {
      $scope.suggestions = data;
    }).
    error(function(data, status, headers, config) {
      console.log('does not work', $scope.undrafted);
    });
  }


  $scope.markDrafted = function(){
    console.log('undrafted', this.player)
    $scope.drafted.push(this.player)
    var ind = $scope.undrafted.indexOf(this.player)
    $scope.undrafted.splice(ind,1);
    $scope.calculate();
  }

  $scope.getPlayers = function() {
    document.querySelector('.NavTabs').childNodes[5].click();
    document.querySelector('.SubNavTabs').children[1].click();

    var players = document.getElementsByClassName('Fz-xs Ell');
    console.log(players);
    Array.prototype.slice.call(players).forEach(function(player) {
      $scope.state[player.innerHTML] = [];
    });
  };

  $scope.initialize = function() {
    // Populates fantasy players into state
    $scope.getPlayers();
    console.log($scope.state);

    // Select the draft results tab
    document.querySelector('.NavTabs').childNodes[5].click();
    document.querySelector('.SubNavTabs').children[0].click();

    var draft = document.querySelector('#results-by-round').querySelector('tbody').children;
    Array.prototype.slice.call(draft).forEach(function(playerNode) {
      if (playerNode.className !== 'drkTheme') {
        var fantasyPlayer = playerNode.children[2].innerText.trim();        // Need to trim because of leading space before each player's name
        //console.log('Fantasy player:', fantasyPlayer);
        var draftedPlayer = playerNode.children[1].innerText;
        $scope.state[fantasyPlayer].push(draftedPlayer);
      }
    });
    console.log($scope.state);

    //click();
  //  $scope.suggestions.push({NAME:document.querySelector('.NavTabs')});
  }
});
>>>>>>> Added INITIALIZE button to slider, which retrieves player info into $scope.state
