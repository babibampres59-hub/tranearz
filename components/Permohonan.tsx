

import React, { useState } from 'react';
import { useData } from '../hooks/useMockData';
import Card from './ui/Card';
import Button from './ui/Button';
import { PageLayout } from './Dashboard';
import Modal from './ui/Modal';
import { Permohonan as PermohonanType } from '../types';

interface PermohonanProps {
    onLogout: () => void;
}

const Permohonan: React.FC<PermohonanProps> = ({ onLogout }) => {
  const { permohonan, updatePermohonanStatus, reloadData } = useData();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actioningPermohonan, setActioningPermohonan] = useState<{ id: string, status: 'Disetujui' | 'Ditolak' } | null>(null);
  
  const handleAction = async (id: string, newStatus: 'Disetujui' | 'Ditolak') => {
      setProcessingId(id);
      try {
        await updatePermohonanStatus(id, newStatus);
      } catch (e: any) {
        alert(`Gagal memproses permohonan: ${e.message}`);
      } finally {
        setProcessingId(null);
      }
  };

  const handleOpenConfirmModal = (p: PermohonanType, status: 'Disetujui' | 'Ditolak') => {
    setActioningPermohonan({ id: p.id, status });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!actioningPermohonan) return;
    handleAction(actioningPermohonan.id, actioningPermohonan.status);
    setIsConfirmModalOpen(false);
    setActioningPermohonan(null);
  };

  const handleRefresh = async () => {
      setIsRefreshing(true);
      try {
          await reloadData();
      } catch (e: any) {
          alert(`Gagal menyegarkan data: ${e.message}`);
      } finally {
          setIsRefreshing(false);
      }
  };

  const pageActions = (
      <Button onClick={handleRefresh} size="sm" variant="secondary" disabled={isRefreshing}>
          {isRefreshing ? "Menyegarkan..." : "Segarkan Permintaan"}
      </Button>
  );


  return (
    <PageLayout title="Permohonan Data" onLogout={onLogout} headerActions={pageActions}>
      <Card>
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Daftar Permohonan Masuk</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Warga & Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Perubahan Data</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permohonan.sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map((p) => (
                <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${p.id === processingId ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-slate-900">{p.wargaNama}</p>
                    <p className="text-xs text-slate-500">{new Date(p.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-semibold capitalize">{p.field}</span>: "{p.dataLama}" ➔ "{p.dataBaru}"
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      p.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                      p.status === 'Disetujui' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {p.status === 'Menunggu' && (
                      <>
                        <Button size="sm" variant="success" onClick={() => handleOpenConfirmModal(p, 'Disetujui')} disabled={!!processingId}>Setujui</Button>
                        <Button size="sm" variant="danger" onClick={() => handleOpenConfirmModal(p, 'Ditolak')} disabled={!!processingId}>Tolak</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
               {permohonan.length === 0 && (
                  <tr>
                      <td colSpan={4} className="text-center py-10 text-slate-500">Tidak ada permohonan masuk.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={`Konfirmasi Aksi Permohonan`}
      >
        {actioningPermohonan && (
            <div className="space-y-4">
                <p className="text-slate-600">
                    Apakah Anda yakin ingin
                    <strong className={`font-bold ${actioningPermohonan.status === 'Disetujui' ? 'text-green-600' : 'text-red-600'}`}>
                        {actioningPermohonan.status === 'Disetujui' ? ' MENYETUJUI ' : ' MENOLAK '}
                    </strong>
                    permohonan perubahan data ini?
                </p>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                    <p className="font-semibold text-slate-800">
                        {permohonan.find(p => p.id === actioningPermohonan.id)?.wargaNama}
                    </p>
                    <p className="text-slate-600 mt-1">
                        Ubah <span className="font-semibold capitalize">{permohonan.find(p => p.id === actioningPermohonan.id)?.field}</span> dari 
                        <span className="font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded mx-1">"{permohonan.find(p => p.id === actioningPermohonan.id)?.dataLama}"</span>
                        menjadi
                        <span className="font-mono bg-green-100 text-green-800 px-1.5 py-0.5 rounded mx-1">"{permohonan.find(p => p.id === actioningPermohonan.id)?.dataBaru}"</span>
                    </p>
                </div>
                <p className="text-xs text-slate-500 pt-2">
                    {actioningPermohonan.status === 'Disetujui' ? 'Data warga akan diperbarui secara permanen.' : 'Permohonan akan ditandai sebagai ditolak.'}
                </p>
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-4">
                    <Button variant="secondary" onClick={() => setIsConfirmModalOpen(false)} disabled={!!processingId}>Batal</Button>
                    <Button
                        variant={actioningPermohonan.status === 'Disetujui' ? 'success' : 'danger'}
                        onClick={handleConfirmAction}
                        disabled={!!processingId}
                    >
                        {processingId === actioningPermohonan.id ? 'Memproses...' : `Ya, ${actioningPermohonan.status}`}
                    </Button>
                </div>
            </div>
        )}
      </Modal>

    </PageLayout>
  );
};

export default Permohonan;