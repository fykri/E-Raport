const prisma = require("../../prisma/prismaClient");
const fs = require("fs");
const path = require("path");

async function main() {
    await prisma.indikator.deleteMany();
    await prisma.subKategori.deleteMany();
    await prisma.kategori.deleteMany();
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Kategori_id_kategori_seq" RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "SubKategori_id_sub_kategori_seq" RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Indikator_id_indikator_seq" RESTART WITH 1`);
    const rawData = fs.readFileSync(
        path.join(__dirname, "data/kategori.json"),
        "utf-8"
    );

    const kategoriData = JSON.parse(rawData);

    for (const kategori of kategoriData) {
        const createdKategori = await prisma.kategori.create({
            data: {
                nama_kategori: kategori.nama_kategori,
            },
        });

        for (const sub of kategori.sub_kategori) {
            const createdSub = await prisma.subKategori.create({
                data: {
                    nama_sub_kategori: sub.nama,
                    kategoriId: createdKategori.id_kategori,
                },
            });

            const indikatorData = sub.indikator.map((no) => ({
                nama_indikator: `${no}`,
                subKategoriId: createdSub.id_sub_kategori,
            }));

            await prisma.indikator.createMany({ data: indikatorData });
        }
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error("❌ Seed gagal:", e);
        prisma.$disconnect().finally(() => process.exit(1));
    });
