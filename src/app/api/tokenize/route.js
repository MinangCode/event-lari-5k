import Midtrans from 'midtrans-client';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Inisialisasi Koneksi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Destrukturisasi data dari frontend
    const { 
      namaLengkap, nik, email, whatsapp, jenisKelamin, 
      golonganDarah, namaDarurat, hpDarurat, kodePromo 
    } = body;

    // 2. Logika Harga Dinamis
    const currentDate = new Date();
    // Batas Early Bird: Sebelum 1 Agustus 2026
    const isEarlyBird = currentDate < new Date('2026-08-01T00:00:00+07:00'); 
    
    const basePrice = isEarlyBird ? 25000 : 30000;
    const adminFee = 4000;
    const grossAmount = basePrice + adminFee;

    // 3. Buat ID Transaksi Unik sesuai format DB Anda
    // Contoh hasil: UBD-2026-84732
    const orderId = `UBD-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // 4. SIMPAN KE DATABASE SUPABASE (Tabel orders & participants)
    
    // A. Masukkan data ke tabel 'orders'
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_id: orderId,
        total_price: grossAmount,
        payment_status: 'pending',
        promo_code_used: kodePromo || null
      }]);

    if (orderError) throw new Error(`Gagal menyimpan order: ${orderError.message}`);

    // B. Masukkan data ke tabel 'participants'
    const { error: participantError } = await supabase
      .from('participants')
      .insert([{
        order_id: orderId,
        full_name: namaLengkap,
        email: email,
        whatsapp_number: whatsapp,
        nik_ktp: nik,
        gender: jenisKelamin,
        blood_type: golonganDarah,
        emergency_contact_name: namaDarurat,
        emergency_contact_phone: hpDarurat
      }]);

    if (participantError) throw new Error(`Gagal menyimpan peserta: ${participantError.message}`);

    // 5. Minta Token ke Midtrans jika penyimpanan database sukses
    let snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount
      },
      item_details: [
        { id: "TIKET-1", price: basePrice, quantity: 1, name: isEarlyBird ? "Tiket 5K (Early Bird)" : "Tiket 5K (Normal)" },
        { id: "FEE-1", price: adminFee, quantity: 1, name: "Biaya Layanan" }
      ],
      customer_details: {
        first_name: namaLengkap,
        email: email,
        phone: whatsapp
      },
      custom_expiry: {
        order_time: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' +0700',
        expiry_duration: 30, // Tiket kedaluwarsa dalam 30 menit
        unit: "minute"
      }
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token, orderId });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Gagal memproses pembayaran" }, { status: 500 });
  }
}