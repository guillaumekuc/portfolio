#!/usr/bin/env node

/**
 * SFTP Deployment Script for OVH Web Hosting
 * 
 * This script builds your Svelte site and uploads it to OVH via SFTP.
 * 
 * Usage:
 *   npm run deploy
 * 
 * Requirements:
 *   - .env file with SFTP credentials (see DEPLOYMENT_GUIDE.md)
 *   - node-ssh and dotenv packages installed
 * 
 * Security:
 *   - Never commit .env file (already in .gitignore)
 *   - Use deployment-specific credentials
 */

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { NodeSSH } from 'node-ssh';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration from environment variables
const config = {
  host: process.env.OVH_SFTP_HOST,
  port: parseInt(process.env.OVH_SFTP_PORT || '22'),
  username: process.env.OVH_SFTP_USERNAME,
  password: process.env.OVH_SFTP_PASSWORD,
  // Optional: use private key instead of password
  privateKey: process.env.OVH_SFTP_PRIVATE_KEY,
  // Remote directory (usually 'www' or 'public_html')
  remoteDir: process.env.OVH_SFTP_REMOTE_DIR || 'www',
  distDir: join(__dirname, 'dist'),
};

// Validate configuration
function validateConfig() {
  const required = ['host', 'username'];
  const missing = required.filter(key => !config[key]);
  
  if (!config.password && !config.privateKey) {
    missing.push('password or privateKey');
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => {
      if (key === 'password or privateKey') {
        console.error(`   - OVH_SFTP_PASSWORD or OVH_SFTP_PRIVATE_KEY`);
      } else {
        const envKey = key === 'host' ? 'OVH_SFTP_HOST' :
                       key === 'username' ? 'OVH_SFTP_USERNAME' : key;
        console.error(`   - ${envKey}`);
      }
    });
    console.error('\nPlease create a .env file in the project root with these variables.');
    console.error('See DEPLOYMENT_GUIDE.md for details.');
    process.exit(1);
  }
}

// Get all files recursively from a directory
function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push({
        localPath: fullPath,
        remotePath: config.remoteDir + '/' + relative(baseDir, fullPath).replace(/\\/g, '/'),
      });
    }
  }
  
  return files;
}

// Main deployment function
async function deploy() {
  console.log('🚀 Starting SFTP deployment to OVH...\n');
  
  // Validate configuration
  validateConfig();
  
  // Check if dist directory exists
  try {
    statSync(config.distDir);
  } catch (error) {
    console.error('❌ dist/ directory not found. Building project...\n');
    try {
      execSync('npm run build', { stdio: 'inherit' });
    } catch (buildError) {
      console.error('❌ Build failed. Please fix errors and try again.');
      process.exit(1);
    }
  }
  
  // Initialize SSH client
  const ssh = new NodeSSH();
  
  try {
    console.log('🔐 Connecting to OVH server...');
    const connectionOptions = {
      host: config.host,
      port: config.port,
      username: config.username,
    };
    
    if (config.privateKey) {
      connectionOptions.privateKey = config.privateKey;
    } else {
      connectionOptions.password = config.password;
    }
    
    await ssh.connect(connectionOptions);
    console.log('✅ Connected successfully\n');
    
    // Get all files to upload
    console.log('📦 Gathering files to upload...');
    const files = getAllFiles(config.distDir);
    console.log(`   Found ${files.length} file(s)\n`);
    
    if (files.length === 0) {
      console.error('❌ No files found in dist/ directory.');
      ssh.dispose();
      process.exit(1);
    }
    
    // Upload files
    console.log('⬆️  Uploading files...');
    let uploaded = 0;
    let failed = 0;
    
    for (const file of files) {
      try {
        // Ensure remote directory exists
        const remoteDir = file.remotePath.substring(0, file.remotePath.lastIndexOf('/'));
        await ssh.execCommand(`mkdir -p ${remoteDir}`, { cwd: '/' });
        
        // Upload file
        await ssh.putFile(file.localPath, file.remotePath);
        uploaded++;
        console.log(`   ✓ ${file.remotePath}`);
      } catch (error) {
        failed++;
        console.error(`   ✗ ${file.remotePath}: ${error.message}`);
      }
    }
    
    console.log(`\n✅ Uploaded ${uploaded} file(s)`);
    if (failed > 0) {
      console.error(`❌ Failed to upload ${failed} file(s)`);
    }
    
    // Set proper permissions (optional, adjust as needed)
    console.log('\n🔧 Setting file permissions...');
    try {
      await ssh.execCommand(`chmod -R 755 ${config.remoteDir}`, { cwd: '/' });
      await ssh.execCommand(`find ${config.remoteDir} -type f -exec chmod 644 {} \\;`, { cwd: '/' });
      console.log('✅ Permissions set');
    } catch (error) {
      console.warn('⚠️  Could not set permissions:', error.message);
    }
    
    // Disconnect
    ssh.dispose();
    
    // Success message
    console.log('\n🎉 Deployment complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Uploaded: ${uploaded} file(s)`);
    console.log(`   - Failed: ${failed} file(s)`);
    console.log(`\n🌐 Your site should be available at your OVH domain.`);
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    ssh.dispose();
    process.exit(1);
  }
}

// Check if node-ssh is installed
try {
  await import('node-ssh');
} catch (error) {
  console.error('❌ node-ssh package not found.');
  console.error('Please install it with: npm install --save-dev node-ssh dotenv');
  process.exit(1);
}

// Run deployment
deploy().catch(error => {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
});

