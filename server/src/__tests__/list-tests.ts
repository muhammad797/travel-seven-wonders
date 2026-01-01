/**
 * Script to list all tests and their status
 * Run with: tsx src/__tests__/list-tests.ts
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface TestInfo {
  file: string;
  describe: string;
  test: string;
  line: number;
}

function extractTestsFromFile(filePath: string): TestInfo[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const tests: TestInfo[] = [];
  const lines = content.split('\n');

  let currentDescribe = '';
  let currentNestedDescribe = '';
  let inDescribe = false;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Match describe blocks
    const describeMatch = line.match(/describe\(['"]([^'"]+)['"]/);
    if (describeMatch) {
      if (!inDescribe) {
        currentDescribe = describeMatch[1];
        inDescribe = true;
      } else {
        currentNestedDescribe = describeMatch[1];
      }
    }

    // Match it/test blocks
    const itMatch = line.match(/(?:it|test)\(['"]([^'"]+)['"]/);
    if (itMatch) {
      const testName = itMatch[1];
      const fullPath = currentNestedDescribe
        ? `${currentDescribe} › ${currentNestedDescribe} › ${testName}`
        : `${currentDescribe} › ${testName}`;

      tests.push({
        file: path.basename(filePath),
        describe: currentDescribe,
        test: testName,
        line: lineNum,
      });
    }

    // Reset nested describe on closing brace
    if (line.includes('});') && currentNestedDescribe) {
      currentNestedDescribe = '';
    }
  });

  return tests;
}

function findAllTestFiles(dir: string): string[] {
  const testFiles: string[] = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      testFiles.push(...findAllTestFiles(fullPath));
    } else if (file.name.endsWith('.test.ts') || file.name.endsWith('.spec.ts')) {
      testFiles.push(fullPath);
    }
  }

  return testFiles;
}

// Find all test files
const srcDir = path.join(__dirname, '..');
const testFiles = findAllTestFiles(srcDir);

console.log('\n📋 Test Suite Summary\n');
console.log('=' .repeat(80));

const allTests: TestInfo[] = [];

testFiles.forEach((file) => {
  const tests = extractTestsFromFile(file);
  allTests.push(...tests);
});

// Group by file
const testsByFile = allTests.reduce((acc, test) => {
  if (!acc[test.file]) {
    acc[test.file] = [];
  }
  acc[test.file].push(test);
  return acc;
}, {} as Record<string, TestInfo[]>);

Object.entries(testsByFile).forEach(([file, tests]) => {
  console.log(`\n📁 ${file}`);
  console.log('-'.repeat(80));
  tests.forEach((test, index) => {
    console.log(`  ${index + 1}. ${test.describe} › ${test.test}`);
  });
});

console.log('\n' + '='.repeat(80));
console.log(`\nTotal Tests: ${allTests.length}`);
console.log(`Test Files: ${testFiles.length}\n`);

