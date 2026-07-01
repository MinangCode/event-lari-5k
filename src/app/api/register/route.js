import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Kunci Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Kunci Server Midtrans
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Simpan data ke Supabase (Status default: BELUM_BAYAR)
    const { data, error } = await supabase
      .from("peserta_lari")
      .insert([
        {
          nama_lengkap: body.nama_lengkap,
          nik: body.nik,
          email: body.email,
          no_whatsapp: body.no_whatsapp,
          ukuran_jersey: body.ukuran_jersey,
          golongan_darah: body.golongan_darah,
          riwayat_medis: body.riwayat_medis,
          kontak_darurat_nama: body.kontak_darurat_nama,
          kontak_darurat_hp: body.kontak_darurat_hp,
        }
      ])
      .select();

    if (error) throw error;

    const peserta = data[0];
    
    // 2. Siapkan parameter untuk Midtrans
    // Kita gunakan ID dari Supabase agar datanya sinkron
    const orderId = `RUN5K-${peserta.id}`; 
    const authString = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');
    
    const midtransData = {
      transaction_details: {
        order_id: orderId,
        gross_amount: 150000 // UBAH ANGKA INI SESUAI HARGA TIKET ACARA ANDA
      },
      customer_details: {
        first_name: peserta.nama_lengkap,
        email: peserta.email,
        phone: peserta.no_whatsapp
      }
    };

    // 3. Minta Token Snap (Pop-up) ke Midtrans Sandbox
    const midtransResponse = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(midtransData)
    });

    const midtransResult = await midtransResponse.json();

    if (!midtransResponse.ok) {
      throw new Error(midtransResult.error_messages?.[0] || 'Gagal membuat tagihan Midtrans');
    }

    // 4. Kirim token ke Front-End
    return NextResponse.json({ 
      success: true, 
      token: midtransResult.token,
      order_id: orderId
    });

  } catch (error) {
    console.error("Sistem Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}