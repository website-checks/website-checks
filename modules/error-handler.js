"use strict";

const { red } = require("kleur");
const path = require("path");
const teardown = require("./teardown");

module.exports = async (params) => {
  const [err, page, name] = params;
  const errorpath = path.resolve(output_path, `./${name}-failed.pdf`);
  console.log(red("[error] " + name), red(err));
  errors++;
  await page.pdf({
    path: errorpath,
    format: "A4",
    printBackground: true,
  });
  console.log(red(`[error] ${name}: Failed document written to ${errorpath}`));
  await page.close();
  open_pages--;
  await teardown();
};
