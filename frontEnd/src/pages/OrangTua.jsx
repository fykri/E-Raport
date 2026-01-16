import { useAuth } from "../context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import RekapNilaiTable from "../component/table/RekapNilaiTable";
import CardRekapNilai from "../component/card/CardRekapNilai";
import {
    getPesertaOrtu,
    getNilaiByIdPeserta,
    getTahunByIdPeserta,
} from "../api/orang_tua";
import { Link } from "react-router-dom";
import ModalInput from "../component/input/ModalInput";
import { getKesimpulan } from "../api/kesimpulan";

const OrangTua = () => {
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [selectedPeserta, setSelectedPeserta] = useState("");
    const [tahunAjaran, setTahunAjaran] = useState([]);
    const [idPeserta, setIdPeserta] = useState("");
    const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [nilai, setNilai] = useState([]);
    const [indikatorNilai, setIndikatorNilai] = useState(["B", "C", "P"]);
    const [idRekapNilai, setIdRekapNilai] = useState("");
    const [keterangan, setKeterangan] = useState({
        baik: 0,
        cukup: 0,
        perluDilatih: 0,
    });
    const dropdownRef = useRef(null);
    const handleLogout = async () => {
        const confirmLogout = window.confirm("Yakin ingin logout?");
        if (!confirmLogout) return;
        try {
            await logout();
        } catch (err) {
            console.error("Gagal logout:", err);
        }
    };

    const fetchDataKeterangan = async () => {
        setError("");
        try {
            const response = await getKesimpulan(idRekapNilai);
            setKeterangan({
                baik: response?.pencapaian_perkembangan_baik,
                cukup: response?.pencapaian_perkembangan_buruk,
                perluDilatih: response?.pencapaian_perkembangan_perlu_dilatih,
            });
        } catch (error) {
            setError(error.message || "terjadi kesalahan");
        }
    };
    const getTahubByIdPeserta = async () => {
        try {
            const getTahun = await getTahunByIdPeserta(
                selectedPeserta?.id_peserta_didik
            );
            setTahunAjaran(
                getTahun?.data.map((item) => ({
                    label: item.tahun_ajaran,
                    value: item.id_tahun_ajaran,
                }))
            );
        } catch (error) {
            setError(error);
        }
    };

    async function getPeserta() {
        setError("");
        try {
            const data = await getPesertaOrtu();
            setSelectedPeserta(data?.data);
            setIdPeserta(data?.data?.id_peserta_didik);
        } catch (error) {
            setError(error);
        }
    }
    const fetchNilaiByPesertaDidik = async () => {
        setNilai([]);
        setError("");
        try {
            const response = await getNilaiByIdPeserta(
                idPeserta,
                selectedTahunAjaran,
                selectedSemester
            );
            if (!response.data.kategori || response.data.kategori.length == 0) {
                setError(
                    `nilai peserta didik ${selectedPeserta.nama_lengkap} pada semester ini belum ada`
                );
                return;
            }
            setIdRekapNilai(response?.data?.kesimpulan.id_rekap_nilai);
            setNilai(response.data.kategori);
        } catch (error) {
            setError(error);
        }
    };
    useEffect(() => {
        getPeserta();
        fetchDataKeterangan()
    }, []);

    useEffect(() => {
        if (idPeserta) {
            getTahubByIdPeserta();
        }
    }, [idPeserta]);

    useEffect(() => {
        if (idPeserta && selectedSemester && selectedTahunAjaran) {
            fetchNilaiByPesertaDidik();
        }
    }, [idPeserta, selectedTahunAjaran, selectedSemester]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="w-full min-h-screen font-poppins px-5 md:px-10 flex flex-col">
                <div className="flex justify-between py-5 relative">
                    <div className="relative " ref={dropdownRef}>
                        <div
                            onClick={() => setOpen(!open)}
                            className="bg-gray-800 hover:bg-gray-900 rounded-sm flex items-center gap-2 p-2 px-3 cursor-pointer"
                        >
                            <FontAwesomeIcon
                                icon={faCircleUser}
                                className="text-2xl text-gray-300"
                            />
                            <p className="text-sm font-semibold tracking-wider text-gray-300">
                                {selectedPeserta?.nama_lengkap?.toUpperCase()}
                            </p>
                        </div>

                        {open && (
                            <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                <ul className="py-1 text-sm text-gray-700">
                                    <li>
                                        <Link
                                            to={`/orang-tua/kelola-password/${idPeserta}`}
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setOpen(false)}
                                        >
                                            Kelola Password
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
                <CardRekapNilai selectedPeserta={selectedPeserta} />

                {/* Input */}
                <div className="drop-shadow-xl self-center w-3/4 rounded-md bg-[#ffffff] p-5 text-sm mt-10 z-10 relative">
                    <ModalInput
                        type={"select"}
                        classname={"mb-5"}
                        value={selectedTahunAjaran}
                        onChange={(val) => {
                            setSelectedTahunAjaran(val);
                        }}
                        options={tahunAjaran}
                        displayKey="label"
                        //disibled={isLoading}
                        emptyMessage={"harap isi data di menu tahun ajaran"}
                        valueKey="value"
                        id={"tahun_ajaran"}
                        name={"tahun_ajaran"}
                    >
                        Tahun Ajaran
                    </ModalInput>
                    <ModalInput
                        type={"select"}
                        value={selectedSemester}
                        onChange={(val) => {
                            setSelectedSemester(val);
                        }}
                        options={["semester 1", "semester 2"]}
                        displayKey="label"
                        valueKey="value"
                        id={"semester"}
                        //disibled={isLoading}
                        name={"semester"}
                    >
                        Semester
                    </ModalInput>
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
                    <>
                        <RekapNilaiTable
                            nilai={nilai}
                            indikatorNilai={indikatorNilai}
                        />
                        <div className="flex gap-6 flex-wrap content-start mt-10 flex-row justify-center mb-10">
                            <div className="w-40 bg-[#5CB338] rounded-xl h-[110px] flex justify-center items-center gap-1 flex-col">
                                <h1 className="font-semibold text-md text-gray-800">
                                    BAIK
                                </h1>
                                <p className="text-sm text-gray-800">
                                    {keterangan.baik}
                                </p>
                            </div>
                            <div className="w-40 h-[110px] bg-[#ECE852] rounded-xl flex justify-center items-center gap-1 flex-col">
                                <h1 className="font-semibold text-md text-gray-800">
                                    CUKUP
                                </h1>
                                <p className="text-sm text-gray-800">
                                    {keterangan.cukup}
                                </p>
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
                    </>
                )}
            </div>
        </>
    );
};

export default OrangTua;
