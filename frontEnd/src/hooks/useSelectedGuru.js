import { useShallow } from "zustand/react/shallow";
import { useGuruStore } from "../stores/guruStore";
import { useEffect } from "react";

export const useSelectedGuru = () => {
    const { dataGuru, fetchDataGuru } = useGuruStore(
        useShallow((state) => ({
            dataGuru: state.data,
            fetchDataGuru: state.fetchGuruKelas,
        }))
    );

    useEffect(() => {
        fetchDataGuru();
    }, []);

    const guruOptions =
        dataGuru?.map((item) => ({
            label: `${item.nama_kelas}: ${item.nama_guru}`,
            value: item.id_guru,
        })) || [];

    return [guruOptions];
};
