import * as ts from 'typescript';

const removedClasses: string[] = [];

export function recordRemoval(node: ts.Node) {
  if ((ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name) {
    removedClasses.push(node.name.getText());
  }
}

export function undeprecatedHeritage(heritage: ts.NodeArray<ts.HeritageClause> | undefined) {
  if (heritage === undefined) {
    return undefined;
  }
  const heritages: ts.HeritageClause[] = [];
  heritage.forEach(h => {
    const types = h.types.filter(t => !removedClasses.includes(t.getText()));
    if (types.length > 0) {
      heritages.push(ts.createHeritageClause(h.token, types));
    }
  });
  return ts.createNodeArray(heritages);
}