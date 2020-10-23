const { renderTokens } = require("./render-template");
const path = require("path");
const fs = require("fs").promises;
const parseTemplate = require("./parse-template");

module.exports = class TemplateEnvironment {
  constructor(templatePath) {
    this.templatePath = templatePath;
  }

  async loadTemplate(templateName) {
    const templatePath = path.resolve(this.templatePath, templateName);

    return await fs.readFile(templatePath, "utf-8");
  }

  async parseTemplate(templateName) {
    const string = await this.loadTemplate(templateName);
    const { tokens, parentTemplate } = parseTemplate(string);

    if (parentTemplate) {
      const parentTokens = await this.parseTemplate(parentTemplate);

      let indexOfSlot = -1;
      let i = 0;

      while (indexOfSlot < 0 && i < parentTokens.length) {
        if (parentTokens[i].type === "slot") {
          indexOfSlot = i;
        }
        i++;
      }

      if (indexOfSlot === -1) {
        return parentTokens.concat(tokens);
      } else {
        return parentTokens
          .slice(0, indexOfSlot)
          .concat(tokens)
          .concat(parentTokens.slice(indexOfSlot + 1));
      }
    }

    return tokens;
  }

  async render(templateName, data) {
    const parsedTemplate = await this.parseTemplate(templateName);

    return renderTokens(parsedTemplate, data).flat(Infinity).join("");
  }
};
