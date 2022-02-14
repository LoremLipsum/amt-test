'use strict';

(function() {

	var accItems = document.querySelectorAll('.j-acc-item');

	if (accItems[0]) {
		for(var i = 0; i < accItems.length; i++) {
			accItems[i].addEventListener('click', function(e) {
				if (e.target.classList.contains('j-acc-togler')) {
					e.preventDefault();
					var toggler = e.target;
					var item = toggler.parentNode.parentNode

					for(var j = 0; j < accItems.length; j++) {
						if (accItems[j] !== item) {
							accItems[j].classList.remove('is-open');
						  accItems[j].querySelector('.j-acc-togler').setAttribute('aria-expanded', 'false');
						}
					}

					if (!item.classList.contains('is-open')) {
						item.classList.add('is-open');
						toggler.setAttribute('aria-expanded', 'true');
					} else {
						item.classList.remove('is-open');
						toggler.setAttribute('aria-expanded', 'false');
					}
				}
			})
		}
	}

})();
