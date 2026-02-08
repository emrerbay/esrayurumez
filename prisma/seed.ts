import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { getDocxFilesInDir, parseDocxToHtml, titleFromFilename } from "../src/lib/docx";
import { slugFromFilename } from "../src/lib/slugify";

const prisma = new PrismaClient();

const BLOGS_DIR = path.join(process.cwd(), "esrayurumez-files", "blogs");

const DEMO_POSTS = [
  { slug: "cocuk-ergen-ruh-sagligi", title: "Çocuk ve Ergen Ruh Sağlığı", excerpt: "Çocuk ve ergenlerde ruh sağlığı değerlendirmesi ve destek hakkında kısa bir giriş." },
  { slug: "aile-destegi", title: "Aile ile İş Birliği", excerpt: "Tedavi sürecinde aile desteğinin önemi." },
];

async function main() {
  const count = await prisma.post.count().catch(() => 0);
  if (count === 0) {
    console.log("Post tablosu boş; örnek yazılar ekleniyor...");
    for (const p of DEMO_POSTS) {
      await prisma.post.upsert({
        where: { slug: p.slug },
        create: {
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          htmlContent: `<p>${p.excerpt}</p><p>İçerik yönetici panelinden .docx yükleyerek veya düzenleyerek güncellenebilir.</p>`,
          tags: "[]",
          published: true,
        },
        update: {},
      });
    }
    console.log(`${DEMO_POSTS.length} örnek yazı oluşturuldu.`);
  }

  const docxFiles = getDocxFilesInDir(BLOGS_DIR);
  console.log(`Found ${docxFiles.length} .docx files in blogs folder.`);

  for (const filePath of docxFiles) {
    const filename = path.basename(filePath);
    const title = titleFromFilename(filename);
    const slug = slugFromFilename(filename);
    try {
      const { html } = await parseDocxToHtml(filePath);
      const existing = await prisma.post.findUnique({ where: { slug } });
      if (existing) {
        await prisma.post.update({
          where: { slug },
          data: { title, htmlContent: html, sourceDocxPath: filePath, updatedAt: new Date() },
        });
        console.log(`Updated post: ${title}`);
      } else {
        await prisma.post.create({
          data: {
            slug,
            title,
            excerpt: null,
            htmlContent: html,
            tags: "[]",
            published: true,
            sourceDocxPath: filePath,
          },
        });
        console.log(`Created post: ${title}`);
      }
    } catch (err) {
      console.error(`Failed to process ${filename}:`, err);
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
