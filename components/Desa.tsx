
import React, { useMemo } from 'react';
import { useData } from '../hooks/useMockData';
import { PageLayout } from './Dashboard';
import InfoDesa from './InfoDesa';
import Card from './ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface DesaProps {
    onLogout: () => void;
}

const calculateAge = (birthDateString: string): number => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const Desa: React.FC<DesaProps> = ({ onLogout }) => {
    const { warga, infoDesa } = useData();
    
    // Guard against null infoDesa during initial render cycles
    if (!infoDesa) {
        return <PageLayout title="Dashboard Desa" onLogout={onLogout}><Card><p>Memuat data desa...</p></Card></PageLayout>;
    }

    const totalDusun = useMemo(() => infoDesa.dusun.length, [infoDesa.dusun]);

    const chartData = useMemo(() => {
        // Data for Dusun Population
        const dusunCounts = infoDesa.dusun.map(dusun => ({
            name: dusun.nama,
            count: warga.filter(w => w.dusun === dusun.nama).length,
        }));

        // Data for Age Statistics
        const ageGroups = { 'Anak (0-17)': 0, 'Remaja (18-35)': 0, 'Dewasa (36-55)': 0, 'Lansia (56+)': 0 };
        warga.forEach(w => {
            const age = calculateAge(w.tanggalLahir);
            if (age <= 17) ageGroups['Anak (0-17)']++;
            else if (age <= 35) ageGroups['Remaja (18-35)']++;
            else if (age <= 55) ageGroups['Dewasa (36-55)']++;
            else ageGroups['Lansia (56+)']++;
        });

        // Data for Occupation Statistics
        const occupationCounts: { [key: string]: number } = {};
        warga.forEach(w => {
            occupationCounts[w.pekerjaan] = (occupationCounts[w.pekerjaan] || 0) + 1;
        });
        const sortedOccupations = Object.entries(occupationCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        return { dusunCounts, ageGroups, sortedOccupations };
    }, [warga, infoDesa.dusun]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { font: { family: 'Inter' } } },
            y: { grid: { display: false }, border: { display: false }, ticks: { font: { family: 'Inter' } } },
        },
    };
    
    const horizontalChartOptions = {
        ...chartOptions,
        indexAxis: 'y' as const,
    };
    
    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: { family: 'Inter' },
                    padding: 20,
                    boxWidth: 12,
                    usePointStyle: true,
                },
            },
        },
    };

    const dusunChart = {
        labels: chartData.dusunCounts.map(d => d.name),
        datasets: [{
            label: 'Jumlah Penduduk',
            data: chartData.dusunCounts.map(d => d.count),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 8,
        }],
    };

    const ageChart = {
        labels: Object.keys(chartData.ageGroups),
        datasets: [{
            label: 'Kelompok Usia',
            data: Object.values(chartData.ageGroups),
            backgroundColor: ['#3b82f6', '#16a34a', '#f97316', '#c026d3'],
            hoverOffset: 4,
        }],
    };
    
    const occupationChart = {
        labels: chartData.sortedOccupations.map(([job]) => job),
        datasets: [{
            label: 'Jumlah Penduduk',
            data: chartData.sortedOccupations.map(([, count]) => count),
            backgroundColor: 'rgba(22, 163, 74, 0.7)',
            borderColor: 'rgba(22, 163, 74, 1)',
            borderWidth: 1,
            borderRadius: 8,
        }],
    };

    return (
        <PageLayout title="Dashboard Desa" onLogout={onLogout}>
            <InfoDesa infoDesa={infoDesa} totalPenduduk={warga.length} totalDusun={totalDusun} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Populasi per Dusun</h3>
                    <div className="h-72">
                        <Bar options={chartOptions} data={dusunChart} />
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Statistik Usia</h3>
                    <div className="h-72">
                        <Doughnut data={ageChart} options={doughnutChartOptions} />
                    </div>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Statistik Pekerjaan (Top 10)</h3>
                <div className="h-96">
                    <Bar options={horizontalChartOptions} data={occupationChart} />
                </div>
            </Card>

        </PageLayout>
    );
};

export default Desa;