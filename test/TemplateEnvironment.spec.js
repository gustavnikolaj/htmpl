const expect = require("unexpected");
const TemplateEnvironment = require("../lib/TemplateEnvironment");

describe("TemplateEnvironment", () => {
  it("should render a template", async () => {
    const env = new TemplateEnvironment();
    env.loadTemplate = (name) => {
      switch (name) {
        case "foo":
          return `<p>Hello, <span tpl-text="name"></span>!</p>`;
        default:
          throw new Error(`Could not find template named "${name}".`);
      }
    };

    expect(
      await env.render("foo", { name: "World" }),
      "to equal",
      "<p>Hello, <span>World</span>!</p>"
    );
  });

  it("should render a template in it's parent", async () => {
    const env = new TemplateEnvironment();
    env.loadTemplate = (name) => {
      switch (name) {
        case "foo":
          return [
            `<link rel="extends" href="layout.html">`,
            `<p>Hello, <span tpl-text="name"></span>!</p>`,
          ].join("");
        case "layout.html":
          return `<h1>Foo bar!</h1>`;
        default:
          throw new Error(`Could not find template named "${name}".`);
      }
    };

    expect(
      await env.render("foo", { name: "World" }),
      "to equal",
      "<h1>Foo bar!</h1><p>Hello, <span>World</span>!</p>"
    );
  });

  it("should render a template in it's parent with a slot", async () => {
    const env = new TemplateEnvironment();
    env.loadTemplate = (name) => {
      switch (name) {
        case "foo":
          return [
            `<link rel="extends" href="layout.html">`,
            `<p>Hello, <span tpl-text="name"></span>!</p>`,
          ].join("");
        case "layout.html":
          return `<h1>Foo bar!</h1><article tpl-slot></article>`;
        default:
          throw new Error(`Could not find template named "${name}".`);
      }
    };

    expect(
      await env.render("foo", { name: "World" }),
      "to equal",
      "<h1>Foo bar!</h1><article><p>Hello, <span>World</span>!</p></article>"
    );
  });
});
