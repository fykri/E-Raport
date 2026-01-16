const router = require("express").Router();
const { getData, updateData } = require("./services_kesimpulan");

router.get("/:id_rekap_nilai", async (req, res, next) => {
    const { id_rekap_nilai } = req.params;

    try {
        const response = await getData(id_rekap_nilai);
        res.json({
            success: true,
            message: "data kesimpulan berhasil didapatkan",
            data: response,
        });
    } catch (error) {
        next(error);
    }
});

router.patch("/update-kesimpulan/:id_rekap_nilai", async (req, res, next) => {
    const { id_rekap_nilai } = req.params;
    const data = req.body;
    try {
        await updateData(id_rekap_nilai, data);
        res.json({
            success: true,
            message: "data berhasil di update",
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
