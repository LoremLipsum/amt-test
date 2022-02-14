(function() {

	var faqSlider = document.querySelectorAll('.j-faq-slider');

	if (faqSlider[0]) {
		var slider = new Swiper('.j-faq-slider', {
			slidesPerView: 1,
			navigation: {
				prevEl: '.j-faq-prev',
				nextEl: '.j-faq-next',
				clickable: true,
				disabledClass: 'disabled',
			},
			breakpoints: {
				640: {
					slidesPerView: 2
				},
				1024: {
					slidesPerView: 3
				},
				1280: {
					slidesPerView: 4
				},
			},
		});
	}

})();
