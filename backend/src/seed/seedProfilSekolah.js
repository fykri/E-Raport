const prisma = require("../../prisma/prismaClient");
const fs = require("fs");
const path = require("path");

async function seedProfilSekolah() {
    const filePath = path.join(__dirname, "/data/profilSekolah.json");

    if (!fs.existsSync(filePath)) {
        console.error("❌ File profilSekolah.json tidak ditemukan!");
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!Array.isArray(data) || data.length === 0) {
        console.warn("⚠️ Data profil sekolah kosong.");
        return;
    }

    // Optional: bersihkan data sebelumnya
    await prisma.profilSekolah.deleteMany();
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "ProfilSekolah_id_profil_sekolah_seq" RESTART WITH 1`);

    for (const item of data) {
        await prisma.profilSekolah.create({
            data: {
                nama_sekolah: item.nama_sekolah,
                NPSN: item.NPSN,
                NSS: item.NSS,
                provinsi: item.provinsi,
                kabupaten: item.kabupaten,
                kecamatan: item.kecamatan,
                desa: item.desa,
                jalan: item.jalan,
                kode_pos: item.kode_pos,
                nomor_hp: item.nomor_hp,
                email: item.email,
                website: item.website,
            },
        });
    }

    console.log("✅ Data Profil Sekolah berhasil di-seed!");
}

// Jika dijalankan langsung
if (require.main === module) {
    seedProfilSekolah()
        .catch((e) => {
            console.error("❌ Gagal seeding:", e);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = seedProfilSekolah;
