# md2html

> This is a simple nodejs cli script. It applies html templates and third-party libraries to markdown so that it can be quickly displayed on a web page.

## Requirements

- [Node.js](nodejs.org)
- Internet

## Usage

1. Your markdown file is test.md, this script will generate test.html.

   ```bash
   node md2blog.js -if test.md -of test
   ```

2. Open your html file, select all and paste it to your blog or web page. (Blogger is tested)

## What might need to change

- The CDN addresses of third-party libraries from the HTML template.
- If you use Blogger or another blogging platform that has a post preview feature, you should replace `*****PREVIEW_CONTENT_TO_REPLACE*****` with your own text.

## Third-party libraries

- [highlight.js](https://highlightjs.org/)
- [Showdown](https://showdownjs.com/)