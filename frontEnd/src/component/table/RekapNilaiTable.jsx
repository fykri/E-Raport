import React from "react";

const RekapNilaiTable = ({ nilai = [], indikatorNilai = [] }) => {
    return (
        <div className="drop-shadow-xl rounded-md bg-[#ffffff] p-5 text-sm relative mt-10 -z-10 lg:max-w-[90%] self-center">
            <table className="table-auto border-collapse border border-black w-full text-[10px] md:text-xs">
                <thead>
                    <tr className="bg-red-100">
                        <th
                            rowSpan={2}
                            className="border border-black px-2 py-1"
                        >
                            NO
                        </th>
                        <th
                            rowSpan={2}
                            colSpan={3}
                            className="border border-black px-2 py-1"
                        >
                            ASPEK PERKEMBANGAN
                        </th>
                        <th
                            colSpan={3}
                            className="border border-black px-2 py-1"
                        >
                            HASIL PENILAIAN
                        </th>
                    </tr>
                    <tr className="bg-red-100">
                        <th className="border border-black px-2 py-1">BAIK</th>
                        <th className="border border-black px-2 py-1">CUKUP</th>
                        <th className="border border-black px-2 py-1">
                            PERLU DILATIH
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* Baris kategori pertama */}
                    {nilai[0] && (
                        <>
                            <tr key={`kategori-0`}>
                                <td className="border border-black px-2 py-1 text-center font-semibold">
                                    1
                                </td>
                                <td
                                    className="border border-black px-2 py-1 text-left font-semibold"
                                    colSpan={3}
                                >
                                    {nilai[0].nama_kategori}
                                </td>
                                <td className="border border-black px-2 py-1 text-center"></td>
                                <td className="border border-black px-2 py-1 text-center"></td>
                                <td className="border border-black px-2 py-1 text-center"></td>
                            </tr>

                            {nilai[0].subKategori[0]?.indikator.map(
                                (item, iIndikator) => (
                                    <tr
                                        key={`kategori-0-indikator-${iIndikator}`}
                                    >
                                        <td className={`border border-black px-2 py-1 text-center ${item.nilai? "": "text-red-500"}`}>{item.nilai ? "": "!"}</td>
                                        <td className="border border-black px-2 py-1 text-center">
                                            {iIndikator + 1}
                                        </td>
                                        <td
                                            className="border border-black px-2 py-1 text-left"
                                            colSpan={2}
                                        >
                                            {item.indikator}
                                        </td>
                                        {indikatorNilai.map((value, iNilai) => (
                                            <td
                                                key={`kategori-0-indikator-${iIndikator}-nilai-${iNilai}`}
                                                className="border border-black px-2 py-1 text-center"
                                            > 
                                                {value === item.nilai
                                                    ? "✓"
                                                    : ""}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            )}
                        </>
                    )}

                    {/* Kategori berikutnya */}
                    {nilai.slice(1).map((item, iKategori) => (
                        <React.Fragment key={`kategori-${iKategori + 1}`}>
                            <tr>
                                <td className="border border-black px-2 py-1 text-center font-semibold">
                                    {iKategori + 2}
                                </td>
                                <td
                                    className="border border-black px-2 py-1 text-left font-semibold"
                                    colSpan={3}
                                >
                                    {item.nama_kategori}
                                </td>
                                <td className="border border-black px-2 py-1 text-center"></td>
                                <td className="border border-black px-2 py-1 text-center"></td>
                                <td className="border border-black px-2 py-1 text-center"></td>
                            </tr>

                            {item.subKategori.map((val, iSub) => (
                                <React.Fragment
                                    key={`kategori-${
                                        iKategori + 1
                                    }-sub-${iSub}`}
                                >
                                    <tr>
                                        <td className="border border-black px-2 py-1 text-center"></td>
                                        <td className="border border-black px-2 py-1 text-center">
                                            {iSub + 1}
                                        </td>
                                        <td
                                            className="border border-black px-2 py-1 text-left"
                                            colSpan={2}
                                        >
                                            {val.nama_sub_kategori}
                                        </td>
                                        <td className="border border-black px-2 py-1 text-center"></td>
                                        <td className="border border-black px-2 py-1 text-center"></td>
                                        <td className="border border-black px-2 py-1 text-center"></td>
                                    </tr>

                                    {val.indikator.map((value, iIndikator) => (
                                        <tr
                                            key={`kategori-${
                                                iKategori + 1
                                            }-sub-${iSub}-indikator-${iIndikator}`}
                                        >
                                            <td className={`border border-black px-2 py-1 text-center ${item.nilai? "": "text-red-500"}`}>{value.nilai? "": "!"}</td>
                                            <td className="border border-black px-2 py-1 text-center"></td>
                                            <td className="border border-black px-2 py-1 text-center size-1">
                                                -
                                            </td>
                                            <td className="border border-black px-2 py-1 text-left">
                                                {value.indikator}
                                            </td>
                                            {indikatorNilai.map(
                                                (nilaiItem, iNilai) => (
                                                    <td
                                                        key={`kategori-${
                                                            iKategori + 1
                                                        }-sub-${iSub}-indikator-${iIndikator}-nilai-${iNilai}`}
                                                        className="border border-black px-2 py-1 text-center"
                                                    >
                                                        {nilaiItem ===
                                                        value.nilai
                                                            ? "✓"
                                                            : ""}
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RekapNilaiTable;
