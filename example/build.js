const TemplateEnvironment = require("../lib/TemplateEnvironment");
const path = require("path");
const fs = require("fs").promises;

const articles = [
  {
    href: "/2020/10/my-third-blog-post",
    title: "My third blog post",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus esse libero debitis!",
    content: [
      "<p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p>",
    ],
  },
  {
    href: "/2020/10/my-second-blog-post",
    title: "My second blog post",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus esse libero debitis!",
    content: [
      "<p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p>",
    ],
  },
  {
    href: "/2020/10/my-first-blog-post",
    title: "My first blog post",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus esse libero debitis!",
    content: [
      "<p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p><p>",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia illum repellat totam cumque quisquam saepe quia, assumenda libero labore perferendis impedit fugiat officiis aliquid dolorem ex. Accusamus esse libero debitis!",
      "</p>",
    ],
  },
];

(async function () {
  const env = new TemplateEnvironment(path.resolve(__dirname, "views"));
  const outputDir = path.resolve(__dirname, "output");

  {
    const content = await env.render("index.html", { articles });
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.resolve(outputDir, "index.html"), content, "utf-8");
  }

  {
    const content = await env.render("about.html", {});
    const outputFile = path.resolve(outputDir, "about/index.html");
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(
      path.resolve(outputDir, "about/index.html"),
      content,
      "utf-8"
    );
  }

  for (const article of articles) {
    const outputFile = path.resolve(
      outputDir,
      path.relative("/", `${article.href}/index.html`)
    );
    const outputFileDir = path.dirname(outputFile);
    const content = await env.render("article.html", article);
    await fs.mkdir(outputFileDir, { recursive: true });
    await fs.writeFile(outputFile, content, "utf-8");
  }
})().then(
  () => console.log("DONE"),
  (err) => console.log(err)
);
