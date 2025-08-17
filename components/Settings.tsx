
import React, { useState } from 'react';
import { useData } from '../hooks/useMockData';
import { PageLayout } from './Dashboard';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';

interface SettingsProps {
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
    const { infoDesa, generateApiKey, revokeApiKey } = useData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState<'regenerate' | 'revoke' | null>(null);
    const [copySuccess, setCopySuccess] = useState('');

    const handleGenerate = async () => {
        if(isSubmitting) return;
        setIsSubmitting(true);
        try {
            await generateApiKey();
        } catch (e: any) {
            alert(`Gagal membuat kode: ${e.message}`);
        } finally {
            setIsSubmitting(false);
            setShowConfirmModal(null);
        }
    };

    const handleRevoke = async () => {
        if(isSubmitting) return;
        setIsSubmitting(true);
        try {
            await revokeApiKey();
        } catch (e: any) {
            alert(`Gagal menghapus kode: ${e.message}`);
        } finally {
            setIsSubmitting(false);
            setShowConfirmModal(null);
        }
    };

    const handleConfirmAction = () => {
        if (showConfirmModal === 'regenerate') {
            handleGenerate();
        } else if (showConfirmModal === 'revoke') {
            handleRevoke();
        }
    };
    
    const handleCopy = () => {
        if (!infoDesa?.apiKey) return;
        navigator.clipboard.writeText(infoDesa.apiKey).then(() => {
            setCopySuccess('Kode berhasil disalin!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Gagal menyalin kode.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const modalContent = {
        regenerate: {
            title: 'Buat Ulang Kode Koneksi?',
            description: 'Tindakan ini akan membuat kode koneksi yang lama tidak valid. Aplikasi eksternal yang ada harus diperbarui dengan kode baru.',
            confirmText: 'Ya, Buat Ulang',
            variant: 'primary' as const
        },
        revoke: {
            title: 'Putuskan Koneksi?',
            description: 'Tindakan ini akan menghapus kode koneksi. Aplikasi eksternal tidak akan dapat lagi mengakses data hingga kode baru dibuat.',
            confirmText: 'Ya, Putuskan',
            variant: 'danger' as const
        }
    }

    return (
        <PageLayout title="Pengaturan" onLogout={onLogout}>
            <Card>
                <h2 className="text-xl font-semibold text-slate-800">Koneksi Aplikasi Eksternal</h2>
                <p className="mt-2 text-sm text-slate-600">
                    Gunakan Kode Koneksi (API Key) di bawah ini untuk menghubungkan aplikasi lain (misalnya aplikasi mobile untuk warga) ke database desa ini. Jaga kerahasiaan kode ini.
                </p>

                {infoDesa?.apiKey ? (
                    <div className="mt-6">
                        <label htmlFor="api-key" className="block text-sm font-medium text-slate-700 mb-1.5">Kode Koneksi Anda</label>
                        <div className="flex gap-2 items-center">
                            <Input id="api-key" type="text" readOnly value={infoDesa.apiKey} className="font-mono" />
                            <Button variant="secondary" onClick={handleCopy} className="flex-shrink-0">{copySuccess || 'Salin'}</Button>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-slate-200/80">
                            <h3 className="text-lg font-semibold text-red-600">Zona Berbahaya</h3>
                            <p className="text-sm text-slate-600 mt-1">Tindakan di bawah ini tidak dapat diurungkan. Harap berhati-hati.</p>
                            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                <Button variant="secondary" onClick={() => setShowConfirmModal('regenerate')} disabled={isSubmitting}>
                                    Buat Ulang Kode
                                </Button>
                                <Button variant="danger" onClick={() => setShowConfirmModal('revoke')} disabled={isSubmitting}>
                                    Putuskan Koneksi (Hapus Kode)
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 text-center py-8 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <h3 className="text-lg font-semibold text-slate-800">Belum Terhubung</h3>
                        <p className="text-slate-600 mt-2">Saat ini belum ada kode koneksi yang dibuat.</p>
                        <Button className="mt-4" onClick={handleGenerate} disabled={isSubmitting}>
                            {isSubmitting ? 'Membuat...' : 'Buat Kode Koneksi Baru'}
                        </Button>
                    </div>
                )}
            </Card>
            
            <Modal
                isOpen={!!showConfirmModal}
                onClose={() => setShowConfirmModal(null)}
                title={showConfirmModal ? modalContent[showConfirmModal].title : ''}
            >
                {showConfirmModal && (
                    <div>
                        <p className="text-slate-600">{modalContent[showConfirmModal].description}</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setShowConfirmModal(null)} disabled={isSubmitting}>Batal</Button>
                            <Button variant={modalContent[showConfirmModal].variant} onClick={handleConfirmAction} disabled={isSubmitting}>
                                {isSubmitting ? 'Memproses...' : modalContent[showConfirmModal].confirmText}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </PageLayout>
    );
};

export default Settings;
