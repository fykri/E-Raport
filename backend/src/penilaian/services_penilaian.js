const {
    findByTahunSemester,
    createPenilaian,
    getDataKategori,
    getDataSubkategori,
    getIndikator,
    updatePenilaian,
    existing,
    getPenilaianGrouped,
    penilaianList,
    searhPenilaian,
    searchRaport,
    findNilaiWithId,
} = require("./repository_penilaian");

const { findByKelas } = require("../peserta-didik/repository_peserta");
const prisma = require("../../prisma/prismaClient");
const { validatorField, sanitizeData } = require("../utils/validator");
const { validateUpdatePayload } = require("../utils/validator");
const throwWithStatus = require("../utils/throwWithStatus");

const displayPesertaDidikByTahunSemester = async (
    tahunAjaran,
    semester,
    nama_kelas
) => {
    validatorField({ tahunAjaran, semester });
    try {
        const response = await findByTahunSemester(
            tahunAjaran,
            semester,
            nama_kelas
        );
        if (nama_kelas) {
            const kelas = await findByKelas(tahunAjaran, nama_kelas);
            if (!kelas) {
                throwWithStatus(
                    "data peserta didik di kelas ini belum ada",
                    404
                );
            }
        }
        if (!response || response.length == 0) {
            throwWithStatus("data peserta pada tahun ini belum ada", 404);
        }
        return response;
    } catch (error) {
        throw error;
    }
};

const displaySearchPenilaian = async (id_tahun_ajaran, semester, data) => {
    validatorField({
        id_tahun_ajaran,
        semester,
        data,
    });

    try {
        const response = await searhPenilaian(id_tahun_ajaran, semester, data);
        if (!response || response.length == 0) {
            throwWithStatus("data tidak ditemukan", 404);
        }
        const newData = response.map((val) => {
            return {
                id_rekap_nilai: val.id_rekap_nilai,
                tahun_ajaran: val.tahunAjaran,
                peserta_didik: {
                    id_peserta_didik: val.pesertaDidik.id_peserta_didik,
                    nama_lengkap: val.pesertaDidik.nama_lengkap,
                    nis: val.pesertaDidik.nis,
                },
                guru: {
                    nama_kelas: val.guru.nama_kelas,
                },
            };
        });
        return newData;
    } catch (error) {
        throw error;
    }
};

const postPenilaian = async (id_rekap_nilai) => {
    try {
        validatorField({
            id_rekap_nilai,
        });
        const response = await createPenilaian(id_rekap_nilai);
        if (!response || response.length == 0) {
            throwWithStatus("kesalahan server", 500);
        }
        return response;
    } catch (error) {
        throw error;
    }
};

const displayKategori = async (id_rekap_nilai) => {
    try {
        validatorField({ id_rekap_nilai });

        const kategoriList = await getDataKategori(id_rekap_nilai);
        if (!kategoriList || kategoriList.length === 0) {
            throwWithStatus("kesalahan server", 500);
        }

        const rekap = await prisma.rekapNilai.findUnique({
            where: { id_rekap_nilai },
            include: {
                pesertaDidik: true,
                tahunAjaran: true,
                semester: true,
            },
        });

        if (!rekap) {
            throwWithStatus("Data rekap tidak ditemukan", 404);
        }

        const mapped = kategoriList.map((kategori) => ({
            id_kategori: kategori.id_kategori,
            nama_kategori: kategori.nama_kategori,
            status: kategori.status,
            peserta_didik: {
                nama_lengkap: rekap.pesertaDidik.nama_lengkap,
                nis: rekap.pesertaDidik.nis,
                tahun_ajaran: rekap.tahunAjaran.tahun_ajaran,
                semester: rekap.semester.nama,
            },
        }));

        return mapped;
    } catch (error) {
        throw error;
    }
};

const displaySubKategori = async (id_rekap_nilai, id_kategori) => {
    try {
        validatorField({
            id_kategori,
            id_rekap_nilai,
        });
        const response = await getDataSubkategori(id_rekap_nilai, id_kategori);
        if (!response || response.length == 0) {
            throwWithStatus("kesalahan server", 500);
        }
        const subKategori = [
            ...new Map(
                response.map((item) => [item.id_sub_kategori, item])
            ).values(),
        ];
        return subKategori;
    } catch (error) {
        throw error;
    }
};

const displayIndikator = async (
    id_rekap_nilai,
    id_kategori,
    id_sub_kategori
) => {
    try {
        validatorField({
            id_rekap_nilai,
            id_kategori,
            id_sub_kategori,
        });
        const response = await getIndikator(
            id_rekap_nilai,
            id_kategori,
            id_sub_kategori
        );
        if (!response || response.length == 0) {
            throwWithStatus("kesalahan server", 500);
        }
        return response;
    } catch (error) {
        throw error;
    }
};

const updateNilai = async (id_rekap_nilai, id_sub_kategori, nilai_list) => {
    if (!Array.isArray(nilai_list)) {
        throwWithStatus("invalid payload", 400);
    }

    const validEnum = ["B", "C", "P"];

    try {
        const listPenilaian = await penilaianList(
            id_rekap_nilai,
            id_sub_kategori
        );

        const penilaianMap = new Map();
        listPenilaian.forEach((p) =>
            penilaianMap.set(p.indikatorId, p.id_penilaian)
        );

        const newData = [];
        const existingData = [];

        for (const item of nilai_list) {
            const sanitizedItem = sanitizeData(item);

            // Validasi nilai hanya B, C, P, atau null
            if (
                sanitizedItem.nilai !== null &&
                !validEnum.includes(sanitizedItem.nilai)
            ) {
                throwWithStatus(
                    `Nilai tidak valid: ${sanitizedItem.nilai}. Harus B, C, P, atau kosong.`,
                    400
                );
            }

            const id_penilaian = penilaianMap.get(sanitizedItem.id_indikator);
            if (!id_penilaian) continue;

            const existingRecord = await existing(id_penilaian);

            const existingFlat =
                Array.isArray(existingRecord) && existingRecord.length === 1
                    ? existingRecord[0]
                    : existingRecord;

            if (!existingFlat) continue;

            const newItem = {
                id_penilaian,
                nilai: sanitizedItem.nilai,
            };

            newData.push(newItem);
            existingData.push(existingFlat);
        }

        validateUpdatePayload(newData, existingData);

        const results = [];
        for (const item of newData) {
            const updated = await updatePenilaian(
                item.nilai,
                item.id_penilaian
            );
            results.push(updated);
        }

        return results;
    } catch (error) {
        throw error;
    }
};

const displayPenilaian = async (id_tahun_ajaran, semester, nama_kelas) => {
    validatorField({ id_tahun_ajaran, semester });

    const penilaianList = await getPenilaianGrouped(
        id_tahun_ajaran,
        semester,
        nama_kelas
    );
    if (nama_kelas) {
        const kelas = await findByKelas(id_tahun_ajaran, nama_kelas);
        if (!kelas) {
            throwWithStatus("data peserta didik di kelas ini belum ada", 404);
        }
    }
    if (!penilaianList || penilaianList.length === 0) {
        throwWithStatus(
            "data peserta didik di tahun ajaran ini belum ada",
            404
        );
    }

    const grouped = {};
    for (const p of penilaianList) {
        const pd = p.rekapNilai.pesertaDidik;
        const nama_kelas = formatNamaKelas(p.rekapNilai.guru.nama_kelas);

        if (!grouped[pd.id_peserta_didik]) {
            grouped[pd.id_peserta_didik] = {
                pesertaDidik: {
                    ...pd,
                    nama_kelas, // Sudah diformat jadi "Kelompok A/B"
                },
                guru: {
                    ...p.rekapNilai.guru,
                    nama_kelas,
                },
                kesimpulan: p.rekapNilai.kesimpulan,
                kategori: {},
            };
        }

        const kategoriId = p.indikator.subKategori.kategori.id_kategori;
        const kategori = p.indikator.subKategori.kategori.nama_kategori;
        const subKategori = p.indikator.subKategori.nama_sub_kategori;

        if (!grouped[pd.id_peserta_didik].kategori[kategoriId]) {
            grouped[pd.id_peserta_didik].kategori[kategoriId] = {
                nama: kategori,
                subKategori: {},
            };
        }

        if (
            !grouped[pd.id_peserta_didik].kategori[kategoriId].subKategori[
                subKategori
            ]
        ) {
            grouped[pd.id_peserta_didik].kategori[kategoriId].subKategori[
                subKategori
            ] = [];
        }

        grouped[pd.id_peserta_didik].kategori[kategoriId].subKategori[
            subKategori
        ].push({
            indikator: p.indikator.nama_indikator,
            nilai: p.nilai,
        });
    }

    return Object.values(grouped).map((g) => ({
        pesertaDidik: g.pesertaDidik,
        guru: g.guru,
        kesimpulan: g.kesimpulan,
        kategori: Object.keys(g.kategori).map((id) => ({
            id_kategori: Number(id),
            nama_kategori: g.kategori[id].nama,
            subKategori: Object.keys(g.kategori[id].subKategori).map(
                (namaSub) => ({
                    nama_sub_kategori: namaSub,
                    indikator: g.kategori[id].subKategori[namaSub],
                })
            ),
        })),
    }));
};

const formatNamaKelas = (nama_kelas) => {
    if (!nama_kelas) return "";
    // Pastikan huruf terakhir dipisah
    const match = nama_kelas.match(/(kelompok)([A-Z])/i);
    if (match) {
        return `${match[1][0].toUpperCase()}${match[1].slice(
            1
        )} ${match[2].toUpperCase()}`;
    }
    return nama_kelas;
};

const displaySearhRaport = async (id_tahun_ajaran, semester, keyword) => {
    try {
        const response = await searchRaport(id_tahun_ajaran, semester, keyword);
        if (!response || response.length == 0) {
            throwWithStatus("data tidak ditemukan", 404);
        }
        return response;
    } catch (error) {
        throw error;
    }
};

const getPenilaianWithId = async (
    id_peserta_didik,
    id_tahun_ajaran,
    semester
) => {
    if (!id_peserta_didik) {
        throwWithStatus("peserta didik tidak ditemukan", 403);
    }
    if (!id_tahun_ajaran) {
        throwWithStatus("tahun ajaran tidak ditemukan", 403);
    }
    if (!semester) {
        throwWithStatus("semester tidak ditemukan", 403);
    }

    try {
        const grouped = {};
        const data = await findNilaiWithId(
            id_peserta_didik,
            id_tahun_ajaran,
            semester
        );
        data.penilaian.forEach((p) => {
            const kategori = p.indikator.subKategori.kategori;
            const subKategori = p.indikator.subKategori;

            if (!grouped[kategori.id_kategori]) {
                grouped[kategori.id_kategori] = {
                    id_kategori: kategori.id_kategori,
                    nama_kategori: kategori.nama_kategori,
                    subKategori: {},
                };
            }

            if (
                !grouped[kategori.id_kategori].subKategori[
                    subKategori.id_sub_kategori
                ]
            ) {
                grouped[kategori.id_kategori].subKategori[
                    subKategori.id_sub_kategori
                ] = {
                    nama_sub_kategori: subKategori.nama_sub_kategori,
                    indikator: [],
                };
            }

            grouped[kategori.id_kategori].subKategori[
                subKategori.id_sub_kategori
            ].indikator.push({
                indikator: p.indikator.nama_indikator,
                nilai: p.nilai ?? null,
            });
        });

        return {
            pesertaDidik: data.pesertaDidik,
            guru: data.guru,
            kesimpulan: data.kesimpulan,
            kategori: Object.values(grouped).map((kat) => ({
                ...kat,
                subKategori: Object.values(kat.subKategori),
            })),
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    displayPesertaDidikByTahunSemester,
    postPenilaian,
    displayKategori,
    displaySubKategori,
    displayIndikator,
    updateNilai,
    displayPenilaian,
    displaySearchPenilaian,
    displaySearhRaport,
    getPenilaianWithId,
};
