import { useState, useRef, useEffect } from "react";

const getBackgroundColor = (name) => {
    const colors = [
        "bg-indigo-500",
        "bg-emerald-500",
        "bg-amber-500",
        "bg-purple-500",
        "bg-cyan-500",
        "bg-fuchsia-500",
        "bg-sky-500",
        "bg-rose-500",
        "bg-violet-500",
        "bg-teal-500",
    ];
    if (!name) return colors[0];
    const charCode = name.charCodeAt(0);
    const index = charCode % colors.length;
    return colors[index];
};

const CardProfil = ({
    data = {},
    titik_tiga = true,
    hover,
    click,
    onEditClick,
    onDeleteClick,
    onNilaiClick,
    status = "belum lengkap",
    onSaranClick,
    onRekapNilai,
    mode = "default",
}) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`group relative w-56 h-80 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-transform duration-300 p-4 flex flex-col items-center justify-between border border-gray-300 transform hover:-translate-y-1 hover:scale-[1.02] ${hover}`}
            onClick={(e) => {
                e.stopPropagation();
                click?.(data);
            }}
        >
            {mode === "penilaian" && status && (
                <div className="absolute top-3 left-3 z-10">
                    {status === "belum lengkap" ? (
                        <p className="text-red-500 font-bold text-lg">!</p>
                    ) : (
                        <p className="text-green-700 font-bold text-lg">✓</p>
                    )}
                </div>
            )}

            {/* Avatar */}
            {data.foto ? (
                <img
                    src={data.foto}
                    alt={data.peserta_didik.nama_lengkap || "Profil"}
                    className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md mb-3"
                />
            ) : (
                <div
                    className={`w-24 h-24 rounded-full text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md mb-3 ${getBackgroundColor(
                        data.peserta_didik.nama_lengkap
                    )}`}
                >
                    {(data.peserta_didik.nama_lengkap || "U")
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                </div>
            )}

            {/* Titik tiga (tampil di semua mode) */}
            {titik_tiga && (
                <div className="absolute top-4 right-4" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(!open);
                        }}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Open menu"
                    >
                        <svg
                            className="w-5 h-5 text-gray-500 hover:text-gray-700"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <circle cx="3" cy="10" r="1.2" />
                            <circle cx="10" cy="10" r="1.2" />
                            <circle cx="17" cy="10" r="1.2" />
                        </svg>
                    </button>

                    {open && (
                        <div
                            className={`${
                                mode == "penilaian" ? "w-48" : "w-40"
                            } mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 text-sm text-gray-700 font-medium absolute right-0 transition-all duration-200 z-50`}
                        >
                            {mode === "default" ? (
                                <>
                                    <button
                                        onClick={onEditClick}
                                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-indigo-600 flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Edit dan lihat
                                    </button>
                                    <button
                                        onClick={onDeleteClick}
                                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-indigo-600 flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Hapus Data
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => onNilaiClick?.(data)}
                                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-indigo-600 flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Input Nilai
                                    </button>
                                    <button
                                        onClick={() => onSaranClick?.(data)}
                                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-indigo-600 flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4.2A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                        Masukan & Saran
                                    </button>
                                    <button
                                        onClick={() => onRekapNilai?.(data)}
                                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-indigo-600 flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6M9 8h6m-2-6h-4a2 2 0 00-2 2v16a2 2 0 002 
            2h8a2 2 0 002-2V8l-6-6z"
                                            />
                                        </svg>
                                        Rekap Nilai
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Overlay dan Tombol Nilai di mode penilaian */}

            {/* Info */}
            <div className="text-center z-0 w-full">
                <h3 className="text-gray-800 font-semibold text-lg mb-1">
                    {data.peserta_didik.nama_lengkap || "Nama Siswa"}
                </h3>
                <p className="text-gray-500 text-sm">
                    {data.peserta_didik.nis || "NIS belum diisi"}
                </p>
            </div>

            <div className="w-full mt-3 z-0">
                <div className="flex text-xs text-gray-700 font-medium gap-2 bg-gray-100 rounded-lg px-3 py-2">
                    <p className="w-1/2 py-1.5 rounded-lg bg-white border border-gray-200 text-center shadow-sm">
                        {data.tahun_ajaran.tahun_ajaran || "-"}
                    </p>
                    <p className="w-1/2 py-1.5 rounded-lg bg-white border border-gray-200 text-center shadow-sm">
                        {data.guru?.nama_kelas?.replace(
                            /([a-z])([A-Z])/g,
                            "$1 $2"
                        ) || "-"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CardProfil;
