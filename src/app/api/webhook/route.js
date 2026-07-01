import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Mengambil kunci Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();

    // Mengambil data laporan dari Midtrans
    const { order_id, transaction_status, fraud_status } = body;

    // Jika statusnya 'settlement' (lunas) atau 'capture' (berhasil ditarik)
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        
        // Memisahkan kata "RUN5K-" agar kita mendapatkan ID asli Supabase-nya
        const supabaseId = order_id.replace('RUN5K-', '');

        // Mengubah status di database menjadi LUNAS
        const { error } = await supabase
          .from('peserta_lari')
          .update({ status_pembayaran: 'LUNAS' })
          .eq('id', supabaseId);

        if (error) {
          throw error;
        }
      }
    }

    // Midtrans hanya butuh jawaban "OK / 200" agar mereka tahu laporannya sudah diterima
    return NextResponse.json({ success: true, message: "Webhook diterima" });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}