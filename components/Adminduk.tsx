import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useMockData';
import { Warga, Adminduk as AdmindukType, AdmindukDocumentType, Dokumen } from '../types';
import { PageLayout } from './Dashboard';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import Spinner from './ui/Spinner';

// --- Local Icons ---
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <title>Tersedia</title>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <title>Tidak Tersedia</title>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
);
const ArrowUpTrayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
);
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-4.43a1.012 1.012 0 011.431 0l4.43 4.43a1.012 1.012 0 010 .639l-4.43 4.43a1.012 1.012 0 01-1.431 0l-4.43-4.43z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);

const DOCUMENT_TYPES: { key: AdmindukDocumentType; label: string }[] = [
    { key: 'kk', label: 'Kartu Keluarga' },
    { key: 'ktp', label: 'KTP' },
    { key: 'aktaLahir', label: 'Akta Lahir' },
    { key: 'bpjs', label: 'BPJS' },
    { key: 'kip', label: 'KIP' },
];

interface ManageDocsModalProps {
    isOpen: boolean;
    onClose: () => void;
    warga: Warga | null;
}

const ManageDocsModal: React.FC<ManageDocsModalProps> = ({ isOpen, onClose, warga }) => {
    const { adminduk, updateAdmindukDocument, deleteAdmindukDocument } = useData();
    const [isProcessing, setIsProcessing] = useState<AdmindukDocumentType | null>(null);

    const wargaAdminduk = useMemo(() => {
        if (!warga) return null;
        return adminduk.find(a => a.id === warga.id);
    }, [adminduk, warga]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, docType: AdmindukDocumentType) => {
        if (!warga) return;
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert("Ukuran file terlalu besar. Maksimal 5MB.");
            return;
        }

        setIsProcessing(docType);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const newDocument: Dokumen = {
                    fileName: file.name,
                    dataUrl: reader.result as string,
                    uploadedAt: new Date().toISOString(),
                };
                await updateAdmindukDocument(warga.id, docType, newDocument);
                setIsProcessing(null);
            };
            reader.onerror = (error) => {
                console.error("FileReader error:", error);
                alert("Gagal membaca file.");
                setIsProcessing(null);
            };
        } catch (error: any) {
            alert(`Gagal memproses file: ${error.message}`);
            setIsProcessing(null);
        }
    };

    const handleDelete = async (docType: AdmindukDocumentType) => {
        if (!warga) return;
        if (window.confirm(`Apakah Anda yakin ingin menghapus dokumen ${docType} untuk ${warga.nama}?`)) {
            setIsProcessing(docType);
            try {
                await deleteAdmindukDocument(warga.id, docType);
            } catch (error: any) {
                alert(`Gagal menghapus dokumen: ${error.message}`);
            } finally {
                setIsProcessing(null);
            }
        }
    };

    if (!warga) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Kelola Dokumen - ${warga.nama}`}>
            <div className="space-y-4">
                <p className="text-sm text-slate-600">Unggah, lihat, atau hapus dokumen administrasi milik warga.</p>
                <ul className="space-y-3 pt-4 border-t">
                    {DOCUMENT_TYPES.map(({ key, label }) => {
                        const document = wargaAdminduk?.[key];
                        return (
                            <li key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    {document ? <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" /> : <XCircleIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />}
                                    <div>
                                        <p className="font-semibold text-slate-800">{label}</p>
                                        {document && <p className="text-xs text-slate-500 truncate max-w-xs">{document.fileName}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {isProcessing === key ? <Spinner size="sm" /> : (
                                        document ? (
                                            <>
                                                <Button size="sm" variant="secondary" onClick={() => window.open(document.dataUrl, '_blank')}>Lihat</Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(key)}>Hapus</Button>
                                            </>
                                        ) : (
                                            <>
                                                <input type="file" id={`upload-${key}`} className="hidden" onChange={(e) => handleFileChange(e, key)} accept="image/*,.pdf" />
                                                <label htmlFor={`upload-${key}`} className="inline-flex items-center justify-center border border-transparent font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 transition-all duration-150 active:scale-95 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-3 py-1.5 text-sm cursor-pointer">
                                                    Unggah
                                                </label>
                                            </>
                                        )
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <div className="flex justify-end pt-4">
                    <Button variant="secondary" onClick={onClose}>Tutup</Button>
                </div>
            </div>
        </Modal>
    );
};


const Adminduk: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { warga, adminduk } = useData();
    const [filter, setFilter] = useState('');
    const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

    const filteredWarga = useMemo(() => {
        const lowercasedFilter = filter.toLowerCase();
        if (!lowercasedFilter) return warga;
        return warga.filter(w =>
            w.nama.toLowerCase().includes(lowercasedFilter) ||
            w.nik.includes(lowercasedFilter)
        );
    }, [warga, filter]);

    const handleManageClick = (w: Warga) => {
        setSelectedWarga(w);
    };

    const handleCloseModal = () => {
        setSelectedWarga(null);
    };

    return (
        <PageLayout title="Data Kepemilikan Adminduk" onLogout={onLogout}>
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-slate-800 self-start">Daftar Warga</h2>
                    <div className="w-full md:w-1/3">
                        <Input
                            type="text"
                            placeholder="Cari nama atau NIK..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Warga</th>
                                {DOCUMENT_TYPES.map(doc => (
                                    <th key={doc.key} className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">{doc.label}</th>
                                ))}
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredWarga.map(w => {
                                const wargaAdminduk = adminduk.find(a => a.id === w.id);
                                return (
                                    <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-medium text-slate-900">{w.nama}</p>
                                            <p className="text-xs text-slate-500 font-mono">{w.nik}</p>
                                        </td>
                                        {DOCUMENT_TYPES.map(doc => (
                                            <td key={doc.key} className="px-3 py-4 text-center">
                                                {wargaAdminduk?.[doc.key] ? (
                                                    <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto" />
                                                ) : (
                                                    <XCircleIcon className="w-6 h-6 text-red-200 mx-auto" />
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button size="sm" variant="secondary" onClick={() => handleManageClick(w)}>Kelola Dokumen</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {filteredWarga.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            <p>Tidak ada warga yang cocok dengan pencarian Anda.</p>
                        </div>
                    )}
                </div>
            </Card>

            <ManageDocsModal
                isOpen={!!selectedWarga}
                onClose={handleCloseModal}
                warga={selectedWarga}
            />
        </PageLayout>
    );
};

export default Adminduk;