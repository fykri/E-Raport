import ModalInput from "../../input/ModalInput";
import ButtonSubmit from "../../button/Button_submit";
import ModalContainer from "../../../containers/modalContainer";
import showToast from "../../../hooks/showToast";
import ButtonSpinLoading from "../../button/ButtonSpinLoading";
import ConfirmModal from "../confirmModal";
import ErrorMessage from "../../Error";
import ModalSelectPeserta from "./ModalSelectPeserta";

import { useState, useRef, useEffect } from "react";
import { useSelectedTahunAjaran } from "../../../hooks/useSelectedTahunAjaran";
import { useSelectedGuru } from "../../../hooks/useSelectedGuru";
import { insertPesertaDidik } from "../../../api/peserta_didik";
import { useFocusError } from "../../../hooks/useFocusError";
import { validatePesertaDidik } from "../../../helpers/pesertaDidikValidator";
const Modal = ({ onClose, onSuccess }) => {
    const [tahunAjaran, setTahunAjaran] = useState("");
    const [guru, setGuru] = useState("");
    const [formAdd, setFormAdd] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { tahunAjaranOptions } = useSelectedTahunAjaran();
    const [guruOptions] = useSelectedGuru();
    const { errorRef, focusError } = useFocusError();
    const [showConfirm, setShowConfirm] = useState(false);
    const [showModalSelectPeserta, setShowModalSelectPeserta] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const namaLengkapRef = useRef(null);
    const onChangeHandle = (e) => {
        const { value, name } = e.target;
        setFormAdd((val) => ({
            ...val,
            [name]: name === "anakKe" ? Number(value) : value,
        }));
    };

    useEffect(() => {
        if (error) {
            focusError();
        }
    }, [error]);

    useEffect(() => {
        if (!disabled) {
            namaLengkapRef.current?.focus();
        }
    }, [disabled]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { valid, error } = validatePesertaDidik(
            formAdd,
            guru,
            tahunAjaran
        );
        if (!valid) {
            setError(error);
            return;
        }
        setError("");
        setShowConfirm(true);
    };
    const handleSelectPeserta = (selected) => {
        setFormAdd(selected);
        setShowModalSelectPeserta(false);
        setDisabled(true);
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await insertPesertaDidik(tahunAjaran, guru, formAdd);
            showToast("success", "Data berhasil ditambahkan");
            setDisabled(false);
            onSuccess();
        } catch (err) {
            setError(err.message || "Gagal Tambah Data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ModalContainer
                onClose={onClose}
                size={"w-6/12"}
                height={"h-[95%]"}
            >
                <h2 className="flex font-semibold text-lg text-gray-800 mb-4 mt-8 ">
                    Tambah Peserta Didik
                </h2>
                <div className="w-2/3">
                    {error && <ErrorMessage error={error} ref={errorRef} />}
                </div>
                <form onSubmit={handleSubmit} className="w-2/3 text-sm ">
                    <div className="w-full h-15 flex gap-5 mb-7">
                        <ModalInput
                            type={"select"}
                            value={guru}
                            onChange={(val) => {
                                setGuru(val);
                            }}
                            options={guruOptions}
                            displayKey="label"
                            valueKey="value"
                            id={"guru_kelas"}
                            name={"guru_kelas"}
                            disibled={loading}
                            required={true}
                        >
                            Guru{" "}
                        </ModalInput>
                        <ModalInput
                            type={"select"}
                            value={tahunAjaran}
                            onChange={(val) => setTahunAjaran(val)}
                            options={tahunAjaranOptions}
                            displayKey="label"
                            valueKey="value"
                            id={"tahun_ajaran"}
                            name={"tahun_ajaran"}
                            disibled={loading}
                            required ={true}
                        >
                            Tahun Ajaran{" "}
                        </ModalInput>
                    </div>
                    <div className="text-sm flex justify-between border-t-2 pt-1 border-t-gray-900/80">
                        <p className="text-gray-900/80 font-semibold ">
                            Informasi Peserta Didik
                        </p>
                        <p
                            className="text-xs font-semibold py-1.5 text-blue-500 cursor-pointer hover:text-blue-600 underline underline-offset-2"
                            onClick={() => {
                                setShowModalSelectPeserta(true);
                            }}
                        >
                            cari di database
                        </p>
                    </div>
                    {disabled && (
                        <div className="rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4 text-blue-800 shadow-sm">
                            <p className="flex items-center gap-2 text-sm">
                                <svg
                                    className="h-5 w-5 flex-shrink-0 text-blue-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 0010 6zm0 7a1 1 0 100-2 1 1 0 000 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Anda mengambil dari database. Tidak dapat
                                mengubah informasi peserta didik.
                            </p>
                        </div>
                    )}

                    <div className="flex mt-1 flex-col w-full">
                        <div className="flex gap-5 mt-3 w-full">
                            <ModalInput
                                id={"nama_lengkap"}
                                value={formAdd.nama_lengkap || ""}
                                ref={namaLengkapRef}
                                type={"text"}
                                name={"nama_lengkap"}
                                placeholder={"Masukkan nama lengkap"}
                                htmlFor={"nama_lengkap"}
                                onChange={onChangeHandle}
                                required ={true}
                                disabled={loading || disabled}
                            >
                                Nama lengkap{" "}
                            </ModalInput>
                            <ModalInput
                                id={"nama_panggilan"}
                                name={"nama_panggilan"}
                                value={formAdd.nama_panggilan || ""}
                                type={"text"}
                                onChange={onChangeHandle}
                                placeholder={"nama panggilan"}
                                required ={true}
                                disabled={loading || disabled}
                                htmlFor={"nama_panggilan"}
                            >
                                Nama panggilan
                            </ModalInput>
                        </div>
                    </div>
                    <div className="flex gap-5 mt-5">
                        <ModalInput
                            id={"NIS"}
                            type={"number"}
                            value={formAdd.nis || ""}
                            placeholder={"Masukkan Nomor Induk Siswa"}
                            htmlFor={"NIS"}
                            name={"nis"}
                            disabled={loading || disabled}
                            onChange={onChangeHandle}
                            
                            required={true}
                            disibled={loading}
                        >
                            NIS{" "}
                        </ModalInput>
                        <ModalInput
                            id={"NISN"}
                            type={"number"}
                            value={formAdd.nisn || ""}
                            name={"nisn"}
                            onChange={onChangeHandle}
                            placeholder={"Nomor Induk Siswa Nasional"}
                            htmlFor={"NISN"}
                            required ={true}
                            disabled={loading || disabled}
                        >
                            NISN
                        </ModalInput>
                    </div>
                    <div className="flex gap-5 mt-5">
                        <ModalInput
                            id={"tempat_lahir"}
                            value={formAdd.tempat_lahir || ""}
                            type={"text"}
                            name={"tempat_lahir"}
                            onChange={onChangeHandle}
                            placeholder={"Masukkan tempat kelahiran"}
                            htmlFor={"tempat_lahir"}
                            required ={true}
                            disabled={loading || disabled}
                        >
                            Tempat lahir
                        </ModalInput>
                        <ModalInput
                            id={"tanggal_lahir"}
                            value={formAdd.tanggal_lahir || ""}
                            type={"date"}
                            name={"tanggal_lahir"}
                            onChange={onChangeHandle}
                            placeholder={"tanggal lahir"}
                            htmlFor={"tanggal_lahir"}
                            required ={true}
                            disabled={loading || disabled}
                        >
                            Tanggal lahir
                        </ModalInput>
                    </div>
                    <div className="flex gap-5 mt-5 w-full">
                        <ModalInput
                            id={"jenis_kelamin"}
                            type={"select"}
                            value={formAdd.jenis_kelamin || ""}
                            name={"jenis_kelamin"}
                            onChange={(val) => {
                                setFormAdd((value) => ({
                                    ...value,
                                    jenis_kelamin: val,
                                }));
                            }}
                            options={["Laki-Laki", "Perempuan"]}
                            htmlFor={"jenis_kelamin"}
                            disabled={loading || disabled}
                            required={true}
                        >
                            Jenis kelamin
                            {/*<span className="text-red-500">
                                * (wajib diisi)
                            </span>*/}
                        </ModalInput>
                        <ModalInput
                            id={"agama"}
                            type={"select"}
                            name={"agama"}
                            allowEmpty={true}
                            emptyLabel={"kosongkan pilihan"}
                            value={formAdd.agama || ""}
                            onChange={(val) => {
                                setFormAdd((item) => ({
                                    ...item,
                                    agama: val,
                                }));
                            }}
                            typeOption={true}
                            options={[
                                "Islam",
                                "Kristen",
                                "Katolik",
                                "Hindu",
                                "Buddha, Konghucu",
                            ]}
                            placeholder={"agama"}
                            htmlFor={"agama"}
                            disabled={loading || disabled}
                            required ={true}
                        >
                            Agama
                        </ModalInput>
                    </div>
                    <div className="flex gap-5 mt-5 w-full ">
                        <ModalInput
                            id={"anak_ke"}
                            type={"number"}
                            value={formAdd.anakKe || ""}
                            name={"anakKe"}
                            onChange={onChangeHandle}
                            placeholder={"Contoh: 1, 2, 3, dst."}
                            htmlFor={"anakKe"}
                            disabled={loading || disabled}
                            required ={true}
                        >
                            Anak ke-
                        </ModalInput>
                    </div>
                    <div className="flex mt-7 flex-col w-full">
                        <p className="text-sm text-gray-900/80 font-semibold border-t-2 pt-1 border-t-gray-900/80">
                            Informasi orang tua :
                        </p>
                        <div className="flex gap-5 mt-3 w-full ">
                            <ModalInput
                                id={"ayah"}
                                type={"text"}
                                name={"nama_ayah"}
                                value={formAdd.nama_ayah || ""}
                                onChange={onChangeHandle}
                                placeholder={"masukkan nama lengkap ayah"}
                                htmlFor={"nama_ayah"}
                                disabled={loading || disabled}
                                required ={true}
                            >
                                Nama Ayah
                            </ModalInput>
                            <ModalInput
                                id={"pekerjaan_ayah"}
                                name={"pekerjaanAyah"}
                                value={formAdd.pekerjaanAyah || ""}
                                onChange={onChangeHandle}
                                type={"text"}
                                placeholder={"masukkan pekerjaan ayah"}
                                htmlFor={"pekerjaanAyah"}
                                disabled={loading || disabled}
                                required ={true}
                            >
                                Pekerjaan ayah
                            </ModalInput>
                        </div>
                    </div>
                    <div className="flex gap-5 mt-5 w-full ">
                        <ModalInput
                            id={"nama_ibu"}
                            type={"text"}
                            name={"nama_ibu"}
                            value={formAdd.nama_ibu || ""}
                            onChange={onChangeHandle}
                            placeholder={"masukkan nama ibu"}
                            disabled={loading || disabled}
                            required ={true}
                        >
                            Nama ibu
                        </ModalInput>
                        <ModalInput
                            id={"pekerjaanIbu"}
                            name={"pekerjaanIbu"}
                            onChange={onChangeHandle}
                            value={formAdd.pekerjaanIbu || ""}
                            type={"text"}
                            placeholder={"masukkan pekerjaan ibu"}
                            htmlFor={"pekerjaanIbu"}
                            disabled={loading || disabled}
                            required ={true}
                        >
                            Pekerjaan ibu
                        </ModalInput>
                    </div>
                    <div className="flex gap-5 mt-5 w-full">
                        <ModalInput
                            id={"nama_wali"}
                            type={"text"}
                            value={formAdd.nama_wali || ""}
                            name={"nama_wali"}
                            onChange={onChangeHandle}
                            placeholder={"masukkan nama wali (opsional)"}
                            htmlFor={"nama_wali"}
                            disabled={loading || disabled}
                            required ={true}
                        >
                            nama Wali{" (Opsional)"}
                        </ModalInput>
                    </div>
                    <div className="flex mt-7 flex-col w-full">
                        <div className="text-sm flex justify-between border-t-2 pt-1 border-t-gray-900/80">
                            <p className="text-gray-900/80 font-semibold ">
                                Alamat tempat tinggal
                            </p>
                            <p
                                className="text-xs font-semibold py-1.5 text-blue-500 cursor-pointer hover:text-blue-600 underline underline-offset-2"
                                onClick={() => {
                                    setFormAdd({
                                        ...formAdd,
                                        provinsi: "Sulawesi Selatan",
                                        kabupaten: "Luwu",
                                        kecamatan: "Belopa",
                                        desa_atau_kelurahan: "Tampumia Radda",
                                        jalan: "Gunung Latimojong",
                                    });
                                }}
                            >
                                template data
                            </p>
                        </div>
                        <div className="flex gap-5 mt-5 w-full ">
                            <ModalInput
                                id={"provinsi"}
                                value={formAdd.provinsi || ""}
                                type={"text"}
                                name={"provinsi"}
                                onChange={onChangeHandle}
                                placeholder={"masukkan nama provinsi"}
                                htmlFor={"provinsi"}
                                required ={true}
                                disabled={loading || disabled}
                            >
                                Provinsi
                            </ModalInput>
                            <ModalInput
                                id={"kabupaten"}
                                type={"text"}
                                name={"kabupaten"}
                                value={formAdd.kabupaten || ""}
                                onChange={onChangeHandle}
                                placeholder={"masukkan nama kabupaten"}
                                htmlFor={"kabupaten"}
                                required ={true}
                                disabled={loading || disabled}
                            >
                                Kabupaten
                            </ModalInput>
                        </div>
                    </div>
                    <div className="flex gap-5 mt-5 w-full ">
                        <ModalInput
                            id={"kecamatan"}
                            type={"text"}
                            name={"kecamatan"}
                            value={formAdd.kecamatan || ""}
                            onChange={onChangeHandle}
                            placeholder={"masukkan nama kecamatan"}
                            htmlFor={"kecamatan"}
                            required ={true}
                            disabled={loading || disabled}
                        >
                            Kecamatan
                        </ModalInput>
                        <ModalInput
                            type={"text"}
                            id={"desa_atau_kelurahan"}
                            name={"desa_atau_kelurahan"}
                            value={formAdd.desa_atau_kelurahan || ""}
                            onChange={onChangeHandle}
                            placeholder={"masukkan nama desa/kelurahan"}
                            htmlFor={"desa_atau_kelurahan"}
                            required ={true}
                            disabled={loading || disabled}
                        >
                            Desa / Kelurahan
                        </ModalInput>
                    </div>
                    <div className="flex gap-5 mt-5 w-full ">
                        <ModalInput
                            type={"text"}
                            id={"jalan"}
                            name={"jalan"}
                            value={formAdd.jalan || ""}
                            onChange={onChangeHandle}
                            placeholder={"masukkan nama jalan"}
                            htmlFor={"jalan"}
                            required ={true}
                            disabled={loading || disabled}
                        >
                            Jalan
                        </ModalInput>
                    </div>

                    {/* Button Submit */}
                    <div className="flex gap-2 mt-5 w-1/2 justify-start pt-5">
                        <ButtonSubmit
                            bg={"bg-teal-600"}
                            type={"submit"}
                            hover={"hover:bg-teal-700 w-20"}
                            disabled={loading}
                            required ={true}
                        >
                            {loading ? (
                                <ButtonSpinLoading size="sm" color="light" />
                            ) : (
                                "Submit"
                            )}
                        </ButtonSubmit>
                        <ButtonSubmit
                            type={"reset"}
                            bg={"bg-gray-600"}
                            hover={"hover:bg-gray-700 w-15"}
                            onClick={() => {
                                setFormAdd("");
                                setGuru("");
                                setTahunAjaran("");
                                setDisabled(false);
                            }}
                            disabled={loading}
                            required ={true}
                        >
                            Reset
                        </ButtonSubmit>
                    </div>
                </form>
            </ModalContainer>
            <ConfirmModal
                isOpen={showConfirm}
                title="Simpan Data?"
                text="Pastikan data sudah benar."
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirm}
            />
            {showModalSelectPeserta && (
                <ModalSelectPeserta
                    closeOpenModal={() => {
                        setShowModalSelectPeserta(false);
                    }}
                    isOpen={showModalSelectPeserta}
                    onSelect={handleSelectPeserta}
                />
            )}
        </>
    );
};

export default Modal;
