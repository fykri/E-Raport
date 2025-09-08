import Container from "../containers/container";
import Search from "../component/input/Search";
import CardProfil from "../component/card/CardProfil";
import ModalInput from "../component/input/ModalInput";
import { useSelectedTahunAjaran } from "../hooks/useSelectedTahunAjaran";
import { getByTahunSemester, searhPenilaian } from "../api/penilaian";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../component/Loading";
import { useAuth } from "../context/authContext";
import ModalKesimpulan from "../component/Modal/ModalKesimpulan/ModalUpdateKesimpulan";

const OrangTua = () => {
    const { logout } = useAuth();
    const { tahunAjaranOptions } = useSelectedTahunAjaran();
    const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("");
    const [pesertaDidik, setPesertaDidik] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setIsLoading] = useState("");
    const [rekapNilai, setRekapNilai] = useState("");
    const [isOpenModalKesimpulan, setOpenModalKesimpulan] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await getByTahunSemester(
                selectedTahunAjaran,
                selectedSemester,
                selectedKelas
            );
            setError("");
            const newData = response.data.map((item) => {
                return {
                    id_rekap_nilai: item.id_rekap_nilai,
                    peserta_didik: item.pesertaDidik,
                    tahun_ajaran: item.tahunAjaran,
                    guru: item.guru,
                };
            });
            setPesertaDidik(newData);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTahunAjaran) {
            localStorage.setItem("tahun_ajaran_penilaian", selectedTahunAjaran);
        }
        if (selectedSemester) {
            localStorage.setItem("semester_penilaian", selectedSemester);
        }
    }, [selectedTahunAjaran, selectedSemester]);

    useEffect(() => {
        const saved = localStorage.getItem("tahun_ajaran_penilaian");
        const savedSemester = localStorage.getItem("semester_penilaian");
        const findTahunRaport = tahunAjaranOptions.find(
            (val) => val?.value === saved
        );
        if (saved && findTahunRaport) {
            setSelectedTahunAjaran(saved);
        } else {
            localStorage.removeItem("tahun_ajaran_raport");
            setSelectedTahunAjaran("");
        }
        if (savedSemester) {
            setSelectedSemester(savedSemester);
        }
    }, [tahunAjaranOptions]);

    useEffect(() => {
        if (!selectedTahunAjaran) {
            setError(
                "tahun ajaran belum dipilih. Harap lengkapi terlebih dahulu"
            );
            return;
        }
        if (!selectedSemester) {
            setError("semester belum dipilih. Harap lengkapi terlebih dahulu");
            return;
        }
        fetchData();
    }, [selectedSemester, selectedTahunAjaran]);

    useEffect(() => {
        if (!selectedTahunAjaran || !selectedSemester) return;
        if (search) return;
        if (!isSearch) return;
        fetchData();
        setIsSearch(false);
    }, [search, selectedSemester, selectedTahunAjaran]);

    useEffect(() => {
        fetchData();
    }, [selectedKelas]);

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Yakin ingin logout?");
        if (!confirmLogout) return;
        try {
            await logout();
        } catch (err) {
            console.error("Gagal logout:", err);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setIsSearch(true);
        setError("");
        try {
            if (!selectedTahunAjaran) {
                setError(
                    "tahun ajaran belum dipilih. Harap lengkapi terlebih dahulu"
                );
                return;
            }
            if (!selectedSemester) {
                setError(
                    "semester belum dipilih. Harap lengkapi terlebih dahulu"
                );
                return;
            }
            if (!search) {
                fetchData();
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await searhPenilaian(
                selectedTahunAjaran,
                selectedSemester,
                search
            );
            setPesertaDidik(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ModalKesimpulan
                isOpen={isOpenModalKesimpulan}
                type="orang-tua"
                data={rekapNilai}
                onClose={() => {
                    setOpenModalKesimpulan(false);
                }}
            />
            <div className="w-full min-h-screen font-poppins ">
                <div className="absolute right-10 top-10">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-[#FB4141] rounded-md text-white hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
                <div className="absolute left-10 top-10 ">
                    <div className="flex items-center gap-2">
                        <img src="/images/logoPaud.png" alt="" width={50} />
                        <h1 className="font-bold text-slate-800">
                            TK AL-IKHLAS BALLA
                        </h1>
                    </div>
                </div>
                <Outlet />
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                    {/* Filter Section */}
                    <div className="w-full rounded-xl bg-white shadow-sm p-4 mb-6 lg:w-2xl">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-7 text-sm">
                            <div className="flex-1">
                                <ModalInput
                                    type={"select"}
                                    classname={"mb-4 md:mb-0"}
                                    value={selectedTahunAjaran}
                                    onChange={(val) => {
                                        setSelectedTahunAjaran(val);
                                    }}
                                    options={tahunAjaranOptions}
                                    displayKey="label"
                                    disibled={isLoading}
                                    emptyMessage={
                                        "harap isi data di menu tahun ajaran"
                                    }
                                    valueKey="value"
                                    id={"tahun_ajaran"}
                                    name={"tahun_ajaran"}
                                >
                                    Tahun Ajaran
                                </ModalInput>
                            </div>
                            <div className="flex-1">
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
                                    disibled={isLoading}
                                    name={"semester"}
                                >
                                    Semester
                                </ModalInput>
                            </div>
                            <div className="flex-1">
                                <ModalInput
                                    type={"select"}
                                    value={selectedKelas}
                                    onChange={(val) => {
                                        setSelectedKelas(val);
                                    }}
                                    options={[
                                        { label: "Semua Kelas", value: "" },
                                        {
                                            label: "Kelompok A",
                                            value: "kelompokA",
                                        },
                                        {
                                            label: "Kelompok B",
                                            value: "kelompokB",
                                        },
                                    ]}
                                    displayKey="label"
                                    valueKey="value"
                                    id={"kelas"}
                                    disibled={isLoading}
                                    name={"kelas"}
                                >
                                    Kelas{" "}
                                    <span className="text-yellow-500">
                                        (opsional)
                                    </span>
                                </ModalInput>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <Container>
                        {isLoading && <Loading />}

                        {/* Header with search and instruction */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                            <div className="inline-flex items-center bg-gray-800 text-gray-100 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                                <svg
                                    className="w-4 h-4 mr-2 text-blue-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                                Instruksi: klik titik 3 pada salah satu peserta
                                didik didik
                            </div>

                            <div className="w-full md:w-64 lg:w-md">
                                <Search
                                    htmlFor="search_student"
                                    placeholder="cari siswa....."
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    onSearch={handleSearch}
                                    label={false}
                                />
                            </div>
                        </div>

                        {/* Error or Content Display */}
                        {error ? (
                            <div className="w-full flex flex-col items-center justify-center h-52 bg-red-50 rounded-lg border border-red-100 p-4">
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
                        ) : (
                            <div
                                className={[
                                    "flex flex-wrap lg:gap-10 gap-6 md:gap-6 ",
                                    pesertaDidik.length % 4 === 0 &&
                                    pesertaDidik.length > 0
                                        ? "justify-center sm:gap-10"
                                        : "justify-center md:justify-start",
                                ].join(" ")}
                            >
                                {pesertaDidik.map((item) => (
                                    <CardProfil
                                        key={item.id_rekap_nilai}
                                        mode="penilaian"
                                        onNilaiClick={(data) => {
                                            navigate(data?.id_rekap_nilai);
                                        }}
                                        data={item}
                                        onSaranClick={(data) => {
                                            setRekapNilai(data?.id_rekap_nilai);
                                            setOpenModalKesimpulan(true);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </Container>
                </div>
            </div>
        </>
    );
};

export default OrangTua;
