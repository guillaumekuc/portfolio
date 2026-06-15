#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { NodeSSH } from 'node-ssh';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  host: process.env.OVH_SFTP_HOST,
  port: parseInt(process.env.OVH_SFTP_PORT || '22'),
  username: process.env.OVH_SFTP_USERNAME,
  password: process.env.OVH_SFTP_PASSWORD,
  privateKey: process.env.OVH_SFTP_PRIVATE_KEY,
  remoteDir: process.env.OVH_SFTP_REMOTE_DIR || 'www',
  distDir: join(__dirname, 'dist'),
};

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
    process.exit(1);
  }
}

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

async function deploy() {
  console.log('🚀 Starting SFTP deployment to OVH...\n');

  validateConfig();

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

  const ssh = new NodeSSH();

  try {
    console.log('🔐 Connecting to OVH server...');
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   Username: ${config.username}`);

    const connectionOptions = {
      host: config.host,
      port: config.port,
      username: config.username,
      readyTimeout: 20000,
      keepaliveInterval: 10000,
    };

    if (config.privateKey) {
      connectionOptions.privateKey = config.privateKey;
    } else {
      connectionOptions.password = config.password;
    }

    await ssh.connect(connectionOptions);
    console.log('✅ Connected successfully\n');

    console.log('📦 Gathering files to upload...');
    const files = getAllFiles(config.distDir);
    console.log(`   Found ${files.length} file(s)\n`);

    if (files.length === 0) {
      console.error('❌ No files found in dist/ directory.');
      ssh.dispose();
      process.exit(1);
    }

    console.log('⬆️  Uploading files...');
    let uploaded = 0;
    let failed = 0;

    for (const file of files) {
      try {
        const remoteDir = file.remotePath.substring(0, file.remotePath.lastIndexOf('/'));
        await ssh.execCommand(`mkdir -p ${remoteDir}`, { cwd: '/' });
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

    console.log('\n🔧 Setting file permissions...');
    try {
      await ssh.execCommand(`chmod -R 755 ${config.remoteDir}`, { cwd: '/' });
      await ssh.execCommand(`find ${config.remoteDir} -type f -exec chmod 644 {} \\;`, { cwd: '/' });
      console.log('✅ Permissions set');
    } catch (error) {
      console.warn('⚠️  Could not set permissions:', error.message);
    }

    ssh.dispose();

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

try {
  await import('node-ssh');
} catch (error) {
  console.error('❌ node-ssh package not found.');
  console.error('Please install it with: npm install --save-dev node-ssh dotenv');
  process.exit(1);
}

deploy().catch(error => {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
});
