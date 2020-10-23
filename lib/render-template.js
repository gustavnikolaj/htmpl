const parseTemplate = require("./parse-template");

function getRef(reference, obj) {
  let value = obj;

  for (const segment of reference.split(".")) {
    value = value[segment];
    if (!value) {
      return;
    }
  }
  return value;
}

function renderTokens(elements, data) {
  const result = [];
  for (const node of elements) {
    switch (node.type) {
      case "static":
        result.push(node.value);
        break;
      case "text":
        result.push(getRef(node.reference, data));
        break;
      case "attr":
        // TODO: Escape
        result.push(getRef(node.reference, data));
        break;
      case "for":
        result.push(
          getRef(node.reference, data).map((item) =>
            renderTokens(node.tokens, item)
          )
        );
        break;
      default:
        throw new Error(`Unsupported type: "${node.type}"`);
    }
  }
  return result;
}

module.exports = function renderTemplate(string, data) {
  const parsedTemplate = parseTemplate(string);

  if (parsedTemplate.type === "fragment") {
    throw new Error("Cannot render a fragment template.");
  }

  const strings = renderTokens(parsedTemplate.tokens, data);

  return strings.flat(Infinity).join("");
};

module.exports.renderTokens = renderTokens;
