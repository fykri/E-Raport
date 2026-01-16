const prisma = require("../../prisma/prismaClient");
const errorPrisma = require("../utils/errorPrisma");
const throwWithStatus = require("../utils/throwWithStatus");

const findPeserta = async (username) => {
    try {
        const data = await prisma.pesertaDidik.findFirst({
            where: {
                nis: username,
            },
        });
        return data;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 500);
    }
};

const updatePassword = async (id_peserta_didik, oldPassword, newPassword) => {
    const findUser = await prisma.users.findFirst({
        where: {
            pesertaDidikId: id_peserta_didik,
        },
    });
    try {
        if (findUser) {
            if (findUser.password != oldPassword) {
                throwWithStatus("password lama salah", 400);
            }
            if (findUser.password == newPassword) {
                throwWithStatus(
                    "password anda yang lama telah dipakai di akun ini, tidak ada perubahan",
                    409
                );
            }
            const data = await prisma.users.update({
                where: {
                    pesertaDidikId: id_peserta_didik,
                },
                data: {
                    password: newPassword,
                },
            });
            return data;
        }
    } catch (error) {
        throwWithStatus(errorPrisma(error), 500);
    }
};

const findTahunByIdPeserta = async (id_peserta_didik) => {
    try {
        const data = await prisma.rekapNilai.findMany({
            where: {
                pesertaDidikId: id_peserta_didik
            },
            select: {
                tahunAjaran:{
                    select: {
                        id_tahun_ajaran: true,
                        tahun_ajaran:true
                    }
                }
            },
            distinct:["tahunAjaranId"]
        });
        const tahunList = data.map((item)=> ({
            id_tahun_ajaran: item.tahunAjaran.id_tahun_ajaran,
            tahun_ajaran: item.tahunAjaran.tahun_ajaran
        }))

        return tahunList;
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
};

const findPenilaianByIdPeserta = async (
    id_peserta_didik,
    id_tahun_ajaran,
    semester
) => {
    try {
        const data = await prisma.rekapNilai.findFirst({
            where: {
                pesertaDidikId: id_peserta_didik,
                tahunAjaranId: id_tahun_ajaran,
                semester: {
                    nama: semester,
                },
            },
            select: {
                penilaian: true,
            },
        });
        if (!data) return null; // atau return { penilaian: [] }

        const sortedPenilaian = [...(data.penilaian || [])].sort(
            (a, b) =>
                (Number(a.indikatorId) || 0) - (Number(b.indikatorId) || 0)
        );

        return { ...data, penilaian: sortedPenilaian };
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
};

module.exports = {
    findPeserta,
    updatePassword,
    findTahunByIdPeserta,
    findPenilaianByIdPeserta,
};
