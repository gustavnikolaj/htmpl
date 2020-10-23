const expect = require("unexpected");
const parseTemplate = require("../lib/parse-template");

describe("parse-template", () => {
  it("should be a function", () => {
    expect(parseTemplate, "to be a function");
  });

  it("should parse a simple template without any attributes", () => {
    expect(parseTemplate(`<p>Hello, World!</p>`), "to equal", {
      type: "root",
      tokens: [{ type: "static", value: "<p>Hello, World!</p>" }],
    });
  });

  it("should parse a template with a tpl-text binding", () => {
    expect(
      parseTemplate(`<p>Hello, <span tpl-text="name"></span>!</p>`),
      "to equal",
      {
        type: "root",
        tokens: [
          { type: "static", value: "<p>Hello, <span>" },
          { type: "text", reference: "name" },
          { type: "static", value: "</span>!</p>" },
        ],
      }
    );
  });

  it("should parse a template with a tpl-attr binding", () => {
    expect(
      parseTemplate(`<input type="text" name="title" tpl-attr="value: title">`),
      "to equal",
      {
        type: "root",
        tokens: [
          { type: "static", value: `<input type="text" name="title" value="` },
          { type: "attr", reference: "title" },
          { type: "static", value: `">` },
        ],
      }
    );
  });

  it("should parse a template with a tpl-attr and tpl-text binding", () => {
    expect(
      parseTemplate(
        `<p tpl-attr="title: titleRef, class: classRef" tpl-text="textRef"></p>`
      ),
      "to equal",
      {
        type: "root",
        tokens: [
          { type: "static", value: `<p title="` },
          { type: "attr", reference: "titleRef" },
          { type: "static", value: `" class="` },
          { type: "attr", reference: "classRef" },
          { type: "static", value: `">` },
          { type: "text", reference: "textRef" },
          { type: "static", value: `</p>` },
        ],
      }
    );
  });

  it("should parse a template with a for loop", () => {
    expect(
      parseTemplate(`<ul tpl-for="arrayRef"><li tpl-text="name"></li></ul>`),
      "to equal",
      {
        type: "root",
        tokens: [
          { type: "static", value: "<ul>" },
          {
            type: "for",
            reference: "arrayRef",
            tokens: [
              { type: "static", value: "<li>" },
              { type: "text", reference: "name" },
              { type: "static", value: "</li>" },
            ],
          },
          { type: "static", value: "</ul>" },
        ],
      }
    );
  });

  it("should parse a template with an extends tag", () => {
    expect(
      parseTemplate(`
        <link rel="extends" href="layouts/default.html">
        <ul tpl-for="arrayRef"><li tpl-text="name"></li></ul>
      `),
      "to satisfy",
      {
        type: "fragment",
        parentTemplate: "layouts/default.html",
        tokens: [
          { type: "static", value: /^\s*<ul>\s*$/ },
          {
            type: "for",
            reference: "arrayRef",
            tokens: [
              { type: "static", value: "<li>" },
              { type: "text", reference: "name" },
              { type: "static", value: "</li>" },
            ],
          },
          { type: "static", value: /^\s*<\/ul>\s*$/ },
        ],
      }
    );
  });

  it("should parse a template with a slot", () => {
    expect(parseTemplate(`<div tpl-slot></div>`), "to equal", {
      type: "root",
      tokens: [
        { type: "static", value: "<div>" },
        { type: "slot" },
        { type: "static", value: "</div>" },
      ],
    });
  });

  it("should parse a template with a title", () => {
    expect(
      parseTemplate(
        `<!doctype html><html><head><title tpl-text="foo"></title></head><body></body></html>`
      ),
      "to equal",
      {
        type: "root",
        tokens: [
          {
            type: "static",
            value: `<!doctype html><html><head><title>`,
          },
          { type: "text", reference: "foo" },
          { type: "static", value: "</title></head><body></body></html>" },
        ],
      }
    );
  });
});
