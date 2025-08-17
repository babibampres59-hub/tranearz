import React, { useState } from 'react';
import { useData } from '../hooks/useMockData';
import { Pengumuman as PengumumanType } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { PageLayout } from './Dashboard';

interface PengumumanProps {
    onLogout: () => void;
}

const PengumumanForm: React.FC<{
    pengumuman?: PengumumanType;
    onSave: (data: Omit<PengumumanType, 'id' | 'tanggal'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}> = ({ pengumuman, onSave, onCancel, isSubmitting }) => {
    const [judul, setJudul] = useState(pengumuman?.judul || '');
    const [isi, setIsi] = useState(pengumuman?.isi || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!judul || !isi) {
            alert("Judul dan isi tidak boleh kosong.");
            return;
        }
        onSave({ judul, isi });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={isSubmitting}>
            <Input 
              label="Judul Pengumuman" 
              value={judul} 
              onChange={(e) => setJudul(e.target.value)} 
              placeholder="Contoh: Jadwal Posyandu Bulanan"
              required
            />
            <div>
              <label htmlFor="isi-pengumuman" className="block text-sm font-medium text-slate-700 mb-1.5">Isi Pengumuman</label>
              <textarea
                id="isi-pengumuman"
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                rows={5}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-xl bg-white"
                placeholder="Tulis isi lengkap pengumuman di sini..."
                required
              ></textarea>
            </div>
          </fieldset>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-4">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : pengumuman ? 'Simpan Perubahan' : 'Terbitkan'}
            </Button>
          </div>
        </form>
    );
};


const Pengumuman: React.FC<PengumumanProps> = ({ onLogout }) => {
  const { pengumuman, addPengumuman, updatePengumuman, deletePengumuman } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPengumuman, setEditingPengumuman] = useState<PengumumanType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPengumuman, setDeletingPengumuman] = useState<PengumumanType | null>(null);


  const handleOpenEditModal = (p: PengumumanType) => {
    setEditingPengumuman(p);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (p: PengumumanType) => {
    setDeletingPengumuman(p);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingPengumuman(null);
    setIsDeleteModalOpen(false);
    setDeletingPengumuman(null);
  };
  
  const handleSave = async (data: Omit<PengumumanType, 'id' | 'tanggal'>) => {
    setIsSubmitting(true);
    try {
        if(editingPengumuman) {
            await updatePengumuman(editingPengumuman.id, data);
        } else {
            await addPengumuman(data);
        }
        handleCloseModals();
    } catch(e: any) {
        alert(`Gagal menyimpan: ${e.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPengumuman) return;
    setIsSubmitting(true);
    try {
        await deletePengumuman(deletingPengumuman.id);
        handleCloseModals();
    } catch(e: any) {
        alert(`Gagal menghapus: ${e.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const pageActions = (
    <Button onClick={() => setIsAddModalOpen(true)} size="sm">
      Buat Pengumuman Baru
    </Button>
  );

  return (
    <PageLayout title="Pengumuman Desa" onLogout={onLogout} headerActions={pageActions}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">Pengumuman Terbit</h2>
        {pengumuman.length === 0 ? (
          <Card>
            <p className="text-center text-slate-500">Belum ada pengumuman yang diterbitkan.</p>
          </Card>
        ) : (
          pengumuman.sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map(p => (
            <Card key={p.id}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{p.judul}</h3>
                  <p className="text-sm text-slate-500 mb-3 mt-1">
                    {new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                   <Button variant="secondary" size="sm" onClick={() => handleOpenEditModal(p)}>Ubah</Button>
                   <Button variant="danger" size="sm" onClick={() => handleOpenDeleteModal(p)}>Hapus</Button>
                </div>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed mt-2">{p.isi}</p>
            </Card>
          ))
        )}
      </div>

      <Modal title="Buat Pengumuman Baru" isOpen={isAddModalOpen} onClose={handleCloseModals}>
        <PengumumanForm 
            onSave={handleSave} 
            onCancel={handleCloseModals} 
            isSubmitting={isSubmitting}
        />
      </Modal>
      
      <Modal title="Ubah Pengumuman" isOpen={isEditModalOpen} onClose={handleCloseModals}>
        {editingPengumuman && (
            <PengumumanForm 
                pengumuman={editingPengumuman}
                onSave={handleSave} 
                onCancel={handleCloseModals} 
                isSubmitting={isSubmitting}
            />
        )}
      </Modal>

      <Modal
        title="Konfirmasi Hapus Pengumuman"
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
      >
        {deletingPengumuman && (
            <div className="space-y-4">
                <p className="text-slate-600">
                    Apakah Anda yakin ingin menghapus pengumuman berjudul:
                    <br />
                    <strong className="text-slate-800 font-semibold">"{deletingPengumuman.judul}"</strong>?
                </p>
                <p className="text-sm text-red-600">Tindakan ini tidak dapat diurungkan.</p>
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-4">
                    <Button variant="secondary" onClick={handleCloseModals} disabled={isSubmitting}>Batal</Button>
                    <Button variant="danger" onClick={handleConfirmDelete} disabled={isSubmitting}>
                        {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </div>
            </div>
        )}
      </Modal>

    </PageLayout>
  );
};

export default Pengumuman;