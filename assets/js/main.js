'use strict'
window.onload = function() {

  var scrollUp = document.getElementById('top');

  scrollUp.onclick = function() {
		window.scrollTo(0,0);
    return false;
	};

};
