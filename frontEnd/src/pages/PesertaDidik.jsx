import LayoutMenu from "../containers/layout";
import Container from "../containers/container";
import Search from "../component/input/Search";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AddStudentButton } from "../component/button/Button";
import Modal from "../component/Modal/ModalPesertaDidik/ModalAdd";
import CardProfil from "../component/card/CardProfil";
import ModalInput from "../component/input/ModalInput";
import { useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePesertaDidikStore } from "../stores/peserta-didik";
import { useSelectedTahunAjaran } from "../hooks/useSelectedTahunAjaran";
import Loading from "../component/Loading";
import showToast from "../hooks/showToast";
import ConfirmModal from "../component/Modal/confirmModal";
import ModalEditPesertaDidik from "../component/Modal/ModalPesertaDidik/ModalEditPeserta";
import usePagination from "../hooks/usePagination";
import PaginationControls from "../component/PaginationControls";

const PesertaDidik = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
    const [selectedPesertaId, setSelectedPesertaId] = useState("");
    const [selectedPesertaDidik, setSelectedPesertaDidik] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("");
    const [search, setSearch] = useState("");
    const { tahunAjaranOptions } = useSelectedTahunAjaran();
    const [showConfirm, setShowConfirm] = useState(false);
    const {
        pesertaDidik = [],
        loadingPeserta,
        errorPeserta,
        fetchByTahunAjaran,
        searchPeserta,
        deletePeserta,
        isSearch,
        setError,
        setIsSearch,
    } = usePesertaDidikStore(
        useShallow((state) => ({
            pesertaDidik: state.data,
            loadingPeserta: state.loading,
            errorPeserta: state.error,
            fetchByTahunAjaran: state.fetchByTahunAjaran,
            searchPeserta: state.searchPeserta,
            deletePeserta: state.deletePeserta,
            isSearch: state.isSearch,
            setIsSearch: state.setIsSearch,
            setError: state.setError,
        }))
    );

    const {
        currentPage,
        totalPages,
        currentData,
        handlePageChange,
        resetPagination,
        startIndex,
    } = usePagination(pesertaDidik, 16);

    const handleEditPesertaDidik = (data) => {
        setSelectedPesertaDidik(data);
        setOpenEditModal(true);
    };

    const handleDelete = (peserta_didik_id, id_tahun_ajaran) => {
        setSelectedPesertaId(peserta_didik_id);
        setSelectedTahunAjaran(id_tahun_ajaran);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        try {
            await deletePeserta(
                selectedPesertaId,
                selectedTahunAjaran,
                selectedKelas
            );
            showToast("success", "data berhasil di hapus");
            resetPagination();
        } catch (error) {
            showToast("error", "gagal menghapus peserta didik");
        }
    };

    useEffect(() => {
        if (selectedTahunAjaran) {
            localStorage.setItem("tahun_ajaran_peserta", selectedTahunAjaran);
        }
    }, [selectedTahunAjaran]);

    useEffect(() => {
        if (!selectedTahunAjaran) {
            setError(
                "tahun ajaran belum dipilih. Harap lengkapi terlebih dahulu"
            );
            return;
        }
        fetchByTahunAjaran(selectedTahunAjaran, selectedKelas);
        setIsSearch();
    }, [selectedTahunAjaran, fetchByTahunAjaran, selectedKelas]);

    useEffect(() => {
        if (search) return;
        if (!isSearch) return;
        fetchByTahunAjaran(selectedTahunAjaran, selectedKelas);
        setIsSearch();
    }, [search]);

    useEffect(() => {
        const saved = localStorage.getItem("tahun_ajaran_peserta");
        const findTahunRaport = tahunAjaranOptions.find(
            (val) => val?.value === saved
        );
        if (saved && findTahunRaport) {
            setSelectedTahunAjaran(saved);
        } else {
            localStorage.removeItem("tahun_ajaran_peserta");
            setSelectedTahunAjaran("");
        }
    }, []);

    const handleSearch = async () => {
        if (!search) {
            fetchByTahunAjaran(selectedTahunAjaran, selectedKelas);
            return;
        }
        await searchPeserta(search);
        resetPagination();
    };
    return (
        <>
            {openModal && (
                <Modal
                    onClose={() => setOpenModal(false)}
                    onSuccess={() => {
                        setOpenModal(false);
                        fetchByTahunAjaran(selectedTahunAjaran, selectedKelas);
                    }}
                ></Modal>
            )}

            {openEditModal && (
                <ModalEditPesertaDidik
                    onClose={() => setOpenEditModal(false)}
                    selectedPesertaDidik={selectedPesertaDidik}
                    tahunAjaranId={selectedTahunAjaran}
                    onSuccess={() => {
                        setOpenEditModal(false);
                        fetchByTahunAjaran(selectedTahunAjaran, selectedKelas);
                    }}
                />
            )}
            <LayoutMenu blur={openModal || openEditModal}>
                <div className="w-5/6 mt-10">
                    {/* Dropdown Tahun Ajaran */}
                    <div className="w-72 flex flex-col gap-5 text-sm pl-5 drop-shadow-xl rounded-2xl bg-[#ffffff] p-5 z-10 relative">
                        <ModalInput
                            type={"select"}
                            value={selectedTahunAjaran}
                            onChange={(val) => {
                                setSelectedTahunAjaran(val);
                            }}
                            options={tahunAjaranOptions}
                            displayKey="label"
                            disibled={loadingPeserta}
                            emptyMessage={"harap isi data di menu tahun ajaran"}
                            valueKey="value"
                            id={"tahun_ajaran"}
                            name={"tahun_ajaran"}
                        >
                            Tahun Ajaran
                        </ModalInput>
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
                            disibled={loadingPeserta}
                            name={"kelas"}
                        >
                            Kelas{" "}
                            <span className="text-yellow-500">(opsional)</span>
                        </ModalInput>
                    </div>

                    {/* Tombol & Search */}
                    <Container>
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <AddStudentButton
                                    icon={faPlus}
                                    htmlFor={"add-data"}
                                    bg={"bg-teal-800/80 hover:bg-teal-800"}
                                    OnClick={() => {
                                        setOpenModal(true);
                                    }}
                                >
                                    tambahkan data
                                </AddStudentButton>
                            </div>
                            <div className="flex text-sm items-center gap-1.5 w-sm">
                                <Search
                                    htmlFor={"cari_peserta_didik"}
                                    placeholder={"cari peserta didik"}
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    onSearch={handleSearch}
                                ></Search>
                            </div>
                        </div>

                        {/* List CardProfil */}
                        {loadingPeserta && <Loading />}

                        {!loadingPeserta && errorPeserta && (
                            <div className=" mt-5 w-full flex flex-col items-center justify-center h-52 bg-red-50 rounded-lg border border-red-100 p-4">
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
                                        {errorPeserta}
                                    </h1>
                                </div>
                            </div>
                        )}

                        {!loadingPeserta &&
                            !errorPeserta &&
                            pesertaDidik.length === 0 && (
                                <div className="p-4 text-gray-500">
                                    {selectedTahunAjaran
                                        ? "Tidak ada peserta didik untuk tahun ajaran ini."
                                        : "Harap pilih tahun ajaran atau cari peserta didik untuk melihat peserta didik."}
                                </div>
                            )}

                        {!loadingPeserta &&
                            !errorPeserta &&
                            currentData.length > 0 && (
                                <div
                                    className={`flex flex-wrap lg:gap-10 gap-6 md:gap-6 mt-10 ${
                                        pesertaDidik.length % 4 === 0 &&
                                        pesertaDidik.length > 0
                                            ? "justify-center sm:gap-10"
                                            : ""
                                    }`}
                                >
                                    {currentData.map((item) => (
                                        <CardProfil
                                            key={
                                                item.peserta_didik
                                                    .id_peserta_didik
                                            }
                                            data={item}
                                            onEditClick={() => {
                                                handleEditPesertaDidik({
                                                    peserta_didik:
                                                        item.peserta_didik,
                                                    id_guru: item.guru.id_guru,
                                                });
                                            }}
                                            onDeleteClick={() => {
                                                handleDelete(
                                                    item.peserta_didik
                                                        .id_peserta_didik,
                                                    item.tahun_ajaran
                                                        .id_tahun_ajaran
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                        {pesertaDidik.length > 15 && (
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            ></PaginationControls>
                        )}
                    </Container>
                </div>
            </LayoutMenu>
            <ConfirmModal
                isOpen={showConfirm}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowConfirm(false);
                }}
                title={`hapus peserta didik`}
                text={"menghapus peserta didik dari tahun ajaran ini"}
            ></ConfirmModal>
        </>
    );
};

export default PesertaDidik;
