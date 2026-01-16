import LayoutMenu from "../containers/layout";
import ModalInput from "../component/input/ModalInput";
import Container from "../containers/container";
import Search from "../component/input/Search";
import ButtonSubmit from "../component/button/Button_submit";
import { useSelectedTahunAjaran } from "../hooks/useSelectedTahunAjaran";
import { useState, useEffect } from "react";
import { searchRaport } from "../api/penilaian";
import { getPenilaian } from "../api/penilaian";
import PaginationControls from "../component/PaginationControls";
import usePagination from "../hooks/usePagination";
import { getDataProfil } from "../api/profil_sekolah";
import ModernPDFViewer from "../component/cetak_raport/PdfViewer";
import CetakNilaiPDF from "../component/cetak_raport/CetaNilai";
import Loading from "../component/Loading";

const CetakRaport = () => {
    const [buttonClick, setButtonClick] = useState("");
    const { tahunAjaranOptions } = useSelectedTahunAjaran();
    const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [pesertaDidik, setPesertaDidik] = useState([]);
    const [selectedPeserta, setSelectedPeserta] = useState(null);
    const [selectedTanggalCetak, setSelectedTanggalCetak] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [profilSekolah, setProfilSekolah] = useState("");
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("");
    const [isSearch, setIsSearch] = useState(false);

    const {
        currentPage,
        totalPages,
        currentData,
        handlePageChange,
        resetPagination,
    } = usePagination(pesertaDidik, 1);

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
        if (!selectedTanggalCetak) {
            setError(
                "tanggal cetak belum dipilih. Harap lengkapi terlebih dahulu"
            );
            return;
        }
        fetchData();
    }, [selectedSemester, selectedTahunAjaran, selectedTanggalCetak]);


    const fetchData = async () => {
        setIsLoading(true);
        setError("");
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const getProfilSekolah = await getDataProfil();
            const penilaian = await getPenilaian(
                selectedTahunAjaran,
                selectedSemester,
                selectedKelas
            );

            setProfilSekolah(getProfilSekolah.data);

            setPesertaDidik(penilaian.data);
            resetPagination(1);

            if (penilaian.length > 0) {
                setSelectedPeserta(penilaian.data[0]);
            }
            setButtonClick("cetak sampul");
        } catch (error) {
            setError(error || "Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentData.length > 0) {
            setSelectedPeserta(currentData[0]);
        }
    }, [currentPage, currentData]);

    useEffect(() => {
        if (!selectedTahunAjaran || !selectedSemester) return;
        if (search) return;
        if (!isSearch) return;
        fetchData();
    }, [search, selectedSemester, selectedTahunAjaran]);

    useEffect(() => {
        if (!selectedKelas) return;
        fetchData();
    }, [selectedKelas]);

    const handleSearch = async () => {
        setIsLoading(true);
        setError("");
        setIsSearch(false);
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
            if (!selectedTanggalCetak) {
                setError(
                    "tanggal cetak belum dipilih. Harap lengkapi terlebih dahulu"
                );
                return;
            }
            if (!search) {
                fetchData();
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await searchRaport(
                selectedTahunAjaran,
                selectedSemester,
                search
            );
            const newData = pesertaDidik.filter((val) => {
                const idPeserta = val?.pesertaDidik?.id_peserta_didik;
                return response.some((r) => r?.pesertaDidikId === idPeserta);
            });
            setIsSearch(true);
            setPesertaDidik(newData);
            resetPagination(1);

            if (newData.length > 0) {
                setSelectedPeserta(newData[0]);
            }
        } catch (error) {
            setError(error);
            setIsSearch(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTahunAjaran) {
            localStorage.setItem("tahun_ajaran_raport", selectedTahunAjaran);
        }
        if (selectedSemester) {
            localStorage.setItem("semester_raport", selectedSemester);
        }
        if (selectedTanggalCetak) {
            localStorage.setItem("tanggal_cetak_raport", selectedTanggalCetak);
        }
    }, [selectedTahunAjaran, selectedSemester, selectedTanggalCetak]);

    useEffect(() => {
        const saved = localStorage.getItem("tahun_ajaran_raport");
        const savedSemester = localStorage.getItem("semester_raport");
        const savedTanggalCetak = localStorage.getItem("tanggal_cetak_raport");

        const findTahunRaport = tahunAjaranOptions.find(
            (val) => val?.value === saved
        );
        if (saved && findTahunRaport) {
            setSelectedTahunAjaran(saved);
        } else {
            localStorage.removeItem("tahun_ajaran_raport");
            setSelectedTahunAjaran("");
        }

        if (savedSemester) setSelectedSemester(savedSemester);
        if (savedTanggalCetak) setSelectedTanggalCetak(savedTanggalCetak);
    }, [tahunAjaranOptions]);

    return (
        <LayoutMenu>
            <div className="w-5/6 mt-8 ">
                <div className="w-full  flex justify-between">
                    <form
                        action="#"
                        className="w-72 flex gap-5 flex-col items-center justify-between text-sm pl-5 drop-shadow-xl rounded-2xl bg-[#ffffff] p-5"
                    >
                        <ModalInput
                            type={"select"}
                            value={selectedTahunAjaran}
                            htmlFor={"tahun_ajaran"}
                            onChange={(val) => setSelectedTahunAjaran(val)}
                            emptyMessage={"harap isi data di menu tahun ajaran"}
                            valueKey="value"
                            id={"tahun_ajaran"}
                            name={"tahun_ajaran"}
                            disabled={isLoading}
                            required
                            options={tahunAjaranOptions}
                        >
                            Tahun Ajaran
                        </ModalInput>
                        <ModalInput
                            type={"select"}
                            value={selectedSemester}
                            htmlFor={"semester"}
                            options={[
                                { label: "Semester 1", value: "semester 1" },
                                { label: "Semester 2", value: "semester 2" },
                            ]}
                            onChange={(val) => setSelectedSemester(val)}
                            displayKey="label"
                            valueKey="value"
                            id={"semester"}
                            name={"semester"}
                            disabled={isLoading}
                        >
                            Semester
                        </ModalInput>
                        <ModalInput
                            type={"date"}
                            id={"tanggal_cetak"}
                            htmlFor={"tanggal_cetak"}
                            value={selectedTanggalCetak}
                            onChange={(val) => {
                                setSelectedTanggalCetak(val.target.value);
                            }}
                            disabled={isLoading}
                            required
                        >
                            Tanggal Cetak
                        </ModalInput>
                    </form>
                    <div className="self-end relative">
                        <div className="w-72 flex gap-5 flex-col items-center justify-between text-sm pl-5 drop-shadow-xl rounded-2xl bg-[#ffffff] p-5 relative z-10">
                            <ModalInput
                                type={"select"}
                                value={selectedKelas}
                                onChange={(val) => {
                                    setSelectedKelas(val);
                                }}
                                options={[
                                    { label: "Semua Kelas", value: "" },
                                    { label: "Kelompok A", value: "kelompokA" },
                                    { label: "Kelompok B", value: "kelompokB" },
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

                <Container>
                    {isLoading && <Loading />}
                    <div className="flex gap-5 w-full justify-between">
                        <div className="flex text-sm items-center gap-1.5 w-sm">
                            <Search
                                htmlFor={"cari peserta didik"}
                                placeholder={"cari peserta didik"}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                onSearch={handleSearch}
                                label={false}
                            />
                        </div>
                    </div>

                    {/* Container cetak raport */}
                    <div className="w-full mt-5 p-4 border rounded-lg shadow">
                        <div className="items-start mb-5">
                            <h2 className="text-sm font-semibold">
                                {buttonClick}
                            </h2>
                        </div>

                        {pesertaDidik.length > 0 && (
                            <div className="mb-5">
                                <PaginationControls
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
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
                            <div style={{ width: "100%", height: "600px" }}>
                                <ModernPDFViewer
                                    style={{ width: "100%", height: "100%" }}
                                    downloadFileName={`Rapor-${
                                        selectedPeserta?.pesertaDidik?.nis ||
                                        "NIS"
                                    }-${
                                        selectedPeserta?.pesertaDidik
                                            ?.nama_lengkap || "Nama"
                                    }.pdf`}
                                >
                                    <CetakNilaiPDF
                                        kategori={selectedPeserta?.kategori}
                                        pesertaDidik={
                                            selectedPeserta?.pesertaDidik
                                        }
                                        kesimpulan={selectedPeserta?.kesimpulan}
                                        guru={selectedPeserta?.guru}
                                        tanggal={selectedTanggalCetak}
                                        profilSekolah={profilSekolah}
                                    />
                                </ModernPDFViewer>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        </LayoutMenu>
    );
};

export default CetakRaport;
