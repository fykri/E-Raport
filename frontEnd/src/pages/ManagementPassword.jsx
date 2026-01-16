import { useState } from "react";
import ModalInput from "../component/input/ModalInput";
import Container from "../containers/container";
import ButtonSubmit from "../component/button/Button_submit";
import { useParams } from "react-router-dom";
import { changePassword } from "../api/orang_tua";
import ConfirmModal from "../component/Modal/confirmModal";
import showToast from "../hooks/showToast";
import ErrorMessage from "../component/Error";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import Loading from "../component/Loading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ManagementPassword = () => {
    const [passwordLama, setPasswordLama] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [passwordBaru, setPasswordBaru] = useState("");
    const [ulangiPassword, setUlangiPassword] = useState("");
    const [error, setError] = useState("");
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            passwordLama.trim() == "" &&
            passwordBaru.trim() == "" &&
            ulangiPassword.trim() == ""
        ) {
            setError("silahkan lengkapi datanya terlebih dahulu!");
            return;
        }
        if (passwordBaru !== ulangiPassword) {
            setError("password dan ulangi password harus sama!");
            return;
        }
        setError("");
        setOpenModal(true);
    };

    const handleConfirm = async () => {
        setOpenModal(false);
        setLoading(true);
        try {
            await changePassword(id, passwordBaru, passwordLama);
            showToast("success", "password berhasil diganti");
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="w-5/6 h-screen flex flex-col justify-center max-w-md">
                <Link to={"/orang-tua"} className="flex justify-center">
                    <FontAwesomeIcon icon={faAnglesLeft} className="p-2 px-4 text-gray-300 rounded-t-md text-lg bg-red-600 cursor-pointer hover:bg-red-700"></FontAwesomeIcon>
                </Link>
                <div className="flex justify-center">
                    <p className="p-2  bg-gray-700 rounded-t-md text-center text-md font-semibold text-gray-200">
                        GANTI PASSWORD
                    </p>
                </div>
                <Container className="mt-0">
                    {error &&
                        error != "data tidak ada, harap tambahkan data" && (
                            <ErrorMessage error={error} />
                        )}
                    {loading && <Loading />}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        <ModalInput
                            id={"password-lama"}
                            value={passwordLama}
                            type={"password"}
                            name={"password-lama"}
                            placeholder={"*********"}
                            htmlFor={"nama_lengkap"}
                            onChange={(e) => {
                                setPasswordLama(e.target.value);
                            }}
                            disabled={loading}
                        >
                            Password Lama{" "}
                        </ModalInput>
                        <ModalInput
                            id={"password-baru"}
                            value={passwordBaru}
                            type={"password"}
                            name={"password-baru"}
                            placeholder={"*********"}
                            htmlFor={"password-baru"}
                            onChange={(e) => {
                                setPasswordBaru(e.target.value);
                            }}
                            disabled={loading}
                        >
                            Password Baru{" "}
                        </ModalInput>
                        <ModalInput
                            id={"ulangi-password"}
                            value={ulangiPassword}
                            type={"password"}
                            name={"ulangi-password"}
                            placeholder={"*********"}
                            htmlFor={"ulangi-password"}
                            onChange={(e) => {
                                setUlangiPassword(e.target.value);
                            }}
                            disabled={loading}
                        >
                            Ulangi Password{" "}
                        </ModalInput>
                        <div className="mt-2 flex justify-center">
                            <ButtonSubmit
                                bg={"bg-teal-600"}
                                type={"submit"}
                                hover={"hover:bg-teal-700 w-20"}
                            >
                                Submit
                            </ButtonSubmit>
                        </div>
                    </form>
                </Container>
            </div>
            <ConfirmModal
                isOpen={openModal}
                text={"yakin ingin mengubah password?"}
                title={"ganti password"}
                onConfirm={handleConfirm}
                onCancel={() => setOpenModal(false)}
            />
        </>
    );
};

export default ManagementPassword;
