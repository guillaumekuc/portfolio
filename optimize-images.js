import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { existsSync } from 'fs';

// Configuration
const config = {
	maxWidth: 1920,
	maxHeight: 1080,
	quality: 90,
	directories: [
		'public/img/.old',
		'public/img/.old/portfolio'
	],
	backup: false // Set to true to create .bak files
};

async function optimizeImages() {
	const { maxWidth, maxHeight, quality, directories, backup } = config;
	
	let totalOriginal = 0;
	let totalOptimized = 0;
	let processedCount = 0;

	for (const dir of directories) {
		if (!existsSync(dir)) {
			console.log(`⚠️  Directory not found: ${dir}`);
			continue;
		}

		try {
			const files = await readdir(dir);
			const imageFiles = files.filter(file => 
				/\.(jpg|jpeg|png)$/i.test(extname(file))
			);

			if (imageFiles.length === 0) {
				continue;
			}

			console.log(`\n📸 Processing ${imageFiles.length} images in ${dir}...`);

			for (const file of imageFiles) {
				const inputPath = join(dir, file);
				const ext = extname(file).toLowerCase();
				const nameWithoutExt = basename(file, ext);
				
				// Keep PNG as PNG (for transparency), keep JPG as JPG
				// PNGs with transparency should not be converted to JPEG
				const outputExt = ext; // Keep original extension
				const outputPath = join(dir, nameWithoutExt + outputExt);

				try {
					const stats = await stat(inputPath);
					const originalSize = stats.size;
					
					// Skip if already optimized (under 200KB)
					if (originalSize < 200 * 1024) {
						console.log(`   ⏭️  Skipping ${file} (already optimized: ${(originalSize / 1024).toFixed(1)} KB)`);
						continue;
					}
					
					totalOriginal += originalSize;

					// Create backup if requested
					if (backup && inputPath !== outputPath) {
						const backupPath = inputPath + '.bak';
						if (!existsSync(backupPath)) {
							const fs = await import('fs/promises');
							await fs.copyFile(inputPath, backupPath);
						}
					}

					// Use temp file if input and output are the same (to avoid Sharp error)
					const fs = await import('fs/promises');
					const tempPath = inputPath === outputPath 
						? join(dir, nameWithoutExt + '_temp' + outputExt)
						: outputPath;

					const sharpInstance = sharp(inputPath)
						.resize(maxWidth, maxHeight, {
							withoutEnlargement: true,
							fit: 'inside'
						});

					if (outputExt === '.jpg' || outputExt === '.jpeg') {
						await sharpInstance
							.jpeg({ quality, mozjpeg: true })
							.toFile(tempPath);
					} else if (outputExt === '.png') {
						// Preserve PNG with transparency support
						await sharpInstance
							.png({ compressionLevel: 9, quality: 90 })
							.toFile(tempPath);
					} else {
						await sharpInstance.toFile(tempPath);
					}

					// Replace original with optimized version if same file
					if (inputPath === outputPath) {
						await fs.unlink(inputPath);
						await fs.rename(tempPath, outputPath);
					}

					const newStats = await stat(outputPath);
					const newSize = newStats.size;
					totalOptimized += newSize;
					processedCount++;
					const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

					console.log(`   ✅ ${file} → ${basename(outputPath)} (${(originalSize / 1024).toFixed(1)} KB → ${(newSize / 1024).toFixed(1)} KB, -${savings}%)`);
				} catch (error) {
					console.error(`   ❌ Error optimizing ${file}:`, error.message);
				}
			}
		} catch (error) {
			console.error(`❌ Error processing ${dir}:`, error.message);
		}
	}

	if (processedCount > 0) {
		const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
		console.log(`\n📊 Optimization complete:`);
		console.log(`   Processed: ${processedCount} images`);
		console.log(`   Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
		console.log(`   Optimized total: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
		console.log(`   💾 Total saved: ${totalSavings}%`);
	}
}

async function main() {
	console.log('🚀 Starting image optimization...\n');
	
	await optimizeImages();
	
	console.log('\n✨ Optimization complete!');
}

main().catch(console.error);

