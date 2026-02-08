#!/usr/bin/env node
/**
 * esrayurumez-files/blogs/ içindeki .docx dosyalarını listeler.
 * Bu dosyalar "npm run db:seed" ile veritabanına aktarılır.
 */
const path = require("path");
const fs = require("fs");

const BLOGS_DIR = path.join(process.cwd(), "esrayurumez-files", "blogs");

function slugify(text) {
  const trMap = { ş: "s", Ş: "s", ğ: "g", Ğ: "g", ü: "u", Ü: "u", ö: "o", Ö: "o", ç: "c", Ç: "c", ı: "i", İ: "i" };
  let s = text.trim();
  for (const [tr, en] of Object.entries(trMap)) s = s.split(tr).join(en);
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

if (!fs.existsSync(BLOGS_DIR)) {
  console.log("Klasör bulunamadı:", BLOGS_DIR);
  process.exit(1);
}

const files = fs.readdirSync(BLOGS_DIR).filter((f) => /\.docx$/i.test(f));
console.log("Blog olarak eklenecek .docx dosyaları (" + files.length + " adet):\n");
files.forEach((f, i) => {
  const title = f.replace(/\.docx$/i, "").trim();
  const slug = slugify(title);
  console.log(`${i + 1}. ${title}`);
  console.log(`   Slug: /blog/${slug}\n`);
});
console.log("Bunları veritabanına eklemek için: npm run db:seed");
