import React, { useState, useEffect, useMemo } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useData } from '../hooks/useMockData';
import { PageLayout } from './Dashboard';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { QrData, KartuKeluarga as KKType, Warga } from '../types';
import Spinner from './ui/Spinner';

const QrCodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm0 6a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm0 6a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6-12a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm0 6a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6-6a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-6 12a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5v.75m0 6v.75m0 6v.75m6-12v.75m0 6v.75m6-6v.75m0 6v.75M19.5 12h.75" />
    </svg>
);


const QRScannerModal: React.FC<{ isOpen: boolean; onClose: () => void; onScanSuccess: (data: QrData) => void; onScanError: (error: string) => void; }> = ({ isOpen, onClose, onScanSuccess, onScanError }) => {
    useEffect(() => {
        if (!isOpen) return;

        const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);

        const handleSuccess = (decodedText: string) => {
            scanner.clear();
            try {
                // SIMULATION: The QR from Dukcapil usually contains a URL.
                // For this demo, we assume the QR contains a JSON string of the KK data.
                const parsedData = JSON.parse(decodedText) as QrData;
                if(parsedData.nomorKK && parsedData.kepalaKeluarga && parsedData.anggota) {
                    onScanSuccess(parsedData);
                } else {
                    onScanError('Format data QR tidak valid.');
                }
            } catch (error) {
                onScanError('Gagal mem-parsing data QR. Pastikan QR code valid.');
            }
        };

        const handleError = (error: any) => {
            // Ignore 'QR code not found' errors which happen continuously
        };

        scanner.render(handleSuccess, handleError);

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, [isOpen, onScanSuccess, onScanError]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pindai QR Kartu Keluarga">
            <div id="qr-reader" className="w-full"></div>
            <p className="text-center text-sm text-slate-500 mt-4">Arahkan kamera ke QR code pada dokumen Kartu Keluarga digital Anda.</p>
        </Modal>
    );
};

const KKReviewModal: React.FC<{ isOpen: boolean; onClose: () => void; qrData: QrData | null; onSave: () => Promise<void>; isSaving: boolean }> = ({ isOpen, onClose, qrData, onSave, isSaving }) => {
    const { warga } = useData();
    if (!isOpen || !qrData) return null;

    const existingNiks = useMemo(() => new Set(warga.map(w => w.nik)), [warga]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pratinjau Data Kartu Keluarga">
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-slate-800">Nomor KK: <span className="font-mono">{qrData.nomorKK}</span></h3>
                    <p className="text-sm text-slate-600">Kepala Keluarga: {qrData.kepalaKeluarga.nama}</p>
                    <p className="text-sm text-slate-600">Alamat: {qrData.alamat}</p>
                    <p className="text-sm text-slate-600">Tanggal Cetak: {new Date(qrData.tanggalCetak).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                    <h4 className="font-medium text-slate-800 mb-2">Anggota Keluarga ({qrData.anggota.length} orang)</h4>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 border-t border-b border-slate-200 py-2">
                        {qrData.anggota.map(anggota => (
                            <li key={anggota.nik} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-sm text-slate-900">{anggota.nama}</p>
                                    <p className="text-xs text-slate-500 font-mono">{anggota.nik}</p>
                                </div>
                                {existingNiks.has(anggota.nik) ? (
                                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Sudah Ada</span>
                                ) : (
                                    <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Baru</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose} disabled={isSaving}>Batal</Button>
                    <Button onClick={onSave} disabled={isSaving}>
                        {isSaving ? <Spinner size="sm" /> : null}
                        <span className={isSaving ? 'ml-2' : ''}>Simpan Kartu Keluarga</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const KKDetailModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    kk: KKType | null;
    warga: Warga[];
}> = ({ isOpen, onClose, kk, warga }) => {
    if (!isOpen || !kk) return null;

    const kepalaKeluarga = warga.find(w => w.id === kk.kepalaKeluargaId);
    const anggotaKeluarga = kk.anggotaIds.map(id => warga.find(w => w.id === id)).filter(Boolean) as Warga[];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Kartu Keluarga">
            <div className="space-y-4">
                <div className="space-y-1">
                    <h3 className="font-semibold text-slate-800">Nomor KK: <span className="font-mono text-slate-600">{kk.nomorKK}</span></h3>
                    <p className="text-sm text-slate-600">Kepala Keluarga: <span className="font-semibold text-slate-800">{kepalaKeluarga?.nama || 'N/A'}</span></p>
                    <p className="text-sm text-slate-600">Alamat: <span className="font-semibold text-slate-800">{kk.alamat}</span></p>
                    <p className="text-sm text-slate-600">Tanggal Cetak: <span className="font-semibold text-slate-800">{new Date(kk.tanggalCetak).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span></p>
                </div>
                <div>
                    <h4 className="font-medium text-slate-800 mb-2 border-t pt-4 mt-4">Anggota Keluarga ({anggotaKeluarga.length} orang)</h4>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 py-2">
                        {anggotaKeluarga.length > 0 ? anggotaKeluarga.map(anggota => (
                            <li key={anggota.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-sm text-slate-900">{anggota.nama}</p>
                                    <p className="text-xs text-slate-500 font-mono">{anggota.nik}</p>
                                </div>
                                {anggota.id === kk.kepalaKeluargaId && (
                                    <span className="text-xs font-bold text-slate-700 bg-yellow-200 px-2.5 py-1 rounded-full">Kepala Keluarga</span>
                                )}
                            </li>
                        )) : (
                            <li className="text-center text-sm text-slate-500 py-4">Tidak ada anggota yang tertaut.</li>
                        )}
                    </ul>
                </div>
                <div className="pt-4 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>Tutup</Button>
                </div>
            </div>
        </Modal>
    );
};


const KartuKeluarga: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { kartuKeluarga, warga, addKartuKeluargaFromQR, deleteKartuKeluarga } = useData();
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [scannedData, setScannedData] = useState<QrData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [viewingKK, setViewingKK] = useState<KKType | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    
    const getWargaName = (id: string) => warga.find(w => w.id === id)?.nama || 'N/A';

    const handleScanSuccess = (data: QrData) => {
        setScannedData(data);
        setIsScannerOpen(false);
        setIsReviewOpen(true);
    };

    const handleScanError = (error: string) => {
        alert(error);
        setIsScannerOpen(false);
    };
    
    const handleSaveKK = async () => {
        if (!scannedData) return;
        setIsSaving(true);
        try {
            await addKartuKeluargaFromQR(scannedData);
            setIsReviewOpen(false);
            setScannedData(null);
        } catch (e: any) {
            alert(`Gagal menyimpan: ${e.message}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data Kartu Keluarga ini? Semua warga yang tertaut akan kehilangan koneksi ke KK ini.")) {
            try {
                await deleteKartuKeluarga(id);
            } catch(e: any) {
                alert(`Gagal menghapus: ${e.message}`);
            }
        }
    };

    const handleViewClick = (kk: KKType) => {
        setViewingKK(kk);
        setIsViewModalOpen(true);
    };

    const pageActions = (
        <Button onClick={() => setIsScannerOpen(true)} size="sm">
            <QrCodeIcon className="w-5 h-5 mr-2" />
            Pindai QR Kartu Keluarga
        </Button>
    );

    return (
        <PageLayout title="Kartu Keluarga" onLogout={onLogout} headerActions={pageActions}>
            <Card>
                <h2 className="text-xl font-semibold text-slate-800 mb-6">Daftar Kartu Keluarga Terdaftar</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nomor KK</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kepala Keluarga</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jumlah Anggota</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {kartuKeluarga.map((kk) => (
                                <tr key={kk.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-mono">{kk.nomorKK}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getWargaName(kk.kepalaKeluargaId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{kk.anggotaIds.length} Orang</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleViewClick(kk)}>Lihat</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(kk.id)}>Hapus</Button>
                                    </td>
                                </tr>
                            ))}
                             {kartuKeluarga.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-slate-500">Belum ada data Kartu Keluarga.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <QRScannerModal 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
            />
            
            <KKReviewModal 
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                qrData={scannedData}
                onSave={handleSaveKK}
                isSaving={isSaving}
            />

            <KKDetailModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                kk={viewingKK}
                warga={warga}
            />

        </PageLayout>
    );
};

export default KartuKeluarga;