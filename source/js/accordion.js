(function() {

	const accToglers = document.querySelectorAll('.j-acc-togler');

	if (accToglers[0]) {
		[].forEach.call(accToglers, function(el, i, accToglers) {
			el.addEventListener('click', function() {
				[].forEach.call(accToglers, function(el) {
					if(el !== this) {
						el.closest('.j-acc-item').classList.remove("is-open");
						this.setAttribute('aria-expanded', 'false');
					}
				}, this);

				const item = this.closest('.j-acc-item')

				if (!item.classList.contains('is-open')) {
					item.classList.add('is-open');
					this.setAttribute('aria-expanded', 'true');
				} else {
					item.classList.remove('is-open');
					this.setAttribute('aria-expanded', 'false');
				}
			});
		});
	};

})();
