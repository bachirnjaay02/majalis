-- Métadonnées des khassaïdes (fiche détaillée)
ALTER TABLE "XamXamBook"
  ADD COLUMN "arabicTitle" TEXT,
  ADD COLUMN "type" TEXT,
  ADD COLUMN "vers" INTEGER,
  ADD COLUMN "metre" TEXT,
  ADD COLUMN "annee" TEXT,
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "files" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
