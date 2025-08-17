
import React from 'react';
import Card from './ui/Card';
import { InfoDesa as InfoDesaType } from '../types';

const OfficeBuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);

const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UsersGroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.253 9.527 9.527 0 00-4.12-9.654M15 19.128v-3.872M15 19.128a9.37 9.37 0 01-3.75 0M9 19.128c1.358 0 2.737-.113 4.024-.336M9 19.128v-3.872m0 3.872a9.37 9.37 0 00-3.75 0m-3.112-9.654a9.527 9.527 0 00-4.12 9.654c1.233 2.223 3.51 3.64 6.063 3.64 2.218 0 4.24-.998 5.602-2.585m-7.85-8.441a4.5 4.5 0 017.85 0m-7.85 0a4.5 4.5 0 00-7.85 0m7.85 0c-1.332 0-2.553.44-3.536 1.176" />
    </svg>
);

const MapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m-10.5 3.75 1.5-1.5L6 18l-1.5-1.5L3 18V6.75l1.5-1.5L6 6l1.5-1.5L9 6l1.5-1.5L12 6l1.5-1.5L15 6l1.5-1.5L18 6v9.75l-1.5 1.5L15 15l-1.5 1.5L12 15l-1.5 1.5L9 15Z" />
    </svg>
);

interface InfoDesaProps {
    infoDesa: InfoDesaType | null;
    totalPenduduk: number;
    totalDusun: number;
}

const InfoItem: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string; value: string | number; colorName: string }> = ({ icon: Icon, label, value, colorName }) => {
    const colorClasses: { [key: string]: string } = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-800',
        purple: 'bg-purple-100 text-purple-600',
    };
    const color = colorClasses[colorName] || colorClasses.blue;

    return (
        <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-4">
            <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                 <Icon className="h-6 w-6" />
            </div>
            <div>
                <div className="text-sm text-slate-500">{label}</div>
                <div className="text-lg font-semibold text-slate-900">{value}</div>
            </div>
        </div>
    );
};

const InfoDesa: React.FC<InfoDesaProps> = ({ infoDesa, totalPenduduk, totalDusun }) => {
    if (!infoDesa) {
        return (
            <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                         <div key={i} className="bg-slate-100 rounded-2xl p-4 h-[88px]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                                <div>
                                    <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                                    <div className="h-6 bg-slate-200 rounded w-28"></div>
                                </div>
                            </div>
                         </div>
                    ))}
                </div>
            </Card>
        )
    }

    const infoItems = [
        { icon: OfficeBuildingIcon, label: "Nama Desa", value: infoDesa.namaDesa, colorName: 'blue' },
        { icon: UserCircleIcon, label: "Kepala Desa", value: infoDesa.kepalaDesa, colorName: 'green' },
        { icon: UsersGroupIcon, label: "Total Penduduk", value: `${totalPenduduk} Jiwa`, colorName: 'yellow' },
        { icon: MapIcon, label: "Jumlah Dusun", value: `${totalDusun} Dusun`, colorName: 'purple' },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {infoItems.map((item, index) => (
                    <InfoItem key={index} {...item} />
                ))}
            </div>
        </Card>
    );
};

export default InfoDesa;
