const rehypeParse = require("rehype-parse");
const unified = require("unified");
const rehype = require("rehype");
const { selectAll, select } = require("hast-util-select");
const toHtml = require("hast-util-to-html");

const fragmentParser = unified().use(rehypeParse, { fragment: true }).freeze();
const documentParser = rehype;

function processTemplate(ast) {
  const context = { replacements: {} };
  const getNextIdentifier = (() => {
    let i = 0;
    return () => `$$$${++i}$$$`;
  })();

  for (const tplForNode of selectAll("[tpl-for]", ast)) {
    const attributeValue = tplForNode.properties["tpl-for"];
    delete tplForNode.properties["tpl-for"];
    const replacementIdentifier = getNextIdentifier();
    context.replacements[replacementIdentifier] = {
      type: "for",
      reference: attributeValue,
      tokens: processTemplate({
        type: "root",
        children: tplForNode.children,
      }),
    };
    tplForNode.children = [{ type: "text", value: replacementIdentifier }];
  }

  for (const tplTextNode of selectAll("[tpl-text]", ast)) {
    const attributeValue = tplTextNode.properties["tpl-text"];
    delete tplTextNode.properties["tpl-text"];
    const replacementIdentifier = getNextIdentifier();
    context.replacements[replacementIdentifier] = {
      type: "text",
      reference: attributeValue,
    };

    tplTextNode.children.push({ type: "text", value: replacementIdentifier });
  }

  for (const tplAttrNode of selectAll("[tpl-attr]", ast)) {
    const attributeValue = tplAttrNode.properties["tpl-attr"];
    delete tplAttrNode.properties["tpl-attr"];

    const pairs = attributeValue.split(/, /).map((pair) => pair.split(/: /));

    for (const [attrName, ref] of pairs) {
      const replacementIdentifier = getNextIdentifier();
      tplAttrNode.properties[attrName] = replacementIdentifier;
      context.replacements[replacementIdentifier] = {
        type: "attr",
        reference: ref,
      };
    }
  }

  for (const tplSlotNode of selectAll("[tpl-slot]", ast)) {
    delete tplSlotNode.properties["tpl-slot"];
    const replacementIdentifier = getNextIdentifier();
    tplSlotNode.children = [{ type: "text", value: replacementIdentifier }];
    context.replacements[replacementIdentifier] = {
      type: "slot",
    };
  }

  const html = toHtml(ast);

  const tokens = [];

  let match;
  let offset = 0;
  while ((match = html.substr(offset).match(/(\$\$\$\d+\$\$\$)/))) {
    const [identifer] = match;
    const oldOffset = offset;
    offset = offset + match.index + identifer.length;
    tokens.push({ type: "static", value: html.substr(oldOffset, match.index) });
    tokens.push(context.replacements[identifer]);
  }

  if (offset < html.length - 1) {
    tokens.push({ type: "static", value: html.substr(offset) });
  }

  return tokens;
}

module.exports = function parseTemplate(string) {
  const isDocument = /^<!doctype/i.test(string.trim());
  const parser = isDocument ? documentParser : fragmentParser;

  const ast = parser.parse(string);

  const linkExtends = select('link[rel="extends"]', ast);
  let parentTemplate;

  if (linkExtends && !ast.children.includes(linkExtends)) {
    throw new Error("Link `extends` tags must only exist at the root.");
  }

  if (linkExtends) {
    parentTemplate = linkExtends.properties.href;
    ast.children = ast.children.filter((node) => node !== linkExtends);
  }

  const tokens = processTemplate(ast);

  return {
    type: parentTemplate ? "fragment" : "root",
    parentTemplate,
    tokens,
  };
};
