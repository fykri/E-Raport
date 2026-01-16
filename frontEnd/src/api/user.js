import axiosInstance from "./axiosInstance";

export const displayData = async () => {
    try {
        const response = await axiosInstance.get("/users");
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || "Terjadi kesalahan";
        } else {
            throw error;
        }
    }
};

export const insertData = async (username, password, role, id_peserta_didik) => {
    try {
        const response = await axiosInstance.post("/users/add-users", {
            username,
            password,
            role,
            id_peserta_didik
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || "Terjadi kesalahan";
        } else {
            throw error;
        }
    }
};


export const updateData = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/users/update-users/${id}`, data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || "Terjadi kesalahan";
        } else {
            throw error;
        }
    }
};

export const deleteData = async (id) => {
    try {
        const response = await axiosInstance.delete(
            `/users/delete-users/${id}`
        );
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || "Terjadi kesalahan";
        } else {
            throw error;
        }
    }
};
