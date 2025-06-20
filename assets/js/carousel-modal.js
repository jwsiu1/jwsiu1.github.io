document.addEventListener('DOMContentLoaded', function() {
	// First carousel
	const images = document.querySelectorAll('.carousel-images:not(.second) img');
	const left = document.querySelector('.carousel-arrow.left:not(.second)');
	const right = document.querySelector('.carousel-arrow.right:not(.second)');
	let current = 0;
	function showImage(idx) {
		images.forEach((img, i) => img.classList.toggle('active', i === idx));
	}
	if (left && right && images.length) {
		left.addEventListener('click', function() {
			current = (current - 1 + images.length) % images.length;
			showImage(current);
		});
		right.addEventListener('click', function() {
			current = (current + 1) % images.length;
			showImage(current);
		});
		showImage(current);
	}
	// Second carousel
	const images2 = document.querySelectorAll('.carousel-images.second img');
	const left2 = document.querySelector('.carousel-arrow.left.second');
	const right2 = document.querySelector('.carousel-arrow.right.second');
	let current2 = 0;
	function showImage2(idx) {
		images2.forEach((img, i) => img.classList.toggle('active', i === idx));
	}
	if (left2 && right2 && images2.length) {
		left2.addEventListener('click', function() {
			current2 = (current2 - 1 + images2.length) % images2.length;
			showImage2(current2);
		});
		right2.addEventListener('click', function() {
			current2 = (current2 + 1) % images2.length;
			showImage2(current2);
		});
		showImage2(current2);
	}
	// First carousel indicators
	const indicators = document.querySelector('.carousel .carousel-indicators');
	if (indicators && images.length) {
		for (let i = 0; i < images.length; i++) {
			const dot = document.createElement('span');
			dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
			dot.addEventListener('click', function() {
				current = i;
				showImage(current);
				updateIndicators();
			});
			indicators.appendChild(dot);
		}
	}
	function updateIndicators() {
		const dots = indicators.querySelectorAll('.carousel-dot');
		dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
	}
	// Update indicators on image change
	if (left && right && images.length) {
		left.addEventListener('click', updateIndicators);
		right.addEventListener('click', updateIndicators);
	}
	// Second carousel indicators
	const indicators2 = document.querySelector('.carousel-indicators.second');
	if (indicators2 && images2.length) {
		for (let i = 0; i < images2.length; i++) {
			const dot2 = document.createElement('span');
			dot2.className = 'carousel-dot' + (i === 0 ? ' active' : '');
			dot2.addEventListener('click', function() {
				current2 = i;
				showImage2(current2);
				updateIndicators2();
			});
			indicators2.appendChild(dot2);
		}
	}
	function updateIndicators2() {
		const dots2 = indicators2.querySelectorAll('.carousel-dot');
		dots2.forEach((dot, i) => dot.classList.toggle('active', i === current2));
	}
	if (left2 && right2 && images2.length) {
		left2.addEventListener('click', updateIndicators2);
		right2.addEventListener('click', updateIndicators2);
	}
	// Gallery modal
	const gallery = document.querySelector('#memories .gallery');
	if (gallery) {
		const galleryImages = gallery.querySelectorAll('.gallery-item img');
		const modalOverlay = document.getElementById('gallery-modal-overlay');
		const modalImg = modalOverlay.querySelector('.gallery-modal-img');
		const modalDesc = modalOverlay.querySelector('.gallery-modal-desc');
		const modalClose = modalOverlay.querySelector('.gallery-modal-close');
		// Carousel modal elements
		const modalCarousel = modalOverlay.querySelector('.gallery-modal-carousel');
		const modalCarouselImg = modalOverlay.querySelector('.gallery-modal-carousel-img');
		const modalCarouselDesc = modalOverlay.querySelector('.gallery-modal-carousel-desc');
		const modalCarouselIndicators = modalOverlay.querySelector('.gallery-modal-carousel-indicators');
		const modalCarouselLeft = modalOverlay.querySelector('.gallery-modal-arrow.left');
		const modalCarouselRight = modalOverlay.querySelector('.gallery-modal-arrow.right');
		let carouselImages = [], carouselDescs = [], carouselCurrent = 0;
		// Single image click
		galleryImages.forEach(img => {
			img.addEventListener('click', function() {
				const parent = img.closest('.gallery-item');
				if (parent && parent.classList.contains('gallery-multi')) return; // skip multi, handled below
				modalOverlay.style.display = 'flex';
				modalImg.src = this.src;
				modalImg.alt = this.alt;
				modalDesc.textContent = this.getAttribute('data-description');
				modalImg.style.display = '';
				modalDesc.style.display = '';
				modalCarousel.style.display = 'none';
			});
		});
		// Multi-image gallery item
		const galleryMulti = gallery.querySelectorAll('.gallery-item.gallery-multi');
		galleryMulti.forEach(item => {
			item.addEventListener('click', function() {
				carouselImages = JSON.parse(item.getAttribute('data-images'));
				carouselDescs = JSON.parse(item.getAttribute('data-descriptions'));
				carouselCurrent = 0;
				modalOverlay.style.display = 'flex';
				modalImg.style.display = 'none';
				modalDesc.style.display = 'none';
				modalCarousel.style.display = 'flex';
				// Clear old indicators
				modalCarouselIndicators.innerHTML = '';
				for (let i = 0; i < carouselImages.length; i++) {
					const dot = document.createElement('span');
					dot.className = 'gallery-modal-dot' + (i === 0 ? ' active' : '');
					dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#ccc;display:inline-block;transition:background 0.2s;cursor:pointer;';
					dot.addEventListener('click', function() {
						showCarousel(i);
					});
					modalCarouselIndicators.appendChild(dot);
				}
				showCarousel(0);
			});
		});
		function showCarousel(idx) {
			// Wrap index for infinite scroll
			if (idx < 0) idx = carouselImages.length - 1;
			if (idx >= carouselImages.length) idx = 0;
			modalCarouselImg.src = carouselImages[idx];
			modalCarouselImg.alt = carouselDescs[idx] || '';
			modalCarouselDesc.textContent = carouselDescs[idx] || '';
			Array.from(modalCarouselIndicators.children).forEach((dot, i) => {
				dot.classList.toggle('active', i === idx);
				dot.style.background = i === idx ? '#6ec1e4' : '#ccc';
			});
			carouselCurrent = idx;
		}
		modalCarouselLeft.addEventListener('click', function() {
			showCarousel(carouselCurrent - 1);
		});
		modalCarouselRight.addEventListener('click', function() {
			showCarousel(carouselCurrent + 1);
		});
		modalClose.addEventListener('click', function() {
			modalOverlay.style.display = 'none';
			modalImg.src = '';
			modalDesc.textContent = '';
			modalCarouselImg.src = '';
			modalCarouselDesc.textContent = '';
			modalCarousel.style.display = 'none';
		});
		modalOverlay.addEventListener('click', function(e) {
			if (e.target === modalOverlay) {
				modalOverlay.style.display = 'none';
				modalImg.src = '';
				modalDesc.textContent = '';
				modalCarouselImg.src = '';
				modalCarouselDesc.textContent = '';
				modalCarousel.style.display = 'none';
			}
		});
	}
	// Mini-carousel logic for gallery
	const miniCarousels = document.querySelectorAll('.mini-carousel');
	miniCarousels.forEach(function(carousel) {
		const imgs = carousel.querySelectorAll('.mini-carousel-images img');
		const leftBtn = carousel.querySelector('.mini-carousel-arrow.left');
		const rightBtn = carousel.querySelector('.mini-carousel-arrow.right');
		const indicators = carousel.querySelector('.mini-carousel-indicators');
		let current = 0;
		// Create indicators
		imgs.forEach((img, i) => {
			const dot = document.createElement('span');
			dot.className = 'mini-carousel-dot' + (i === 0 ? ' active' : '');
			dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:#ccc;display:inline-block;transition:background 0.2s;cursor:pointer;';
			dot.addEventListener('click', function() {
				show(i);
			});
			indicators.appendChild(dot);
		});
		function show(idx) {
			imgs.forEach((img, i) => {
				img.style.display = i === idx ? '' : 'none';
				img.classList.toggle('active', i === idx);
			});
			indicators.querySelectorAll('.mini-carousel-dot').forEach((dot, i) => {
				dot.classList.toggle('active', i === idx);
				dot.style.background = i === idx ? '#6ec1e4' : '#ccc';
			});
			current = idx;
		}
		leftBtn.addEventListener('click', function() {
			show((current - 1 + imgs.length) % imgs.length);
		});
		rightBtn.addEventListener('click', function() {
			show((current + 1) % imgs.length);
		});
		show(current);
	});
});
