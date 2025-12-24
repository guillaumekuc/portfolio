<script>
	import portfolioConfig from '../../config/portfolio.json';
	import PortfolioGallery from './PortfolioGallery.svelte';

	const sectionConfig = portfolioConfig.portfolioSections.find(
		(section) => section.id === 'illustrationFolio2'
	);
</script>

<PortfolioGallery {sectionConfig} />
