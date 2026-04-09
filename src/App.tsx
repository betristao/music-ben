import React, { useState, useEffect } from 'react';
import { Play, Check, X, Star, Music, ArrowRight, Home, Trophy, ArrowUp, ArrowDown, HelpCircle, Volume2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initAudio, playPianoNote, playChord, playMelody, playCorrect, playIncorrect } from './lib/audio';
import { Staff } from './components/Staff';
import { TREBLE_NOTES, BASS_NOTES, ACCIDENTALS, INTERVALS, CHORDS, CADENCES, SIGNS, MELODIES, NoteDef, ALL_NOTES } from './data/modules';

type View = 'home' | 'treble' | 'bass' | 'accidentals' | 'intervals' | 'chords' | 'cadences' | 'dictation_sound' | 'dictation_melody' | 'signs' | 'quiz' | 'results';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // Interaction state
  const [userY, setUserY] = useState(60);
  const [userAccidental, setUserAccidental] = useState<'sharp' | 'flat' | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  useEffect(() => {
    const handleInteraction = () => initAudio();
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const resetState = () => {
    setUserY(60);
    setUserAccidental(null);
    setShowHelp(false);
    setFeedback(null);
  };

  const startModule = (v: View) => {
    setView(v);
    setCurrentIndex(0);
    resetState();
  };

  const handleVerifyNotePlacement = (correctNote: NoteDef) => {
    if (feedback) return;
    
    if (userY === correctNote.y && userAccidental === (correctNote.accidental || null)) {
      playPianoNote(correctNote.freq, 1.5, 0);
      setFeedback('correct');
      playCorrect();
      if (view === 'quiz' || view === 'dictation_sound') setScore(s => s + 1);
    } else {
      setFeedback('incorrect');
      playIncorrect();
    }

    setTimeout(() => {
      setFeedback(null);
      if (userY === correctNote.y && userAccidental === (correctNote.accidental || null)) {
        advanceModule();
      }
    }, 1500);
  };

  const handleMultipleChoice = (selectedName: string, correctName: string, item: any) => {
    if (feedback) return;
    
    if (view === 'intervals' || view === 'chords') {
      playChord(item.freqs);
    } else if (view === 'cadences') {
      playChord(item.chords[0], 1);
      setTimeout(() => playChord(item.chords[1], 2), 1000);
    } else if (view === 'dictation_melody') {
      playMelody(item.freqs);
    }

    if (selectedName === correctName) {
      setFeedback('correct');
      setTimeout(playCorrect, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(playIncorrect, 1000);
    }

    setTimeout(() => {
      setFeedback(null);
      advanceModule();
    }, 2500);
  };

  const advanceModule = () => {
    let max = 0;
    if (view === 'treble') max = TREBLE_NOTES.length;
    else if (view === 'bass') max = BASS_NOTES.length;
    else if (view === 'accidentals') max = ACCIDENTALS.length;
    else if (view === 'intervals') max = INTERVALS.length;
    else if (view === 'chords') max = CHORDS.length;
    else if (view === 'cadences') max = CADENCES.length;
    else if (view === 'dictation_sound') max = 5; // 5 questions
    else if (view === 'dictation_melody') max = MELODIES.length;

    if (currentIndex < max - 1) {
      setCurrentIndex(i => i + 1);
      resetState();
    } else {
      setView('home');
    }
  };

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center px-4"
    >
      <div className="bg-white p-6 rounded-full shadow-lg mb-4">
        <Music className="w-16 h-16 text-indigo-500" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
        Musical <span className="text-indigo-500">Kids</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-md">
        Aprende a ler música, reconhecer acordes e treinar o teu ouvido!
      </p>
      
      <div className="w-full max-w-4xl mt-8 space-y-8">
        
        <div>
          <h3 className="text-xl font-bold text-slate-500 mb-4 text-left border-b-2 border-slate-200 pb-2">Nível 1: Leitura</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => startModule('treble')} className="btn-module bg-sky-400 hover:bg-sky-500">
              <span className="text-3xl mb-2">𝄞</span>
              <span className="font-semibold">Clave de Sol</span>
            </button>
            <button onClick={() => startModule('bass')} className="btn-module bg-emerald-400 hover:bg-emerald-500">
              <span className="text-3xl mb-2">𝄢</span>
              <span className="font-semibold">Clave de Fá</span>
            </button>
            <button onClick={() => startModule('accidentals')} className="btn-module bg-amber-400 hover:bg-amber-500">
              <span className="text-3xl mb-2">♯ ♭</span>
              <span className="font-semibold">Acidentes</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-500 mb-4 text-left border-b-2 border-slate-200 pb-2">Nível 2: Harmonia</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => startModule('intervals')} className="btn-module bg-purple-400 hover:bg-purple-500">
              <span className="text-3xl mb-2">↔️</span>
              <span className="font-semibold">Intervalos</span>
            </button>
            <button onClick={() => startModule('chords')} className="btn-module bg-pink-400 hover:bg-pink-500">
              <span className="text-3xl mb-2">🎹</span>
              <span className="font-semibold">Acordes</span>
            </button>
            <button onClick={() => startModule('cadences')} className="btn-module bg-indigo-400 hover:bg-indigo-500">
              <span className="text-3xl mb-2">🎵</span>
              <span className="font-semibold">Cadências</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-500 mb-4 text-left border-b-2 border-slate-200 pb-2">Nível 3: Treino Auditivo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => {
              // Generate 5 random notes for dictation
              const randomNotes = [];
              for(let i=0; i<5; i++) randomNotes.push(ALL_NOTES[Math.floor(Math.random() * ALL_NOTES.length)]);
              setQuizQuestions(randomNotes);
              startModule('dictation_sound');
            }} className="btn-module bg-teal-500 hover:bg-teal-600">
              <Volume2 className="w-8 h-8 mb-2" />
              <span className="font-semibold">Ditado de Sons</span>
            </button>
            <button onClick={() => startModule('dictation_melody')} className="btn-module bg-cyan-500 hover:bg-cyan-600">
              <Music className="w-8 h-8 mb-2" />
              <span className="font-semibold">Ditado Melódico</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-500 mb-4 text-left border-b-2 border-slate-200 pb-2">Estudo</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <button onClick={() => startModule('signs')} className="btn-module bg-slate-600 hover:bg-slate-700 !flex-row gap-4 !p-6">
              <BookOpen className="w-8 h-8" />
              <span className="font-semibold text-xl">Tabela de Sinais Musicais</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );

  const renderNotePlacement = () => {
    let title = '';
    let theory = '';
    let clef: 'treble' | 'bass' = 'treble';
    let notes: NoteDef[] = [];

    if (view === 'treble') {
      title = 'Clave de Sol';
      theory = 'A Clave de Sol indica que a nota Sol está na 2ª linha (a contar de baixo).';
      clef = 'treble';
      notes = TREBLE_NOTES;
    } else if (view === 'bass') {
      title = 'Clave de Fá';
      theory = 'A Clave de Fá indica que a nota Fá está na 4ª linha. É usada para sons graves.';
      clef = 'bass';
      notes = BASS_NOTES;
    } else if (view === 'accidentals') {
      title = 'Acidentes';
      theory = 'O Sustenido (♯) sobe a nota. O Bemol (♭) desce a nota.';
      clef = 'treble';
      notes = ACCIDENTALS;
    } else if (view === 'dictation_sound') {
      title = 'Ditado de Sons';
      theory = 'Ouve o som e coloca a nota no sítio certo!';
      clef = 'treble';
      notes = quizQuestions;
    }

    const currentNote = notes[currentIndex];
    if (!currentNote) return null;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-8">
        <div className="w-full flex justify-between items-center mb-8">
          <button onClick={() => setView('home')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Home className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <div className="w-10"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-100 mb-8 text-center">
          <p className="text-lg text-slate-700 font-medium">{theory}</p>
        </div>

        {view === 'dictation_sound' ? (
          <div className="mb-6 flex flex-col items-center">
            <button 
              onClick={() => playPianoNote(currentNote.freq, 1.5)}
              className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-600 hover:scale-105 transition-all"
            >
              <Volume2 className="w-10 h-10" />
            </button>
            <p className="mt-4 text-lg font-bold text-slate-700">Ouve e coloca a nota</p>
          </div>
        ) : (
          <h3 className="text-2xl font-bold text-indigo-600 mb-6">
            Coloca a nota: <span className="text-slate-800">{currentNote.name}</span>
          </h3>
        )}

        <div className="w-full relative">
          <Staff clef={clef} notes={[{ y: userY, accidental: userAccidental }]} />
          
          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-24 h-24 rounded-full shadow-xl z-10 ${
                  feedback === 'correct' ? 'bg-emerald-400 text-white' : 'bg-rose-400 text-white'
                }`}
              >
                {feedback === 'correct' ? <Check className="w-12 h-12" /> : <X className="w-12 h-12" />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-6 space-y-6">
          <div className="flex items-center justify-center gap-6 w-full">
            <div className="flex flex-col gap-2">
              <button onClick={() => setUserY(y => Math.max(-20, y - 10))} className="p-4 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm"><ArrowUp className="w-6 h-6" /></button>
              <button onClick={() => setUserY(y => Math.min(140, y + 10))} className="p-4 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm"><ArrowDown className="w-6 h-6" /></button>
            </div>
            <div className="flex gap-2 bg-white p-2 border-2 border-slate-200 rounded-2xl shadow-sm">
              <button onClick={() => setUserAccidental('flat')} className={`w-14 h-14 rounded-xl text-2xl ${userAccidental === 'flat' ? 'bg-indigo-500 text-white' : 'text-slate-700'}`}>♭</button>
              <button onClick={() => setUserAccidental(null)} className={`w-14 h-14 rounded-xl text-2xl ${userAccidental === null ? 'bg-indigo-500 text-white' : 'text-slate-700'}`}>♮</button>
              <button onClick={() => setUserAccidental('sharp')} className={`w-14 h-14 rounded-xl text-2xl ${userAccidental === 'sharp' ? 'bg-indigo-500 text-white' : 'text-slate-700'}`}>♯</button>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            {view !== 'dictation_sound' && (
              <button onClick={() => setShowHelp(!showHelp)} className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-100 text-amber-700 rounded-2xl font-semibold">
                <HelpCircle className="w-5 h-5" /> Ajuda
              </button>
            )}
            <button onClick={() => handleVerifyNotePlacement(currentNote)} disabled={feedback !== null} className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-md">
              Verificar
            </button>
          </div>

          <AnimatePresence>
            {showHelp && currentNote.hint && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center">
                💡 {currentNote.hint}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-8 text-slate-500 font-medium">{currentIndex + 1} / {notes.length}</div>
      </motion.div>
    );
  };

  const renderMultipleChoice = () => {
    let title = '';
    let theory = '';
    let items: any[] = [];
    let isAudioOnly = false;

    if (view === 'intervals') {
      title = 'Intervalos'; theory = 'Um intervalo é a distância entre duas notas.'; items = INTERVALS;
    } else if (view === 'chords') {
      title = 'Acordes'; theory = 'Um acorde é um conjunto de 3 ou mais notas tocadas ao mesmo tempo.'; items = CHORDS;
    } else if (view === 'cadences') {
      title = 'Cadências'; theory = 'Uma cadência é uma sequência de acordes que conclui uma frase musical.'; items = CADENCES; isAudioOnly = true;
    } else if (view === 'dictation_melody') {
      title = 'Ditado Melódico'; theory = 'Ouve a melodia e escolhe a sequência correta.'; items = MELODIES; isAudioOnly = true;
    }

    const currentItem = items[currentIndex];
    if (!currentItem) return null;

    const playCurrent = () => {
      if (view === 'intervals' || view === 'chords') playChord(currentItem.freqs);
      else if (view === 'cadences') {
        playChord(currentItem.chords[0], 1);
        setTimeout(() => playChord(currentItem.chords[1], 2), 1000);
      } else if (view === 'dictation_melody') {
        playMelody(currentItem.freqs);
      }
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-8">
        <div className="w-full flex justify-between items-center mb-8">
          <button onClick={() => setView('home')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Home className="w-6 h-6" /></button>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <div className="w-10"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-100 mb-8 text-center">
          <p className="text-lg text-slate-700 font-medium">{theory}</p>
        </div>

        <div className="w-full mb-8 relative flex flex-col items-center">
          {isAudioOnly ? (
            <button onClick={playCurrent} className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-600 hover:scale-105 transition-all mb-4">
              <Play className="w-12 h-12 ml-2" />
            </button>
          ) : (
            <div className="w-full relative">
              <Staff clef="treble" notes={currentItem.notes} />
              <button onClick={playCurrent} className="absolute -bottom-4 right-4 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-600">
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          )}

          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-24 h-24 rounded-full shadow-xl z-10 ${
                  feedback === 'correct' ? 'bg-emerald-400 text-white' : 'bg-rose-400 text-white'
                }`}
              >
                {feedback === 'correct' ? <Check className="w-12 h-12" /> : <X className="w-12 h-12" />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mb-4">O que ouviste/vês?</h3>
        
        <div className="flex flex-wrap justify-center gap-2 w-full">
          {items.map(opt => (
            <button
              key={opt.name}
              onClick={() => handleMultipleChoice(opt.name, currentItem.name, currentItem)}
              disabled={feedback !== null}
              className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-base font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-500 hover:shadow-md transition-all disabled:opacity-50"
            >
              {opt.name}
            </button>
          ))}
        </div>

        <div className="flex gap-4 w-full max-w-md mt-6">
          <button onClick={() => setShowHelp(!showHelp)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-100 text-amber-700 rounded-2xl font-semibold">
            <HelpCircle className="w-5 h-5" /> Ajuda
          </button>
        </div>

        <AnimatePresence>
          {showHelp && currentItem.hint && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full max-w-md mt-4 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center">
              💡 {currentItem.hint}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-8 text-slate-500 font-medium">{currentIndex + 1} / {items.length}</div>
      </motion.div>
    );
  };

  const renderSigns = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-8">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={() => setView('home')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Home className="w-6 h-6" /></button>
        <h2 className="text-3xl font-bold text-slate-800">Tabela de Sinais</h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {SIGNS.map(sign => (
          <div key={sign.name} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-100 flex items-center gap-4 md:gap-6">
            <div className={`font-serif italic text-indigo-600 text-center flex-shrink-0 flex items-center justify-center ${sign.symbol.length > 2 ? 'text-3xl min-w-[4rem]' : 'text-5xl min-w-[4rem]'}`}>
              {sign.symbol}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{sign.name}</h3>
              <p className="text-slate-600 mt-1">{sign.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      <main className="container mx-auto max-w-4xl pt-8 pb-16">
        {view === 'home' && renderHome()}
        {(view === 'treble' || view === 'bass' || view === 'accidentals' || view === 'dictation_sound') && renderNotePlacement()}
        {(view === 'intervals' || view === 'chords' || view === 'cadences' || view === 'dictation_melody') && renderMultipleChoice()}
        {view === 'signs' && renderSigns()}
      </main>
    </div>
  );
}
