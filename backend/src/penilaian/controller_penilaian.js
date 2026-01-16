const router = require("express").Router();
const {
    displayPesertaDidikByTahunSemester,
    postPenilaian,
    displayKategori,
    displaySubKategori,
    displayIndikator,
    updateNilai,
    displayPenilaian,
    displaySearchPenilaian,
    displaySearhRaport,
    getPenilaianWithId
} = require("./services_penilaian");

router.get("/", async (req, res, next) => {
    const { tahunAjaranId, semester, nama_kelas } = req.query;
    try {
        const response = await displayPesertaDidikByTahunSemester(
            tahunAjaranId,
            semester,
            nama_kelas
        );
        res.json({
            data: response,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/byId", async (req,res,next)=> {
    try {
        const {id_peserta_didik, id_tahun_ajaran, semester} = req.query
        const data = await getPenilaianWithId(id_peserta_didik, id_tahun_ajaran, semester)
        res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        next(error)
    }
})

router.get(
    "/search-penilaian/:id_tahun_ajaran/:semester",
    async (req, res, next) => {
        const { id_tahun_ajaran, semester } = req.params;
        const { keyword } = req.query;
        try {
            const response = await displaySearchPenilaian(
                id_tahun_ajaran,
                semester,
                keyword
            );
            res.json({
                success: true,
                msg: "berhasil didapatkan",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get("/search-raport", async (req, res, next) => {
    const { id_tahun_ajaran, semester, keyword } = req.query;
    try {
        const response = await displaySearhRaport(
            id_tahun_ajaran,
            semester,
            keyword
        );
        res.json({
            success: true,
            msg: "berhasil didapatkan",
            data: response,
        });
    } catch (error) {
        next(error);
    }
});

router.get(
    "/display-penilaian/:id_tahun_ajaran/:semester",
    async (req, res, next) => {
        const { id_tahun_ajaran, semester } = req.params;
        const {nama_kelas} = req.query
        try {
            const response = await displayPenilaian(id_tahun_ajaran, semester, nama_kelas);
            res.json({
                success: true,
                msg: "data berhasil didapatkan",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get("/:id_rekap_nilai", async (req, res, next) => {
    try {
        const response = await displayKategori(req.params.id_rekap_nilai);
        res.json({
            data: response,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/:id_rekap_nilai/:id_kategori", async (req, res, next) => {
    try {
        const { id_rekap_nilai, id_kategori } = req.params;
        const response = await displaySubKategori(
            id_rekap_nilai,
            Number(id_kategori)
        );
        res.json({
            success: true,
            data: response,
        });
    } catch (error) {
        next(error);
    }
});

router.get(
    "/:id_rekap_nilai/:id_kategori/:id_sub_kategori",
    async (req, res, next) => {
        try {
            const { id_rekap_nilai, id_kategori, id_sub_kategori } = req.params;
            const response = await displayIndikator(
                id_rekap_nilai,
                Number(id_kategori),
                Number(id_sub_kategori)
            );
            res.json({
                success: true,
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post("/tambah-penilaian/:id_rekap_nilai", async (req, res, next) => {
    const { id_rekap_nilai } = req.params;
    try {
        await postPenilaian(id_rekap_nilai);
        res.json({
            success: true,
            message: "data berhasil di tambahkan",
        });
    } catch (error) {
        next(error);
    }
});

router.patch(
    "/update-nilai/:id_rekap_nilai/:id_sub_kategori",
    async (req, res, next) => {
        const { id_rekap_nilai, id_sub_kategori } = req.params;
        const { nilai_list } = req.body;
        try {
            await updateNilai(id_rekap_nilai, id_sub_kategori, nilai_list);
            res.json({
                success: true,
                message: "data berhasil di update",
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
