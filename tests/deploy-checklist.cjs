/**
 * Tresit Deployment Checklist
 * Run this script to check if the app is ready for deployment
 * Usage: node tests/deploy-checklist.cjs
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const publicDir = path.join(rootDir, 'public');
const packageJsonPath = path.join(rootDir, 'package.json');

// Define checklist items
const checklist = {
  // PWA Requirements
  'Service Worker': {
    file: path.join(publicDir, 'service-worker.js'),
    required: true
  },
  'Web App Manifest': {
    file: path.join(publicDir, 'manifest.json'),
    required: true
  },
  'PWA Icons': {
    folder: path.join(publicDir, 'icons'),
    required: false
  },
  
  // Performance Optimizations
  'LazyImage Component': {
    file: path.join(srcDir, 'components', 'LazyImage.jsx'),
    required: true
  },
  'React.lazy Implementation': {
    check: () => {
      const appPath = path.join(srcDir, 'App.jsx');
      const content = fs.readFileSync(appPath, 'utf8');
      return content.includes('lazy') && content.includes('Suspense');
    },
    message: 'React.lazy and Suspense implementation in App.jsx',
    required: true
  },
  
  // Build Configuration
  'Vite Config': {
    check: () => {
      const vitePath = path.join(rootDir, 'vite.config.js');
      const content = fs.readFileSync(vitePath, 'utf8');
      return content.includes('build') && content.includes('manualChunks');
    },
    message: 'Build optimizations in vite.config.js',
    required: true
  },
  
  // Documentation
  'README': {
    check: () => {
      const readmePath = path.join(rootDir, 'README.md');
      const content = fs.readFileSync(readmePath, 'utf8');
      return content.includes('Performance Optimizations') && 
             content.includes('Installation') && 
             content.includes('Deployment');
    },
    message: 'Comprehensive README with documentation',
    required: true
  },
  
  // Dependencies
  'Production Dependencies': {
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'recharts'];
      return requiredDeps.every(dep => Object.keys(packageJson.dependencies).includes(dep));
    },
    message: 'All required production dependencies are present',
    required: true
  }
};

// Run checks
console.log(chalk.blue.bold('\n🔍 TRESIT DEPLOYMENT CHECKLIST\n'));

let passedCount = 0;
let failedCount = 0;
let warningCount = 0;

Object.entries(checklist).forEach(([name, check]) => {
  let passed = false;
  let message = '';
  
  try {
    if (check.file) {
      passed = fs.existsSync(check.file);
      message = `${check.file} exists`;
    } else if (check.folder) {
      passed = fs.existsSync(check.folder) && fs.readdirSync(check.folder).length > 0;
      message = `${check.folder} exists and contains files`;
    } else if (check.check) {
      passed = check.check();
      message = check.message;
    }
    
    if (passed) {
      console.log(chalk.green('✅ PASS: ') + chalk.white(name) + ' - ' + chalk.gray(message));
      passedCount++;
    } else if (check.required) {
      console.log(chalk.red('❌ FAIL: ') + chalk.white(name) + ' - ' + chalk.gray(message));
      failedCount++;
    } else {
      console.log(chalk.yellow('⚠️ WARNING: ') + chalk.white(name) + ' - ' + chalk.gray(message));
      warningCount++;
    }
  } catch (error) {
    console.log(chalk.red('❌ ERROR: ') + chalk.white(name) + ' - ' + chalk.gray(error.message));
    failedCount++;
  }
});

// Summary
console.log(chalk.blue.bold('\n📊 SUMMARY\n'));
console.log(`${chalk.green(`✅ Passed: ${passedCount}`)} | ${chalk.red(`❌ Failed: ${failedCount}`)} | ${chalk.yellow(`⚠️ Warnings: ${warningCount}`)}\n`);

if (failedCount > 0) {
  console.log(chalk.red.bold('❌ Some checks failed. Please address the issues before deployment.'));
  process.exit(1);
} else if (warningCount > 0) {
  console.log(chalk.yellow.bold('⚠️ Deployment possible, but consider addressing warnings for optimal experience.'));
  process.exit(0);
} else {
  console.log(chalk.green.bold('✅ All checks passed! The app is ready for deployment.'));
  process.exit(0);
} 