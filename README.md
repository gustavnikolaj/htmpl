# HTML Template

```html
<!-- ./my-template.html -->
<h1>Hello, <span tpl-text="name"></span>!</h1>
```

```js
htmlTemplate.render("./my-template.html", { name: "World" });
// => <h1>Hello, <span tpl-text="name">World</span>!</h1>
```

### THIS IS A PROOF OF CONCEPT

This module is not production ready, but only serves as a proof of concept for
now.

## Features

### Plain HTML

All templates must be plain HTML.

### Extending Templates

```html
<!-- ./layout.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>My title</title>
  </head>
  <body tpl-slot></body>
</html>
```

```html
<!-- ./view.html -->
<link rel="tpl-extends" href="./layout.html" />
<h1>Hello, World!</h1>
```

Produces:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My title</title>
  </head>
  <body tpl-slot>
    <h1>Hello, World!</h1>
  </body>
</html>
```

### Partial Templates

```html
<div tpl-include="./my-template.html"></div>
```

## Spec

### Attributes

#### tpl-text

Replace the node's text content with the value of the referenced variable.

#### tpl-raw

As `tpl-text` but will allow html to be inserted. Use of this should be avoided,
but it can be a useful escape-hatch for when you are in a hurry and the template
syntax does not play ball with you.

Should also

#### tpl-attr

Allows you to set attributes on the node.

```html
<form tpl-attr="action: formAction">
  <input type="checkbox" tpl-attr="checked: isChecked" />
</form>
```

When rendered with data `{ formAction: '/submit', isChecked: true }` it will yield:

```html
<form action="/submit">
  <input type="checkbox" checked />
</form>
```

#### tpl-class

Allows you to set classes on the node.

```html
<div tpl-class="active: isActive"></div>
```

When rendered with data `{ isActive: true }` it will yield:

```html
<div class="active"></div>
```

#### tpl-include

Include the referenced template and put its content as children of the node.

#### tpl-slot

This is a boolean attribute only used in templates that are intended to be
extended. This marks the node into which the extending templates content will be
put.

#### tpl-if

```html
<div tpl-if="!!profileImage">
  <img tpl-attr="src: profileImage" />
</div>
```

#### tpl-ifnot

Reverse if.

### Extending with <link>

In order to extend a template, you have to put a link-tag at the start of your
template, with a `rel`-attribute value of `tpl-extends` and an `href`-attribute
point to the template file that you wish to extend.

```html
<link rel="tpl-extends" href="./layout.html" />
```

The link tag may not be nested under other elements, and may not be in a
conditional.

# References

## Prior art

There are without a doubt similar attempts on building something like this. I
will add them here as I find them. I haven't yet found something that is
appropriate, but they might have ideas that we can learn from.

- [TAL - Template Attribute Language](https://pagetemplates.readthedocs.io/en/latest/tal.html)
