import axiosInstance from "./axiosInstance";

export const getPesertaOrtu = async () => {
    try {
        const data = await axiosInstance.get("/ortu");
        return data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data.message || "Terjadi kesalahan";
        } else {
            throw error;
        }
    }
};

export const getPesertaByNis = async (nis) => {
    try {
        const data = await axiosInstance.get(`/ortu/penilaian/rekap-nilai/${nis}`);
        return data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data.message || "Terjadi kesalahan";
        } else {
            throw error;
        }
    }
};

export const changePassword = async (id, newPassword, oldPassword) => {
    try {
        const response = await axiosInstance.patch(
            `/ortu/update-password/${id}`,
            { newPassword, oldPassword }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data.message || "Terjadi kesalahan";
        } else {
            throw error;
        }
    }
};

export const getTahunByIdPeserta = async (id_peserta_didik) => {
    try {
        const data = await axiosInstance.get(
            `/ortu/getTahun/${id_peserta_didik}`
        );
        return data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data.message || "Terjadi kesalahan";
        } else {
            throw error;
        }
    }
};

export const getNilaiByIdPeserta = async (
    id_peserta_didik,
    id_tahun_ajaran,
    semester
) => {
    try {
        const response = await axiosInstance.get(
            "/penilaian/byId",
            {
                params: {
                    id_peserta_didik,
                    id_tahun_ajaran,
                    semester,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data.message || "Terjadi kesalahan";
        } else {
            throw error;
        }
    }
};
