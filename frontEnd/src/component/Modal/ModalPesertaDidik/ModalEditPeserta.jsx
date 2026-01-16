import { useState, useEffect } from "react";
import ModalContainer from "../../../containers/modalContainer";
import ModalInput from "../../input/ModalInput";
import { useSelectedGuru } from "../../../hooks/useSelectedGuru";
import { useSelectedTahunAjaran } from "../../../hooks/useSelectedTahunAjaran";
import ButtonSubmit from "../../button/Button_submit";
import ButtonSpinLoading from "../../button/ButtonSpinLoading";
import { updatePesertaDidik } from "../../../api/peserta_didik";
import { useFocusError } from "../../../hooks/useFocusError";
import ConfirmModal from "../confirmModal";
import { validatePesertaDidik } from "../../../helpers/pesertaDidikValidator";
import ErrorMessage from "../../Error";
import showToast from "../../../hooks/showToast";

const ModalEditPesertaDidik = ({
    onClose,
    onSuccess,
    selectedPesertaDidik,
    tahunAjaranId,
}) => {
    const [listPesertaDidik, setListPesertaDidik] = useState(
        selectedPesertaDidik.peserta_didik
    );
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const { errorRef, focusError } = useFocusError();
    const [loading, setLoading] = useState(false);
    const tahun_ajaran_id = tahunAjaranId;
    const id_guru = selectedPesertaDidik.id_guru;
    const [formEdit, setFormEdit] = useState({
        tahunAjaranId: tahun_ajaran_id,
        guruId: id_guru,
        pesertaDidik: {
            ...listPesertaDidik,
        },
    });
    // ini dari hook untuk mengambil data tahun-ajaran dan guru
    const { tahunAjaranOptions } = useSelectedTahunAjaran();
    const [guruOptions] = useSelectedGuru();

    const onChangeHandelEdit = (e) => {
        const { value, name } = e.target;
        setFormEdit((val) => ({
            ...val,
            pesertaDidik: {
                ...val.pesertaDidik,
                [name]: name === "anakKe" ? Number(value) : value,
            },
        }));
    };

    useEffect(() => {
        if (error) {
            focusError();
        }
    }, [error]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { valid, error } = validatePesertaDidik(
            formEdit.pesertaDidik,
            formEdit.guruId,
            formEdit.tahunAjaranId
        );
        if (!valid) {
            setError(error);
            return;
        }
        setError("");
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await updatePesertaDidik(
                listPesertaDidik.id_peserta_didik,
                tahun_ajaran_id,
                formEdit
            );
            showToast("success", "Data berhasil diupdate");
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
                    Edit Peserta Didik
                </h2>
                <div className="w-2/3">
                    {error && <ErrorMessage error={error} ref={errorRef} />}
                </div>
                <form className="w-2/3 text-sm" onSubmit={handleUpdate}>
                    <div className="w-full h-15 flex gap-5 mb-7">
                        <ModalInput
                            type={"select"}
                            value={formEdit.guruId || " "}
                            onChange={(val) => {
                                setFormEdit({
                                    ...formEdit,
                                    guruId: val,
                                });
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
                            value={formEdit.tahunAjaranId}
                            onChange={(val) => {
                                setFormEdit({
                                    ...formEdit,
                                    tahunAjaranId: val,
                                });
                            }}
                            options={tahunAjaranOptions}
                            displayKey="label"
                            valueKey="value"
                            id={"tahun_ajaran"}
                            name={"tahun_ajaran"}
                            disibled={loading}
                            required={true}
                        >
                            Tahun Ajaran{" "}
                        </ModalInput>
                    </div>
                    <div className="flex mt-1 flex-col w-full">
                        <p className="text-sm text-gray-900/80 font-semibold border-t-2 pt-1 border-t-gray-900/80">
                            Informasi peserta didik
                        </p>
                        <div className="flex gap-5 mt-3 w-full">
                            <ModalInput
                                id={"nama_lengkap"}
                                value={formEdit.pesertaDidik.nama_lengkap}
                                type={"text"}
                                name={"nama_lengkap"}
                                placeholder={"Masukkan nama lengkap"}
                                htmlFor={"nama_lengkap"}
                                onChange={onChangeHandelEdit}
                                disibled={loading}
                                required={true}
                            >
                                Nama lengkap{" "}
                            </ModalInput>
                            <ModalInput
                                id={"nama_panggilan"}
                                name={"nama_panggilan"}
                                type={"text"}
                                value={formEdit.pesertaDidik.nama_panggilan}
                                onChange={onChangeHandelEdit}
                                placeholder={"nama panggilan"}
                                htmlFor={"nama_panggilan"}
                                disibled={loading}
                                required={true}
                            >
                                Nama panggilan
                            </ModalInput>
                        </div>
                        <div className="flex gap-5 mt-5">
                            <ModalInput
                                id={"NIS"}
                                type={"number"}
                                placeholder={"Masukkan Nomor Induk Siswa"}
                                htmlFor={"NIS"}
                                name={"nis"}
                                value={formEdit.pesertaDidik.nis}
                                onChange={onChangeHandelEdit}
                                required={true}
                                disibled={loading}
                            >
                                NIS{" "}
                            </ModalInput>
                            <ModalInput
                                id={"NISN"}
                                type={"number"}
                                name={"nisn"}
                                value={formEdit.pesertaDidik.nisn}
                                onChange={onChangeHandelEdit}
                                placeholder={
                                    "Masukkan Nomor Induk Siswa Nasional"
                                }
                                htmlFor={"NISN"}
                                disibled={loading}
                                required={true}
                            >
                                NISN
                            </ModalInput>
                        </div>
                        <div className="flex gap-5 mt-5">
                            <ModalInput
                                id={"tempat_lahir"}
                                type={"text"}
                                name={"tempat_lahir"}
                                value={formEdit.pesertaDidik.tempat_lahir}
                                onChange={onChangeHandelEdit}
                                placeholder={"Masukkan tempat kelahiran"}
                                htmlFor={"tempat_lahir"}
                                disibled={loading}
                                required={true}
                            >
                                Tempat lahir
                            </ModalInput>
                            <ModalInput
                                id={"tanggal_lahir"}
                                type={"date"}
                                name={"tanggal_lahir"}
                                value={formEdit.pesertaDidik.tanggal_lahir}
                                onChange={onChangeHandelEdit}
                                placeholder={"tanggal lahir"}
                                htmlFor={"tanggal_lahir"}
                                disibled={loading}
                                required={true}
                            >
                                Tanggal lahir
                            </ModalInput>
                        </div>
                        <div className="flex gap-5 mt-5 w-full">
                            <ModalInput
                                id={"jenis_kelamin"}
                                type={"select"}
                                value={formEdit.pesertaDidik.jenis_kelamin}
                                onChange={(val) => {
                                    setFormEdit((prev) => ({
                                        ...prev,
                                        pesertaDidik: {
                                            ...prev.pesertaDidik,
                                            jenis_kelamin: val,
                                        },
                                    }));
                                }}
                                name={"jenis_kelamin"}
                                options={["Laki-Laki", "Perempuan"]}
                                htmlFor={"jenis-kelamin"}
                                disibled={loading}
                                required={true}
                            >
                                Jenis kelamin
                            </ModalInput>
                            <ModalInput
                                id={"agama"}
                                type={"select"}
                                allowEmpty={true}
                                emptyLabel={"kosongkan pilihan"}
                                name={"agama"}
                                value={formEdit.pesertaDidik.agama}
                                onChange={(val) => {
                                    setFormEdit((prev) => ({
                                        ...prev,
                                        pesertaDidik: {
                                            ...prev.pesertaDidik,
                                            agama: val,
                                        },
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
                                disibled={loading}
                                required={true}
                            >
                                Agama
                            </ModalInput>
                        </div>
                        <div className="flex gap-5 mt-5 w-full ">
                            <ModalInput
                                id={"anak_ke"}
                                type={"number"}
                                name={"anakKe"}
                                value={formEdit.pesertaDidik.anakKe}
                                onChange={onChangeHandelEdit}
                                placeholder={"Contoh: 1, 2, 3, dst."}
                                htmlFor={"anakKe"}
                                disibled={loading}
                                required={true}
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
                                    value={formEdit.pesertaDidik.nama_ayah}
                                    onChange={onChangeHandelEdit}
                                    placeholder={"masukkan nama lengkap ayah"}
                                    htmlFor={"nama_ayah"}
                                    disibled={loading}
                                    required={true}
                                >
                                    Nama Ayah
                                </ModalInput>
                                <ModalInput
                                    id={"pekerjaan_ayah"}
                                    name={"pekerjaanAyah"}
                                    value={formEdit.pesertaDidik.pekerjaanAyah}
                                    onChange={onChangeHandelEdit}
                                    type={"text"}
                                    placeholder={"masukkan pekerjaan ayah"}
                                    htmlFor={"pekerjaanAyah"}
                                    disibled={loading}
                                    required={true}
                                >
                                    Pekerjaan ayah
                                </ModalInput>
                            </div>
                            <div className="flex gap-5 mt-5 w-full ">
                                <ModalInput
                                    id={"nama_ibu"}
                                    type={"text"}
                                    name={"nama_ibu"}
                                    value={formEdit.pesertaDidik.nama_ibu}
                                    onChange={onChangeHandelEdit}
                                    placeholder={"masukkan nama ibu"}
                                    disibled={loading}
                                    required={true}
                                >
                                    Nama ibu
                                </ModalInput>
                                <ModalInput
                                    id={"pekerjaanIbu"}
                                    name={"pekerjaanIbu"}
                                    value={formEdit.pesertaDidik.pekerjaanIbu}
                                    onChange={onChangeHandelEdit}
                                    type={"text"}
                                    placeholder={"masukkan pekerjaan ibu"}
                                    htmlFor={"pekerjaanIbu"}
                                    disibled={loading}
                                    required={true}
                                >
                                    Pekerjaan ibu
                                </ModalInput>
                            </div>
                            <div className="flex gap-5 mt-5 w-full">
                                <ModalInput
                                    id={"nama_wali"}
                                    type={"text"}
                                    name={"nama_wali"}
                                    value={formEdit.pesertaDidik.nama_wali}
                                    onChange={onChangeHandelEdit}
                                    placeholder={
                                        "masukkan nama wali (opsional)"
                                    }
                                    htmlFor={"nama_wali"}
                                    disibled={loading}
                                    required={true}
                                >
                                    nama Wali{" (Opsional)"}
                                </ModalInput>
                            </div>
                            <div className="flex mt-7 flex-col w-full">
                                <div className="text-sm flex justify-between border-t-2 pt-1 border-t-gray-900/80">
                                    <p className="text-gray-900/80 font-semibold">
                                        Alamat Tempat Tinggal :
                                    </p>
                                    <p
                                        className="text-xs font-semibold py-1.5 text-blue-500 cursor-pointer hover:text-blue-600 underline underline-offset-2"
                                        onClick={() => {
                                            setFormEdit((prev) => ({
                                                ...prev,
                                                pesertaDidik: {
                                                    ...prev.pesertaDidik,
                                                    provinsi:
                                                        "Sulawesi Selatan",
                                                    kabupaten: "Luwu",
                                                    kecamatan: "Belopa",
                                                    desa_atau_kelurahan:
                                                        "Tampumia Radda",
                                                    jalan: "Gunung Latimojong",
                                                },
                                            }));
                                        }}
                                    >
                                        template data
                                    </p>
                                </div>
                                <div className="flex gap-5 mt-5 w-full ">
                                    <ModalInput
                                        id={"provinsi"}
                                        type={"text"}
                                        name={"provinsi"}
                                        value={formEdit.pesertaDidik.provinsi}
                                        onChange={onChangeHandelEdit}
                                        placeholder={"masukkan nama provinsi"}
                                        htmlFor={"provinsi"}
                                        disibled={loading}
                                        required={true}
                                    >
                                        Provinsi
                                    </ModalInput>
                                    <ModalInput
                                        id={"kabupaten"}
                                        type={"text"}
                                        name={"kabupaten"}
                                        value={formEdit.pesertaDidik.kabupaten}
                                        onChange={onChangeHandelEdit}
                                        placeholder={"masukkan nama kabupaten"}
                                        htmlFor={"kabupaten"}
                                        disibled={loading}
                                        required={true}
                                    >
                                        Kabupaten
                                    </ModalInput>
                                </div>
                                <div className="flex gap-5 mt-5 w-full ">
                                    <ModalInput
                                        id={"kecamatan"}
                                        type={"text"}
                                        name={"kecamatan"}
                                        value={formEdit.pesertaDidik.kecamatan}
                                        onChange={onChangeHandelEdit}
                                        placeholder={"masukkan nama kecamatan"}
                                        htmlFor={"kecamatan"}
                                        disibled={loading}
                                        required={true}
                                    >
                                        Kecamatan
                                    </ModalInput>
                                    <ModalInput
                                        type={"text"}
                                        id={"desa_atau_kelurahan"}
                                        name={"desa_atau_kelurahan"}
                                        value={
                                            formEdit.pesertaDidik
                                                .desa_atau_kelurahan
                                        }
                                        onChange={onChangeHandelEdit}
                                        placeholder={
                                            "masukkan nama desa/kelurahan"
                                        }
                                        htmlFor={"desa_atau_kelurahan"}
                                        disibled={loading}
                                        required={true}
                                    >
                                        Desa / Kelurahan
                                    </ModalInput>
                                </div>
                                <div className="flex gap-5 mt-5 w-full ">
                                    <ModalInput
                                        type={"text"}
                                        id={"jalan"}
                                        name={"jalan"}
                                        value={formEdit.pesertaDidik.jalan}
                                        onChange={onChangeHandelEdit}
                                        placeholder={"masukkan nama jalan"}
                                        htmlFor={"jalan"}
                                        disibled={loading}
                                        required={true}
                                    >
                                        Jalan
                                    </ModalInput>
                                </div>
                                <div className="flex gap-2 mt-5 w-full justify-center pt-5 ">
                                    <ButtonSubmit
                                        bg={"bg-teal-600"}
                                        type={"submit"}
                                        hover={"hover:bg-teal-700 w-20"}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ButtonSpinLoading
                                                size="sm"
                                                color="light"
                                            />
                                        ) : (
                                            "update"
                                        )}
                                    </ButtonSubmit>
                                </div>
                            </div>
                        </div>
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
        </>
    );
};

export default ModalEditPesertaDidik;
