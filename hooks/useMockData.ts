import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Warga, Bantuan, Pengumuman, Permohonan, InfoDesa, TargetBantuan, KartuKeluarga, QrData, LogAktivitas, UMKM, Adminduk, AdmindukDocumentType, Dokumen } from '../types';
import * as api from '../services/api';

// Helper for localStorage caching
const getFromCache = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading from cache key ${key}:`, error);
        return null;
    }
};

const saveToCache = <T>(key: string, data: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving to cache key ${key}:`, error);
    }
};

// Context definition
interface DataContextType {
  warga: Warga[];
  bantuan: Bantuan[];
  pengumuman: Pengumuman[];
  permohonan: Permohonan[];
  infoDesa: InfoDesa | null;
  targetBantuan: TargetBantuan[];
  kartuKeluarga: KartuKeluarga[];
  logAktivitas: LogAktivitas[];
  umkm: UMKM[];
  adminduk: Adminduk[];
  
  loading: boolean;
  error: string | null;
  
  addWarga: (w: Omit<Warga, 'id' | 'bantuan'>) => Promise<void>;
  updateWarga: (w: Warga) => Promise<void>;
  deleteWarga: (id: string) => Promise<void>;
  
  addBantuan: (b: Omit<Bantuan, 'id'>) => Promise<void>;
  updateBantuan: (b: Bantuan) => Promise<void>;
  deleteBantuan: (id: string) => Promise<void>;
  
  updateTargetBantuan: (t: TargetBantuan) => Promise<void>;
  
  addPengumuman: (p: Omit<Pengumuman, 'id' | 'tanggal'>) => Promise<void>;
  updatePengumuman: (id: string, p: Omit<Pengumuman, 'id' | 'tanggal'>) => Promise<void>;
  deletePengumuman: (id: string) => Promise<void>;
  
  updatePermohonanStatus: (id: string, status: 'Disetujui' | 'Ditolak') => Promise<void>;
  addPermohonan: () => Promise<void>;
  
  updateInfoDesa: (info: InfoDesa) => Promise<void>;
  
  generateApiKey: () => Promise<void>;
  revokeApiKey: () => Promise<void>;
  
  addKartuKeluargaFromQR: (data: QrData) => Promise<void>;
  deleteKartuKeluarga: (id: string) => Promise<void>;
  
  addUmkm: (u: Omit<UMKM, 'id'>) => Promise<void>;
  updateUmkm: (u: UMKM) => Promise<void>;
  deleteUmkm: (id: string) => Promise<void>;

  updateAdmindukDocument: (wargaId: string, docType: AdmindukDocumentType, doc: Dokumen) => Promise<void>;
  deleteAdmindukDocument: (wargaId: string, docType: AdmindukDocumentType) => Promise<void>;

  reloadData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [warga, setWarga] = useState<Warga[]>(() => getFromCache('warga') || []);
    const [bantuan, setBantuan] = useState<Bantuan[]>(() => getFromCache('bantuan') || []);
    const [pengumuman, setPengumuman] = useState<Pengumuman[]>(() => getFromCache('pengumuman') || []);
    const [permohonan, setPermohonan] = useState<Permohonan[]>(() => getFromCache('permohonan') || []);
    const [infoDesa, setInfoDesa] = useState<InfoDesa | null>(() => getFromCache('infoDesa') || null);
    const [targetBantuan, setTargetBantuan] = useState<TargetBantuan[]>(() => getFromCache('targetBantuan') || []);
    const [kartuKeluarga, setKartuKeluarga] = useState<KartuKeluarga[]>(() => getFromCache('kartuKeluarga') || []);
    const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(() => getFromCache('logAktivitas') || []);
    const [umkm, setUmkm] = useState<UMKM[]>(() => getFromCache('umkm') || []);
    const [adminduk, setAdminduk] = useState<Adminduk[]>(() => getFromCache('adminduk') || []);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        // Don't set loading to true on refetch if we already have cached data
        if (!infoDesa) {
            setLoading(true);
        }
        setError(null);
        try {
            const [wargaData, bantuanData, pengumumanData, permohonanData, infoDesaData, targetBantuanData, kkData, logAktivitasData, umkmData, admindukData] = await Promise.all([
                api.getWarga(),
                api.getBantuan(),
                api.getPengumuman(),
                api.getPermohonan(),
                api.getInfoDesa(),
                api.getTargetBantuan(),
                api.getKartuKeluarga(),
                api.getLogAktivitas(),
                api.getUmkm(),
                api.getAdminduk(),
            ]);
            
            setWarga(wargaData); saveToCache('warga', wargaData);
            setBantuan(bantuanData); saveToCache('bantuan', bantuanData);
            setPengumuman(pengumumanData); saveToCache('pengumuman', pengumumanData);
            setPermohonan(permohonanData); saveToCache('permohonan', permohonanData);
            setInfoDesa(infoDesaData); saveToCache('infoDesa', infoDesaData);
            setTargetBantuan(targetBantuanData); saveToCache('targetBantuan', targetBantuanData);
            setKartuKeluarga(kkData); saveToCache('kartuKeluarga', kkData);
            setLogAktivitas(logAktivitasData); saveToCache('logAktivitas', logAktivitasData);
            setUmkm(umkmData); saveToCache('umkm', umkmData);
            setAdminduk(admindukData); saveToCache('adminduk', admindukData);

        } catch (e: any) {
            setError(e.message || 'Gagal memuat data dari server.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [infoDesa]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addWarga = async (w: Omit<Warga, 'id' | 'bantuan'>) => {
        await api.addWarga(w);
        await fetchData();
    };

    const updateWarga = async (w: Warga) => {
        await api.updateWarga(w.id, w);
        await fetchData();
    };

    const deleteWarga = async (id: string) => {
        await api.deleteWarga(id);
        await fetchData();
    };
    
    const addBantuan = async (b: Omit<Bantuan, 'id'>) => {
        await api.addBantuan(b);
        await fetchData();
    };

    const updateBantuan = async (b: Bantuan) => {
        await api.updateBantuan(b.id, b);
        await fetchData();
    };

    const deleteBantuan = async (id: string) => {
        await api.deleteBantuan(id);
        await fetchData();
    };
    
    const updateTargetBantuan = async (t: TargetBantuan) => {
        await api.updateTargetBantuan(t);
        await fetchData();
    };

    const addPengumuman = async (p: Omit<Pengumuman, 'id' | 'tanggal'>) => {
        await api.addPengumuman(p);
        await fetchData();
    };

    const updatePengumuman = async (id: string, p: Omit<Pengumuman, 'id' | 'tanggal'>) => {
        await api.updatePengumuman(id, p);
        await fetchData();
    };

    const deletePengumuman = async (id: string) => {
        await api.deletePengumuman(id);
        await fetchData();
    };

    const updatePermohonanStatus = async (id: string, status: 'Disetujui' | 'Ditolak') => {
        await api.updatePermohonanStatus(id, status);
        await fetchData();
    };
    
    const addPermohonan = async () => {
        await api.addPermohonan();
        await fetchData();
    };
    
    const updateInfoDesa = async (info: InfoDesa) => {
        await api.updateInfoDesa(info);
        await fetchData();
    };
    
    const generateApiKey = async () => {
        await api.generateApiKey();
        await fetchData();
    };

    const revokeApiKey = async () => {
        await api.revokeApiKey();
        await fetchData();
    };

    const addKartuKeluargaFromQR = async (data: QrData) => {
        await api.addKartuKeluargaFromQR(data);
        await fetchData();
    };

    const deleteKartuKeluarga = async (id: string) => {
        await api.deleteKartuKeluarga(id);
        await fetchData();
    };

    const addUmkm = async (u: Omit<UMKM, 'id'>) => {
        await api.addUmkm(u);
        await fetchData();
    };

    const updateUmkm = async (u: UMKM) => {
        await api.updateUmkm(u.id, u);
        await fetchData();
    };

    const deleteUmkm = async (id: string) => {
        await api.deleteUmkm(id);
        await fetchData();
    };
    
    const updateAdmindukDocument = async (wargaId: string, docType: AdmindukDocumentType, doc: Dokumen) => {
        await api.updateAdmindukDocument(wargaId, docType, doc);
        await fetchData();
    };

    const deleteAdmindukDocument = async (wargaId: string, docType: AdmindukDocumentType) => {
        await api.deleteAdmindukDocument(wargaId, docType);
        await fetchData();
    };

    const value = { 
        warga, bantuan, pengumuman, permohonan, infoDesa, targetBantuan, kartuKeluarga, logAktivitas, umkm, adminduk,
        loading, error, reloadData: fetchData,
        addWarga, updateWarga, deleteWarga,
        addBantuan, updateBantuan, deleteBantuan, updateTargetBantuan,
        addPengumuman, updatePengumuman, deletePengumuman,
        updatePermohonanStatus,
        addPermohonan,
        updateInfoDesa,
        generateApiKey,
        revokeApiKey,
        addKartuKeluargaFromQR,
        deleteKartuKeluarga,
        addUmkm, updateUmkm, deleteUmkm,
        updateAdmindukDocument, deleteAdmindukDocument,
    };

    return React.createElement(DataContext.Provider, { value }, children);
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
