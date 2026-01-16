const prisma = require("../../prisma/prismaClient");
const errorPrisma = require("../utils/errorPrisma");
const throwWithStatus = require("../utils/throwWithStatus");
const { v4: uuidv4 } = require("uuid");
async function updateKesimpulanTx(tx, rekapNilaiId) {
    const allPenilaian = await tx.penilaian.findMany({
        where: { rekapNilaiId },
        select: { nilai: true },
    });

    const totalIndikator = allPenilaian.length;
    let totalB = 0;
    let totalC = 0;
    let totalP = 0;

    for (const p of allPenilaian) {
        if (!p.nilai) continue; // skip null
        if (p.nilai === "B") totalB++;
        else if (p.nilai === "C") totalC++;
        else if (p.nilai === "P") totalP++;
    }

    const dataKesimpulan = {
        pencapaian_perkembangan_baik: `${totalB}/${totalIndikator}`,
        pencapaian_perkembangan_buruk: `${totalC}/${totalIndikator}`,
        pencapaian_perkembangan_perlu_dilatih: `${totalP}/${totalIndikator}`,
    };

    const existingKesimpulan = await tx.kesimpulan.findUnique({
        where: { id_rekap_nilai: rekapNilaiId },
    });

    if (existingKesimpulan) {
        await tx.kesimpulan.update({
            where: { id_rekap_nilai: rekapNilaiId },
            data: dataKesimpulan,
        });
    } else {
        await tx.kesimpulan.create({
            data: {
                id_rekap_nilai: rekapNilaiId,
                ...dataKesimpulan,
                saran_dan_masukan: null,
            },
        });
    }
}

const findByTahunSemester = async (tahunAjaranId, semester, nama_kelas) => {
    try {
        const response = await prisma.rekapNilai.findMany({
            where: {
                tahunAjaranId: tahunAjaranId,
                semester: {
                    nama: semester,
                },
                ...(nama_kelas ? { guru: { nama_kelas } } : {}),
            },
            include: {
                tahunAjaran: true,
                pesertaDidik: true,
                guru: true,
                penilaian: {
                    select: {
                        nilai: true,
                    },
                },
            },
            orderBy: {
                pesertaDidik: {
                    nama_lengkap: "asc",
                },
            },
        });

        const indikatorList = await getAllIndikator(); // ambil semua indikator

        // Jalankan transaction untuk setiap rekap
        await Promise.all(
            response.map(async (rekap) => {
                await prisma.$transaction(async (tx) => {
                    if (!rekap.penilaian || rekap.penilaian.length === 0) {
                        await tx.penilaian.createMany({
                            data: indikatorList.map((indikator) => ({
                                id_penilaian: `pnl-${uuidv4()}`,
                                indikatorId: indikator.id_indikator,
                                rekapNilaiId: rekap.id_rekap_nilai,
                                nilai: null,
                            })),
                            skipDuplicates: true,
                        });
                    }

                    // Panggil update kesimpulan dalam transaction
                    await updateKesimpulanTx(tx, rekap.id_rekap_nilai);
                });
            })
        );

        // Tambahkan status, lalu hilangkan field penilaian
        const withStatus = response.map(({ penilaian, ...rest }) => {
            const semuaNilaiTerisi =
                penilaian.length > 0 &&
                penilaian.every((p) => p.nilai !== null);
            return {
                ...rest,
                status: semuaNilaiTerisi ? "lengkap" : "belum lengkap",
            };
        });

        return withStatus;
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
};

const searhPenilaian = async (id_tahun_ajaran, semester, data) => {
    try {
        const response = await prisma.rekapNilai.findMany({
            where: {
                tahunAjaranId: id_tahun_ajaran,
                semester: {
                    nama: semester,
                },
                pesertaDidik: {
                    is: {
                        OR: [
                            {
                                nama_lengkap: {
                                    contains: data,
                                },
                            },
                            {
                                nis: {
                                    contains: data,
                                },
                            },
                        ],
                    },
                },
            },
            include: {
                tahunAjaran: true,
                pesertaDidik: true,
                guru: true,
                penilaian: {
                    select: {
                        nilai: true,
                    },
                },
            },
        });

        const withStatus = response.map(({ penilaian, ...rest }) => {
            const semuaNilaiTerisi = penilaian.every((p) => p.nilai !== null);
            return {
                ...rest,
                status: semuaNilaiTerisi ? "lengkap" : "belum lengkap",
            };
        });

        return withStatus;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 500);
    }
};

const createPenilaian = async (id_rekap_nilai) => {
    try {
        const indikatorList = await getIndikator();
        const results = await Promise.all(
            indikatorList.map((indikator) =>
                prisma.penilaian.createMany({
                    data: {
                        id_penilaian: `pnl-${uuidv4()}`,
                        indikatorId: indikator.indikator.id_indikator,
                        rekapNilaiId: id_rekap_nilai,
                        nilai: null,
                    },
                })
            )
        );
        return results;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const getAllIndikator = async () => {
    return await prisma.indikator.findMany({
        select: {
            id_indikator: true,
            nama_indikator: true,
        },
    });
};

const getDataKategori = async (id_rekap_nilai) => {
    try {
        const kategoriList = await prisma.kategori.findMany({
            include: {
                subKategori: {
                    include: {
                        indikator: {
                            include: {
                                penilaian: {
                                    where: { rekapNilaiId: id_rekap_nilai },
                                },
                            },
                        },
                    },
                },
            },
        });

        // 4. Hitung status kategori dan sub-kategori
        const withStatus = kategoriList.map((kategori) => {
            const subKategoriWithStatus = (kategori.subKategori || []).map(
                (sub) => {
                    const semuaIndikatorDinilai = (sub.indikator || []).every(
                        (indikator) => {
                            const penilaian = indikator.penilaian?.[0];
                            return penilaian && penilaian.nilai !== null;
                        }
                    );

                    return {
                        id_sub_kategori: sub.id_sub_kategori,
                        nama_sub_kategori: sub.nama_sub_kategori,
                        status: semuaIndikatorDinilai
                            ? "lengkap"
                            : "belum lengkap",
                    };
                }
            );

            const kategoriLengkap = subKategoriWithStatus.every(
                (sub) => sub.status === "lengkap"
            );

            return {
                id_kategori: kategori.id_kategori,
                nama_kategori: kategori.nama_kategori,
                status: kategoriLengkap ? "lengkap" : "belum lengkap",
                subKategori: subKategoriWithStatus,
            };
        });

        return withStatus;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const getDataSubkategori = async (id_rekap_nilai, id_kategori) => {
    try {
        const subKategoriList = await prisma.subKategori.findMany({
            where: {
                kategoriId: id_kategori,
                indikator: {
                    some: {
                        penilaian: {
                            some: {
                                rekapNilaiId: id_rekap_nilai,
                            },
                        },
                    },
                },
            },
            include: {
                kategori: true,
                indikator: {
                    include: {
                        penilaian: {
                            where: {
                                rekapNilaiId: id_rekap_nilai,
                            },
                        },
                    },
                },
            },
        });

        const withStatus = subKategoriList.map((sub) => {
            const semuaNilaiTerisi = sub.indikator.every((indikator) => {
                return (
                    indikator.penilaian.length > 0 &&
                    indikator.penilaian[0].nilai !== null
                );
            });

            // Kembalikan hanya data penting + status
            return {
                id_sub_kategori: sub.id_sub_kategori,
                nama_sub_kategori: sub.nama_sub_kategori,
                kategori: {
                    id_kategori: sub.kategori.id_kategori,
                    nama_kategori: sub.kategori.nama_kategori,
                },
                status: semuaNilaiTerisi ? "lengkap" : "belum lengkap",
            };
        });

        return withStatus;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const getIndikator = async (id_rekap_nilai, id_kategori, id_sub_kategori) => {
    try {
        const data = await prisma.penilaian.findMany({
            where: {
                rekapNilaiId: id_rekap_nilai, // ← dari parameter
                indikator: {
                    subKategori: {
                        id_sub_kategori: id_sub_kategori, // ← dari parameter
                        kategoriId: id_kategori, // ← dari parameter
                    },
                },
            },
            select: {
                nilai: true,
                indikator: {
                    select: {
                        id_indikator: true,
                        nama_indikator: true,
                        subKategori: {
                            include: {
                                kategori: {
                                    select: {
                                        id_kategori: false,
                                        nama_kategori: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return data;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const penilaianList = async (id_rekap_nilai, id_sub_kategori) => {
    return await prisma.penilaian.findMany({
        where: {
            rekapNilaiId: id_rekap_nilai,
            indikator: {
                subKategoriId: Number(id_sub_kategori),
            },
        },
        select: {
            id_penilaian: true,
            indikatorId: true,
        },
    });
};

const existing = async (id_penilaian) => {
    try {
        const existing = await prisma.penilaian.findUnique({
            where: { id_penilaian: id_penilaian },
        });
        return existing;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const updatePenilaian = async (nilai, id_penilaian) => {
    try {
        const update = await prisma.penilaian.update({
            where: { id_penilaian },
            data: {
                nilai,
            },
        });

        return update;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const getPenilaianGrouped = async (id_tahun_ajaran, semester, nama_kelas) => {
    try {
        const findSemester = await prisma.semester.findFirst({
            where: {
                tahunAjaranId: id_tahun_ajaran,
                nama: semester,
            },
            select: { id_semester: true },
        });

        if (!findSemester) throwWithStatus("Semester tidak ditemukan", 404);

        const indikatorList = await getAllIndikator();

        // Ambil semua rekap nilai yang terkait semester & tahun ajaran
        const rekapList = await prisma.rekapNilai.findMany({
            where: {
                tahunAjaranId: id_tahun_ajaran,
                semesterId: findSemester.id_semester,
            },
            select: { id_rekap_nilai: true },
        });

        // --- Jalankan transaction untuk setiap rekap nilai ---
        await Promise.all(
            rekapList.map(async (rekap) => {
                await prisma.$transaction(async (tx) => {
                    const countPenilaian = await tx.penilaian.count({
                        where: { rekapNilaiId: rekap.id_rekap_nilai },
                    });

                    if (countPenilaian === 0) {
                        await tx.penilaian.createMany({
                            data: indikatorList.map((indikator) => ({
                                id_penilaian: `pnl-${uuidv4()}`,
                                indikatorId: indikator.id_indikator,
                                rekapNilaiId: rekap.id_rekap_nilai,
                                nilai: null,
                            })),
                            skipDuplicates: true,
                        });
                    }

                    // Update kesimpulan setelah penilaian dipastikan ada
                    await updateKesimpulanTx(tx, rekap.id_rekap_nilai);
                });
            })
        );

        // --- Ambil penilaian hasil akhir (grouped) ---
        const penilaianList = await prisma.penilaian.findMany({
            where: {
                rekapNilai: {
                    tahunAjaranId: id_tahun_ajaran,
                    semesterId: findSemester.id_semester,
                    ...(nama_kelas ? { guru: { nama_kelas } } : {}),
                },
            },
            select: {
                nilai: true,
                indikator: {
                    select: {
                        nama_indikator: true,
                        subKategori: {
                            select: {
                                nama_sub_kategori: true,
                                kategori: {
                                    select: {
                                        id_kategori: true,
                                        nama_kategori: true,
                                    },
                                },
                            },
                        },
                    },
                },
                rekapNilai: {
                    select: {
                        pesertaDidik: true,
                        guru: true,
                        kesimpulan: true,
                    },
                },
            },
            orderBy: [
                {
                    rekapNilai: {
                        pesertaDidik: {
                            nama_lengkap: "asc",
                        },
                    },
                },
                {
                    indikator: {
                        subKategori: { kategori: { id_kategori: "asc" } },
                    },
                },
                { indikator: { subKategori: { id_sub_kategori: "asc" } } },
                { indikator: { id_indikator: "asc" } },
                { rekapNilai: { pesertaDidik: { nama_lengkap: "asc" } } },
            ],
        });

        return penilaianList;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 500);
    }
};

const searchRaport = async (id_tahun_ajaran, semester, keyword) => {
    try {
        const findSemester = await prisma.semester.findFirst({
            where: {
                tahunAjaranId: id_tahun_ajaran,
                nama: semester,
            },
            select: { id_semester: true },
        });

        if (!findSemester) throwWithStatus("Semester tidak ditemukan", 404);
        const response = await prisma.rekapNilai.findMany({
            where: {
                tahunAjaranId: id_tahun_ajaran,
                semester: {
                    nama: semester,
                },
                pesertaDidik: {
                    is: {
                        OR: [
                            {
                                nama_lengkap: {
                                    contains: keyword,
                                },
                            },
                            {
                                nis: {
                                    contains: keyword,
                                },
                            },
                        ],
                    },
                },
            },
        });
        return response;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 500);
    }
};

const findNilaiWithId = async (id_peserta_didik, id_tahun_ajaran, semester) => {
    try {
        const data = await prisma.rekapNilai.findFirst({
            where: {
                pesertaDidikId: id_peserta_didik,
                tahunAjaranId: id_tahun_ajaran,
                semester: { nama: semester },
            },
            include: {
                pesertaDidik: {
                    select: {
                        nama_lengkap: true,
                        nis: true,
                    },
                },
                kesimpulan: true,
                penilaian: {
                    orderBy: { indikatorId: "asc" },
                    include: {
                        indikator: {
                            include: {
                                subKategori: {
                                    include: {
                                        kategori: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return data;
    } catch (error) {
        throwWithStatus(error);
    }
};

module.exports = {
    findByTahunSemester,
    getIndikator,
    createPenilaian,
    getDataKategori,
    getDataSubkategori,
    updatePenilaian,
    penilaianList,
    existing,
    getPenilaianGrouped,
    searhPenilaian,
    searchRaport,
    findNilaiWithId,
};
