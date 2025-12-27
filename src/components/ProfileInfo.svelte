<div class="profileInfo">
	<div class="profileName">{profile.name}</div>
	<div class="profileHeadline">{profile.headline}</div>
	<div class="socialLinks">
		{#each socials.socials.filter(s => !s.disabled) as social}
			<a 
				href={social.url} 
				target="_blank" 
				rel="noopener noreferrer"
				class="socialLink"
				title={social.name}
				style="--icon-url: url('{social.icon}')"
			>
			</a>
		{/each}
	</div>
</div>

<script>
	import profile from '../config/profile.json';
	import socials from '../config/socials.json';
</script>

<style>
	.profileInfo {
		/* Font interface variables - map global variables to local scope */
		--profile-info-font-rounded: var(--ffRounded);
	}
	.profileInfo {
		display: flex;
		flex-direction: column;
		align-items: var(--profile-info-align-items, center);
		flex: 1;
		min-width: 0;
		
		/* Color interface variables */
		--profile-text-primary: var(--color-white);
		--profile-text-secondary: var(--color-gray-light);
		--profile-accent-color: var(--color-accent);
		
		/* Profile section variables */
		--profile-name-size: 24px;
		--profile-headline-size: 18px;
		--profile-location-size: 14px;
		--profile-availability-size: 14px;
		--social-link-size: 24px;
		--social-links-height: 32px;
		
		/* Layout variables */
		--profile-info-align-items: center;
		--profile-name-text-align: center;
		--profile-headline-text-align: center;
		--social-links-justify-content: center;
		--social-links-gap: 0.75em;
		--social-links-margin-top: 0.5em;
	}

	.profileName {
		font-family: var(--profile-info-font-rounded);
		font-size: var(--profile-name-size);
		font-weight: 500;
		color: var(--profile-text-primary);
		text-align: var(--profile-name-text-align);
		letter-spacing: 0.05em;
	}

	.profileHeadline {
		font-family: var(--profile-info-font-rounded);
		font-size: var(--profile-headline-size);
		font-weight: 400;
		color: var(--profile-text-secondary);
		text-align: var(--profile-headline-text-align);
		letter-spacing: 0.05em;
	}

	.profileLocation {
		font-family: var(--profile-info-font-rounded);
		font-size: var(--profile-location-size);
		font-weight: 300;
		color: var(--profile-text-secondary);
		text-align: center;
		letter-spacing: 0.05em;
		margin-top: 0.25em;
	}

	.socialLinks {
		display: flex;
		flex-wrap: wrap;
		gap: var(--social-links-gap);
		justify-content: var(--social-links-justify-content);
		align-items: center;
		margin-top: var(--social-links-margin-top);
		min-height: var(--social-links-height);
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.profileInfo {
			--profile-name-size: 22px;
			--profile-headline-size: 16px;
			--profile-location-size: 13px;
			--profile-availability-size: 13px;
			--social-link-size: 22px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.profileInfo {
			--profile-name-size: 18px;
			--profile-headline-size: 14px;
			--profile-location-size: 11px;
			--profile-availability-size: 11px;
			--social-link-size: 18px;
			--social-links-height: 24px;
			--profile-info-align-items: flex-start;
			--profile-name-text-align: left;
			--profile-headline-text-align: left;
			--social-links-justify-content: flex-start;
			--social-links-gap: 0.4em;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.profileInfo {
			--profile-name-size: 16px;
			--profile-headline-size: 12px;
			--profile-location-size: 10px;
			--profile-availability-size: 10px;
			--social-link-size: 16px;
			--social-links-height: 20px;
			--profile-info-align-items: flex-start;
			--profile-name-text-align: left;
			--profile-headline-text-align: left;
			--social-links-justify-content: flex-start;
			--social-links-gap: 0.33em;
			--social-links-margin-top: 0.35em;
		}
	}

	.socialLink {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--social-link-size);
		height: var(--social-link-size);
		background-color: currentColor;
		mask-image: var(--icon-url);
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
		color: var(--profile-text-secondary);
		transition: transform 0.15s ease-in, color 0.15s ease-in;
	}

	.socialLink:hover {
		transform: scale(1.1);
		color: var(--profile-text-primary);
	}

</style>


