"use client";

import { useState } from "react";
import Script from "next/script";

export default function PendaftaranLari() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nik: "",
    email: "",
    whatsapp: "",
    jenisKelamin: "",
    golonganDarah: "",
    namaDarurat: "",
    hpDarurat: "",
    kodePromo: "",
  });
  
  const [isWaiverChecked, setIsWaiverChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isWaiverChecked) {
      setError("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }
    // Lanjutkan ke logika integrasi Midtrans (API Route) Anda di sini
    setIsLoading(true);
    // ... simulasi ...
    setTimeout(() => setIsLoading(false), 2000);
  };

  // Utility classes untuk input agar seragam dan rapi
  const inputStyle = "w-full px-4 py-3 mt-1 text-base bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all duration-200";
  const labelStyle = "block text-sm font-semibold text-gray-700";

  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-[#f4f7fb] pb-24 font-sans text-gray-800">
        
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 py-4 px-6 flex justify-center shadow-sm">
          <h1 className="text-2xl font-black text-blue-900 italic tracking-tighter">UNBOUND</h1>
        </nav>

        {/* Hero Section */}
        <header className="bg-gradient-to-br from-blue-900 to-blue-700 pt-12 pb-16 px-6 text-center text-white rounded-b-[2.5rem] shadow-lg">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-800 text-blue-200 text-xs font-bold tracking-widest mb-4">
            CAFE RUN SERIES
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">UNBOUND <br/> FUN RUN 2026</h2>
          <p className="text-blue-100/90 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Rasakan sensasi lari dengan konsep Cafe Run[cite: 18]. Pelepasan peserta diiringi DJ mobil dan pengalaman yang tak terlupakan[cite: 32].
          </p>
        </header>

        <main className="max-w-2xl mx-auto px-4 -mt-8 relative z-10 space-y-6">
          
          {/* Location Split Card (KRUSIAL) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
            <div className="bg-blue-50/50 rounded-xl p-5 border-l-4 border-blue-600">
              <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📍</span> INFORMASI RUTE
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">🚩 Titik Start</p>
                  <p className="text-base font-bold text-gray-900">Mener Tarok</p>
                  <p className="text-xs text-gray-500 mt-1">Pelepasan: 06.00 WIB [cite: 27]</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">🏁 Titik Finish</p>
                  <p className="text-base font-bold text-gray-900">Mener Belakang Balok</p>
                  <p className="text-xs text-gray-500 mt-1">Hiburan: DJ, Doorprize [cite: 32]</p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-red-500 font-semibold text-center italic">
                *Mohon perhatikan lokasi Start & Finish berbeda.
              </p>
            </div>
          </div>

          {/* Form Pendaftaran */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Bagian 1: Informasi Pribadi */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h4 className="text-lg font-extrabold border-b pb-3 mb-4">Informasi Pribadi</h4>
              
              <div>
                <label className={labelStyle}>Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span></label>
                <input type="text" name="namaLengkap" required value={formData.namaLengkap} onChange={handleChange} className={inputStyle} placeholder="Contoh: Budi Santoso" />
              </div>

              <div>
                <label className={labelStyle}>NIK KTP (16 Digit) <span className="text-red-500">*</span></label>
                <input type="tel" name="nik" required minLength="16" maxLength="16" pattern="\d*" value={formData.nik} onChange={handleChange} className={inputStyle} placeholder="Masukkan 16 angka NIK" />
              </div>

              <div>
                <label className={labelStyle}>Email Aktif <span className="text-red-500">*</span></label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputStyle} placeholder="E-tiket akan dikirim ke sini" />
              </div>

              <div>
                <label className={labelStyle}>Nomor WhatsApp <span className="text-red-500">*</span></label>
                <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} className={inputStyle} placeholder="08xxxxxxxxxx" />
              </div>
            </div>

            {/* Bagian 2: Data Medis (Tanpa Jersey) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <h4 className="text-lg font-extrabold border-b pb-3">Data Medis Pelari</h4>
              
              {/* Custom Radio Button UI untuk Gender (Lebih mudah ditekan di HP) */}
              <div>
                <label className={labelStyle}>Jenis Kelamin <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <label className={`cursor-pointer border text-center py-3 rounded-xl font-semibold transition-all ${formData.jenisKelamin === 'L' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                    <input type="radio" name="jenisKelamin" value="L" className="hidden" onChange={handleChange} required /> Laki-laki
                  </label>
                  <label className={`cursor-pointer border text-center py-3 rounded-xl font-semibold transition-all ${formData.jenisKelamin === 'P' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                    <input type="radio" name="jenisKelamin" value="P" className="hidden" onChange={handleChange} required /> Perempuan
                  </label>
                </div>
              </div>

              <div>
                <label className={labelStyle}>Golongan Darah <span className="text-red-500">*</span></label>
                <select name="golonganDarah" required value={formData.golonganDarah} onChange={handleChange} className={inputStyle}>
                  <option value="" disabled>Pilih Golongan Darah</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="Tidak Tahu">Tidak Tahu</option>
                </select>
              </div>
            </div>

            {/* Bagian 3: Kontak Darurat */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h4 className="text-lg font-extrabold border-b pb-3 mb-4">Kontak Darurat</h4>
              <p className="text-xs text-gray-500 mb-2">Orang yang bisa dihubungi jika terjadi keadaan darurat (bukan nomor Anda).</p>
              
              <div>
                <label className={labelStyle}>Nama Kontak Darurat <span className="text-red-500">*</span></label>
                <input type="text" name="namaDarurat" required value={formData.namaDarurat} onChange={handleChange} className={inputStyle} placeholder="Nama keluarga / kerabat" />
              </div>

              <div>
                <label className={labelStyle}>No. HP Darurat <span className="text-red-500">*</span></label>
                <input type="tel" name="hpDarurat" required value={formData.hpDarurat} onChange={handleChange} className={inputStyle} placeholder="08xxxxxxxxxx" />
              </div>
            </div>

            {/* Promo & Persetujuan (Waiver) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div>
                <label className={labelStyle}>Kode Promo / Referral (Opsional)</label>
                <input type="text" name="kodePromo" value={formData.kodePromo} onChange={handleChange} className={`${inputStyle} uppercase`} placeholder="Masukkan kode jika ada" />
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}

              <label className="flex items-start gap-3 cursor-pointer bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <input 
                  type="checkbox" 
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={isWaiverChecked}
                  onChange={(e) => {
                    setIsWaiverChecked(e.target.checked);
                    if(e.target.checked) setError("");
                  }}
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Saya menyatakan dalam kondisi fisik yang sehat untuk mengikuti jarak 5K. Saya membebaskan penyelenggara dari tuntutan medis/kerugian, dan setuju bahwa tiket <strong className="text-gray-900">tidak dapat dikembalikan (No Refund)</strong> atau dipindahtangankan.
                </span>
              </label>
            </div>

            {/* Tombol Submit Sticky di Mobile */}
            <div className="sticky bottom-4 z-40 md:static md:bottom-auto">
              <button 
                type="submit" 
                disabled={!isWaiverChecked || isLoading}
                className={`w-full py-4 px-6 rounded-2xl text-white font-extrabold text-lg shadow-xl transition-all ${
                  isWaiverChecked 
                    ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-blue-600/30" 
                    : "bg-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                {isLoading ? "Memproses..." : "Lanjut ke Pembayaran"}
              </button>
            </div>

          </form>
        </main>
      </div>
    </>
  );
}