const {
    findPeserta,
    updatePassword,
    findTahunByIdPeserta,
    findPenilaianByIdPeserta,
} = require("./repository_orangTua");
const throwWithStatus = require("../utils/throwWithStatus");

const getPeserta = async (username) => {
    if (!username) {
        throwWithStatus("username tidak ditemukan", 304);
    }
    try {
        const data = await findPeserta(username);
        if (!data) throwWithStatus("data peserta didik tidak ditemukan", 304);
        return data;
    } catch (error) {
        throw error;
    }
};

const getTahunByPeserta = async (id_peserta_didik) => {
    try {
        if (!id_peserta_didik)
            throwWithStatus("peserta didik tidak ditemukan, ", 400);
        const response = await findTahunByIdPeserta(id_peserta_didik);
        return response;
    } catch (error) {
        throw error;
    }
};

const updatePass = async (id, oldPassword, newPassword) => {
    try {
        if (!id) throwWithStatus("id tidak ditemukan", 404);
        if (!newPassword || newPassword.length == 0)
            throwWithStatus("password kosong, harap isi", 422);
        if (!newPassword || newPassword.length == 0)
            throwWithStatus("password kosong, harap isi", 422);
        const data = await updatePassword(id, oldPassword, newPassword);
        return data;
    } catch (error) {
        throw error;
    }
};

const getPenilaianByIdPeserta = async(id_peserta_didik, id_tahun_ajaran, semester)=> {
    try {
        if(!id_peserta_didik) throwWithStatus("peserta didik tidak ada")
        if(!id_tahun_ajaran) throwWithStatus("harap memilih tahun ajaran")    
        if(!semester) throwWithStatus("harap memilih semester")
        
        const response = await findPenilaianByIdPeserta(id_peserta_didik, id_tahun_ajaran, semester)
        return response
    } catch (error) {
        throw error
    }
}

module.exports = {
    getPeserta,
    updatePass,
    getTahunByPeserta,
    getPenilaianByIdPeserta
};
