import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import { join } from "path";

const prisma = new PrismaClient();

async function loadJson<T>(file: string): Promise<T> {
  const filePath = join(process.cwd(), "seed-data", file);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function main() {
  const vessels = await loadJson<any[]>("vessels.json");
  const terminals = await loadJson<any[]>("terminals.json");
  const positions = await loadJson<any[]>("vessel-positions.json");
  const pricing = await loadJson<any[]>("pricing-history.json");
  const insights = await loadJson<any[]>("insights.json");
  const news = await loadJson<any[]>("news-articles.json");

  for (const vessel of vessels) {
    await prisma.vessel.upsert({
      where: { name: vessel.name },
      update: {
        ...vessel,
      },
      create: {
        ...vessel,
      },
    });
  }

  for (const terminal of terminals) {
    await prisma.terminal.upsert({
      where: { slug: terminal.slug },
      update: {
        ...terminal,
      },
      create: {
        ...terminal,
      },
    });
  }

  const vesselIndex = await prisma.vessel.findMany();
  const vesselMap = new Map(vesselIndex.map((v) => [v.name, v.id]));

  for (const position of positions) {
    const vesselId = vesselMap.get(position.vesselName);
    if (!vesselId) continue;
    await prisma.vesselPosition.create({
      data: {
        vesselId,
        latitude: position.latitude,
        longitude: position.longitude,
        heading: position.heading,
        speedKnots: position.speedKnots,
        course: position.course,
        draught: position.draught,
        destination: position.destination,
        eta: position.eta ? new Date(position.eta) : null,
        navStatus: position.navStatus,
        recordedAt: new Date(position.recordedAt),
        source: "seed",
      },
    });
  }

  await prisma.pricePoint.createMany({
    data: pricing.map((point) => ({
      benchmark: point.benchmark,
      date: new Date(point.date),
      price: point.price,
      source: point.source ?? "seed",
      frequency: point.frequency ?? "DAILY",
      unit: point.unit ?? "USD/MMBtu",
    })),
    skipDuplicates: true,
  });

  await prisma.insight.createMany({
    data: insights.map((item) => ({
      date: new Date(item.date),
      title: item.title,
      body: item.body,
      category: item.category,
      severity: item.severity ?? "INFO",
      source: "seed",
    })),
    skipDuplicates: true,
  });

  await prisma.newsArticle.createMany({
    data: news.map((item) => ({
      title: item.title,
      description: item.description ?? null,
      content: item.content ?? null,
      url: item.url,
      imageUrl: item.imageUrl ?? null,
      source: item.source,
      author: item.author ?? null,
      publishedAt: new Date(item.publishedAt),
      category: item.category ?? "GENERAL",
      sentiment: item.sentiment ?? null,
      relevanceScore: item.relevanceScore ?? null,
      isVgRelated: item.isVgRelated ?? false,
      tags: item.tags ?? [],
    })),
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
