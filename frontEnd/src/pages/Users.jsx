import LayoutMenu from "../containers/layout";
import { displayData, insertData, deleteData } from "../api/user";
import ModalInput from "../component/input/ModalInput";
import ButtonSubmit from "../component/button/Button_submit";
import ModernTable from "../component/table/ModernTable";
import usePagination from "../hooks/usePagination";
import PaginationControls from "../component/PaginationControls";
import { useEffect, useState } from "react";
import Container from "../containers/container";
import ConfirmModal from "../component/Modal/confirmModal";
import showToast from "../hooks/showToast";
import Loading from "../component/Loading";
import ErrorMessage from "../component/Error";
import { useFocusError } from "../hooks/useFocusError";
import ModalEditUser from "../component/Modal/ModalUsers/modalEditUser";

const Users = () => {
    const [showConfirmAdd, setShowConfirmAdd] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [originalData, setOriginalData] = useState([]);
    const [emptyData, setEmptyData] = useState("");
    const [username, setUsername] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const { errorRef, focusError } = useFocusError();
    const {
        currentPage,
        totalPages,
        currentData,
        handlePageChange,
        resetPagination,
        startIndex,
    } = usePagination(originalData, 5);
    const columns = [
        { header: "username", accessor: "username", sortable: false },
        { header: "password", accessor: "password", sortable: false },
        { header: "role", accessor: "role", sortable: false },
    ];
    const fetchData = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setEmptyData("");
            const result = await displayData();
            setOriginalData(result.data);
        } catch (error) {
            setEmptyData(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setSelectedId(id);
        setShowConfirmDelete(true);
    };

    const handleEdit = (dataUsers) => {
        setSelectedUser(dataUsers);
        setOpenModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim() === "" || password.trim() === "") {
            setError("Silahkan lengkapi datanya terlebih dahulu");
            return;
        }
        setError("");
        setShowConfirmAdd(true);
    };

    const handleConfirmAdd = async (e) => {
        setShowConfirmAdd(false);
        setLoading(true);
        try {
            await insertData(username, password, role);
            fetchData();
            showToast("success", "data berhasil ditambahkan");
            setUsername("");
            setPassword("");
            setRole("");
        } catch (error) {
            setError(error.message || "gagal menambahkan data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (error) focusError();
    }, [error]);

    const handleConfirmDelete = async () => {
        setError("");
        setLoading(true);
        setError("");
        try {
            await deleteData(selectedId);
            setShowConfirmDelete(false);
            showToast("success", "berhasil menghapus data");
            await fetchData();
        } catch (error) {
            setShowConfirmDelete(false);
            setError(error.message);
            showToast("error", "gagal mengahapus data");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUser = async () => {
        fetchData();
        showToast("success", "data berhasil diupdate");
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <ModalEditUser
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                dataUser={selectedUser}
                onSave={handleSaveUser}
            ></ModalEditUser>
            <LayoutMenu>
                <div className="w-5/6 flex flex-col mt-10">
                    <Container className="mt-5">
                        {error &&
                            error != "data tidak ada, harap tambahkan data" && (
                                <ErrorMessage error={error} ref={errorRef} />
                            )}
                        {loading && <Loading />}
                        <div className="flex justify-between mb-8 ">
                            <form
                                onSubmit={handleSubmit}
                                className="flex gap-5 w-4xl"
                            >
                                <ModalInput
                                    id={"username"}
                                    value={username}
                                    //ref={namaLengkapRef}
                                    type={"text"}
                                    name={"username"}
                                    placeholder={"masukkan username"}
                                    htmlFor={"username"}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                    //disabled={loading || disabled}
                                >
                                    Username{" "}
                                </ModalInput>
                                <ModalInput
                                    id={"password"}
                                    value={password}
                                    //ref={namaLengkapRef}
                                    type={"text"}
                                    name={"password"}
                                    placeholder={"masukkan password"}
                                    htmlFor={"password"}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    //disabled={loading || disabled}
                                >
                                    Password{" "}
                                </ModalInput>
                                <ModalInput
                                    type={"select"}
                                    value={role}
                                    onChange={(val) => {
                                        setRole(val);
                                    }}
                                    options={["Operator", "Ortu"]}
                                    displayKey="label"
                                    emptyMessage="test"
                                    valueKey="value"
                                    id={"role"}
                                    name={"role"}
                                    //disibled={loading}
                                    required
                                >
                                    Role{" "}
                                </ModalInput>
                                <div className="flex items-end ml-2 gap-2">
                                    <ButtonSubmit
                                        bg={"bg-teal-600"}
                                        type={"submit"}
                                        hover={"hover:bg-teal-700 text-xs"}
                                        //disabled={loading}
                                    >
                                        tambahkan data
                                    </ButtonSubmit>
                                </div>z
                            </form>
                        </div>
                        <ModernTable
                            columns={columns}
                            data={currentData}
                            emptyData={emptyData}
                            startIndex={startIndex}
                            onDelete={(item) => {
                                handleDelete(item.id);
                            }}
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
                    </Container>
                </div>
                <ConfirmModal
                    isOpen={showConfirmAdd}
                    onConfirm={handleConfirmAdd}
                    title={"Simpan Data"}
                    text={"Pastikan data sudah benar"}
                    onCancel={() => setShowConfirmAdd(false)}
                />

                <ConfirmModal
                    isOpen={showConfirmDelete}
                    onConfirm={handleConfirmDelete}
                    title={"Hapus Data"}
                    text={"Yakin Ingin Menghapus?"}
                    onCancel={() => setShowConfirmDelete(false)}
                />
            </LayoutMenu>
        </>
    );
};

export default Users;
