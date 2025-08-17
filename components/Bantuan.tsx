
import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../hooks/useMockData';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import { Bantuan as BantuanType, TargetBantuan, Warga, KartuKeluarga } from '../types';
import { UsersIcon, DocumentArrowDownIcon } from '../constants';
import { PageLayout } from './Dashboard';

interface BantuanProps {
    onLogout: () => void;
}

const BanknotesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V6.375m18 15v-1.5c0-.414-.336-.75-.75-.75h-.75m1.5 1.5h.375c.621 0 1.125.504 1.125-1.125v-9.75c0 .621-.504-1.125-1.125-1.125h-.375M14.25 12a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
);

const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125-1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

const formatNumber = (val: number | string | undefined) => {
    if (val === undefined || val === null) return '0';
    const num = typeof val === 'string' ? parseInt(val.replace(/[^0-9]/g, ''), 10) || 0 : val;
    return new Intl.NumberFormat('id-ID').format(num);
};

const parseFormattedNumber = (val: string | undefined): number => {
    if (val === undefined || val === null) return 0;
    return Number(String(val).replace(/[^0-9]/g, '')) || 0;
};

type BantuanFormData = Omit<BantuanType, 'id'>;

const BantuanForm: React.FC<{ onSave: (data: Omit<BantuanType, 'id'>) => Promise<void>; onCancel: () => void; isSubmitting: boolean; wargaList: Warga[]; kartuKeluargaList: KartuKeluarga[]; bantuanData?: BantuanType | null; defaultYear?: number; }> = ({ onSave, onCancel, isSubmitting, wargaList, kartuKeluargaList, bantuanData, defaultYear }) => {
    
    const getInitialFormData = (): BantuanFormData => {
        return {
            wargaId: bantuanData?.wargaId || '',
            jenis: bantuanData?.jenis || 'BLT',
            tahun: bantuanData?.tahun || defaultYear || new Date().getFullYear(),
            nominal: bantuanData?.nominal || 0,
            keterangan: bantuanData?.keterangan || '',
        };
    };

    const [formData, setFormData] = useState<BantuanFormData>(getInitialFormData());
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [isNominalFocused, setIsNominalFocused] = useState(false);

    const getRecipientDisplay = (warga?: Warga) => {
        if (!warga) return '';
        const kk = kartuKeluargaList.find(kk => kk.id === warga.kartuKeluargaId);
        return `${warga.nama} (${warga.nik})${kk ? ` - KK: ${kk.nomorKK}` : ''}`;
    };

    useEffect(() => {
        const initialData = getInitialFormData();
        setFormData(initialData);
        
        const recipient = wargaList.find(w => w.id === initialData.wargaId);
        if (recipient) {
            setSearchTerm(getRecipientDisplay(recipient));
            setShowResults(false);
        } else {
            setSearchTerm('');
            setShowResults(true);
        }
    }, [bantuanData, defaultYear]);

    const filteredWarga = useMemo(() => {
        if (!searchTerm || (formData.wargaId && !showResults)) return [];
        
        const lowercasedTerm = searchTerm.toLowerCase();
        
        const wargaIdsInMatchingKKs = new Set<string>();
        if(searchTerm.match(/^\d{10,}/)) { 
            kartuKeluargaList.forEach(kk => {
                if (kk.nomorKK.includes(searchTerm)) {
                    kk.anggotaIds.forEach(id => wargaIdsInMatchingKKs.add(id));
                }
            });
        }

        return wargaList.filter(w =>
            w.nama.toLowerCase().includes(lowercasedTerm) ||
            w.nik.includes(searchTerm) ||
            wargaIdsInMatchingKKs.has(w.id)
        ).slice(0, 10);
    }, [searchTerm, wargaList, kartuKeluargaList, formData.wargaId, showResults]);

    const handleRecipientSelect = (warga: Warga) => {
        setFormData(prev => ({...prev, wargaId: warga.id}));
        setSearchTerm(getRecipientDisplay(warga));
        setShowResults(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setFormData(prev => ({ ...prev, wargaId: '' }));
        setShowResults(true);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'nominal' ? parseFormattedNumber(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.wargaId) {
            alert('Silakan pilih warga penerima dari daftar pencarian.');
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={isSubmitting}>
            <div>
                <label htmlFor="wargaId-search" className="block text-sm font-medium text-slate-700 mb-1.5">Penerima</label>
                <div className="relative">
                    <Input
                        id="wargaId-search"
                        name="wargaId-search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                        required={!formData.wargaId}
                        placeholder="Ketik nama, NIK, atau No. KK untuk mencari..."
                        autoComplete="off"
                        disabled={!!bantuanData} // Disable changing recipient on edit
                    />
                    {showResults && filteredWarga.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {filteredWarga.map(w => (
                                <li
                                    key={w.id}
                                    className="px-4 py-3 hover:bg-slate-100 cursor-pointer"
                                    onMouseDown={() => handleRecipientSelect(w)}
                                >
                                    <p className="font-semibold text-sm text-slate-900">{w.nama}</p>
                                    <p className="text-xs text-slate-500 font-mono">
                                        {w.nik}
                                        {w.kartuKeluargaId && ` (KK: ${kartuKeluargaList.find(kk => kk.id === w.kartuKeluargaId)?.nomorKK})`}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                    {showResults && filteredWarga.length === 0 && searchTerm && !formData.wargaId && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-xl shadow-lg p-4">
                            <p className="text-center text-sm text-slate-500">Warga tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="jenis" className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Bantuan</label>
                    <select id="jenis" name="jenis" value={formData.jenis} onChange={handleChange} required className="bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-xl py-2.5 px-3.5">
                        <option>BLT</option> <option>PKH</option> <option>BPNT</option> <option>KIS</option> <option>Lainnya</option>
                    </select>
                </div>
                <Input label="Tahun" name="tahun" type="number" value={formData.tahun} onChange={handleChange} required />
            </div>
            <Input 
                label="Nominal (Rp)" 
                name="nominal" 
                type="text"
                inputMode="numeric"
                value={isNominalFocused ? formData.nominal.toString().replace(/[^0-9]/g, '') || '' : formatNumber(formData.nominal)}
                onChange={handleChange}
                onFocus={() => setIsNominalFocused(true)}
                onBlur={() => setIsNominalFocused(false)}
                placeholder="0"
                required 
            />
            <div>
                <label htmlFor="keterangan" className="block text-sm font-medium text-slate-700 mb-1.5">Keterangan</label>
                <textarea id="keterangan" name="keterangan" value={formData.keterangan || ''} onChange={handleChange} rows={3} className="bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-xl" placeholder="Catatan tambahan (opsional)"></textarea>
            </div>
          </fieldset>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Batal</Button>
                <Button type="submit" disabled={isSubmitting || !formData.wargaId}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
            </div>
        </form>
    );
}

const TargetForm: React.FC<{
    currentTarget: TargetBantuan;
    onSave: (data: TargetBantuan) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}> = ({ currentTarget, onSave, onCancel, isSubmitting }) => {
    // State to hold the string values for the inputs. This is the source of truth for the form fields.
    const [formState, setFormState] = useState({
        totalAnggaran: formatNumber(currentTarget.totalAnggaran),
        targetPenerima: formatNumber(currentTarget.targetPenerima),
    });

    // When the modal re-opens with new data, sync the form state.
    useEffect(() => {
        setFormState({
            totalAnggaran: formatNumber(currentTarget.totalAnggaran),
            targetPenerima: formatNumber(currentTarget.targetPenerima),
        });
    }, [currentTarget]);

    // Handle typing in the input fields.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only allow digits, and update the string state.
        const numericValue = value.replace(/[^0-9]/g, '');
        setFormState(prev => ({ ...prev, [name]: numericValue }));
    };

    // When an input is focused, remove formatting for easy editing.
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const rawValue = parseFormattedNumber(value).toString();
        // If the value is '0', show an empty string for better UX.
        setFormState(prev => ({ ...prev, [name]: rawValue === '0' ? '' : rawValue }));
    };

    // When the input loses focus, apply the number formatting for readability.
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFormattedNumber(value);
        setFormState(prev => ({ ...prev, [name]: formatNumber(numValue) }));
    };

    // On submit, parse the string values back to numbers and save.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            tahun: currentTarget.tahun,
            totalAnggaran: parseFormattedNumber(formState.totalAnggaran),
            targetPenerima: parseFormattedNumber(formState.targetPenerima),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={isSubmitting}>
                <Input
                    label="Target Anggaran (Rp)"
                    name="totalAnggaran"
                    type="text"
                    inputMode="numeric"
                    value={formState.totalAnggaran}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="0"
                    required
                />
                <Input
                    label="Target Penerima (Jiwa)"
                    name="targetPenerima"
                    type="text"
                    inputMode="numeric"
                    value={formState.targetPenerima}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="0"
                    required
                    className="mt-4"
                />
            </fieldset>
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-4">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Batal</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
            </div>
        </form>
    );
};

const Bantuan: React.FC<BantuanProps> = ({ onLogout }) => {
  const { bantuan, warga, kartuKeluarga, targetBantuan, addBantuan, updateBantuan, deleteBantuan, updateTargetBantuan } = useData();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBantuan, setEditingBantuan] = useState<BantuanType | null>(null);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTarget = useMemo(() => {
    return targetBantuan.find(t => t.tahun === selectedYear) || {
        tahun: selectedYear,
        totalAnggaran: 0,
        targetPenerima: 0,
    };
  }, [targetBantuan, selectedYear]);

  const dataBantuanForYear = useMemo(() => {
    return bantuan
      .filter(b => b.tahun === selectedYear)
      .filter(b => filterJenis === 'Semua' || b.jenis === filterJenis)
      .map(b => {
        const w = warga.find(w => w.id === b.wargaId);
        return {
          ...b,
          namaWarga: w?.nama || 'N/A',
          nikWarga: w?.nik || 'N/A',
        };
      }).sort((a,b) => b.id.localeCompare(a.id));
  }, [bantuan, warga, selectedYear, filterJenis]);
  
  const statsForYear = useMemo(() => {
    const filteredBantuan = bantuan.filter(b => b.tahun === selectedYear);
    const totalNominal = filteredBantuan.reduce((acc, curr) => acc + curr.nominal, 0);
    const uniqueRecipientsCount = new Set(filteredBantuan.map(b => b.wargaId)).size;
    
    return {
      totalNominal,
      uniqueRecipientsCount
    };
  }, [bantuan, selectedYear]);

  const handleSaveBantuan = async (data: Omit<BantuanType, 'id'>) => {
      setIsSubmitting(true);
      try {
          if (editingBantuan) {
              await updateBantuan({ ...data, id: editingBantuan.id });
          } else {
              await addBantuan(data);
          }
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setEditingBantuan(null);
      } catch (e: any) {
          alert(`Gagal menyimpan: ${e.message}`);
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleEditClick = (b: BantuanType) => {
      setEditingBantuan(b);
      setIsEditModalOpen(true);
  };
  
  const handleDelete = async (id: string) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus data penyaluran bantuan ini?")) {
          await deleteBantuan(id);
      }
  };

  const handleSaveTarget = async (data: TargetBantuan) => {
    setIsSubmitting(true);
    try {
        await updateTargetBantuan(data);
        setIsTargetModalOpen(false);
    } catch (e: any) {
        alert(`Gagal menyimpan: ${e.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleExportCSV = () => {
    if (!dataBantuanForYear.length) {
        alert("Tidak ada data untuk diekspor.");
        return;
    }
    const headers = ["Nama Penerima", "NIK", "Jenis Bantuan", "Nominal (Rp)", "Tahun", "Keterangan"];
    const csvRows = dataBantuanForYear.map(row => 
        [
            `"${row.namaWarga}"`,
            `'${row.nikWarga}`,
            row.jenis,
            row.nominal,
            row.tahun,
            `"${row.keterangan || ''}"`
        ].join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `penyaluran_bantuan_${selectedYear}_${filterJenis.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const pageActions = (
    <div className="flex gap-2">
        <Button onClick={() => { setEditingBantuan(null); setIsAddModalOpen(true); }} size="sm">Tambah Penyaluran</Button>
        <Button onClick={handleExportCSV} variant="secondary" size="sm" className="hidden sm:flex">
          <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> Ekspor
        </Button>
    </div>
  );

  return (
    <PageLayout title="Manajemen Bantuan Sosial" onLogout={onLogout} headerActions={pageActions}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatCard icon={BanknotesIcon} title="Total Anggaran Tahun Ini" value={`Rp ${formatNumber(statsForYear.totalNominal)}`} />
            <StatCard icon={UsersIcon} title="Total Penerima Tahun Ini" value={`${statsForYear.uniqueRecipientsCount} Orang`} />
            <div onClick={() => setIsTargetModalOpen(true)} className="cursor-pointer group">
                <Card className="h-full transition-all duration-300 group-hover:bg-blue-50 group-hover:border-blue-300">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                            <ChartBarIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Target Anggaran {selectedYear}</p>
                            <p className="text-xl font-bold text-slate-800">Rp {formatNumber(currentTarget.totalAnggaran)}</p>
                            <p className="text-sm text-slate-500">{formatNumber(currentTarget.targetPenerima)} Target Penerima</p>
                        </div>
                    </div>
                     <p className="text-xs text-center text-slate-400 group-hover:text-blue-600 mt-2 font-semibold">Klik untuk mengubah target</p>
                </Card>
            </div>
        </div>

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4 self-start flex-wrap">
                <h2 className="text-xl font-semibold text-slate-800">Riwayat Penyaluran</h2>
                <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-slate-300 rounded-xl py-1.5 px-2.5">
                    <option>2025</option> <option>2024</option> <option>2023</option>
                </select>
                 <select value={filterJenis} onChange={e => setFilterJenis(e.target.value)} className="bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-slate-300 rounded-xl py-1.5 px-2.5">
                    <option>Semua</option> <option>BLT</option> <option>PKH</option> <option>BPNT</option> <option>KIS</option> <option>Lainnya</option>
                </select>
            </div>
             <Button onClick={handleExportCSV} variant="secondary" size="sm" className="sm:hidden w-full">
                Ekspor Data
            </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Penerima</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jenis</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nominal</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {dataBantuanForYear.map(b => (
                    <tr key={b.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium text-slate-800 text-sm">{b.namaWarga}</p>
                            <p className="text-xs text-slate-500 font-mono">{b.nikWarga}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${b.jenis === 'BLT' ? 'bg-blue-100 text-blue-800' : b.jenis === 'PKH' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {b.jenis}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">Rp {formatNumber(b.nominal)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                            <Button size="sm" variant="secondary" onClick={() => handleEditClick(b)}>Ubah</Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(b.id)}>Hapus</Button>
                        </td>
                    </tr>
                ))}
                {dataBantuanForYear.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-10 text-slate-500">Tidak ada data untuk tahun dan jenis bantuan ini.</td></tr>
                )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Modal title="Tambah Penyaluran Bantuan" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <BantuanForm onSave={handleSaveBantuan} onCancel={() => setIsAddModalOpen(false)} isSubmitting={isSubmitting} wargaList={warga} kartuKeluargaList={kartuKeluarga} defaultYear={selectedYear}/>
      </Modal>

      <Modal title="Ubah Data Penyaluran" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {editingBantuan && <BantuanForm bantuanData={editingBantuan} onSave={handleSaveBantuan} onCancel={() => setIsEditModalOpen(false)} isSubmitting={isSubmitting} wargaList={warga} kartuKeluargaList={kartuKeluarga}/>}
      </Modal>

      <Modal
          title={`Ubah Target Bantuan Tahun ${selectedYear}`}
          isOpen={isTargetModalOpen}
          onClose={() => setIsTargetModalOpen(false)}
      >
        <TargetForm
            currentTarget={currentTarget}
            isSubmitting={isSubmitting}
            onCancel={() => setIsTargetModalOpen(false)}
            onSave={handleSaveTarget}
        />
      </Modal>
    </PageLayout>
  );
};

const StatCard: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>; title: string; value: string; }> = ({ icon: Icon, title, value }) => (
    <Card className="h-full">
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    </Card>
);

export default Bantuan;
