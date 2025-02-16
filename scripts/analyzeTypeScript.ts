import { Project, Node, SourceFile, ImportDeclaration } from 'ts-morph';
import { resolve, join, relative } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = resolve(__filename, '../..');
const SRC_DIR = resolve(ROOT_DIR, 'src');
const IGNORED_DIRS = ['node_modules', 'dist', 'build', '.git'];

interface TypeScriptIssue {
  filePath: string;
  line: number;
  column: number;
  message: string;
  category: 'error' | 'warning';
  code: string;
  suggestions?: string[];
}

interface AnalysisResult {
  issues: TypeScriptIssue[];
  fixes: number;
  scannedFiles: number;
}

// Initialize project with compiler options
const project = new Project({
  tsConfigFilePath: resolve(ROOT_DIR, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: false,
  skipFileDependencyResolution: false,
});

function scanDirectory(dir: string): string[] {
  const files: string[] = [];
  
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    
    if (IGNORED_DIRS.includes(entry)) continue;
    
    if (statSync(fullPath).isDirectory()) {
      files.push(...scanDirectory(fullPath));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function getSuggestions(diagnostic: any): string[] {
  const suggestions: string[] = [];
  
  // Common TypeScript error codes and their fixes
  const errorFixes: Record<number, (diagnostic: any) => string[]> = {
    2304: () => ['Check if the module is installed and imported correctly'],
    2307: () => ['Verify the import path is correct', 'Make sure the file exists'],
    2322: () => ['Check the type compatibility', 'Consider using type assertion if necessary'],
    2339: () => ['Verify the property exists on the type', 'Check for typos'],
    2345: () => ['Ensure argument types match the function parameters'],
    2551: () => ['Check the property name for typos', 'Verify the object has the property'],
    2571: () => ['Initialize the object with required properties'],
    7006: () => ['Explicitly declare the parameter type'],
    7031: () => ['Add type declarations for the module']
  };

  const code = diagnostic.getCode();
  if (errorFixes[code]) {
    suggestions.push(...errorFixes[code](diagnostic));
  }

  return suggestions;
}

function analyzeFile(sourceFile: SourceFile): TypeScriptIssue[] {
  const issues: TypeScriptIssue[] = [];
  const diagnostics = sourceFile.getPreEmitDiagnostics();

  for (const diagnostic of diagnostics) {
    const { line, character } = diagnostic.getLineAndCharacter();
    const message = diagnostic.getMessageText();
    const code = diagnostic.getCode().toString();
    
    issues.push({
      filePath: relative(ROOT_DIR, sourceFile.getFilePath()),
      line,
      column: character,
      message: typeof message === 'string' ? message : message.getMessageText(),
      category: diagnostic.getCategory() === 1 ? 'warning' : 'error',
      code,
      suggestions: getSuggestions(diagnostic)
    });
  }

  return issues;
}

function fixCommonIssues(sourceFile: SourceFile): number {
  let fixCount = 0;

  // Fix 1: Add missing type annotations
  sourceFile.getFunctions().forEach(func => {
    if (!func.getReturnTypeNode() && !func.isOverload()) {
      const returnType = project.getTypeChecker().getReturnTypeOfSignature(func.getSignature());
      func.setReturnType(returnType.getText());
      fixCount++;
    }
  });

  // Fix 2: Add missing interface properties
  sourceFile.getInterfaces().forEach(interface_ => {
    interface_.getProperties().forEach(prop => {
      if (!prop.getTypeNode()) {
        const type = project.getTypeChecker().getTypeAtLocation(prop);
        prop.setType(type.getText());
        fixCount++;
      }
    });
  });

  // Fix 3: Fix import paths
  sourceFile.getImportDeclarations().forEach(importDecl => {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    if (moduleSpecifier.startsWith('./') || moduleSpecifier.startsWith('../')) {
      const resolvedPath = resolve(sourceFile.getDirectoryPath(), moduleSpecifier);
      if (!existsSync(resolvedPath + '.ts') && !existsSync(resolvedPath + '.tsx')) {
        const correctPath = findCorrectImportPath(resolvedPath);
        if (correctPath) {
          importDecl.setModuleSpecifier(correctPath);
          fixCount++;
        }
      }
    }
  });

  if (fixCount > 0) {
    sourceFile.saveSync();
  }

  return fixCount;
}

function findCorrectImportPath(originalPath: string): string | null {
  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  for (const ext of extensions) {
    if (existsSync(originalPath + ext)) {
      return originalPath + ext;
    }
  }
  return null;
}

function generateReport(result: AnalysisResult): void {
  console.log('\n🔍 TypeScript Analysis Report\n');

  if (result.issues.length === 0) {
    console.log('✅ No TypeScript issues found!');
    console.log(`📊 Scanned ${result.scannedFiles} files`);
    return;
  }

  const errorCount = result.issues.filter(i => i.category === 'error').length;
  const warningCount = result.issues.filter(i => i.category === 'warning').length;

  console.log(`📊 Analysis Summary:`);
  console.log(`   Files scanned: ${result.scannedFiles}`);
  console.log(`   Issues found: ${result.issues.length} (${errorCount} errors, ${warningCount} warnings)`);
  console.log(`   Automatic fixes applied: ${result.fixes}\n`);

  // Group issues by file
  const issuesByFile = result.issues.reduce((acc, issue) => {
    const key = issue.filePath;
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue);
    return acc;
  }, {} as Record<string, TypeScriptIssue[]>);

  // Print issues grouped by file
  for (const [file, fileIssues] of Object.entries(issuesByFile)) {
    console.log(`\n📄 ${file}`);
    
    for (const issue of fileIssues) {
      const symbol = issue.category === 'error' ? '❌' : '⚠️';
      console.log(`  ${symbol} Line ${issue.line + 1}, Col ${issue.column + 1}: ${issue.message} (${issue.code})`);
      
      if (issue.suggestions?.length) {
        console.log('    💡 Suggestions:');
        issue.suggestions.forEach(suggestion => {
          console.log(`      • ${suggestion}`);
        });
      }
    }
  }
}

// Main execution
console.log('🔎 Scanning TypeScript files...');
const files = scanDirectory(SRC_DIR);
console.log(`Found ${files.length} TypeScript files to analyze`);

let totalFixes = 0;
const allIssues: TypeScriptIssue[] = [];

for (const file of files) {
  const sourceFile = project.addSourceFileAtPath(file);
  const issues = analyzeFile(sourceFile);
  allIssues.push(...issues);
  
  if (issues.length > 0) {
    const fixes = fixCommonIssues(sourceFile);
    totalFixes += fixes;
  }
}

generateReport({
  issues: allIssues,
  fixes: totalFixes,
  scannedFiles: files.length
});