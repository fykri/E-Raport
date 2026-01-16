const prisma = require("../../prisma/prismaClient");
const errorPrisma = require("../utils/errorPrisma");
const throwWithStatus = require("../utils/throwWithStatus");

async function getKesimpulan(id_rekap_nilai) {
    try {
        const response = await prisma.kesimpulan.findFirst({
            where: {
                id_rekap_nilai: id_rekap_nilai,
            },
        });
        return response;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 500);
    }
}

async function updateKesimpulan(id_rekap_nilai, data) {
    try {
        const response = await prisma.kesimpulan.update({
            where: {
                id_rekap_nilai: id_rekap_nilai,
            },
            data: data,
        });
        return response;
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
}

module.exports = {
    updateKesimpulan,
    getKesimpulan,
};
