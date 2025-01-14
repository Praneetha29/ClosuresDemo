import React, { useState } from 'react';
import { Lock, Unlock, BookLock } from 'lucide-react';

const DiaryDemo = () => {
    const [diaryName, setDiaryName] = useState('Praneetha');
    const [password, setPassword] = useState('');
    const [newEntry, setNewEntry] = useState('');
    const [selectedMood, setSelectedMood] = useState('happy');
    const [output, setOutput] = useState([]);
    const [isLocked, setIsLocked] = useState(true);
    const [selectedDecorations, setSelectedDecorations] = useState([]);

    const moods = {
        happy: '😊',
        excited: '🎉',
        thoughtful: '🤔',
        tired: '😴',
        coding: '👩‍💻',
        peaceful: '🌸',
        coffee: '☕️'
    };

    const decorations = {
        stars: '✨',
        hearts: '💖',
        flowers: '🌸',
        sparkles: '⭐️',
        moons: '🌙',
        coffee: '☕️',
        books: '📚'
    };

    // Diary implementation
    const createDiary = (ownerName) => {
        const entries = [];
        let lastModified = null;
        let isUnlocked = false;

        const decorator = (() => {
            const activeDecorations = [];
            return {
                addDecoration: (symbol) => {
                    activeDecorations.push(symbol);
                    return activeDecorations.join(' ');
                },
                clearDecorations: () => {
                    activeDecorations.length = 0;
                },
                decorateText: (text) => {
                    if (activeDecorations.length === 0) return text;
                    return `${activeDecorations.join(' ')} ${text} ${activeDecorations.reverse().join(' ')}`;
                }
            };
        })();

        return {
            unlock: (pass) => {
                isUnlocked = pass === `${ownerName}123`;
                return isUnlocked;
            },

            lock: () => {
                isUnlocked = false;
                return "🔒 Diary locked!";
            },

            addEntry: (mood, text, decorations = []) => {
                if (!isUnlocked) return "🔒 Please unlock the diary first!";

                lastModified = new Date();
                decorator.clearDecorations();
                decorations.forEach(d => decorator.addDecoration(d));

                entries.push({
                    date: new Date(),
                    mood,
                    text: decorator.decorateText(text),
                    id: `${ownerName}-${entries.length}`
                });
                return `✨ Entry #${entries.length} saved in ${ownerName}'s diary!`;
            },

            getEntries: () => {
                if (!isUnlocked) return "🔒 Please unlock the diary first!";
                return entries;
            },

            getStats: () => {
                const basicStats = {
                    totalEntries: entries.length,
                    isLocked: !isUnlocked
                };

                if (!isUnlocked) return basicStats;

                return {
                    ...basicStats,
                    lastModified,
                    hasEntries: entries.length > 0,
                    latestMood: entries.length > 0 ? entries[entries.length - 1].mood : null
                };
            }
        };
    };

    const [diary] = useState(() => createDiary(diaryName));

    const addNewEntry = () => {
        if (!newEntry.trim()) return;

        const result = diary.addEntry(selectedMood, newEntry, selectedDecorations);
        if (result.includes("locked")) {
            setOutput(prev => [...prev, { type: 'error', text: result }]);
        } else {
            setNewEntry('');
            const entries = diary.getEntries();
            setOutput([
                { type: 'success', text: result },
                {
                    type: 'success',
                    text: '📖 Current entries:',
                    entries: Array.isArray(entries) ? entries : []
                }
            ]);
        }
    };

    const showEntries = () => {
        const entries = diary.getEntries();
        if (typeof entries === 'string') {
            setOutput(prev => [...prev, { type: 'error', text: entries }]);
        } else {
            setOutput([{
                type: 'success',
                text: '📖 Current entries:',
                entries: Array.isArray(entries) ? entries : []
            }]);
        }
    };
    const tryUnlock = () => {
        const unlocked = diary.unlock(password);
        if (!unlocked) {
            setOutput(prev => [...prev, {
                type: 'error',
                text: "🔒 Nice try! But this diary is private!"
            }]);
            setIsLocked(true);
        } else {
            setOutput([{
                type: 'success',
                text: '🎉 Diary unlocked! You can now write entries:'
            }]);
            setIsLocked(false);
            showEntries();
        }
        setPassword('');
    };

    const lockDiary = () => {
        const result = diary.lock();
        setOutput(prev => [...prev, { type: 'success', text: result }]);
        setIsLocked(true);
    };

    const getStats = () => {
        const stats = diary.getStats();
        setOutput([{
            type: 'info',
            text: '📊 Diary Stats:',
            stats
        }]);
    };

    return (
        <div className="min-h-screen bg-[#F0F6F1] p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className={`
          relative bg-[#395245] rounded-lg shadow-xl p-12
          border-4 border-[#2C3E35]
          ${isLocked ? 'mb-8' : 'mb-0'}
        `}
                >
                    <div className="text-center">
                        <h1 className="text-4xl font-serif text-[#F0F6F1] mb-4">
                            {diaryName}'s Diary
                        </h1>
                        <div className="text-[#C18783] font-serif italic text-lg">
                            {isLocked ? "🔒 Locked" : "🔓 Unlocked"}
                        </div>
                    </div>

                    {isLocked && (
                        <div className="mt-8 max-w-lg mx-auto">
                            <div className="bg-[#2C3E35] rounded-lg p-6">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password..."
                                    className="w-full px-4 py-3 rounded bg-[#F0F6F1] text-[#2C3E35] 
                           placeholder-[#C18783] mb-4 shadow-inner focus:outline-none 
                           focus:ring-2 focus:ring-[#C18783]"
                                    onKeyPress={(e) => e.key === 'Enter' && tryUnlock()}
                                />
                                <button
                                    onClick={tryUnlock}
                                    className="w-full bg-[#C18783] text-[#F0F6F1] rounded-lg py-3 
                           hover:bg-opacity-90 transition-colors flex items-center 
                           justify-center gap-2 shadow-md"
                                >
                                    <Unlock className="w-4 h-4" /> Unlock Diary
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                {output.map((item, index) => (
                                    item.type === 'error' && (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg text-center
                               bg-[#C18783] bg-opacity-20 text-[#C18783] 
                               border border-[#C18783]"
                                        >
                                            {item.text}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>


                {!isLocked && (
                    <div className="relative bg-[#F0F6F1] p-6">

                        <div className="absolute top-4 right-4">
                            <button
                                onClick={lockDiary}
                                className="bg-[#C18783] text-[#F0F6F1] px-4 py-2 rounded-lg 
                         hover:bg-opacity-90 transition-colors flex items-center gap-2"
                            >
                                <BookLock className="w-4 h-4" /> Lock Diary
                            </button>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="bg-[#F0F6F1] p-6 rounded-lg shadow-lg border border-[#395245]">
                                <h2 className="text-2xl font-serif mb-4 text-[#395245]">New Entry</h2>


                                <div className="mb-4">
                                    <div className="text-sm text-[#395245] mb-2">Today I feel...</div>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(moods).map(([mood, emoji]) => (
                                            <button
                                                key={mood}
                                                onClick={() => setSelectedMood(mood)}
                                                className={`px-3 py-1 rounded-full border ${selectedMood === mood
                                                        ? 'bg-[#C18783] border-[#395245] text-white'
                                                        : 'bg-white border-[#395245] hover:bg-[#C18783] hover:text-white'
                                                    }`}
                                            >
                                                {emoji} {mood}
                                            </button>
                                        ))}
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <div className="text-sm text-[#395245] mb-2">Add some flair...</div>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(decorations).map(([name, symbol]) => (
                                            <button
                                                key={name}
                                                onClick={() => setSelectedDecorations(prev =>
                                                    prev.includes(symbol)
                                                        ? prev.filter(d => d !== symbol)
                                                        : [...prev, symbol]
                                                )}
                                                className={`px-3 py-1 rounded-full border ${selectedDecorations.includes(symbol)
                                                        ? 'bg-[#C18783] border-[#395245] text-white'
                                                        : 'bg-white border-[#395245] hover:bg-[#C18783] hover:text-white'
                                                    }`}
                                            >
                                                {symbol}
                                            </button>
                                        ))}
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <textarea
                                        value={newEntry}
                                        onChange={(e) => setNewEntry(e.target.value)}
                                        placeholder="Dear Diary..."
                                        className="w-full h-32 p-4 rounded-lg border border-[#395245] 
                             bg-white focus:bg-white transition-colors
                             text-[#395245] font-serif placeholder-[#C18783]"
                                    />
                                </div>

                                <button
                                    onClick={addNewEntry}
                                    className="w-full bg-[#395245] text-white rounded-lg py-2 
                           hover:bg-[#2C3E35] transition-colors"
                                >
                                    Save Entry
                                </button>
                            </div>


                            <div className="bg-[#F0F6F1] p-6 rounded-lg shadow-lg border border-[#395245]">
                                <div className="mb-4">
                                    <h2 className="text-2xl font-serif text-[#395245] mb-3">My Entries</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={showEntries}
                                            className="px-4 py-2 bg-[#C18783] text-[#F0F6F1] rounded-lg 
                               hover:bg-opacity-90 transition-colors flex-1 font-serif"
                                        >
                                            View All Entries
                                        </button>
                                        <button
                                            onClick={getStats}
                                            className="px-4 py-2 bg-[#C18783] text-[#F0F6F1] rounded-lg 
                               hover:bg-opacity-90 transition-colors flex-1 font-serif"
                                        >
                                            View Stats
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                    {output.map((item, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg"
                                        >
                                            {item.entries ? (
                                                <div className="space-y-4">
                                                    {item.entries.map((entry, i) => (
                                                        <div
                                                            key={i}
                                                            className="p-4 bg-white rounded-lg border border-[#395245]"
                                                        >
                                                            <div className="text-sm text-[#C18783] mb-1 font-serif">
                                                                {new Date(entry.date).toLocaleDateString('en-US', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                })}
                                                            </div>
                                                            <div className="font-serif text-[#395245]">
                                                                {moods[entry.mood]} {entry.text}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className={`p-4 rounded-lg ${item.type === 'error'
                                                        ? 'bg-[#C18783] bg-opacity-20 text-[#C18783] border border-[#C18783]'
                                                        : 'bg-[#395245] bg-opacity-10 text-[#395245] border border-[#395245]'
                                                    }`}>
                                                    {item.text}
                                                    {item.stats && (
                                                        <div className="mt-2 text-sm">
                                                            <div>📚 Total Entries: {item.stats.totalEntries}</div>
                                                            {item.stats.lastModified && (
                                                                <div>
                                                                    ✏️ Last Written: {new Date(item.stats.lastModified).toLocaleDateString()}
                                                                </div>
                                                            )}
                                                            {item.stats.latestMood && (
                                                                <div>
                                                                    💭 Latest Mood: {moods[item.stats.latestMood]} {item.stats.latestMood}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiaryDemo;