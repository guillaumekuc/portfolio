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
		display: flex;
		flex-direction: column;
		align-items: center;
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
			align-items: flex-start;
		}

		.profileName,
		.profileHeadline {
			text-align: left;
		}

		.socialLinks {
			justify-content: flex-start;
			gap: 0.4em;
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
			align-items: flex-start;
		}

		.profileName,
		.profileHeadline {
			text-align: left;
		}

		.socialLinks {
			justify-content: flex-start;
			gap: 0.3em;
			margin-top: 0.35em;
		}
	}

	.profileName {
		font-family: var(--ffRounded);
		font-size: var(--profile-name-size);
		font-weight: 500;
		color: var(--profile-text-primary);
		text-align: center;
		letter-spacing: 0.05em;
	}

	.profileHeadline {
		font-family: var(--ffRounded);
		font-size: var(--profile-headline-size);
		font-weight: 400;
		color: var(--profile-text-secondary);
		text-align: center;
		letter-spacing: 0.05em;
	}

	.profileLocation {
		font-family: var(--ffRounded);
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
		gap: 0.75em;
		justify-content: center;
		align-items: center;
		height: var(--social-links-height);
		margin-top: 0.5em;
		min-height: var(--social-links-height);
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
		color: var(--profile-text-primary);
		transition: transform 0.15s ease-in, color 0.15s ease-in;
	}

	.socialLink:hover {
		transform: scale(1.1);
		color: var(--profile-accent-color);
	}

</style>


