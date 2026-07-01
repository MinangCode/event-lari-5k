"use client";

import { useState } from "react";
import Script from "next/script";

export default function PendaftaranLari() {
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nik: "",
    email: "",
    no_whatsapp: "",
    ukuran_jersey: "M",
    golongan_darah: "O",
    riwayat_medis: "",
    kontak_darurat_nama: "",
    kontak_darurat_hp: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.nik.length !== 16) return setError("NIK harus tepat 16 digit.");
    if (!formData.no_whatsapp.startsWith("08") && !formData.no_whatsapp.startsWith("62")) return setError("Nomor WhatsApp harus diawali 08 atau 62.");
    if (formData.kontak_darurat_hp === formData.no_whatsapp) return setError("Nomor HP darurat tidak boleh sama dengan nomor WhatsApp peserta.");

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // MEMUNCULKAN POP-UP MIDTRANS
        window.snap.pay(result.token, {
          onSuccess: function(result){
            alert("Pembayaran Berhasil! Sampai jumpa di garis start!");
            // Opsional: Redirect ke halaman sukses
          },
          onPending: function(result){
            alert("Menunggu konfirmasi pembayaran Anda.");
          },
          onError: function(result){
            alert("Pembayaran Gagal. Silakan coba lagi.");
          },
          onClose: function(){
            alert("Anda menutup jendela pembayaran sebelum menyelesaikan transaksi.");
          }
        });
      } else {
        setError("Gagal sistem: " + result.error);
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan saat menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Memuat Script Midtrans Sandbox */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Pendaftaran 5K Fun Run</h1>
            <p className="mt-2 text-sm text-gray-500">Isi data diri Anda dengan benar sesuai kartu identitas. Data medis diperlukan untuk keamanan peserta.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Informasi Pribadi */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Informasi Pribadi</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap (Sesuai KTP)</label>
                  <input required type="text" name="nama_lengkap" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">NIK (Nomor Induk Kependudukan)</label>
                  <input required type="number" name="nik" onChange={handleChange} placeholder="16 Digit NIK" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Aktif</label>
                  <input required type="email" name="email" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">No. WhatsApp</label>
                  <input required type="number" name="no_whatsapp" onChange={handleChange} placeholder="08..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                </div>
              </div>
            </div>

            {/* Section 2: Logistik */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Logistik & Medis</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ukuran Jersey</label>
                  <select name="ukuran_jersey" onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Golongan Darah</label>
                  <select name="golongan_darah" onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                    <option value="Tidak Tahu">Tidak Tahu</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Riwayat Penyakit (Opsional)</label>
                  <textarea name="riwayat_medis" onChange={handleChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                </div>
              </div>
            </div>

            {/* Section 3: Kontak Darurat */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Kontak Darurat</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Kontak Darurat</label>
                  <input required type="text" name="kontak_darurat_nama" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">No. HP Darurat</label>
                  <input required type="number" name="kontak_darurat_hp" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'}`}
              >
                {isLoading ? "Menyiapkan Pembayaran..." : "Lanjut ke Pembayaran"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}