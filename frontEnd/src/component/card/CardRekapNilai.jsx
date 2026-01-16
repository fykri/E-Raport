const CardRekapNilai = ({ selectedPeserta }) => {
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
    return (
        <div className="flex justify-center mt-5 ">
            <div
                className={`group relative w-3/4 h-72 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-transform duration-300 p-4 flex flex-col items-center justify-center border border-gray-300 transform hover:-translate-y-1 hover:scale-[1.02]`}
            >
                <div
                    className={`w-24 h-24 rounded-full text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md mb-3 ${getBackgroundColor(
                        selectedPeserta?.nama_lengkap
                    )}`}
                >
                    {(selectedPeserta?.nama_lengkap || "U")
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                </div>
                <div className="text-center z-0 w-full mt-2">
                    <h3 className="text-gray-800 font-semibold text-lg mb-1">
                        {selectedPeserta?.nama_lengkap || "Nama Siswa"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                        {selectedPeserta?.nis || "NIS belum diisi"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CardRekapNilai;
