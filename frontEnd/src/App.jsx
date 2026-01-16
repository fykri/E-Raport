import "./css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OfflineIndicator from "./component/OfflineIndicator";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PesertaDidik from "./pages/PesertaDidik";
import GuruKelas from "./pages/GuruKelas";
import Penilaian from "./pages/Penilaian";
import CetakRaport from "./pages/CetakRaport";
import TahunAjaran from "./pages/TahunAjaran";
import KategoriPenilaian from "./component/penilaian/KategoriPenilaian";
import SubKategoriPenilaian from "./component/penilaian/SubKategoriPenilaian";
import Nilai from "./component/penilaian/Nilai";
import OrangTua from "./pages/OrangTua";
import Users from "./pages/Users";
import ManagementPassword from "./pages/ManagementPassword";
import RoleRoute from "./component/RoleRoute";
import RekapNilai from "./component/RekapNilai";

function App() {
    return (
        <>
            <OfflineIndicator />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Halaman khusus Ortu */}
                <Route
                    path="/orang-tua"
                    element={
                        <RoleRoute allowedRoles={["Ortu"]}>
                            <OrangTua />
                        </RoleRoute>
                    }
                ></Route>
                <Route path="/orang-tua/kelola-password/:id" element={
                    <RoleRoute allowedRoles={["Ortu"]}>
                        <ManagementPassword/>
                    </RoleRoute>
                }></Route>

                {/* Halaman khusus Operator */}
                <Route
                    path="/dashboard"
                    element={
                        <RoleRoute allowedRoles={["Operator"]}>
                            <Dashboard />
                        </RoleRoute>
                    }
                />
                <Route
                    path="/kelola-users"
                    element={
                        <RoleRoute allowedRoles={["Operator"]}>
                            <Users />
                        </RoleRoute>
                    }
                />
                <Route
                    path="/peserta-didik"
                    element={
                        <RoleRoute allowedRoles={["Operator"]}>
                            <PesertaDidik />
                        </RoleRoute>
                    }
                />
                <Route
                    path="/tahun-ajaran"
                    element={
                        <RoleRoute allowedRoles={["Operator"]}>
                            <TahunAjaran />
                        </RoleRoute>
                    }
                />
                <Route
                    path="/guru-kelas"
                    element={
                        <RoleRoute allowedRoles={["Operator"]}>
                            <GuruKelas />
                        </RoleRoute>
                    }
                />
                <Route
                    path="/penilaian"
                    element={
                        <RoleRoute allowedRoles={["Operator"]}>
                            <Penilaian />
                        </RoleRoute>
                    }
                >
                    <Route
                        path=":id_rekap_nilai"
                        element={<KategoriPenilaian />}
                    />
                    <Route
                        path=":id_rekap_nilai/:id_kategori"
                        element={<SubKategoriPenilaian />}
                    />
                    <Route
                        path=":id_rekap_nilai/:id_kategori/:id_sub_kategori"
                        element={<Nilai />}
                    />
                </Route>
                <Route
                    path="/penilaian/:id_rekap_nilai/:id_peserta_didik/:tahun_ajaran/:semester/:nis"
                    element={
                        <RoleRoute allowedRoles={["Operator"]}>
                            <RekapNilai />
                        </RoleRoute>
                    }
                ></Route>
                <Route
                    path="/cetak-raport"
                    element={
                        <RoleRoute allowedRoles={["Operator"]}>
                            <CetakRaport />
                        </RoleRoute>
                    }
                />

                {/* Halaman tidak ditemukan */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
