import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";

const prisma = new PrismaClient();

type WirdItem = {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl: string | null;
  repeat: string;
};

type WirdFamily = {
  name: string;
  nameArabic: string;
  items: WirdItem[];
};

const dataPath = path.join(__dirname, "wird-mahfuz-data.json");
const data: Record<string, WirdFamily> = JSON.parse(readFileSync(dataPath, "utf-8"));

const order = ["al-xafiif", "al-kaamil", "al-xaatam"] as const;

function formatContent(family: WirdFamily): string {
  return family.items
    .map((item) => `${item.arabic} ×${item.repeat}\n${item.transliteration}`)
    .join("\n\n");
}

async function main() {
  console.log("Ajout du Wird Mahfuz (Al Xafiif, Al Kaamil, Al Xaatam)...");
  console.log("Source : https://wirdmaaxuuz.com/\n");

  for (const slug of order) {
    const family = data[slug];
    if (!family) {
      console.warn(`Introuvable dans le JSON : ${slug}`);
      continue;
    }

    const wird = await prisma.xamXamWird.create({
      data: {
        title: `Wird Mahfuz — ${family.name} (${family.nameArabic})`,
        moment: null,
        language: "ARABE",
        content: formatContent(family),
        audioUrl: null,
      },
    });

    console.log(`Créé : ${wird.title} (${family.items.length} invocations, id=${wird.id})`);
  }

  console.log("\nTerminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
