const {
    findUsername,
    insertToken,
    findToken,
    deleteToken,
} = require("./repository_auth");
const throwWithStatus = require("../utils/throwWithStatus");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const verifyJwt = promisify(jwt.verify);

const Login = async (username, password, userAgent) => {
    if (!username || !password) throwWithStatus("form login masih kosong", 400);

    const user = await findUsername(username);
    if (user.password !== password)
        throwWithStatus("username atau password salah", 400);

    const payload = { id: user.id, username: user.username, role: user.role };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20s",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });

    await insertToken(refreshToken, user.id, userAgent);

    return { success: true, msg: "login berhasil", accessToken, refreshToken };
};

const refreshToken = async (token) => {
    if (!token) throwWithStatus("token tidak valid", 401);

    const tokenData = await findToken(token);
    try {
        await verifyJwt(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        if (err.name === "TokenExpiredError") {
            await deleteToken(token);
            throwWithStatus("Refresh token expired", 401);
        }
        throw err;
    }

    const payload = {
        id: tokenData.user.id,
        username: tokenData.user.username,
        role: tokenData.user.role,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20s",
    });

    return {
        success: true,
        msg: "token berhasil didapatkan",
        token: accessToken,
    };
};

const Logout = async (token) => {
    await deleteToken(token);
    return { status: "success", message: "Logged out successfully" };
};

module.exports = {
    Login,
    refreshToken,
    Logout,
};
