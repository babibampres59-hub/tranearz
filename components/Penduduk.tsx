import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../hooks/useMockData';
import { Warga, InfoDesa as InfoDesaType, Dusun } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import Input from './ui/Input';
import InfoDesa from './InfoDesa';
import { PageLayout } from './Dashboard';
import { DocumentArrowDownIcon } from '../constants';

interface PendudukProps {
    onLogout: () => void;
}

const WargaForm: React.FC<{
    wargaData?: Warga | null;
    onSave: (w: Warga) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}> = ({ wargaData, onSave, onCancel, isSubmitting }) => {
    const { infoDesa, kartuKeluarga, warga } = useData();
    
    const getWargaName = (id: string) => warga.find(w => w.id === id)?.nama || 'N/A';
    
    const getDefaultFormData = () => ({
        nama: '',
        nik: '',
        tempatLahir: '',
        tanggalLahir: '',
        pekerjaan: '',
        dusun: '',
        rt: '',
        rw: '',
        desa: infoDesa?.namaDesa || 'Sukamakmur',
        kecamatan: 'Ajung',
        kabupaten: 'Jember',
        provinsi: 'Jawa Timur',
        kartuKeluargaId: undefined,
    });

    const [formData, setFormData] = useState<Omit<Warga, 'id' | 'bantuan'>>(() => {
        if (wargaData) {
            const { id, bantuan, ...rest } = wargaData;
            return rest;
        }
        return getDefaultFormData();
    });
    
    useEffect(() => {
        if (wargaData) {
            const { id, bantuan, ...rest } = wargaData;
            setFormData(rest);
        } else {
            setFormData(getDefaultFormData());
        }
    }, [wargaData, infoDesa]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData: Warga = {
            ...formData,
            id: wargaData?.id || '',
            bantuan: wargaData?.bantuan || { blt: false, pkh: false, lainnya: false }
        };
        onSave(finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset disabled={isSubmitting} className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Data Diri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Nama Lengkap" name="nama" value={formData.nama} onChange={handleChange} required />
                        <Input label="NIK" name="nik" value={formData.nik} onChange={handleChange} required />
                        <Input label="Tempat Lahir" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required />
                        <Input label="Tanggal Lahir" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={handleChange} required />
                        <Input label="Pekerjaan" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} required />
                         <div>
                            <label htmlFor="kartuKeluargaId" className="block text-sm font-medium text-slate-700 mb-1.5">Kartu Keluarga</label>
                             <select id="kartuKeluargaId" name="kartuKeluargaId" value={formData.kartuKeluargaId || ''} onChange={handleChange} className="bg-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-xl py-2.5 px-3.5 border transition-colors duration-150 disabled:bg-slate-100">
                                 <option value="">Tidak Terhubung</option>
                                 {kartuKeluarga.map(kk => (
                                     <option key={kk.id} value={kk.id}>{`${kk.nomorKK} - a/n ${getWargaName(kk.kepalaKeluargaId)}`}</option>
                                 ))}
                             </select>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Alamat</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                             <label htmlFor="dusun" className="block text-sm font-medium text-slate-700 mb-1.5">Dusun</label>
                             <select id="dusun" name="dusun" value={formData.dusun} onChange={handleChange} required className="bg-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-xl py-2.5 px-3.5 border transition-colors duration-150 disabled:bg-slate-100">
                                 <option value="" disabled>Pilih Dusun</option>
                                 {infoDesa?.dusun.map(d => (
                                     <option key={d.id} value={d.nama}>{d.nama}</option>
                                 ))}
                             </select>
                        </div>
                        <Input label="RT" name="rt" value={formData.rt} onChange={handleChange} required />
                        <Input label="RW" name="rw" value={formData.rw} onChange={handleChange} required />
                        <Input label="Desa" name="desa" value={formData.desa} onChange={handleChange} required />
                        <Input label="Kecamatan" name="kecamatan" value={formData.kecamatan} onChange={handleChange} required />
                        <Input label="Kabupaten" name="kabupaten" value={formData.kabupaten} onChange={handleChange} required />
                        <Input label="Provinsi" name="provinsi" value={formData.provinsi} onChange={handleChange} required />
                    </div>
                </div>
            </fieldset>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Batal</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
            </div>
        </form>
    );
};

const InfoDesaForm: React.FC<{
    currentInfo: InfoDesaType;
    onSave: (info: InfoDesaType) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}> = ({ currentInfo, onSave, onCancel, isSubmitting }) => {
    const { warga } = useData();
    const [formData, setFormData] = useState(currentInfo);
    const [newDusunName, setNewDusunName] = useState('');
    const [editingDusun, setEditingDusun] = useState<{id: string; name: string} | null>(null);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDusun = () => {
        if (newDusunName.trim() === '' || formData.dusun.some(d => d.nama.toLowerCase() === newDusunName.trim().toLowerCase())) {
            alert('Nama dusun tidak boleh kosong atau duplikat.');
            return;
        }
        const newDusun: Dusun = { id: `dusun-new-${Date.now()}`, nama: newDusunName.trim() };
        setFormData(prev => ({ ...prev, dusun: [...prev.dusun, newDusun] }));
        setNewDusunName('');
    };

    const handleDeleteDusun = (dusunId: string) => {
        const dusunToDelete = formData.dusun.find(d => d.id === dusunId);
        if (!dusunToDelete) return;

        const isDusunInUse = warga.some(w => w.dusun === dusunToDelete.nama);
        if (isDusunInUse) {
            alert('Dusun tidak dapat dihapus karena masih ada warga yang terdata di dusun ini.');
            return;
        }

        if (window.confirm(`Apakah Anda yakin ingin menghapus dusun "${dusunToDelete.nama}"?`)) {
            setFormData(prev => ({ ...prev, dusun: prev.dusun.filter(d => d.id !== dusunId) }));
        }
    };
    
    const handleUpdateDusun = () => {
        if (!editingDusun || editingDusun.name.trim() === '') return;
        setFormData(prev => ({
            ...prev,
            dusun: prev.dusun.map(d => d.id === editingDusun.id ? { ...d, nama: editingDusun.name.trim() } : d)
        }));
        setEditingDusun(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset disabled={isSubmitting}>
                <div className="space-y-4">
                  <Input label="Nama Desa" name="namaDesa" value={formData.namaDesa} onChange={handleInfoChange} required />
                  <Input label="Nama Kepala Desa" name="kepalaDesa" value={formData.kepalaDesa} onChange={handleInfoChange} required />
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-200 mt-6">
                    <h4 className="text-lg font-semibold text-slate-800">Kelola Dusun</h4>
                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {formData.dusun.map(dusun => (
                            <li key={dusun.id} className="flex items-center justify-between gap-2 bg-slate-100 p-2.5 rounded-xl">
                                {editingDusun?.id === dusun.id ? (
                                    <Input value={editingDusun.name} onChange={(e) => setEditingDusun({...editingDusun, name: e.target.value})} className="!my-0"/>
                                ) : (
                                    <span className="text-sm font-medium text-slate-800">{dusun.nama}</span>
                                )}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {editingDusun?.id === dusun.id ? (
                                        <>
                                            <Button type="button" size="sm" variant="success" onClick={handleUpdateDusun}>Simpan</Button>
                                            <Button type="button" size="sm" variant="secondary" onClick={() => setEditingDusun(null)}>Batal</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button type="button" size="sm" variant="secondary" onClick={() => setEditingDusun({id: dusun.id, name: dusun.nama})}>Ubah</Button>
                                            <Button type="button" size="sm" variant="danger" onClick={() => handleDeleteDusun(dusun.id)}>Hapus</Button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-3">
                        <Input placeholder="Nama dusun baru..." value={newDusunName} onChange={(e) => setNewDusunName(e.target.value)} className="!my-0"/>
                        <Button type="button" onClick={handleAddDusun} className="flex-shrink-0">Tambah Dusun</Button>
                    </div>
                </div>
            </fieldset>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Batal</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
            </div>
        </form>
    );
};


const Penduduk: React.FC<PendudukProps> = ({ onLogout }) => {
    const { warga, infoDesa, kartuKeluarga, addWarga, updateWarga, deleteWarga, updateInfoDesa } = useData();
    const [filter, setFilter] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingWarga, setEditingWarga] = useState<Warga | null>(null);

    // Guard against null infoDesa
    if (!infoDesa) {
        return <PageLayout title="Data Penduduk" onLogout={onLogout}><Card><p>Memuat data...</p></Card></PageLayout>;
    }
    
    const totalDusun = useMemo(() => infoDesa.dusun.length, [infoDesa.dusun]);

    const filteredWarga = useMemo(() => {
        return warga.filter(w =>
            w.nama.toLowerCase().includes(filter.toLowerCase()) ||
            w.nik.includes(filter)
        );
    }, [warga, filter]);
    
    const handleExportCSV = () => {
        if (!warga.length || !infoDesa) {
            alert("Tidak ada data penduduk untuk diekspor.");
            return;
        }

        const kkMap = new Map<string, string>();
        kartuKeluarga.forEach(kk => kkMap.set(kk.id, kk.nomorKK));

        const headers = [
            "nik", "nama", "tempatLahir", "tanggalLahir", "pekerjaan",
            "dusun", "rt", "rw", "desa", "kecamatan", "kabupaten", "provinsi", "nomorKK"
        ];

        const escapeCsvValue = (value: any): string => {
            if (value === null || value === undefined) return '';
            const strValue = String(value);
            if (strValue.includes(',')) {
                return `"${strValue.replace(/"/g, '""')}"`;
            }
            return strValue;
        };

        const csvRows = warga.map(w => {
            const nomorKK = w.kartuKeluargaId ? kkMap.get(w.kartuKeluargaId) || '' : '';
            const row = [
                w.nik, w.nama, w.tempatLahir, w.tanggalLahir, w.pekerjaan,
                w.dusun, w.rt, w.rw, w.desa, w.kecamatan, w.kabupaten, w.provinsi,
                nomorKK
            ];
            return row.map(escapeCsvValue).join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `data_penduduk_${infoDesa.namaDesa.toLowerCase().replace(/\s+/g, '_')}_${date}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEditClick = (w: Warga) => {
        setEditingWarga(w);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if(window.confirm('Apakah Anda yakin ingin menghapus data warga ini?')) {
            try {
                await deleteWarga(id);
            } catch(e: any) {
                alert(`Gagal menghapus: ${e.message}`);
            }
        }
    };
    
    const handleSave = async (wargaToSave: Warga) => {
        setIsSubmitting(true);
        try {
            if (wargaToSave.id && warga.some(w => w.id === wargaToSave.id)) {
                await updateWarga(wargaToSave);
            } else {
                const { id, bantuan, ...newWargaData } = wargaToSave;
                await addWarga(newWargaData);
            }
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setEditingWarga(null);
        } catch (e: any) {
            alert(`Gagal menyimpan: ${e.message}`);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    const pageActions = (
        <Button onClick={() => setIsInfoModalOpen(true)} variant="secondary" size="sm">Ubah Info Desa</Button>
    );

    return (
        <PageLayout title="Data Penduduk" onLogout={onLogout} headerActions={pageActions}>
            <InfoDesa infoDesa={infoDesa} totalPenduduk={warga.length} totalDusun={totalDusun} />
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="w-full md:w-1/3">
                        <Input
                            type="text"
                            placeholder="Cari nama atau NIK..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 self-stretch md:self-auto">
                        <Button onClick={handleExportCSV} variant="secondary" className="w-full justify-center">
                            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                            Ekspor CSV
                        </Button>
                        <Button onClick={() => setIsAddModalOpen(true)} className="w-full justify-center">Tambah Warga</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">NIK</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Alamat</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pekerjaan</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredWarga.map((w) => (
                                <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{w.nama}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">{w.nik}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{`Dusun ${w.dusun}, RT ${w.rt}/RW ${w.rw}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{w.pekerjaan}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleEditClick(w)}>Ubah</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(w.id)}>Hapus</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <Modal title="Tambah Warga Baru" isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setEditingWarga(null); }}>
                <WargaForm onSave={handleSave} onCancel={() => setIsAddModalOpen(false)} isSubmitting={isSubmitting} />
            </Modal>
            
            <Modal title="Ubah Data Warga" isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingWarga(null); }}>
                {editingWarga && <WargaForm wargaData={editingWarga} onSave={handleSave} onCancel={() => setIsEditModalOpen(false)} isSubmitting={isSubmitting} />}
            </Modal>
            
            <Modal title="Ubah Informasi Desa" isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)}>
                <InfoDesaForm
                    currentInfo={infoDesa}
                    isSubmitting={isSubmitting}
                    onCancel={() => setIsInfoModalOpen(false)}
                    onSave={async (newInfo) => {
                        setIsSubmitting(true);
                        try {
                            await updateInfoDesa(newInfo);
                            setIsInfoModalOpen(false);
                        } catch (e: any) {
                            alert(`Gagal menyimpan: ${e.message}`);
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}
                />
            </Modal>

        </PageLayout>
    );
};

export default Penduduk;