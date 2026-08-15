import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage des données Xam Xam...");
  await prisma.xamXamTrack.deleteMany();
  await prisma.xamXamPlaylist.deleteMany();
  await prisma.xamXamBook.deleteMany();
  await prisma.xamXamVideo.deleteMany();
  await prisma.xamXamWird.deleteMany();
  await prisma.xamXamAdmin.deleteMany();

  console.log("Création de l'administrateur Xam Xam...");
  const admin = await prisma.xamXamAdmin.create({
    data: {
      name: "Administrateur Xam Xam",
      email: "admin@xamxam.sn",
      password: await bcrypt.hash("XamXam2026!", 10),
    },
  });

  console.log("Ajout de livres de démonstration...");
  // Liens d'exemple à remplacer par de vrais liens PDF depuis l'admin.
  await prisma.xamXamBook.createMany({
    data: [
      {
        title: "Matlabul Fawzeyni",
        language: "ARABE",
        category: "Soufisme",
        description: "Traité sur les moyens d'obtenir la réussite ici-bas et dans l'au-delà.",
        pdfUrl: "https://example.com/xamxam/matlabul-fawzeyni.pdf",
        featured: true,
      },
      {
        title: "Matlabul Fawzeyni (traduction française)",
        language: "FRANCAIS",
        category: "Soufisme",
        description: "Traduction française du Matlabul Fawzeyni.",
        pdfUrl: "https://example.com/xamxam/matlabul-fawzeyni-fr.pdf",
        featured: true,
      },
      {
        title: "Jazâul Chakour",
        language: "ARABE",
        category: "Poésie",
        description: "Recueil de poèmes de louanges et d'invocations.",
        pdfUrl: "https://example.com/xamxam/jazaul-chakour.pdf",
      },
      {
        title: "Nahju Qadim ci Wolof",
        language: "WOLOF",
        category: "Fiqh",
        description: "Xam-xam ci yoonu jamono, ci làkku wolof.",
        pdfUrl: "https://example.com/xamxam/nahju-qadim-wolof.pdf",
        featured: true,
      },
      {
        title: "Massalik Al Jinan",
        language: "ARABE",
        category: "Soufisme",
        description: "Les voies du paradis.",
        pdfUrl: "https://example.com/xamxam/massalik-al-jinan.pdf",
      },
      {
        title: "Yoonu Yàlla — Ndigël ak jikko",
        language: "WOLOF",
        category: "Éducation",
        description: "Livre ci njàngale mbir yu bokk ci jikko ju rafet.",
        pdfUrl: "https://example.com/xamxam/yoonu-yalla-wolof.pdf",
      },
    ],
  });

  console.log("Ajout d'une playlist de démonstration...");
  const playlist = await prisma.xamXamPlaylist.create({
    data: {
      title: "Qacida du vendredi",
      description: "Une sélection de qacida à écouter chaque vendredi.",
      tracks: {
        create: [
          {
            title: "Jazâul Chakour — Partie 1",
            reciter: "Groupe Xassida Touba",
            audioUrl: "https://example.com/xamxam/audio/jazaul-chakour-1.mp3",
            duration: "6:12",
            order: 0,
          },
          {
            title: "Jazâul Chakour — Partie 2",
            reciter: "Groupe Xassida Touba",
            audioUrl: "https://example.com/xamxam/audio/jazaul-chakour-2.mp3",
            duration: "5:48",
            order: 1,
          },
        ],
      },
    },
  });

  console.log("Ajout d'une vidéo de démonstration...");
  await prisma.xamXamVideo.create({
    data: {
      title: "Qui était Serigne Touba ?",
      description: "Introduction à la vie et à l'œuvre de Cheikh Ahmadou Bamba.",
      category: "Documentaire",
      videoUrl: "https://example.com/xamxam/video/qui-etait-serigne-touba.mp4",
    },
  });

  console.log("Ajout de wirds de démonstration...");
  await prisma.xamXamWird.createMany({
    data: [
      {
        title: "Wird du matin",
        moment: "Matin",
        language: "ARABE",
        content:
          "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ ×100\nلَا إِلَهَ إِلَّا اللَّهُ ×100\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ ×100",
      },
      {
        title: "Wird bu suba si (traduction)",
        moment: "Matin",
        language: "WOLOF",
        content:
          "Nañu wax Astaghfiroulah 100 yoon.\nNañu wax La ilaha illa Llah 100 yoon.\nNañu wax salawat yi 100 yoon.",
      },
      {
        title: "Wird du soir",
        moment: "Soir",
        language: "FRANCAIS",
        content:
          "Répéter Astaghfiroullah (100 fois), La ilaha illa Llah (100 fois), puis les prières sur le Prophète (100 fois), selon l'enseignement transmis par Serigne Touba.",
      },
    ],
  });

  console.log("\n✅ Données Xam Xam créées avec succès !\n");
  console.log("Connexion administrateur Xam Xam :");
  console.log(`  Email       : ${admin.email}`);
  console.log("  Mot de passe: XamXam2026!");
  console.log(`\nPlaylist créée : ${playlist.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
