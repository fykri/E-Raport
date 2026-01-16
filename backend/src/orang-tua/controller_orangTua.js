const {
    getPeserta,
    updatePass,
    getTahunByPeserta,
    getPenilaianByIdPeserta,
} = require("./services_orangTua");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
    try {
        const { username } = req.user;
        const data = await getPeserta(username);
        res.json({
            success: true,
            message: "data berhasil didapatkan",
            data,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/penilaian/rekap-nilai/:nis", async (req, res, next) => {
    try {
        const { nis } = req.params;
        const data = await getPeserta(nis);
        res.json({
            success: true,
            message: "data berhasil didapatkan",
            data,
        });
    } catch (error) {
        next(error);
    }
});

router.patch("/update-password/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;
        await updatePass(id, oldPassword, newPassword);
        res.json({
            success: true,
            message: "password berhasil diperbarui",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/getTahun/:id_peserta_didik", async (req, res, next) => {
    try {
        const { id_peserta_didik } = req.params;
        const response = await getTahunByPeserta(id_peserta_didik);
        res.json({
            success: true,
            message: "data berhasil didapatkan",
            data: response,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/getPenilaianByIdPeserta", async (req, res, next) => {
    try {
        const { id_peserta_didik, id_tahun_ajaran, semester } = req.query;
        const response = await getPenilaianByIdPeserta(
            id_peserta_didik,
            id_tahun_ajaran,
            semester
        );
        res.json({
            success: true,
            message: "data berhasil didapatkan",
            data: response,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
