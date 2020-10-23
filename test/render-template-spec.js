const expect = require("unexpected");
const renderTemplate = require("../lib/render-template");

describe("render-template", () => {
  it("should be a function", () => {
    expect(renderTemplate, "to be a function");
  });

  it("should render a simple template without any attributes", () => {
    expect(
      renderTemplate(`<p>Hello, World!</p>`),
      "to equal",
      "<p>Hello, World!</p>"
    );
  });

  it("should render a template with a tpl-text binding", () => {
    expect(
      renderTemplate(`<p>Hello, <span tpl-text="name"></span>!</p>`, {
        name: "World",
      }),
      "to equal",
      "<p>Hello, <span>World</span>!</p>"
    );
  });

  it("should render a template with both tpl-text and tpl-attr binding", () => {
    expect(
      renderTemplate(
        `<p tpl-attr="title: titleRef, class: classRef" tpl-text="textRef"></p>`,
        {
          titleRef: "title-value",
          classRef: "class-value",
          textRef: "text-value",
        }
      ),
      "to equal",
      `<p title="title-value" class="class-value">text-value</p>`
    );
  });

  it("should render a template with a for loop", () => {
    expect(
      renderTemplate(`<ul tpl-for="people"><li tpl-text="name"></li></ul>`, {
        people: [{ name: "John" }, { name: "Jane" }],
      }),
      "to equal",
      `<ul><li>John</li><li>Jane</li></ul>`
    );
  });
});
