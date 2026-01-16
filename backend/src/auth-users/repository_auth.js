const prisma = require("../../prisma/prismaClient");
const throwWithStatus = require("../utils/throwWithStatus");

const insertData = async function (username, password, role) {
    try {
        const user = await prisma.users.findFirst({
            where: {
                username,
            },
        });
        if (user) throwWithStatus("username sudah ada dalam tabel");
        return await prisma.users.create({
            data: { username, password, role },
        });
    } catch (error) {
        throw error;
    }
};

const findUsername = async function (username) {
    const user = await prisma.users.findFirst({ where: { username } });
    if (!user) throwWithStatus("username atau password salah", 400);
    return user;
};

const insertToken = async function (token, idUser, userAgent) {
    return await prisma.userTokens.create({
        data: {
            userId: idUser,
            token,
            userAgent,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 hari
        },
    });
};

const findToken = async function (token) {
    const found = await prisma.userTokens.findFirst({
        where: { token },
        include: { user: true },
    });
    if (!found) throwWithStatus("forbidden", 403);
    return found;
};

const deleteToken = async function (token) {
    return await prisma.userTokens.deleteMany({ where: { token } });
};

module.exports = {
    insertData,
    findUsername,
    insertToken,
    findToken,
    deleteToken,
};
