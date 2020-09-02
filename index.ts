import * as fs from 'fs-extra';
import * as path from 'path';
import * as ts from 'typescript';
import { recordRemoval, undeprecatedHeritage } from './heritage';

/**
 * Execute by running `yarn build && node index`
 * Results are in `sample/hello.transformed.ts`
 */

const SOURCE_FILE = 'sample/hello.ts';
const now = new Date();

function transformSource(ctx: ts.TransformationContext) {
  function visitor(node: ts.Node): ts.Node {
    if (ts.isSourceFile(node)) {
      const deprecated = node.statements.filter(s => isDeprecated(s));
      deprecated.forEach(d => recordRemoval(d));
      const filtered = node.statements.filter(s => !deprecated.includes(s));
      const updated = ts.updateSourceFileNode(
        node.getSourceFile(),
        filtered,
        node.isDeclarationFile,
        node.referencedFiles,
        node.typeReferenceDirectives,
        node.hasNoDefaultLib,
        node.libReferenceDirectives
      );
      return ts.visitEachChild(updated, visitor, ctx);
    } else if (ts.isClassDeclaration(node)) {
      const heritage = undeprecatedHeritage(node.heritageClauses);
      const filtered = node.members.filter(e => !isDeprecated(e));
      return ts.addSyntheticTrailingComment(
        ts.updateClassDeclaration(
          node,
          node.decorators,
          node.modifiers,
          node.name,
          node.typeParameters,
          heritage,
          filtered,
        ),
        ts.SyntaxKind.SingleLineCommentTrivia,
        `stripped at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        false,
      );
    } else if (ts.isInterfaceDeclaration(node)) {
      const heritage = undeprecatedHeritage(node.heritageClauses);
      const filtered = node.members.filter((e) => !isDeprecated(e));
      return ts.addSyntheticTrailingComment(
        ts.updateInterfaceDeclaration(
          node,
          node.decorators,
          node.modifiers,
          node.name,
          node.typeParameters,
          heritage,
          filtered,
        ),
        ts.SyntaxKind.SingleLineCommentTrivia,
        `stripped at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        false,
      );
    }
    return ts.visitEachChild(node, visitor, ctx);
  }
  return visitor;
}

function isDeprecated(node: ts.Node) {
  const deprecatedKinds = [
    ts.SyntaxKind.MethodDeclaration,
    ts.SyntaxKind.PropertyDeclaration,
    ts.SyntaxKind.PropertySignature,
    ts.SyntaxKind.ClassDeclaration,
    ts.SyntaxKind.InterfaceDeclaration,
  ];
  if (deprecatedKinds.includes(node.kind)) {
    const sourceText = node.getSourceFile().getFullText();
    const commentranges = ts.getLeadingCommentRanges(node.getFullText(), 0);
    return commentranges?.map((comment, _index, _arr) => {
      const text = sourceText.slice(node.getFullStart() + comment.pos, node.getFullStart() + comment.end).trim();
      if (comment.kind === ts.SyntaxKind.MultiLineCommentTrivia && text.startsWith('/**') && text.indexOf('@deprecated') > -1) {
        return true;
      }
      return false;
    }).reduce((agg, deprecated) => agg || deprecated, false);
  }
}

async function main() {
  const sourceFile = ts.createSourceFile(
    SOURCE_FILE,
    await fs.readFile(SOURCE_FILE, { encoding: 'utf8' }),
    ts.ScriptTarget.ES2018,
    true,
    ts.ScriptKind.TS,
  );
  const tSourceFile = ts.transform(sourceFile, [transformSource]).transformed[0];

  const parsedPath = path.parse(SOURCE_FILE);
  await fs.writeFile(
    path.join(parsedPath.dir, `${parsedPath.name}.stripped${parsedPath.ext}`),
    ts.createPrinter().printFile(tSourceFile as ts.SourceFile),
    { encoding : 'utf8' },
  );
}

main().then(t => console.log(t)).catch(e => console.log(`error ${e}`));