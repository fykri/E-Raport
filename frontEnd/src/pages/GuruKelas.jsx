import LayoutMenu from "../containers/layout";
import { getGuruKelas, deleteData } from "../api/guru_kelas";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AddStudentButton } from "../component/button/Button";
import Search from "../component/input/Search";
import { useEffect, useState } from "react";
import ModalFormGuru from "../component/Modal/modalGuru";
import showToast from "../hooks/showToast";
import ModalEditGuru from "../component/Modal/ModalEditGuru";
import Loading from "../component/Loading";
import ModernTable from "../component/table/ModernTable";
import usePagination from "../hooks/usePagination";
import PaginationControls from "../component/PaginationControls";
import ConfirmModal from "../component/Modal/confirmModal";
import { searchDataGuru } from "../api/guru_kelas";
import ErrorMessage from "../component/Error";
import { useFocusError } from "../hooks/useFocusError";

const GuruKelas = () => {
    const [originalData, setOriginalData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [emptyData, setEmptyData] = useState("");
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedId, setSelectedId] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const { errorRef, focusError } = useFocusError();
    const {
        currentPage,
        totalPages,
        currentData,
        handlePageChange,
        resetPagination,
        startIndex,
    } = usePagination(originalData, 5);

    //sorting
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sorted = [...originalData].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setOriginalData(sorted);
    };
    //end Sorting

    const columns = [
        { header: "Nama Guru", accessor: "nama_guru", sortable: true },
        { header: "NUPTK", accessor: "NUPTK", sortable: true },
        { header: "Kelas", accessor: "nama_kelas", sortable: true },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setEmptyData("");
            const result = await getGuruKelas();
            setOriginalData(result);
        } catch (error) {
            setEmptyData(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (teacher) => {
        setSelectedTeacher(teacher);
        setOpenEditModal(true);
    };

    const handleDelete = (id_guru) => {
        setSelectedId(id_guru);
        setShowConfirmDelete(true);
    };
    const handleConfirm = async () => {
        setLoading(true);
        setError("");
        try {
            await deleteData(selectedId);
            setShowConfirmDelete(false);
            showToast("success", "berhasil menghapus data");
            await fetchData();
        } catch (error) {
            setError(
                "Penghapusan dibatalkan: masih ada peserta didik yang terdaftar pada Guru ini."
            );
            setShowConfirmDelete(false);
            showToast("error", "gagal menghapus data");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGuru = async () => {
        fetchData();
        showToast("success", "data berhasil ditambahkan");
    };
    const handleEditGuru = async () => {
        fetchData();
        showToast("success", "data berhasil di ubah");
    };


    const handleSearch = async () => {
        setLoading(true);
        setError("");
        if (!search.trim()) {
            setLoading(false);
            return;
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const response = await searchDataGuru(search);
            setOriginalData(response.data);
            resetPagination();
        } catch (error) {
            setError(error || "gagal search");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search.length == 0) {
            fetchData();
        }
    }, [search]);

    return (
        <>
            <ModalFormGuru
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onSave={handleSaveGuru}
            />
            {selectedTeacher && (
                <ModalEditGuru
                    isOpen={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    onSave={handleEditGuru}
                    teacherData={selectedTeacher}
                />
            )}
            <LayoutMenu>
                <div className="w-5/6 mt-10 drop-shadow-xl rounded-2xl bg-[#ffffff] p-5 text-sm">
                    <div className="flex justify-between">
                        <AddStudentButton
                            icon={faPlus}
                            htmlFor={"add-data"}
                            bg={"bg-teal-800/80 hover:bg-teal-800"}
                            OnClick={() => setOpenModal(true)}
                        >
                            tambahkan data
                        </AddStudentButton>
                        <div className="flex text-sm items-center gap-1.5">
                            <Search
                                htmlFor={"cari-guru"}
                                placeholder={"cari guru"}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                onSearch={handleSearch}
                                value={search}
                            />
                        </div>
                    </div>
                    <div className="p-6 max-w-6xl mx-auto">
                        <h1 className="text-3xl font-semibold text-gray-700 mb-6">
                            Data Guru
                        </h1>
                        {error &&
                            error != "data tidak ada, harap tambahkan data" && (
                                <ErrorMessage error={error} ref={errorRef} />
                            )}
                        {isLoading && <Loading />}

                        <ModernTable
                            columns={columns}
                            data={currentData}
                            emptyData={emptyData}
                            startIndex={startIndex}
                            onSort={handleSort}
                            onDelete={(item) => {
                                handleDelete(item.id_guru);
                            }}
                            sortConfig={sortConfig}
                            onEdit={(item) => {
                                handleEdit(item);
                            }}
                        />

                        {originalData.length > 5 && (
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            ></PaginationControls>
                        )}
                    </div>
                </div>
            </LayoutMenu>
            <ConfirmModal
                isOpen={showConfirmDelete}
                text={"anda akan menghapus data guru. Apakah anda yakin?"}
                title={"menghapus data guru"}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmDelete(false)}
            />
        </>
    );
};

export default GuruKelas;
