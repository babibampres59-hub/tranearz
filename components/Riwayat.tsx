import React from 'react';
import { useData } from '../hooks/useMockData';
import { PageLayout } from './Dashboard';
import Card from './ui/Card';
import { ClockIcon } from '../constants';

const Riwayat: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { logAktivitas } = useData();

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 60) return `${seconds} detik yang lalu`;
        if (minutes < 60) return `${minutes} menit yang lalu`;
        if (hours < 24) return `${hours} jam yang lalu`;
        if (days < 7) return `${days} hari yang lalu`;
        
        return date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <PageLayout title="Riwayat & Log Aktivitas" onLogout={onLogout}>
            <Card>
                <div className="flow-root">
                    <ul role="list" className="-mb-8">
                        {logAktivitas.length > 0 ? logAktivitas.map((log, logIdx) => (
                            <li key={log.id}>
                                <div className="relative pb-8">
                                    {logIdx !== logAktivitas.length - 1 ? (
                                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center ring-8 ring-white">
                                                <ClockIcon className="h-5 w-5 text-slate-500" />
                                            </span>
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                            <div>
                                                <p className="text-sm text-slate-700">
                                                    {log.aktivitas}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Oleh <span className="font-medium">{log.pengguna}</span>
                                                </p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-slate-500">
                                                <span>{formatRelativeTime(log.tanggal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )) : (
                            <div className="text-center py-10 text-slate-500">
                                <ClockIcon className="mx-auto h-12 w-12 text-slate-400" />
                                <h3 className="mt-2 text-sm font-semibold text-slate-900">Tidak Ada Aktivitas</h3>
                                <p className="mt-1 text-sm text-slate-500">Belum ada aktivitas yang tercatat.</p>
                            </div>
                        )}
                    </ul>
                </div>
            </Card>
        </PageLayout>
    );
};

export default Riwayat;
