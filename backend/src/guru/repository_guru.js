const prisma = require("../../prisma/prismaClient");
const throwWithStatus = require("../utils/throwWithStatus");
const errorPrisma = require("../utils/errorPrisma");
const { validateUpdatePayload } = require("../utils/validator");

const getDataGuru = async () => {
    try {
        const data = await prisma.guru.findMany();
        return data;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const insertDataGuru = async (data) => {
    try {
        const dataGuru = await prisma.guru.create({
            data,
        });
        return dataGuru;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const updateDataGuru = async (data, id) => {
    const existing = await prisma.guru.findUnique({
        where: { id_guru: id },
    });
    validateUpdatePayload(data, existing);
    try {
        const update = await prisma.guru.update({
            where: { id_guru: id },
            data,
        });
        return update;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 400);
    }
};

const deleteDataById = async (id) => {
    try {
        const existing = await prisma.guru.findUnique({
            where: { id_guru: id },
        });
        if (!existing) {
            throwWithStatus("data tidak ditemukan", 400);
        }
        return await prisma.guru.delete({
            where: {
                id_guru: id,
            },
        });
    } catch (error) {
        throwWithStatus(errorPrisma(error));
    }
};

const searchDataGuru = async (data) => {
    if (!data || typeof data !== "string" || data.trim() === "") {
        throwWithStatus("Query pencarian tidak valid", 400);
    }
    try {
        const response = await prisma.guru.findMany({
            where: {
                OR: [
                    {
                        nama_guru: {
                            contains:data
                        }
                    },
                    {
                        NUPTK: {
                            contains:data
                        }
                    }
                ]
            },
        });
        if (!response || response.length == 0) {
            throwWithStatus("data tidak ditemukan", 403);
        }
        return response;
    } catch (error) {
        throwWithStatus(errorPrisma(error), 500);
    }
};

module.exports = {
    getDataGuru,
    insertDataGuru,
    updateDataGuru,
    deleteDataById,
    searchDataGuru
};
