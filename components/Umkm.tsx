import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useMockData';
import { UMKM as UmkmType, Warga } from '../types';
import { PageLayout } from './Dashboard';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';

const UmkmForm: React.FC<{
    umkmData?: UmkmType | null;
    onSave: (u: Omit<UmkmType, 'id'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}> = ({ umkmData, onSave, onCancel, isSubmitting }) => {
    const { warga } = useData();
    const [formData, setFormData] = useState<Omit<UmkmType, 'id'>>({
        namaUsaha: umkmData?.namaUsaha || '',
        pemilikId: umkmData?.pemilikId || '',
        jenisUsaha: umkmData?.jenisUsaha || '',
        deskripsi: umkmData?.deskripsi || '',
        fotoUrl: umkmData?.fotoUrl || '',
    });
    const [fotoPreview, setFotoPreview] = useState<string>(umkmData?.fotoUrl || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("Ukuran file terlalu besar. Maksimal 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, fotoUrl: base64String }));
                setFotoPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.namaUsaha || !formData.pemilikId || !formData.jenisUsaha || !formData.deskripsi || !formData.fotoUrl) {
            alert("Semua field termasuk foto wajib diisi.");
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={isSubmitting} className="space-y-4">
                <Input label="Nama Usaha" name="namaUsaha" value={formData.namaUsaha} onChange={handleChange} required />
                <div>
                    <label htmlFor="pemilikId" className="block text-sm font-medium text-slate-700 mb-1.5">Pemilik Usaha</label>
                    <select id="pemilikId" name="pemilikId" value={formData.pemilikId} onChange={handleChange} required className="bg-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-xl py-2.5 px-3.5 border transition-colors duration-150">
                        <option value="" disabled>Pilih warga...</option>
                        {warga.map(w => <option key={w.id} value={w.id}>{w.nama}</option>)}
                    </select>
                </div>
                <Input label="Jenis Usaha" name="jenisUsaha" value={formData.jenisUsaha} onChange={handleChange} placeholder="Contoh: Kuliner, Kerajinan, Jasa" required />
                <div>
                    <label htmlFor="deskripsi" className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi Singkat</label>
                    <textarea id="deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={4} required className="bg-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-xl"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Foto Usaha</label>
                    <div className="mt-2 flex items-center gap-4">
                        {fotoPreview ? (
                            <img src={fotoPreview} alt="Pratinjau" className="h-20 w-20 rounded-xl object-cover" />
                        ) : (
                            <div className="h-20 w-20 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-500 text-center">Pratinjau Foto</div>
                        )}
                        <Input type="file" name="fotoUrl" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="!p-0 !border-none !ring-0 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                </div>
            </fieldset>
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-4">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Batal</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
            </div>
        </form>
    );
};

const Umkm: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { umkm, warga, addUmkm, updateUmkm, deleteUmkm } = useData();
    const [filter, setFilter] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUmkm, setEditingUmkm] = useState<UmkmType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getWargaName = (id: string) => warga.find(w => w.id === id)?.nama || 'N/A';

    const filteredUmkm = useMemo(() => {
        return umkm.filter(u =>
            u.namaUsaha.toLowerCase().includes(filter.toLowerCase()) ||
            getWargaName(u.pemilikId).toLowerCase().includes(filter.toLowerCase())
        );
    }, [umkm, warga, filter]);

    const handleEditClick = (u: UmkmType) => {
        setEditingUmkm(u);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data UMKM ini?')) {
            await deleteUmkm(id);
        }
    };
    
    const handleSave = async (umkmToSave: Omit<UmkmType, 'id'>) => {
        setIsSubmitting(true);
        try {
            if (editingUmkm) {
                await updateUmkm({ ...umkmToSave, id: editingUmkm.id });
            } else {
                await addUmkm(umkmToSave);
            }
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setEditingUmkm(null);
        } catch (e: any) {
            alert(`Gagal menyimpan: ${e.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const pageActions = (
        <Button onClick={() => setIsAddModalOpen(true)} size="sm">Tambah UMKM</Button>
    );

    return (
        <PageLayout title="Database UMKM" onLogout={onLogout} headerActions={pageActions}>
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="w-full md:w-1/3">
                        <Input type="text" placeholder="Cari nama usaha atau pemilik..." value={filter} onChange={(e) => setFilter(e.target.value)} />
                    </div>
                </div>
                {filteredUmkm.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredUmkm.map(u => (
                            <Card key={u.id} className="!p-0 flex flex-col">
                                <img src={u.fotoUrl} alt={u.namaUsaha} className="w-full h-40 object-cover rounded-t-2xl bg-slate-100" />
                                <div className="p-4 flex flex-col flex-grow">
                                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full self-start">{u.jenisUsaha}</span>
                                    <h3 className="font-bold text-lg text-slate-800 mt-2">{u.namaUsaha}</h3>
                                    <p className="text-sm text-slate-500">Oleh: {getWargaName(u.pemilikId)}</p>
                                    <p className="text-sm text-slate-600 mt-2 flex-grow">{u.deskripsi}</p>
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                        <Button size="sm" variant="secondary" onClick={() => handleEditClick(u)} className="w-full">Ubah</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)} className="w-full">Hapus</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-10 text-slate-500">
                        <p>Tidak ada data UMKM yang ditemukan.</p>
                     </div>
                )}
            </Card>

            <Modal title="Tambah UMKM Baru" isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); }}>
                <UmkmForm onSave={handleSave} onCancel={() => setIsAddModalOpen(false)} isSubmitting={isSubmitting} />
            </Modal>
            
            <Modal title="Ubah Data UMKM" isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingUmkm(null); }}>
                {editingUmkm && <UmkmForm umkmData={editingUmkm} onSave={handleSave} onCancel={() => setIsEditModalOpen(false)} isSubmitting={isSubmitting} />}
            </Modal>
        </PageLayout>
    );
};

export default Umkm;
