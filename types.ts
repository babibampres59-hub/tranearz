export interface Bantuan {
  id: string;
  wargaId: string;
  jenis: 'BLT' | 'PKH' | 'BPNT' | 'KIS' | 'Lainnya';
  tahun: number;
  nominal: number;
  keterangan?: string;
}

export interface Warga {
  id: string;
  nama: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  pekerjaan: string;
  dusun: string;
  rt: string;
  rw: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kartuKeluargaId?: string; // Relasi ke KartuKeluarga
  bantuan: {
    blt: boolean;
    pkh: boolean;
    lainnya: boolean;
  };
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string; // ISO 8601 Date
}

export interface Permohonan {
  id: string;
  wargaId: string;
  wargaNama: string;
  field: keyof Warga;
  dataLama: string;
  dataBaru: string;
  tanggal: string; // ISO 8601 Date
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
}

export interface Dusun {
  id: string;
  nama: string;
}

export interface InfoDesa {
  namaDesa: string;
  kepalaDesa: string;
  dusun: Dusun[];
  apiKey?: string;
}

export interface TargetBantuan {
  tahun: number;
  totalAnggaran: number;
  targetPenerima: number;
}

export interface KartuKeluarga {
  id: string;
  nomorKK: string;
  kepalaKeluargaId: string;
  alamat: string;
  anggotaIds: string[];
  tanggalCetak: string;
}

// Type for data parsed from QR code
export interface QrData {
  nomorKK: string;
  kepalaKeluarga: Warga;
  anggota: Warga[];
  alamat: string;
  tanggalCetak: string;
}

export interface LogAktivitas {
  id: string;
  tanggal: string; // ISO 8601 Date
  pengguna: string;
  aktivitas: string;
}

export interface UMKM {
  id: string;
  namaUsaha: string;
  pemilikId: string;
  jenisUsaha: string;
  deskripsi: string;
  fotoUrl: string; // Base64 Data URL
}

export type AdmindukDocumentType = 'kk' | 'ktp' | 'aktaLahir' | 'bpjs' | 'kip';

export interface Dokumen {
  fileName: string;
  dataUrl: string; // base64
  uploadedAt: string;
}

export interface Adminduk {
  id: string; // Corresponds to Warga ID
  kk: Dokumen | null;
  ktp: Dokumen | null;
  aktaLahir: Dokumen | null;
  bpjs: Dokumen | null;
  kip: Dokumen | null;
}
