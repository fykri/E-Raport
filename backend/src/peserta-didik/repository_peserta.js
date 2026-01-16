const prisma = require("../../prisma/prismaClient");
const errorPrisma = require("../utils/errorPrisma");
const throwWithStatus = require("../utils/throwWithStatus");
const { v4: uuidv4 } = require("uuid");
const { validateUpdatePayload } = require("../utils/validator");

const getSemester = async (tahunAjaranId) => {
    try {
        const result = await prisma.tahunAjaran.findUnique({
            where: {
                id_tahun_ajaran: tahunAjaranId,
            },
            include: {
                semester: {
                    select: {
                        id_semester: true,
                    },
                    orderBy: {
                        nama: "asc", // urutkan jika dibutuhkan
                    },
                },
            },
        });

        if (!result || result.semester.length !== 2) {
            throw new Error("Semester tidak ditemukan atau jumlahnya tidak 2");
        }

        return result.semester.map((s) => s.id_semester);
    } catch (error) {
        throwWithStatus(errorPrisma(error), 500);
    }
};

const insertDataPesertaDidik = async (data) => {
    const { tahunAjaranId, guruId, pesertaDidik } = data;

    try {
        const semesterId = await getSemester(tahunAjaranId);

        const peserta_didik = await prisma.rekapNilai.findFirst({
            where: {
                pesertaDidik: {
                    nis: pesertaDidik.nis,
                    nama_lengkap: pesertaDidik.nama_lengkap,
                },
            },
            include: {
                pesertaDidik: true,
            },
        });

        if (pesertaDidik.tanggal_lahir) {
            pesertaDidik.tanggal_lahir = new Date(pesertaDidik.tanggal_lahir);
        }

        return await prisma.$transaction(async (tx) => {
            let peserta;

            if (peserta_didik) {
                if (tahunAjaranId === peserta_didik.tahunAjaranId) {
                    // NIS sama & tahun ajaran sama → error
                    throw new Error(
                        "peserta didik pada tahun ajaran ini sudah ada"
                    );
                } else {
                    // NIS sama & tahun ajaran berbeda → pakai peserta lama
                    peserta = peserta_didik.pesertaDidik;
                }
            } else {
                const username = pesertaDidik.nis;
                const password = "peserta-didik";
                const role = "Ortu";
                const id = `PD-${uuidv4().split("-")[0]}`;
                peserta = await tx.pesertaDidik.create({
                    data: {
                        id_peserta_didik: id,
                        ...pesertaDidik,
                    },
                });
                await tx.users.create({
                    data: {
                        username,
                        password,
                        role,
                        pesertaDidikId: id,
                    },
                });
            }

            const rekap1 = await tx.rekapNilai.create({
                data: {
                    id_rekap_nilai: `RKP-${uuidv4().split("-")[0]}`,
                    pesertaDidikId: peserta.id_peserta_didik,
                    tahunAjaranId,
                    guruId,
                    semesterId: semesterId[0],
                },
            });

            const rekap2 = await tx.rekapNilai.create({
                data: {
                    id_rekap_nilai: `RKP-${uuidv4().split("-")[0]}`,
                    pesertaDidikId: peserta.id_peserta_didik,
                    tahunAjaranId,
                    guruId,
                    semesterId: semesterId[1],
                },
            });

            return { peserta, rekap1, rekap2 };
        });
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
};

const findManyDataPesertaDidik = async () => {
    try {
        const response = await prisma.pesertaDidik.findMany({
            orderBy: {
                nama_lengkap: "asc",
            },
        });
        return response;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 404);
    }
};

const findByTahunAjaran = async (tahunAjaranId, nama_kelas) => {
    try {
        const data = await prisma.rekapNilai.findMany({
            where: {
                tahunAjaranId: tahunAjaranId,
                ...(nama_kelas ? { guru: { nama_kelas } } : {}),
            },
            include: {
                tahunAjaran: true,
                pesertaDidik: true,
                guru: true,
            },
            orderBy: {
                pesertaDidik: {
                    nama_lengkap: "asc",
                },
            },
            distinct: ["pesertaDidikId"], // hanya ambil satu untuk setiap pesertaDidik
        });
        return data;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const findByKelas = async (id_tahun_ajaran, nama_kelas) => {
    try {
        const response = await prisma.rekapNilai.findFirst({
            where: {
                tahunAjaranId: id_tahun_ajaran,
                ...(nama_kelas ? { guru: { nama_kelas } } : {}),
            },
        });
        return response;
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
};

const updatePesertaDidik = async (data, id_peserta_didik, tahun_ajaran_id) => {
    // Cari semua rekapNilai lama
    const existing = await prisma.rekapNilai.findMany({
        where: {
            pesertaDidikId: id_peserta_didik,
            tahunAjaranId: tahun_ajaran_id,
        },
        include: {
            pesertaDidik: true,
        },
    });

    if (!existing || existing.length < 2) {
        throwWithStatus(
            "Data rekap nilai tidak lengkap untuk peserta ini.",
            400
        );
    }

    const dupeCheck = await prisma.rekapNilai.findFirst({
        where: {
            pesertaDidik: { id_peserta_didik },
            tahunAjaranId: data.tahunAjaranId,
            NOT: {
                id_rekap_nilai: { in: existing.map((x) => x.id_rekap_nilai) },
            },
        },
        include: { tahunAjaran: true },
    });

    if (dupeCheck) {
        throwWithStatus(
            `Peserta didik ini sudah punya data pada tahun ajaran ${dupeCheck.tahunAjaran.tahun_ajaran}: harap cek`,
            400
        );
    }
    if (existing[0].tahunAjaranId !== data.tahunAjaranId || existing[0].guruId !== data.guruId) {
        const semesterId = await getSemester(data.tahunAjaranId);

        await prisma.$transaction([
            prisma.rekapNilai.update({
                where: { id_rekap_nilai: existing[0].id_rekap_nilai },
                data: {
                    tahunAjaranId: data.tahunAjaranId,
                    guruId: data.guruId,
                    semesterId: semesterId[0],
                },
            }),
            prisma.rekapNilai.update({
                where: { id_rekap_nilai: existing[1].id_rekap_nilai },
                data: {
                    tahunAjaranId: data.tahunAjaranId,
                    guruId: data.guruId,
                    semesterId: semesterId[1],
                },
            }),
        ]);
    }

    const newExisting = {
        tahunAjaranId: existing[0].tahunAjaranId,
        guruId: existing[0].guruId,
        ...existing[0].pesertaDidik,
    };

    try {
        if (data.pesertaDidik.tanggal_lahir) {
            data.pesertaDidik.tanggal_lahir = new Date(
                data.pesertaDidik.tanggal_lahir
            );
        }

        const newData = {
            tahunAjaranId: data.tahunAjaranId,
            guruId: data.guruId,
            ...data.pesertaDidik,
        };
        validateUpdatePayload(newData, newExisting);

        const update = await prisma.pesertaDidik.update({
            where: { id_peserta_didik },
            data: data.pesertaDidik,
        });
        if (data.pesertaDidik.nis) {
            const username = data.pesertaDidik.nis;
            await prisma.users.update({
                where: { pesertaDidikId: id_peserta_didik },
                data: {
                    username,
                },
            });
        }
        return update;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const findPesertaDidik = async (id_peserta_didik, id_tahun_ajaran) => {
    try {
        const response = await prisma.rekapNilai.findFirst({
            where: {
                AND: [
                    { pesertaDidikId: id_peserta_didik },
                    { tahunAjaranId: id_tahun_ajaran },
                ],
            },
        });
        if (!response || response.length == 0) {
            throwWithStatus("peserta didik tidak ditemukan", 404);
        }
        return response.id_rekap_nilai;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 500);
    }
};

const deleteDataById = async (id_peserta_didik, id_tahun_ajaran) => {
    try {
        await findPesertaDidik(id_peserta_didik, id_tahun_ajaran);
        await prisma.rekapNilai.deleteMany({
            where: {
                pesertaDidikId: id_peserta_didik,
                tahunAjaranId: id_tahun_ajaran,
            },
        });
        const pesertaDidik = await prisma.pesertaDidik.findFirst({
            where: {
                id_peserta_didik
            }
        })
        const existing = await prisma.rekapNilai.findFirst({
            where: {
                pesertaDidikId: id_peserta_didik,
            },
        });
        if (!existing || existing.length == 0) {
            await prisma.pesertaDidik.delete({
                where: {
                    id_peserta_didik: id_peserta_didik,
                },
            });
            await prisma.users.deleteMany({
                where: {
                    username: pesertaDidik.nis
                }
            })
        }
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
};

const finByTahunSemester = async (tahunAjaranId, semester) => {
    try {
        const response = await prisma.rekapNilai.findMany({
            where: {
                tahunAjaranId: tahunAjaranId,
                semester: {
                    is: {
                        nama: semester,
                    },
                },
            },
            select: {
                id_rekap_nilai: true,
                tahunAjaranId: true,
                guruId: true,
                semesterId: true,
                pesertaDidik: true,
            },
        });
        return response;
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
};

const searchPesertaDidik = async (data) => {
    if (!data || typeof data !== "string" || data.trim() === "") {
        throwWithStatus("Query pencarian tidak valid", 400);
    }
    try {
        const hasil = await prisma.rekapNilai.findMany({
            where: {
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
                pesertaDidik: true,
                guru: true,
                tahunAjaran: true,
            },
            distinct: ["tahunAjaranId"],
        });
        if (hasil.length == 0) {
            throwWithStatus("pencarian tidak ditemukan", 404);
        }
        return hasil;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const allPesertaDidik = async (data) => {
    try {
        if (!data || typeof data !== "string" || data.trim() === "") {
            throwWithStatus("Query pencarian tidak valid", 400);
        }

        const response = await prisma.pesertaDidik.findMany({
            where: {
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
        });
        if (!response || response.length == 0) {
            throwWithStatus("pencarian tidak ditemukan", 404);
        }
        return response;
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
};

module.exports = {
    insertDataPesertaDidik,
    findManyDataPesertaDidik,
    findByTahunAjaran,
    updatePesertaDidik,
    searchPesertaDidik,
    deleteDataById,
    finByTahunSemester,
    allPesertaDidik,
    findByKelas,
};
