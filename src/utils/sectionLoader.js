export function sectionLoader(node) {
	const overlay = document.createElement('div');
	overlay.className = 'section-loader-overlay';
	const spinner = document.createElement('div');
	spinner.className = 'section-loader-spinner';
	overlay.appendChild(spinner);
	node.appendChild(overlay);

	let fallbackId;

	setTimeout(() => {
		const imgs = [...node.querySelectorAll('img')];
		const posterImgs = [...node.querySelectorAll('video[poster]')].map((video) => {
			const img = new Image();
			img.src = video.poster;
			return img;
		});

		const all = [...imgs, ...posterImgs];

		if (all.length === 0 || all.every((img) => img.complete)) {
			overlay.classList.add('loaded');
			return;
		}

		let remaining = all.filter((img) => !img.complete).length;

		const onSettle = () => {
			remaining--;
			if (remaining <= 0) {
				clearTimeout(fallbackId);
				overlay.classList.add('loaded');
			}
		};

		for (const img of all) {
			if (!img.complete) {
				img.addEventListener('load', onSettle, { once: true });
				img.addEventListener('error', onSettle, { once: true });
			}
		}

		fallbackId = setTimeout(() => {
			overlay.classList.add('loaded');
		}, 6000);
	}, 0);

	return {
		destroy() {
			clearTimeout(fallbackId);
			overlay.remove();
		}
	};
}
