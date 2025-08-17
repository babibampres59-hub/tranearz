import { Warga, Bantuan, Pengumuman, Permohonan, InfoDesa, TargetBantuan, Dusun, KartuKeluarga, QrData, LogAktivitas, UMKM, Adminduk, AdmindukDocumentType, Dokumen } from '../types';

// --- MOCK DATABASE (using localStorage) ---

const getFromStorage = <T>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) {
        saveToStorage(key, defaultValue);
        return defaultValue;
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error(`Gagal mem-parsing ${key} dari localStorage`, e);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// --- LOGGING ---
const addLog = (aktivitas: string) => {
    const logs = getFromStorage<LogAktivitas[]>('logAktivitas', []);
    const newLog: LogAktivitas = {
        id: `log-${Date.now()}`,
        tanggal: new Date().toISOString(),
        pengguna: 'admin',
        aktivitas,
    };
    const updatedLogs = [newLog, ...logs].slice(0, 100); // Keep max 100 logs
    saveToStorage('logAktivitas', updatedLogs);
};


// --- INITIAL MOCK DATA ---
const initialDusun: Dusun[] = [
    { id: 'dusun-1', nama: 'Krajan' },
    { id: 'dusun-2', nama: 'Pojok' },
    { id: 'dusun-3', nama: 'Gebang' },
];

const initialWarga: Warga[] = [
    { id: 'warga-1', nama: 'Budi Santoso', nik: '3509211204850001', tempatLahir: 'Jember', tanggalLahir: '1985-04-12', pekerjaan: 'Petani', dusun: 'Krajan', rt: '01', rw: '01', desa: 'Sukamakmur', kecamatan: 'Ajung', kabupaten: 'Jember', provinsi: 'Jawa Timur', kartuKeluargaId: 'kk-1', bantuan: { blt: true, pkh: false, lainnya: false } },
    { id: 'warga-2', nama: 'Siti Aminah', nik: '3509215507920002', tempatLahir: 'Banyuwangi', tanggalLahir: '1992-07-25', pekerjaan: 'Wiraswasta', dusun: 'Pojok', rt: '03', rw: '02', desa: 'Sukamakmur', kecamatan: 'Ajung', kabupaten: 'Jember', provinsi: 'Jawa Timur', kartuKeluargaId: 'kk-2', bantuan: { blt: false, pkh: true, lainnya: false } },
    { id: 'warga-3', nama: 'Joko Susilo', nik: '3509210101700003', tempatLahir: 'Jember', tanggalLahir: '1970-01-01', pekerjaan: 'Buruh Tani', dusun: 'Gebang', rt: '02', rw: '03', desa: 'Sukamakmur', kecamatan: 'Ajung', kabupaten: 'Jember', provinsi: 'Jawa Timur', kartuKeluargaId: 'kk-2', bantuan: { blt: true, pkh: true, lainnya: true } },
    { id: 'warga-4', nama: 'Dewi Lestari', nik: '3509214506880004', tempatLahir: 'Jember', tanggalLahir: '1988-06-05', pekerjaan: 'Ibu Rumah Tangga', dusun: 'Krajan', rt: '01', rw: '01', desa: 'Sukamakmur', kecamatan: 'Ajung', kabupaten: 'Jember', provinsi: 'Jawa Timur', kartuKeluargaId: 'kk-1', bantuan: { blt: false, pkh: false, lainnya: false } },
];

const initialKartuKeluarga: KartuKeluarga[] = [
    { id: 'kk-1', nomorKK: '3509211001090001', kepalaKeluargaId: 'warga-1', alamat: 'Dusun Krajan, RT 01/RW 01, Desa Sukamakmur', anggotaIds: ['warga-1', 'warga-4'], tanggalCetak: '2022-08-10' },
    { id: 'kk-2', nomorKK: '3509212003110007', kepalaKeluargaId: 'warga-2', alamat: 'Dusun Pojok, RT 03/RW 02, Desa Sukamakmur', anggotaIds: ['warga-2', 'warga-3'], tanggalCetak: '2023-01-15' },
];

const initialBantuan: Bantuan[] = [
    { id: 'bantuan-1', wargaId: 'warga-1', jenis: 'BLT', tahun: 2024, nominal: 300000, keterangan: 'Penyaluran tahap 1' },
    { id: 'bantuan-2', wargaId: 'warga-2', jenis: 'PKH', tahun: 2024, nominal: 750000, keterangan: 'Bantuan pendidikan anak' },
    { id: 'bantuan-3', wargaId: 'warga-3', jenis: 'BPNT', tahun: 2025, nominal: 200000, keterangan: 'Bantuan pangan' },
    { id: 'bantuan-4', wargaId: 'warga-3', jenis: 'KIS', tahun: 2025, nominal: 42000, keterangan: 'Iuran bulanan' },
];

const initialPengumuman: Pengumuman[] = [
    { id: 'pengumuman-1', judul: 'Jadwal Posyandu Balita', isi: 'Diberitahukan kepada seluruh warga yang memiliki balita, jadwal Posyandu bulan ini akan dilaksanakan pada tanggal 15 Mei 2024 di Balai Desa.', tanggal: '2024-05-10T10:00:00Z' },
    { id: 'pengumuman-2', judul: 'Kerja Bakti Desa', isi: 'Dalam rangka menyambut hari kemerdekaan, akan diadakan kerja bakti serentak pada hari Minggu, 11 Agustus 2024. Diharapkan partisipasi seluruh warga.', tanggal: '2024-08-01T15:30:00Z' },
];

const initialPermohonan: Permohonan[] = [
    { id: 'permohonan-1', wargaId: 'warga-4', wargaNama: 'Dewi Lestari', field: 'pekerjaan', dataLama: 'Ibu Rumah Tangga', dataBaru: 'Penjahit', tanggal: '2024-05-20T09:00:00Z', status: 'Menunggu' },
];

const initialInfoDesa: InfoDesa = {
    namaDesa: 'Sukamakmur',
    kepalaDesa: 'Ahmad Subagyo',
    dusun: initialDusun,
};

const initialTargetBantuan: TargetBantuan[] = [
    { tahun: 2024, totalAnggaran: 50000000, targetPenerima: 150 },
    { tahun: 2025, totalAnggaran: 60000000, targetPenerima: 160 },
];

const initialLogAktivitas: LogAktivitas[] = [];

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U1ZTdlZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTZweCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Rm90byBVc2FoYTwvdGV4dD4KPC9zdmc+';

const initialUmkm: UMKM[] = [
    { id: 'umkm-1', namaUsaha: 'Warung Makan Bu Siti', pemilikId: 'warga-2', jenisUsaha: 'Kuliner', deskripsi: 'Menjual aneka masakan rumahan, nasi campur, dan minuman segar.', fotoUrl: placeholderImage },
    { id: 'umkm-2', namaUsaha: 'Kerajinan Bambu Pak Budi', pemilikId: 'warga-1', jenisUsaha: 'Kerajinan', deskripsi: 'Membuat dan menjual berbagai kerajinan tangan dari bambu, seperti kursi, meja, dan hiasan dinding.', fotoUrl: placeholderImage },
];

const fakePdfUrl = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL1BhZ2VzL0NvdW50IDEvS2lkcyBbMyAwIFJdID4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94IFswIDAgNTk1IDg0Ml0vQ29udGVudHMgNCAwIFIvUmVzb3VyY2VzIDw8L0ZvbnQgPDwvRjEgNSAwIFI+PiA+PiA+PgplbmRvYmoKNSAwIG9iago8PC9UeXBlIC9Gb250L1N1YnR5cGUgL1R5cGUxL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDU5Pj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihJbmkgYWRhbGFoIGRva3VtZW4gc2ltdWxhc2kpcyBURgoKVGoCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjMgMDAwMDAgbiAKMDAwMDAwMDA5NiAwMDAwMCBuIAowMDAwMDAwMjQ5IDAwMDAwIG4gCjAwMDAwMDAxODAgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKMzEwCiUlRU9GCg==';
const fakeImageUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const initialAdminduk: Adminduk[] = [
    {
        id: 'warga-1', // Budi Santoso
        kk: { fileName: 'KK_Budi_Santoso.pdf', dataUrl: fakePdfUrl, uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        ktp: { fileName: 'KTP_Budi_Santoso.jpg', dataUrl: fakeImageUrl, uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        aktaLahir: null,
        bpjs: null,
        kip: null,
    },
    {
        id: 'warga-2', // Siti Aminah
        kk: null,
        ktp: { fileName: 'KTP_Siti_Aminah.jpg', dataUrl: fakeImageUrl, uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
        aktaLahir: { fileName: 'AKTA_SITI.pdf', dataUrl: fakePdfUrl, uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
        bpjs: { fileName: 'BPJS_12345.pdf', dataUrl: fakePdfUrl, uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        kip: null,
    }
];


// --- MOCK API SIMULATOR ---

const SIMULATED_LATENCY = 300; // ms

// A helper to simulate a network request
function simulateRequest<T>(dataFactory: () => T, fail: boolean = false): Promise<T> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (fail) {
                reject(new Error('Operasi gagal. Terjadi kesalahan pada server simulasi.'));
            } else {
                try {
                    const data = dataFactory();
                    // deep copy to prevent mutation issues
                    resolve(JSON.parse(JSON.stringify(data)));
                } catch (e) {
                    reject(e);
                }
            }
        }, SIMULATED_LATENCY);
    });
}

// === API Functions ===

// Log Aktivitas
export const getLogAktivitas = () => simulateRequest(() => getFromStorage('logAktivitas', initialLogAktivitas));

// InfoDesa
export const getInfoDesa = () => simulateRequest(() => getFromStorage('infoDesa', initialInfoDesa));
export const updateInfoDesa = (data: InfoDesa) => simulateRequest(() => {
    const oldInfo = getFromStorage<InfoDesa>('infoDesa', initialInfoDesa);
    const renamedDusunMap = new Map<string, string>();
    oldInfo.dusun.forEach(oldDusun => {
        const newDusun = data.dusun.find(d => d.id === oldDusun.id);
        if (newDusun && newDusun.nama !== oldDusun.nama) {
            renamedDusunMap.set(oldDusun.nama, newDusun.nama);
        }
    });

    if (renamedDusunMap.size > 0) {
        let warga = getFromStorage<Warga[]>('warga', []);
        warga = warga.map(w => {
            if (renamedDusunMap.has(w.dusun)) {
                return { ...w, dusun: renamedDusunMap.get(w.dusun)! };
            }
            return w;
        });
        saveToStorage('warga', warga);
    }
    
    // Preserve API key when updating other info
    const currentApiKey = oldInfo.apiKey;
    const updatedData = { ...data, apiKey: currentApiKey };

    saveToStorage('infoDesa', updatedData);
    addLog('Memperbarui informasi desa.');
    return updatedData;
});

// Warga
export const getWarga = () => simulateRequest(() => getFromStorage('warga', initialWarga));
export const addWarga = (data: Omit<Warga, 'id' | 'bantuan'>) => simulateRequest(() => {
    const warga = getFromStorage<Warga[]>('warga', []);
    const newWarga: Warga = { 
        ...data, 
        id: `warga-${Date.now()}`,
        bantuan: { blt: false, pkh: false, lainnya: false } 
    };
    const updated = [...warga, newWarga];
    saveToStorage('warga', updated);
    addLog(`Menambahkan warga baru: ${newWarga.nama}`);
    return newWarga;
});
export const updateWarga = (id: string, data: Warga) => simulateRequest(() => {
    const warga = getFromStorage<Warga[]>('warga', []);
    const updated = warga.map(w => w.id === id ? data : w);
    saveToStorage('warga', updated);
    addLog(`Memperbarui data warga: ${data.nama}`);
    return data;
});
export const deleteWarga = (id: string) => simulateRequest(() => {
    let warga = getFromStorage<Warga[]>('warga', []);
    const wargaToDelete = warga.find(w => w.id === id);
    warga = warga.filter(w => w.id !== id);
    saveToStorage('warga', warga);

    // Also delete associated adminduk data
    let admindukData = getFromStorage<Adminduk[]>('adminduk', []);
    admindukData = admindukData.filter(a => a.id !== id);
    saveToStorage('adminduk', admindukData);

    if (wargaToDelete) {
        addLog(`Menghapus warga: ${wargaToDelete.nama}`);
    }
    return {};
});

// Bantuan
export const getBantuan = () => simulateRequest(() => getFromStorage('bantuan', initialBantuan));
export const addBantuan = (data: Omit<Bantuan, 'id'>) => simulateRequest(() => {
    const bantuan = getFromStorage<Bantuan[]>('bantuan', []);
    const newBantuan: Bantuan = { ...data, id: `bantuan-${Date.now()}` };
    const updated = [newBantuan, ...bantuan];
    const wargaPenerima = getFromStorage<Warga[]>('warga', []).find(w => w.id === data.wargaId);
    saveToStorage('bantuan', updated);
    addLog(`Menyalurkan bantuan ${data.jenis} kepada ${wargaPenerima?.nama || 'N/A'}`);
    return newBantuan;
});
export const updateBantuan = (id: string, data: Bantuan) => simulateRequest(() => {
    const bantuan = getFromStorage<Bantuan[]>('bantuan', []);
    const updated = bantuan.map(b => b.id === id ? data : b);
    const wargaPenerima = getFromStorage<Warga[]>('warga', []).find(w => w.id === data.wargaId);
    saveToStorage('bantuan', updated);
    addLog(`Memperbarui data bantuan ${data.jenis} untuk ${wargaPenerima?.nama || 'N/A'}`);
    return data;
});
export const deleteBantuan = (id: string) => simulateRequest(() => {
    let bantuan = getFromStorage<Bantuan[]>('bantuan', []);
    const bToDelete = bantuan.find(b => b.id === id);
    bantuan = bantuan.filter(b => b.id !== id);
    saveToStorage('bantuan', bantuan);
    if (bToDelete) {
        const wargaPenerima = getFromStorage<Warga[]>('warga', []).find(w => w.id === bToDelete.wargaId);
        addLog(`Menghapus data bantuan ${bToDelete.jenis} untuk ${wargaPenerima?.nama || 'N/A'}`);
    }
    return {};
});
export const getTargetBantuan = () => simulateRequest(() => getFromStorage('targetBantuan', initialTargetBantuan));
export const updateTargetBantuan = (data: TargetBantuan) => simulateRequest(() => {
    let targets = getFromStorage<TargetBantuan[]>('targetBantuan', []);
    const index = targets.findIndex(t => t.tahun === data.tahun);
    if (index > -1) {
        targets[index] = data;
    } else {
        targets.push(data);
    }
    saveToStorage('targetBantuan', targets);
    addLog(`Memperbarui target bantuan tahun ${data.tahun}.`);
    return data;
});

// Pengumuman
export const getPengumuman = () => simulateRequest(() => getFromStorage('pengumuman', initialPengumuman));
export const addPengumuman = (data: Omit<Pengumuman, 'id' | 'tanggal'>) => simulateRequest(() => {
    const pengumuman = getFromStorage<Pengumuman[]>('pengumuman', []);
    const newPengumuman: Pengumuman = { ...data, id: `pengumuman-${Date.now()}`, tanggal: new Date().toISOString() };
    const updated = [newPengumuman, ...pengumuman];
    saveToStorage('pengumuman', updated);
    addLog(`Menerbitkan pengumuman baru: "${newPengumuman.judul}"`);
    return newPengumuman;
});
export const updatePengumuman = (id: string, data: Omit<Pengumuman, 'id' | 'tanggal'>) => simulateRequest(() => {
    const pengumuman = getFromStorage<Pengumuman[]>('pengumuman', []);
    let updatedPengumuman: Pengumuman | undefined;
    const updated = pengumuman.map(p => {
        if (p.id === id) {
            // Retain original date, only update title and content
            updatedPengumuman = { ...p, judul: data.judul, isi: data.isi };
            return updatedPengumuman;
        }
        return p;
    });
    if (!updatedPengumuman) {
        throw new Error("Pengumuman tidak ditemukan");
    }
    saveToStorage('pengumuman', updated);
    addLog(`Memperbarui pengumuman: "${data.judul}"`);
    return updatedPengumuman;
});
export const deletePengumuman = (id: string) => simulateRequest(() => {
    let pengumuman = getFromStorage<Pengumuman[]>('pengumuman', []);
    const pToDelete = pengumuman.find(p => p.id === id);
    pengumuman = pengumuman.filter(p => p.id !== id);
    saveToStorage('pengumuman', pengumuman);
    if(pToDelete) {
        addLog(`Menghapus pengumuman: "${pToDelete.judul}"`);
    }
    return {};
});

// Permohonan
export const getPermohonan = () => simulateRequest(() => getFromStorage('permohonan', initialPermohonan));
export const updatePermohonanStatus = (id: string, status: 'Disetujui' | 'Ditolak') => simulateRequest(() => {
    const permohonan = getFromStorage<Permohonan[]>('permohonan', []);
    let updatedPermohonan: Permohonan | undefined;
    const updated = permohonan.map(p => {
        if (p.id === id) {
            updatedPermohonan = { ...p, status };
            return updatedPermohonan;
        }
        return p;
    });
    
    // Jika disetujui, perbarui data Warga terkait
    if (status === 'Disetujui' && updatedPermohonan) {
        const { wargaId, field, dataBaru } = updatedPermohonan;
        let warga = getFromStorage<Warga[]>('warga', []);
        warga = warga.map(w => {
            if (w.id === wargaId) {
                return { ...w, [field]: dataBaru };
            }
            return w;
        });
        saveToStorage('warga', warga);
    }

    saveToStorage('permohonan', updated);
    if (!updatedPermohonan) {
        throw new Error("Permohonan tidak ditemukan");
    }
    addLog(`Memproses permohonan data untuk ${updatedPermohonan.wargaNama} menjadi '${status}'.`);
    return updatedPermohonan;
});
export const addPermohonan = () => simulateRequest(() => {
    const allPermohonan = getFromStorage<Permohonan[]>('permohonan', []);
    const allWarga = getFromStorage<Warga[]>('warga', []);

    if (allWarga.length === 0) {
        throw new Error("Tidak ada data warga untuk membuat permohonan.");
    }
    
    const randomWarga = allWarga[Math.floor(Math.random() * allWarga.length)];
    
    const fields: (keyof Warga)[] = ['pekerjaan', 'dusun', 'rt', 'rw'];
    const randomField = fields[Math.floor(Math.random() * fields.length)];
    
    const newPermohonan: Permohonan = {
        id: `permohonan-${Date.now()}`,
        wargaId: randomWarga.id,
        wargaNama: randomWarga.nama,
        field: randomField,
        dataLama: randomWarga[randomField]?.toString() || 'N/A',
        dataBaru: `Data Baru ${Math.floor(Math.random() * 100)}`,
        tanggal: new Date().toISOString(),
        status: 'Menunggu',
    };

    const updated = [newPermohonan, ...allPermohonan];
    saveToStorage('permohonan', updated);
    addLog(`Menambahkan permohonan data simulasi untuk ${newPermohonan.wargaNama}.`);
    return newPermohonan;
});


// API Key Management
export const generateApiKey = () => simulateRequest(() => {
    const info = getFromStorage('infoDesa', initialInfoDesa);
    const newKey = `desa_skm_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const updatedInfo = { ...info, apiKey: newKey };
    saveToStorage('infoDesa', updatedInfo);
    addLog(`Membuat Kode Koneksi (API Key) baru.`);
    return updatedInfo;
});

export const revokeApiKey = () => simulateRequest(() => {
    const info = getFromStorage('infoDesa', initialInfoDesa);
    const updatedInfo: InfoDesa = { ...info, apiKey: undefined };
    delete updatedInfo.apiKey; // ensure key is removed
    saveToStorage('infoDesa', updatedInfo);
    addLog(`Mencabut Kode Koneksi (API Key).`);
    return updatedInfo;
});

// Kartu Keluarga
export const getKartuKeluarga = () => simulateRequest(() => getFromStorage('kartuKeluarga', initialKartuKeluarga));
export const addKartuKeluargaFromQR = (qrData: QrData) => simulateRequest(() => {
    const allKK = getFromStorage<KartuKeluarga[]>('kartuKeluarga', []);
    if (allKK.some(kk => kk.nomorKK === qrData.nomorKK)) {
        throw new Error(`Kartu Keluarga dengan nomor ${qrData.nomorKK} sudah terdaftar.`);
    }

    let allWarga = getFromStorage<Warga[]>('warga', []);
    const newWargaIds: string[] = [];

    qrData.anggota.forEach(anggotaFromQR => {
        let warga = allWarga.find(w => w.nik === anggotaFromQR.nik);
        if (warga) {
            // Warga already exists
            newWargaIds.push(warga.id);
        } else {
            // Add new warga
            const newWarga: Warga = {
                ...anggotaFromQR,
                id: `warga-${Date.now()}-${Math.random()}`,
                bantuan: { blt: false, pkh: false, lainnya: false }
            };
            allWarga.push(newWarga);
            newWargaIds.push(newWarga.id);
        }
    });

    const kepalaKeluarga = allWarga.find(w => w.nik === qrData.kepalaKeluarga.nik);
    if (!kepalaKeluarga) {
        throw new Error("Kepala keluarga tidak ditemukan di antara anggota.");
    }

    const newKK: KartuKeluarga = {
        id: `kk-${Date.now()}`,
        nomorKK: qrData.nomorKK,
        kepalaKeluargaId: kepalaKeluarga.id,
        alamat: qrData.alamat,
        tanggalCetak: qrData.tanggalCetak,
        anggotaIds: newWargaIds,
    };
    
    // Update kartuKeluargaId for all members
    const updatedWarga = allWarga.map(w => {
        if (newWargaIds.includes(w.id)) {
            return { ...w, kartuKeluargaId: newKK.id };
        }
        return w;
    });

    saveToStorage('kartuKeluarga', [newKK, ...allKK]);
    saveToStorage('warga', updatedWarga);
    addLog(`Menambahkan Kartu Keluarga baru dari QR (${qrData.nomorKK}) an. ${kepalaKeluarga.nama}.`);
    
    return { newKK, updatedWarga };
});

export const deleteKartuKeluarga = (id: string) => simulateRequest(() => {
    const allKK = getFromStorage<KartuKeluarga[]>('kartuKeluarga', []);
    const kkToDelete = allKK.find(kk => kk.id === id);
    if (!kkToDelete) {
        throw new Error("Kartu Keluarga tidak ditemukan.");
    }
    
    const updatedKK = allKK.filter(kk => kk.id !== id);
    saveToStorage('kartuKeluarga', updatedKK);
    
    // Unlink warga from the deleted KK
    let allWarga = getFromStorage<Warga[]>('warga', []);
    const updatedWarga = allWarga.map(w => {
        if (kkToDelete.anggotaIds.includes(w.id)) {
            const { kartuKeluargaId, ...rest } = w;
            return rest;
        }
        return w;
    });
    saveToStorage('warga', updatedWarga);
    addLog(`Menghapus Kartu Keluarga: ${kkToDelete.nomorKK}.`);
    return updatedWarga;
});

// UMKM
export const getUmkm = () => simulateRequest(() => getFromStorage('umkm', initialUmkm));
export const addUmkm = (data: Omit<UMKM, 'id'>) => simulateRequest(() => {
    const umkm = getFromStorage<UMKM[]>('umkm', []);
    const newUmkm: UMKM = { ...data, id: `umkm-${Date.now()}` };
    const updated = [newUmkm, ...umkm];
    saveToStorage('umkm', updated);
    addLog(`Menambahkan UMKM baru: "${newUmkm.namaUsaha}"`);
    return newUmkm;
});
export const updateUmkm = (id: string, data: UMKM) => simulateRequest(() => {
    const umkm = getFromStorage<UMKM[]>('umkm', []);
    const updated = umkm.map(u => u.id === id ? data : u);
    saveToStorage('umkm', updated);
    addLog(`Memperbarui data UMKM: "${data.namaUsaha}"`);
    return data;
});
export const deleteUmkm = (id: string) => simulateRequest(() => {
    let umkm = getFromStorage<UMKM[]>('umkm', []);
    const umkmToDelete = umkm.find(u => u.id === id);
    umkm = umkm.filter(u => u.id !== id);
    saveToStorage('umkm', umkm);
    if (umkmToDelete) {
        addLog(`Menghapus UMKM: "${umkmToDelete.namaUsaha}"`);
    }
    return {};
});

// Adminduk
export const getAdminduk = () => simulateRequest(() => {
    const allWarga = getFromStorage<Warga[]>('warga', initialWarga);
    let allAdminduk = getFromStorage<Adminduk[]>('adminduk', initialAdminduk);
    const admindukMap = new Map(allAdminduk.map(a => [a.id, a]));
    let hasChanges = false;

    allWarga.forEach(warga => {
        if (!admindukMap.has(warga.id)) {
            const newAdmindukData: Adminduk = {
                id: warga.id,
                kk: null,
                ktp: null,
                aktaLahir: null,
                bpjs: null,
                kip: null,
            };
            allAdminduk.push(newAdmindukData);
            hasChanges = true;
        }
    });

    if (hasChanges) {
        saveToStorage('adminduk', allAdminduk);
    }

    return allAdminduk;
});

export const updateAdmindukDocument = (wargaId: string, docType: AdmindukDocumentType, doc: Dokumen) => simulateRequest(() => {
    const allAdminduk = getFromStorage<Adminduk[]>('adminduk', []);
    let wargaAdminduk = allAdminduk.find(a => a.id === wargaId);

    if (wargaAdminduk) {
        wargaAdminduk[docType] = doc;
    } else {
        const newAdmindukData: Adminduk = {
            id: wargaId,
            kk: null,
            ktp: null,
            aktaLahir: null,
            bpjs: null,
            kip: null,
            [docType]: doc,
        };
        allAdminduk.push(newAdmindukData);
    }

    const warga = getFromStorage<Warga[]>('warga', []).find(w => w.id === wargaId);
    saveToStorage('adminduk', allAdminduk);
    addLog(`Mengunggah dokumen '${docType}' untuk warga ${warga?.nama || 'N/A'}`);
    return allAdminduk;
});

export const deleteAdmindukDocument = (wargaId: string, docType: AdmindukDocumentType) => simulateRequest(() => {
    const allAdminduk = getFromStorage<Adminduk[]>('adminduk', []);
    const wargaAdminduk = allAdminduk.find(a => a.id === wargaId);

    if (wargaAdminduk) {
        wargaAdminduk[docType] = null;
    } else {
        console.warn(`No adminduk data found for wargaId: ${wargaId} to delete document.`);
        return allAdminduk;
    }

    const warga = getFromStorage<Warga[]>('warga', []).find(w => w.id === wargaId);
    saveToStorage('adminduk', allAdminduk);
    addLog(`Menghapus dokumen '${docType}' milik warga ${warga?.nama || 'N/A'}`);
    return allAdminduk;
});