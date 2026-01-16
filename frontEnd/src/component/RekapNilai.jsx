import { getNilaiByIdPeserta, getPesertaByNis } from "../api/orang_tua";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardRekapNilai from "./card/CardRekapNilai";
import RekapNilaiTable from "./table/RekapNilaiTable";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getKesimpulan } from "../api/kesimpulan";

const RekapNilai = () => {
    const [error, setError] = useState("");
    const [nilai, setNilai] = useState([]);
    const [selectedPeserta, setSelectedPeserta] = useState({});
    const { id_peserta_didik, tahun_ajaran, semester, nis, id_rekap_nilai } = useParams();
    const [keterangan, setKeterangan] = useState({
        baik: 0,
        cukup: 0,
        perluDilatih: 0,
    });
    const indikatorNilai = ["B", "C", "P"];
    const navigate = useNavigate();
    const getPeserta = async () => {
        setError("");
        try {
            const data = await getPesertaByNis(nis);
            setSelectedPeserta(data?.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Terjadi kesalahan"
            );
        }
    };
    useEffect(() => {
        getPeserta();
        fetchDataKeterangan();
    }, []);

    const fetchDataKeterangan = async () => {
        setError("");
        try {
            const response = await getKesimpulan(id_rekap_nilai);
            setKeterangan({
                baik: response?.pencapaian_perkembangan_baik,
                cukup: response?.pencapaian_perkembangan_buruk,
                perluDilatih: response?.pencapaian_perkembangan_perlu_dilatih,
            });
        } catch (error) {
            setError(error.message || "terjadi kesalahan");
        }
    };

    const fetchNilaiByPesertaDidik = async () => {
        setError("");
        setNilai([]);
        try {
            const response = await getNilaiByIdPeserta(
                id_peserta_didik,
                tahun_ajaran,
                semester
            );
            console.log("response rekap: ", response);
            if (
                !response.data.kategori ||
                response.data.kategori.length === 0
            ) {
                setError(
                    `nilai peserta didik ${
                        selectedPeserta?.nama_lengkap || ""
                    } pada semester ini belum ada`
                );
                return;
            }
            setNilai(response.data.kategori);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Terjadi kesalahan saat mengambil data nilai"
            );
        }
    };

    useEffect(() => {
        if (id_peserta_didik && tahun_ajaran && semester) {
            fetchNilaiByPesertaDidik();
        }
    }, [id_peserta_didik, tahun_ajaran, semester]);

    return (
        <div className="w-full min-h-screen font-poppins px-5 md:px-10 flex flex-col">
            <button
                onClick={() => navigate("/penilaian")}
                className="mb-4 mt-2 self-start flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                Kembali
            </button>

            <CardRekapNilai selectedPeserta={selectedPeserta} />
            <div className="flex gap-6 flex-wrap content-start mt-10 flex-row justify-center">
                <div className="w-40 bg-[#5CB338] rounded-xl h-[110px] flex justify-center items-center gap-1 flex-col">
                    <h1 className="font-semibold text-md text-gray-800">
                        BAIK
                    </h1>
                    <p className="text-sm text-gray-800">{keterangan.baik}</p>
                </div>
                <div className="w-40 h-[110px] bg-[#ECE852] rounded-xl flex justify-center items-center gap-1 flex-col">
                    <h1 className="font-semibold text-md text-gray-800">
                        CUKUP
                    </h1>
                    <p className="text-sm text-gray-800">{keterangan.cukup}</p>
                </div>
                <div className="w-40 h-[110px] bg-[#FB4141] rounded-xl flex justify-center items-center gap-1 flex-col">
                    <h1 className="font-semibold text-md text-gray-800">
                        PERLU DILATIH
                    </h1>
                    <p className="text-sm text-gray-800">
                        {keterangan.perluDilatih}
                    </p>
                </div>
            </div>
            {error && (
                <div className="self-center mb-5 flex flex-col items-center justify-center h-52 bg-red-50 rounded-lg border border-red-100 p-4 mt-10 w-3/4">
                    <div className="flex items-center justify-center gap-2">
                        <svg
                            className="w-5 h-5 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h1 className="text-sm font-medium text-red-600">
                            {error}
                        </h1>
                    </div>
                </div>
            )}
            {nilai.length > 0 && !error && (
                <RekapNilaiTable
                    nilai={nilai}
                    indikatorNilai={indikatorNilai}
                />
            )}
        </div>
    );
};

export default RekapNilai;
