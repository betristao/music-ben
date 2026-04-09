import React, { useState, useEffect } from 'react';
import { Play, Check, X, Star, Music, ArrowRight, Home, Trophy, ArrowUp, ArrowDown, HelpCircle, Volume2, BookOpen, Clock, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initAudio, playPianoNote, playChord, playMelody, playCorrect, playIncorrect, playTick, playViolin, playFlute } from './lib/audio';
import { Staff } from './components/Staff';
import { TREBLE_NOTES, BASS_NOTES, ACCIDENTALS, INTERVALS, CHORDS, CADENCES, SIGNS, MELODIES, NoteDef, ALL_NOTES, RHYTHM_PATTERNS, INSTRUMENTS_DATA } from './data/modules';

type View = 'home' | 'treble' | 'bass' | 'accidentals' | 'intervals' | 'chords' | 'cadences' | 'dictation_sound' | 'dictation_melody' | 'signs' | 'rhythm' | 'compose' | 'instruments' | 'quiz' | 'results';

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

  // Persistence
  const [progress, setProgress] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('musical-kids-progress');
    return saved ? JSON.parse(saved) : {};
  });
  const [showTrophy, setShowTrophy] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('musical-kids-progress', JSON.stringify(progress));
  }, [progress]);

  const [isRecordingRhythm, setIsRecordingRhythm] = useState(false);
  const [rhythmStartTime, setRhythmStartTime] = useState(0);
  const [recordedClicks, setRecordedClicks] = useState<number[]>([]);

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
    else if (view === 'rhythm') max = RHYTHM_PATTERNS.length;
    else if (view === 'instruments') max = INSTRUMENTS_DATA.length;
    else if (view === 'quiz') max = quizQuestions.length;

    if (currentIndex < max - 1) {
      setCurrentIndex(i => i + 1);
      resetState();
    } else {
      // Mark as completed and show trophy if first time
      if (!progress[view] && view !== 'quiz' && view !== 'results') {
        setShowTrophy(view);
      }
      if (view === 'quiz') {
        setView('results');
      } else {
        setProgress(p => ({ ...p, [view]: true }));
        setView('home');
      }
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
            <button onClick={() => startModule('treble')} className="btn-module bg-sky-400 hover:bg-sky-500 relative">
              {progress['treble'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <span className="text-3xl mb-2">𝄞</span>
              <span className="font-semibold">Clave de Sol</span>
            </button>
            <button onClick={() => startModule('bass')} className="btn-module bg-emerald-400 hover:bg-emerald-500 relative">
              {progress['bass'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <span className="text-3xl mb-2">𝄢</span>
              <span className="font-semibold">Clave de Fá</span>
            </button>
            <button onClick={() => startModule('accidentals')} className="btn-module bg-amber-400 hover:bg-amber-500 relative">
              {progress['accidentals'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <span className="text-3xl mb-2">♯ ♭</span>
              <span className="font-semibold">Acidentes</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-500 mb-4 text-left border-b-2 border-slate-200 pb-2">Nível 2: Harmonia</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => startModule('intervals')} className="btn-module bg-purple-400 hover:bg-purple-500 relative">
              {progress['intervals'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <span className="text-3xl mb-2">↔️</span>
              <span className="font-semibold">Intervalos</span>
            </button>
            <button onClick={() => startModule('chords')} className="btn-module bg-pink-400 hover:bg-pink-500 relative">
              {progress['chords'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <span className="text-3xl mb-2">🎹</span>
              <span className="font-semibold">Acordes</span>
            </button>
            <button onClick={() => startModule('cadences')} className="btn-module bg-indigo-400 hover:bg-indigo-500 relative">
              {progress['cadences'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <span className="text-3xl mb-2">🎵</span>
              <span className="font-semibold">Cadências</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-500 mb-4 text-left border-b-2 border-slate-200 pb-2">Nível 3: Treino Auditivo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => {
              const randomNotes = [];
              for(let i=0; i<5; i++) randomNotes.push(ALL_NOTES[Math.floor(Math.random() * ALL_NOTES.length)]);
              setQuizQuestions(randomNotes);
              startModule('dictation_sound');
            }} className="btn-module bg-teal-500 hover:bg-teal-600 relative">
              {progress['dictation_sound'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <Volume2 className="w-8 h-8 mb-2" />
              <span className="font-semibold">Ditado de Sons</span>
            </button>
            <button onClick={() => startModule('dictation_melody')} className="btn-module bg-cyan-500 hover:bg-cyan-600 relative">
              {progress['dictation_melody'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <Music className="w-8 h-8 mb-2" />
              <span className="font-semibold">Ditado Melódico</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-500 mb-4 text-left border-b-2 border-slate-200 pb-2">Nível 4: Ritmo e Criatividade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => startModule('rhythm')} className="btn-module bg-orange-400 hover:bg-orange-500 relative">
              {progress['rhythm'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <Clock className="w-8 h-8 mb-2" />
              <span className="font-semibold">Ritmo</span>
            </button>
            <button onClick={() => setView('compose')} className="btn-module bg-violet-400 hover:bg-violet-500">
              <Edit3 className="w-8 h-8 mb-2" />
              <span className="font-semibold">Compositor</span>
            </button>
            <button onClick={() => startModule('instruments')} className="btn-module bg-red-400 hover:bg-red-500 relative">
              {progress['instruments'] && <Check className="absolute top-2 right-2 w-6 h-6 text-white bg-emerald-500 rounded-full p-1" />}
              <Volume2 className="w-8 h-8 mb-2" />
              <span className="font-semibold">Instrumentos</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-500 mb-4 text-left border-b-2 border-slate-200 pb-2">Desafio Final</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <button 
              onClick={() => {
                const totalQuestions = 10;
                const pool = [
                  ...TREBLE_NOTES.map(n => ({ ...n, type: 'note', clef: 'treble' })),
                  ...BASS_NOTES.map(n => ({ ...n, type: 'note', clef: 'bass' })),
                  ...INTERVALS.map(i => ({ ...i, type: 'multiple', category: 'Intervalo' })),
                  ...CHORDS.map(c => ({ ...c, type: 'multiple', category: 'Acorde' })),
                  ...INSTRUMENTS_DATA.map(i => ({ ...i, type: 'instrument' }))
                ];
                const selected = [];
                for(let i=0; i<totalQuestions; i++) {
                  selected.push(pool[Math.floor(Math.random() * pool.length)]);
                }
                setQuizQuestions(selected);
                setScore(0);
                startModule('quiz');
              }} 
              className="btn-module bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 !flex-row gap-4 !p-6"
            >
              <Star className="w-8 h-8 text-amber-300 fill-amber-300" />
              <div className="text-left">
                <span className="font-semibold text-xl block">Super Teste de Conhecimentos</span>
                <span className="text-sm opacity-90">10 perguntas aleatórias de todos os níveis!</span>
              </div>
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

        <div className="pt-8 border-t-2 border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-100 w-full text-left">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-indigo-500" /> O teu Progresso
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Módulos Concluídos</span>
                  <span>{Object.keys(progress).length} / 10</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (Object.keys(progress).length / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-100 w-full text-left">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Estante de Troféus
              </h3>
              <div className="flex flex-wrap gap-3">
                {Object.keys(progress).length === 0 ? (
                  <p className="text-slate-400 text-sm italic">Ainda não ganhaste troféus. Começa a aprender!</p>
                ) : (
                  Object.keys(progress).map(mod => (
                    <div key={mod} className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shadow-sm" title={mod.replace('_', ' ')}>
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                  ))
                )}
              </div>
            </div>
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

  const renderRhythm = () => {
    const currentItem = RHYTHM_PATTERNS[currentIndex];
    if (!currentItem) return null;

    const playPattern = () => {
      currentItem.pattern.forEach(t => playTick(t));
      // Visual feedback via state if needed, but for now just sound
    };

    const startRecording = () => {
      setRecordedClicks([]);
      setRhythmStartTime(Date.now());
      setIsRecordingRhythm(true);
      playTick(); // Start with a tick
    };

    const handleClick = () => {
      if (!isRecordingRhythm) return;
      const now = Date.now();
      const time = (now - rhythmStartTime) / 1000;
      setRecordedClicks(prev => [...prev, time]);
      playTick();
    };

    const verify = () => {
      setIsRecordingRhythm(false);
      let isCorrect = true;
      if (Math.abs(recordedClicks.length - currentItem.pattern.length) > 0) {
        isCorrect = false;
      } else {
        for(let i=0; i<currentItem.pattern.length; i++) {
          if (Math.abs(recordedClicks[i] - currentItem.pattern[i]) > 0.3) {
            isCorrect = false;
            break;
          }
        }
      }

      if (isCorrect) {
        setFeedback('correct');
        playCorrect();
      } else {
        setFeedback('incorrect');
        playIncorrect();
      }

      setTimeout(() => {
        setFeedback(null);
        if (isCorrect) advanceModule();
        else setRecordedClicks([]);
      }, 2000);
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-8">
        <div className="w-full flex justify-between items-center mb-8">
          <button onClick={() => setView('home')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Home className="w-6 h-6" /></button>
          <h2 className="text-2xl font-bold text-slate-800">Mestre do Ritmo</h2>
          <div className="w-10"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-100 mb-8 text-center w-full">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">{currentItem.name}</h3>
          <p className="text-lg text-slate-700 font-medium">{currentItem.hint}</p>
        </div>

        <div className="flex flex-col items-center gap-8 w-full">
          {!isRecordingRhythm ? (
            <button onClick={playPattern} className="flex items-center gap-2 px-8 py-4 bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-600 transition-all">
              <Volume2 className="w-6 h-6" /> Ouvir Ritmo
            </button>
          ) : (
            <div className="text-xl font-bold text-rose-500 animate-pulse">A GRAVAR... Clica no botão abaixo!</div>
          )}

          <button 
            onMouseDown={isRecordingRhythm ? handleClick : startRecording}
            className={`w-48 h-48 rounded-full shadow-2xl flex items-center justify-center transition-all transform active:scale-95 ${
              isRecordingRhythm ? 'bg-rose-400 text-white border-8 border-rose-200' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {isRecordingRhythm ? <Clock className="w-20 h-20" /> : <Play className="w-20 h-20 ml-2" />}
          </button>

          {isRecordingRhythm && (
            <button onClick={verify} className="px-12 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-md hover:bg-emerald-600">
              Verificar
            </button>
          )}

          <div className="flex gap-2">
            {currentItem.pattern.map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-full ${recordedClicks.length > i ? 'bg-indigo-500' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-slate-500 font-medium">{currentIndex + 1} / {RHYTHM_PATTERNS.length}</div>
      </motion.div>
    );
  };

  const [composedNotes, setComposedNotes] = useState<any[]>([]);
  const renderCompose = () => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-8">
        <div className="w-full flex justify-between items-center mb-8">
          <button onClick={() => setView('home')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Home className="w-6 h-6" /></button>
          <h2 className="text-2xl font-bold text-slate-800">Compositor Livre</h2>
          <div className="w-10"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-100 mb-8 text-center w-full">
          <p className="text-lg text-slate-700 font-medium">Cria a tua própria música! Adiciona notas e ouve o resultado.</p>
        </div>

        <div className="w-full relative mb-8">
          <Staff clef="treble" notes={composedNotes} />
          <div className="absolute top-0 right-0 p-2 flex flex-col gap-2">
            <button onClick={() => setComposedNotes([])} className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 w-full max-w-md">
          {TREBLE_NOTES.slice(0, 8).map(n => (
            <button 
              key={n.id} 
              onClick={() => {
                setComposedNotes(prev => [...prev, { y: n.y, x: 60 + prev.length * 40 }]);
                playPianoNote(n.freq);
              }}
              className="py-3 bg-white border-2 border-indigo-100 rounded-xl font-bold text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              {n.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            composedNotes.forEach((cn, i) => {
              const noteData = ALL_NOTES.find(an => an.y === cn.y);
              if (noteData) playPianoNote(noteData.freq, 1.5, i * 0.5);
            });
          }}
          disabled={composedNotes.length === 0}
          className="mt-8 flex items-center gap-2 px-12 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-emerald-600 disabled:opacity-50 transition-all"
        >
          <Play className="w-6 h-6" /> Tocar Tudo
        </button>
      </motion.div>
    );
  };

  const renderInstruments = () => {
    const currentItem = INSTRUMENTS_DATA[currentIndex];
    if (!currentItem) return null;

    const playSound = () => {
      if (currentItem.type === 'piano') playPianoNote(currentItem.freq);
      else if (currentItem.type === 'violin') playViolin(currentItem.freq);
      else if (currentItem.type === 'flute') playFlute(currentItem.freq);
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-8">
        <div className="w-full flex justify-between items-center mb-8">
          <button onClick={() => setView('home')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Home className="w-6 h-6" /></button>
          <h2 className="text-2xl font-bold text-slate-800">Conheces o Som?</h2>
          <div className="w-10"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-100 mb-8 text-center w-full">
          <p className="text-lg text-slate-700 font-medium">Ouve o som e escolhe o instrumento correto!</p>
        </div>

        <button onClick={playSound} className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-red-600 hover:scale-105 transition-all mb-12">
          <Volume2 className="w-16 h-16" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {INSTRUMENTS_DATA.map(opt => (
            <button
              key={opt.name}
              onClick={() => {
                if (opt.name === currentItem.name) {
                  setFeedback('correct');
                  playCorrect();
                  setTimeout(() => { setFeedback(null); advanceModule(); }, 2000);
                } else {
                  setFeedback('incorrect');
                  playIncorrect();
                  setTimeout(() => setFeedback(null), 1500);
                }
              }}
              disabled={feedback !== null}
              className="py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-xl text-slate-700 hover:border-red-400 hover:text-red-500 transition-all shadow-sm"
            >
              {opt.name}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              className={`mt-8 flex items-center justify-center w-20 h-20 rounded-full shadow-lg ${
                feedback === 'correct' ? 'bg-emerald-400 text-white' : 'bg-rose-400 text-white'
              }`}
            >
              {feedback === 'correct' ? <Check className="w-10 h-10" /> : <X className="w-10 h-10" />}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-8 text-slate-500 font-medium">{currentIndex + 1} / {INSTRUMENTS_DATA.length}</div>
      </motion.div>
    );
  };

  const renderQuiz = () => {
    const q = quizQuestions[currentIndex];
    if (!q) return null;

    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-700">Pergunta {currentIndex + 1} de {quizQuestions.length}</span>
          </div>
          <div className="bg-indigo-100 px-4 py-1 rounded-full text-indigo-700 font-bold">
            Pontos: {score}
          </div>
        </div>

        {q.type === 'note' && (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 font-sans">Coloca a nota: <span className="text-indigo-600">{q.name}</span></h3>
            <div className="w-full relative mb-8">
              <Staff clef={q.clef} notes={[{ y: userY, accidental: userAccidental }]} />
              <AnimatePresence>{feedback && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  {feedback === 'correct' ? <Check className="w-20 h-20 text-emerald-500 bg-white rounded-full shadow-lg" /> : <X className="w-20 h-20 text-rose-500 bg-white rounded-full shadow-lg" />}
                </motion.div>
              )}</AnimatePresence>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <div className="flex gap-2">
                <button onClick={() => setUserY(y => Math.max(-20, y - 10))} className="flex-1 p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50"><ArrowUp /></button>
                <button onClick={() => setUserY(y => Math.min(140, y + 10))} className="flex-1 p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50"><ArrowDown /></button>
              </div>
              <button onClick={() => handleVerifyNotePlacement(q)} disabled={feedback !== null} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-md hover:bg-emerald-600 shadow-emerald-200">Verificar</button>
            </div>
          </div>
        )}

        {q.type === 'multiple' && (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">{q.category}: O que vês/ouves?</h3>
            <div className="w-full relative mb-8">
              <Staff clef="treble" notes={q.notes} />
              <button onClick={() => playChord(q.freqs)} className="absolute -bottom-4 right-4 w-12 h-12 bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-600 active:scale-95 transition-all"><Volume2 /></button>
              <AnimatePresence>{feedback && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  {feedback === 'correct' ? <Check className="w-20 h-20 text-emerald-500 bg-white rounded-full shadow-lg" /> : <X className="w-20 h-20 text-rose-500 bg-white rounded-full shadow-lg" />}
                </motion.div>
              )}</AnimatePresence>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {(q.category === 'Intervalo' ? INTERVALS : CHORDS).map(opt => (
                <button key={opt.name} onClick={() => handleMultipleChoice(opt.name, q.name, q)} disabled={feedback !== null} className="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all">
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {q.type === 'instrument' && (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-8">Identifica o instrumento</h3>
            <button onClick={() => {
              if (q.type === 'piano') playPianoNote(q.freq);
              else if (q.type === 'violin') playViolin(q.freq);
              else if (q.type === 'flute') playFlute(q.freq);
              else playPianoNote(q.freq);
            }} className="w-32 h-32 bg-red-500 text-white rounded-full shadow-xl flex items-center justify-center mb-12 hover:scale-105 active:scale-95 transition-all outline-none"><Volume2 className="w-16 h-16" /></button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {INSTRUMENTS_DATA.map(opt => (
                <button key={opt.name} onClick={() => {
                  if (opt.name === q.name) { setFeedback('correct'); playCorrect(); setScore(s => s + 1); setTimeout(() => { setFeedback(null); advanceModule(); }, 1500); }
                  else { setFeedback('incorrect'); playIncorrect(); setTimeout(() => setFeedback(null), 1500); }
                }} disabled={feedback !== null} className="py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-xl text-slate-700 hover:border-red-400 hover:text-red-500 transition-all shadow-sm">
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let rank = '';
    let icon = null;

    if (percentage === 100) { rank = 'Mestre da Música'; icon = <Trophy className="w-24 h-24 text-amber-500" />; }
    else if (percentage >= 70) { rank = 'Músico Talento'; icon = <Star className="w-24 h-24 text-indigo-500 fill-indigo-500" />; }
    else { rank = 'Aprendiz Dedicado'; icon = <Music className="w-24 h-24 text-slate-400" />; }

    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-xl border-2 border-slate-100 max-w-md mx-auto">
        <div className="mb-6">{icon}</div>
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Quiz Terminado!</h2>
        <p className="text-xl text-slate-600 mb-8 font-medium">Nível: <span className="font-bold text-indigo-600">{rank}</span></p>
        
        <div className="w-full bg-slate-50 rounded-2xl p-6 mb-8 flex justify-around border-2 border-slate-100">
          <div>
            <span className="block text-sm text-slate-400 uppercase font-bold tracking-wider">Pontos</span>
            <span className="text-4xl font-black text-indigo-600">{score}</span>
          </div>
          <div>
            <span className="block text-sm text-slate-400 uppercase font-bold tracking-wider">Acerto</span>
            <span className="text-4xl font-black text-emerald-500">{percentage}%</span>
          </div>
        </div>

        <button onClick={() => setView('home')} className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-600 transition-all mb-4 hover:shadow-indigo-200">
          Voltar ao Início
        </button>
        <button onClick={() => setView('quiz')} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">Tentar de novo</button>
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
        {view === 'rhythm' && renderRhythm()}
        {view === 'compose' && renderCompose()}
        {view === 'instruments' && renderInstruments()}
        {view === 'quiz' && renderQuiz()}
        {view === 'results' && renderResults()}
      </main>

      <AnimatePresence>
        {showTrophy && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-amber-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Parabéns!</h2>
              <p className="text-slate-600 mb-8">
                Ganhaste o troféu de <span className="font-bold text-indigo-600">{showTrophy.replace('_', ' ')}</span>!
              </p>
              <button 
                onClick={() => setShowTrophy(null)}
                className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-colors shadow-lg"
              >
                Continuar a aprender
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
