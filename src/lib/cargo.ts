import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/db";
import type { WeeklyCargoRecord } from "@/lib/lng-dashboard";

const DEFAULT_FILE = "cargo-weekly.json";

export async function getCargoWeekly(): Promise<WeeklyCargoRecord[]> {
  if (process.env.DATABASE_URL) {
    try {
      const setting = await prisma.appSetting.findUnique({ where: { key: "weekly_cargoes" } });
      if (Array.isArray(setting?.value)) {
        return setting.value as unknown as WeeklyCargoRecord[];
      }
    } catch (error) {
      console.error("Failed to load cargo weekly from DB:", error);
    }
  }

  try {
    const filePath = join(process.cwd(), "seed-data", DEFAULT_FILE);
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as WeeklyCargoRecord[];
  } catch (error) {
    return [];
  }
}

export async function setCargoWeekly(records: WeeklyCargoRecord[]) {
  const cleaned = [...records].sort((a, b) => a.week.localeCompare(b.week));

  if (process.env.DATABASE_URL) {
    try {
      await prisma.appSetting.upsert({
        where: { key: "weekly_cargoes" },
        update: { value: cleaned as unknown as object },
        create: {
          key: "weekly_cargoes",
          value: cleaned as unknown as object,
          description: "Weekly LNG vessel counts from EIA update",
        },
      });
    } catch (error) {
      console.error("Failed to save cargo weekly to DB:", error);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    try {
      const filePath = join(process.cwd(), "seed-data", DEFAULT_FILE);
      await writeFile(filePath, JSON.stringify(cleaned, null, 2));
    } catch (error) {
      console.error("Failed to write cargo weekly file:", error);
    }
  }
}
