import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useData } from '../hooks/useMockData';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { SparklesIcon } from '../constants';

type Message = {
  sender: 'user' | 'assistant' | 'loading';
  text: string;
};

// Very basic markdown to HTML converter for safe rendering
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    // Convert **bold** to <strong>
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert lists starting with *
    html = html.replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>');
    html = html.replace(/<\/ul>\n<ul>/g, ''); // Merge consecutive list items

    return <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: html }} />;
};


const SmartAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const allData = useData();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    useEffect(() => {
        if (isOpen) {
            setIsLoading(false);
            setUserInput('');
            setMessages([
                { sender: 'assistant', text: "Halo! Saya Asisten Cerdas Desa. Ada yang bisa saya bantu? Anda bisa menanyakan tentang data penduduk, bantuan, atau meminta ringkasan." }
            ]);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (prompt: string) => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt || isLoading) return;

        const newUserMessage: Message = { sender: 'user', text: trimmedPrompt };
        setMessages(prev => [...prev, newUserMessage, { sender: 'loading', text: '' }]);
        setUserInput('');
        setIsLoading(true);

        try {
            const contextData = {
                infoDesa: allData.infoDesa,
                statistik: {
                    totalWarga: allData.warga.length,
                    totalKK: allData.kartuKeluarga.length,
                    totalUMKM: allData.umkm.length,
                    totalPenerimaBantuanTahunIni: new Set(allData.bantuan.filter(b => b.tahun === new Date().getFullYear()).map(b => b.wargaId)).size
                },
                warga: allData.warga.slice(0, 30).map(({id, nama, dusun, pekerjaan}) => ({id, nama, dusun, pekerjaan})), // Sample data
                bantuan: allData.bantuan.slice(0, 30).map(({wargaId, jenis, tahun, nominal}) => ({wargaId, jenis, tahun, nominal})), // Sample data
                umkm: allData.umkm.slice(0, 30).map(({namaUsaha, pemilikId, jenisUsaha}) => ({namaUsaha, pemilikId, jenisUsaha})), // Sample data
            };

            const systemInstruction = `You are a helpful AI assistant for a village administration dashboard called "Admin Desa". You will be given a context of the village's data in JSON format, followed by a user's question. Your task is to answer the user's question based *only* on the provided data context. Do not use any external knowledge. If the data is insufficient to answer the question, state that the information is not available in the provided data. All your responses must be in Indonesian. Format your answers using simple Markdown (bolding with **text**, unordered lists with *). Be friendly, concise, and clear. Do not repeat the question in your answer.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        parts: [
                            { text: `Data Konteks: ${JSON.stringify(contextData)}` },
                            { text: `Pertanyaan Pengguna: ${trimmedPrompt}` }
                        ]
                    }
                ],
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            const assistantResponse: Message = { sender: 'assistant', text: response.text };
            setMessages(prev => [...prev.slice(0, -1), assistantResponse]);

        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: Message = { sender: 'assistant', text: "Maaf, terjadi kesalahan saat menghubungi asisten. Silakan coba lagi." };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        } finally {
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };
    
    const PREDEFINED_PROMPTS = [
        "Buat ringkasan statistik desa",
        "Siapa saja penerima bantuan BLT?",
        "Ada UMKM apa saja di desa ini?",
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-20"
                aria-label="Buka Asisten Cerdas"
            >
                <SparklesIcon className="w-7 h-7" />
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Asisten Cerdas Desa">
                <div className="flex flex-col h-[65vh]">
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 rounded-xl">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'loading' ? (
                                    <div className="bg-slate-200 text-slate-800 rounded-2xl p-3 max-w-lg inline-block">
                                        <Spinner size="sm" />
                                    </div>
                                ) : (
                                    <div className={`rounded-2xl p-3 max-w-lg inline-block ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                        {msg.sender === 'assistant' ? <SimpleMarkdown text={msg.text} /> : msg.text}
                                    </div>
                                )}
                            </div>
                        ))}
                        {messages.length === 1 && (
                            <div className="pt-4 space-y-2">
                                <p className="text-sm text-slate-500 text-center mb-3">Atau coba salah satu dari ini:</p>
                                {PREDEFINED_PROMPTS.map(prompt => (
                                    <button
                                        key={prompt}
                                        onClick={() => handleSendMessage(prompt)}
                                        className="w-full text-left text-sm p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <form
                        className="mt-4 flex items-center gap-3"
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(userInput); }}
                    >
                        <Input
                            ref={inputRef}
                            type="text"
                            className="flex-1"
                            placeholder="Ketik pertanyaan Anda..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !userInput.trim()}>
                            {isLoading ? '...' : 'Kirim'}
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default SmartAssistant;
