<script>
	import portfolioConfig from '../../config/portfolio.json';
	import PortfolioGallery from './PortfolioGallery.svelte';

	const sectionConfig = portfolioConfig.portfolioSections.find(
		(section) => section.id === 'illustrationFolio1'
	);
</script>

<PortfolioGallery {sectionConfig} />
