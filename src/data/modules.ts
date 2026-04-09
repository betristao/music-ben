export interface NoteDef {
  id: string;
  name: string;
  y: number;
  freq: number;
  accidental?: 'sharp' | 'flat' | null;
  hint: string;
}

export const TREBLE_NOTES: NoteDef[] = [
  { id: 'C4', name: 'Dó (Central)', y: 120, freq: 261.63, hint: 'Fica numa linha suplementar inferior, abaixo do pentagrama.' },
  { id: 'D4', name: 'Ré', y: 110, freq: 293.66, hint: 'Fica no espaço logo abaixo da primeira linha do pentagrama.' },
  { id: 'E4', name: 'Mi', y: 100, freq: 329.63, hint: 'Fica na 1ª linha do pentagrama (a contar de baixo).' },
  { id: 'F4', name: 'Fá', y: 90, freq: 349.23, hint: 'Fica no 1º espaço do pentagrama (a contar de baixo).' },
  { id: 'G4', name: 'Sol', y: 80, freq: 392.00, hint: 'Fica na 2ª linha. A clave de Sol nasce nesta linha!' },
  { id: 'A4', name: 'Lá', y: 70, freq: 440.00, hint: 'Fica no 2º espaço do pentagrama.' },
  { id: 'B4', name: 'Si', y: 60, freq: 493.88, hint: 'Fica na 3ª linha do pentagrama (a linha do meio).' },
  { id: 'C5', name: 'Dó (Agudo)', y: 50, freq: 523.25, hint: 'Fica no 3º espaço do pentagrama.' },
  { id: 'D5', name: 'Ré (Agudo)', y: 40, freq: 587.33, hint: 'Fica na 4ª linha do pentagrama.' },
  { id: 'E5', name: 'Mi (Agudo)', y: 30, freq: 659.25, hint: 'Fica no 4º espaço do pentagrama.' },
  { id: 'F5', name: 'Fá (Agudo)', y: 20, freq: 698.46, hint: 'Fica na 5ª linha do pentagrama (a linha de cima).' },
  { id: 'G5', name: 'Sol (Agudo)', y: 10, freq: 783.99, hint: 'Fica logo acima da 5ª linha.' },
  { id: 'A5', name: 'Lá (Agudo)', y: 0, freq: 880.00, hint: 'Fica numa linha suplementar superior.' },
];

export const BASS_NOTES: NoteDef[] = [
  { id: 'E2', name: 'Mi (Grave)', y: 120, freq: 82.41, hint: 'Fica numa linha suplementar inferior.' },
  { id: 'F2', name: 'Fá (Grave)', y: 110, freq: 87.31, hint: 'Fica no espaço logo abaixo da primeira linha.' },
  { id: 'G2', name: 'Sol (Grave)', y: 100, freq: 98.00, hint: 'Fica na 1ª linha do pentagrama (a contar de baixo).' },
  { id: 'A2', name: 'Lá (Grave)', y: 90, freq: 110.00, hint: 'Fica no 1º espaço do pentagrama.' },
  { id: 'B2', name: 'Si (Grave)', y: 80, freq: 123.47, hint: 'Fica na 2ª linha do pentagrama.' },
  { id: 'C3', name: 'Dó', y: 70, freq: 130.81, hint: 'Fica no 2º espaço do pentagrama.' },
  { id: 'D3', name: 'Ré', y: 60, freq: 146.83, hint: 'Fica na 3ª linha do pentagrama (a linha do meio).' },
  { id: 'E3', name: 'Mi', y: 50, freq: 164.81, hint: 'Fica no 3º espaço do pentagrama.' },
  { id: 'F3', name: 'Fá', y: 40, freq: 174.61, hint: 'Fica na 4ª linha. A clave de Fá tem dois pontos a abraçar esta linha!' },
  { id: 'G3', name: 'Sol', y: 30, freq: 196.00, hint: 'Fica no 4º espaço do pentagrama.' },
  { id: 'A3', name: 'Lá', y: 20, freq: 220.00, hint: 'Fica na 5ª linha do pentagrama (a linha de cima).' },
  { id: 'B3', name: 'Si', y: 10, freq: 246.94, hint: 'Fica logo acima da 5ª linha.' },
  { id: 'C4', name: 'Dó (Central)', y: 0, freq: 261.63, hint: 'Fica numa linha suplementar superior. É o mesmo Dó central da clave de Sol!' },
];

export const ACCIDENTALS: NoteDef[] = [
  { id: 'F4_sharp', name: 'Fá Sustenido', accidental: 'sharp', y: 90, freq: 369.99, hint: 'Coloca a nota no Fá (1º espaço) e adiciona o Sustenido (♯).' },
  { id: 'B4_flat', name: 'Si Bemol', accidental: 'flat', y: 60, freq: 466.16, hint: 'Coloca a nota no Si (3ª linha) e adiciona o Bemol (♭).' },
  { id: 'C4_sharp', name: 'Dó Sustenido', accidental: 'sharp', y: 120, freq: 277.18, hint: 'Coloca a nota no Dó central (linha extra inferior) e adiciona o Sustenido (♯).' },
  { id: 'E4_flat', name: 'Mi Bemol', accidental: 'flat', y: 100, freq: 311.13, hint: 'Coloca a nota no Mi (1ª linha) e adiciona o Bemol (♭).' },
  { id: 'G4_sharp', name: 'Sol Sustenido', accidental: 'sharp', y: 80, freq: 415.30, hint: 'Coloca a nota no Sol (2ª linha) e adiciona o Sustenido (♯).' },
  { id: 'A4_flat', name: 'Lá Bemol', accidental: 'flat', y: 70, freq: 415.30, hint: 'Coloca a nota no Lá (2º espaço) e adiciona o Bemol (♭).' },
  { id: 'D4_sharp', name: 'Ré Sustenido', accidental: 'sharp', y: 110, freq: 311.13, hint: 'Coloca a nota no Ré (abaixo da 1ª linha) e adiciona o Sustenido (♯).' },
];

export const ALL_NOTES = [...TREBLE_NOTES, ...BASS_NOTES, ...ACCIDENTALS];

export const INTERVALS = [
  { name: '2ª Menor', notes: [{y: 120, x: 80}, {y: 110, x: 120, accidental: 'flat'}], freqs: [261.63, 277.18], hint: 'Distância de 1 meio-tom (Dó - Ré bemol).' },
  { name: '2ª Maior', notes: [{y: 120, x: 80}, {y: 110, x: 120}], freqs: [261.63, 293.66], hint: 'Distância de 2 notas (Dó - Ré).' },
  { name: '3ª Menor', notes: [{y: 120, x: 80}, {y: 100, x: 120, accidental: 'flat'}], freqs: [261.63, 311.13], hint: 'Distância de 3 notas, menor (Dó - Mi bemol).' },
  { name: '3ª Maior', notes: [{y: 120, x: 80}, {y: 100, x: 120}], freqs: [261.63, 329.63], hint: 'Distância de 3 notas (Dó - Mi).' },
  { name: '4ª Perfeita', notes: [{y: 120, x: 80}, {y: 90, x: 120}], freqs: [261.63, 349.23], hint: 'Distância de 4 notas (Dó - Fá).' },
  { name: 'Trítono (4ª Aum / 5ª Dim)', notes: [{y: 120, x: 80}, {y: 90, x: 120, accidental: 'sharp'}], freqs: [261.63, 369.99], hint: 'O famoso trítono (Dó - Fá sustenido).' },
  { name: '5ª Perfeita', notes: [{y: 120, x: 80}, {y: 80, x: 120}], freqs: [261.63, 392.00], hint: 'Distância de 5 notas (Dó - Sol).' },
  { name: '6ª Menor', notes: [{y: 120, x: 80}, {y: 70, x: 120, accidental: 'flat'}], freqs: [261.63, 415.30], hint: 'Distância de 6 notas, menor (Dó - Lá bemol).' },
  { name: '6ª Maior', notes: [{y: 120, x: 80}, {y: 70, x: 120}], freqs: [261.63, 440.00], hint: 'Distância de 6 notas (Dó - Lá).' },
  { name: '7ª Menor', notes: [{y: 120, x: 80}, {y: 60, x: 120, accidental: 'flat'}], freqs: [261.63, 466.16], hint: 'Distância de 7 notas, menor (Dó - Si bemol).' },
  { name: '7ª Maior', notes: [{y: 120, x: 80}, {y: 60, x: 120}], freqs: [261.63, 493.88], hint: 'Distância de 7 notas (Dó - Si).' },
  { name: '8ª Perfeita', notes: [{y: 120, x: 80}, {y: 50, x: 120}], freqs: [261.63, 523.25], hint: 'Distância de 8 notas (Dó - Dó agudo).' },
];

export const CHORDS = [
  { name: 'Dó Maior', notes: [{y: 120}, {y: 100}, {y: 80}], freqs: [261.63, 329.63, 392.00], hint: 'Acorde maior: Dó, Mi, Sol.' },
  { name: 'Dó Menor', notes: [{y: 120}, {y: 100, accidental: 'flat'}, {y: 80}], freqs: [261.63, 311.13, 392.00], hint: 'Acorde menor: Dó, Mi bemol, Sol.' },
  { name: 'Fá Maior', notes: [{y: 90}, {y: 70}, {y: 50}], freqs: [349.23, 440.00, 523.25], hint: 'Acorde maior: Fá, Lá, Dó.' },
  { name: 'Fá Menor', notes: [{y: 90}, {y: 70, accidental: 'flat'}, {y: 50}], freqs: [349.23, 415.30, 523.25], hint: 'Acorde menor: Fá, Lá bemol, Dó.' },
  { name: 'Sol Maior', notes: [{y: 80}, {y: 60}, {y: 40}], freqs: [392.00, 493.88, 587.33], hint: 'Acorde maior: Sol, Si, Ré.' },
  { name: 'Sol Menor', notes: [{y: 80}, {y: 60, accidental: 'flat'}, {y: 40}], freqs: [392.00, 466.16, 587.33], hint: 'Acorde menor: Sol, Si bemol, Ré.' },
  { name: 'Lá Menor', notes: [{y: 70}, {y: 50}, {y: 30}], freqs: [440.00, 523.25, 659.25], hint: 'Acorde menor: Lá, Dó, Mi.' },
  { name: 'Lá Maior', notes: [{y: 70}, {y: 50, accidental: 'sharp'}, {y: 30}], freqs: [440.00, 554.37, 659.25], hint: 'Acorde maior: Lá, Dó sustenido, Mi.' },
  { name: 'Ré Maior', notes: [{y: 110}, {y: 90, accidental: 'sharp'}, {y: 70}], freqs: [293.66, 369.99, 440.00], hint: 'Acorde maior: Ré, Fá sustenido, Lá.' },
  { name: 'Ré Menor', notes: [{y: 110}, {y: 90}, {y: 70}], freqs: [293.66, 349.23, 440.00], hint: 'Acorde menor: Ré, Fá, Lá.' },
  { name: 'Mi Maior', notes: [{y: 100}, {y: 80, accidental: 'sharp'}, {y: 60}], freqs: [329.63, 415.30, 493.88], hint: 'Acorde maior: Mi, Sol sustenido, Si.' },
  { name: 'Mi Menor', notes: [{y: 100}, {y: 80}, {y: 60}], freqs: [329.63, 392.00, 493.88], hint: 'Acorde menor: Mi, Sol, Si.' },
  { name: 'Si Diminuto', notes: [{y: 60}, {y: 40}, {y: 20}], freqs: [246.94, 293.66, 349.23], hint: 'Acorde diminuto: Si, Ré, Fá.' },
];

export const CADENCES = [
  { name: 'Perfeita (V - I)', chords: [[392.00, 493.88, 587.33], [261.63, 329.63, 392.00]], hint: 'Vai do grau V (Sol) para o grau I (Dó). Soa a conclusão total.' },
  { name: 'Plagal (IV - I)', chords: [[349.23, 440.00, 523.25], [261.63, 329.63, 392.00]], hint: 'Vai do grau IV (Fá) para o grau I (Dó). Soa a "Ámen" de igreja.' },
  { name: 'Imperfeita (I - V)', chords: [[261.63, 329.63, 392.00], [392.00, 493.88, 587.33]], hint: 'Vai do grau I (Dó) para o grau V (Sol). Soa a suspensão, como uma vírgula.' },
  { name: 'Interrompida (V - VI)', chords: [[392.00, 493.88, 587.33], [440.00, 523.25, 659.25]], hint: 'Vai do grau V (Sol) para o grau VI (Lá menor). Uma surpresa, não conclui.' },
];

export const SIGNS = [
  { symbol: '𝄞', name: 'Clave de Sol', desc: 'Indica que a nota Sol está na 2ª linha. Usada para sons agudos.' },
  { symbol: '𝄢', name: 'Clave de Fá', desc: 'Indica que a nota Fá está na 4ª linha. Usada para sons graves.' },
  { symbol: '𝄡', name: 'Clave de Dó', desc: 'Indica onde está a nota Dó (pode estar na 1ª, 2ª, 3ª ou 4ª linha).' },
  { symbol: '♯', name: 'Sustenido', desc: 'Sobe a nota um meio-tom.' },
  { symbol: '♭', name: 'Bemol', desc: 'Desce a nota um meio-tom.' },
  { symbol: '♮', name: 'Bequadro', desc: 'Anula o efeito do sustenido ou bemol, voltando à nota natural.' },
  { symbol: '𝄪', name: 'Duplo Sustenido', desc: 'Sobe a nota dois meios-tons (um tom inteiro).' },
  { symbol: '𝄫', name: 'Duplo Bemol', desc: 'Desce a nota dois meios-tons (um tom inteiro).' },
  { symbol: '𝄐', name: 'Fermata', desc: 'Prolonga a duração da nota ou pausa o tempo que o maestro quiser.' },
  { symbol: '𝆒', name: 'Crescendo', desc: 'Aumentar gradualmente o volume do som.' },
  { symbol: '𝆓', name: 'Diminuendo', desc: 'Diminuir gradualmente o volume do som.' },
  { symbol: '𝆗', name: 'Staccato', desc: 'Tocar a nota de forma curta e destacada (saltitante).' },
  { symbol: '𝆟', name: 'Tenuto', desc: 'Tocar a nota segurando-a até ao seu valor completo.' },
  { symbol: '>', name: 'Acento', desc: 'Tocar a nota com mais força/intensidade.' },
  { symbol: '𝄆 𝄇', name: 'Sinais de Repetição', desc: 'Repetir a secção de música que está entre os sinais.' },
  { symbol: 'D.C.', name: 'Da Capo', desc: 'Voltar ao início da música.' },
  { symbol: '𝄋', name: 'Dal Segno', desc: 'Voltar ao sinal (𝄋).' },
  { symbol: '𝄌', name: 'Coda', desc: 'Saltar para a secção final da música (Coda).' },
  { symbol: 'Fine', name: 'Fine', desc: 'Fim da música.' },
  { symbol: '8va', name: 'Oitava Acima', desc: 'Tocar as notas uma oitava mais aguda do que está escrito.' },
  { symbol: '8vb', name: 'Oitava Abaixo', desc: 'Tocar as notas uma oitava mais grave do que está escrito.' },
  { symbol: '𝅝 𝄻', name: 'Semibreve e Pausa', desc: 'Figura rítmica que vale 4 tempos (num compasso 4/4) e a sua pausa.' },
  { symbol: '𝅗𝅥 𝄼', name: 'Mínima e Pausa', desc: 'Figura rítmica que vale 2 tempos e a sua pausa.' },
  { symbol: '𝅘𝅥 𝄽', name: 'Semínima e Pausa', desc: 'Figura rítmica que vale 1 tempo e a sua pausa.' },
  { symbol: '𝅘𝅥𝅮 𝄾', name: 'Colcheia e Pausa', desc: 'Figura rítmica que vale 1/2 tempo e a sua pausa.' },
  { symbol: '𝅘𝅥𝅯 𝄿', name: 'Semicolcheia e Pausa', desc: 'Figura rítmica que vale 1/4 de tempo e a sua pausa.' },
  { symbol: '𝅘𝅥𝅰 𝅀', name: 'Fusa e Pausa', desc: 'Figura rítmica que vale 1/8 de tempo e a sua pausa.' },
  { symbol: '𝅘𝅥𝅱 𝅁', name: 'Semifusa e Pausa', desc: 'Figura rítmica que vale 1/16 de tempo e a sua pausa.' },
  { symbol: 'p', name: 'Piano', desc: 'Tocar suavemente.' },
  { symbol: 'f', name: 'Forte', desc: 'Tocar com força/alto.' },
  { symbol: 'mf', name: 'Mezzo-forte', desc: 'Tocar meio forte.' },
  { symbol: 'mp', name: 'Mezzo-piano', desc: 'Tocar meio suave.' },
  { symbol: 'ff', name: 'Fortíssimo', desc: 'Tocar muito forte.' },
  { symbol: 'pp', name: 'Pianíssimo', desc: 'Tocar muito suave.' },
];

export const MELODIES = [
  { name: 'Dó - Mi - Sol', notes: [{y: 120, x: 70}, {y: 100, x: 100}, {y: 80, x: 130}], freqs: [261.63, 329.63, 392.00] },
  { name: 'Sol - Fá - Mi', notes: [{y: 80, x: 70}, {y: 90, x: 100}, {y: 100, x: 130}], freqs: [392.00, 349.23, 329.63] },
  { name: 'Dó - Ré - Dó', notes: [{y: 120, x: 70}, {y: 110, x: 100}, {y: 120, x: 130}], freqs: [261.63, 293.66, 261.63] },
  { name: 'Dó - Sol - Lá - Sol', notes: [{y: 120, x: 60}, {y: 80, x: 90}, {y: 70, x: 120}, {y: 80, x: 150}], freqs: [261.63, 392.00, 440.00, 392.00] },
  { name: 'Mi - Ré - Dó', notes: [{y: 100, x: 70}, {y: 110, x: 100}, {y: 120, x: 130}], freqs: [329.63, 293.66, 261.63] },
  { name: 'Sol - Mi - Sol - Mi', notes: [{y: 80, x: 60}, {y: 100, x: 90}, {y: 80, x: 120}, {y: 100, x: 150}], freqs: [392.00, 329.63, 392.00, 329.63] },
  { name: 'Lá - Sol - Fá - Mi', notes: [{y: 70, x: 60}, {y: 80, x: 90}, {y: 90, x: 120}, {y: 100, x: 150}], freqs: [440.00, 392.00, 349.23, 329.63] },
  { name: 'Fá - Lá - Dó', notes: [{y: 90, x: 70}, {y: 70, x: 100}, {y: 50, x: 130}], freqs: [349.23, 440.00, 523.25] },
  { name: 'Dó - Mi - Sol - Dó(ag)', notes: [{y: 120, x: 60}, {y: 100, x: 90}, {y: 80, x: 120}, {y: 50, x: 150}], freqs: [261.63, 329.63, 392.00, 523.25] },
  { name: 'Ré - Fá - Lá', notes: [{y: 110, x: 70}, {y: 90, x: 100}, {y: 70, x: 130}], freqs: [293.66, 349.23, 440.00] },
];

export const RHYTHM_PATTERNS = [
  { name: 'Pulsação Básica', pattern: [0, 1, 2, 3], total: 4, hint: 'Clica em cada batida (1, 2, 3, 4).' },
  { name: 'Semínimas e Pausas', pattern: [0, 2], total: 4, hint: 'Clica no 1 e no 3. O 2 e o 4 são silêncio!' },
  { name: 'Ritmo de Marcha', pattern: [0, 0.5, 1, 1.5, 2], total: 3, hint: 'Clica rápido! 1 e, 2 e, 3.' },
  { name: 'Sincopa Simples', pattern: [0, 0.75, 1.5], total: 2, hint: 'Este é mais difícil!' }
];

export const INSTRUMENTS_DATA = [
  { name: 'Piano', type: 'piano', freq: 261.63, hint: 'O instrumento rei, com teclas pretas e brancas.' },
  { name: 'Violino', type: 'violin', freq: 440.00, hint: 'Um instrumento de cordas tocado com um arco.' },
  { name: 'Flauta', type: 'flute', freq: 523.25, hint: 'Um instrumento de sopro feito de metal ou madeira.' }
];

export const PITCH_DATA = [
  { name: 'Sol Agudo', freq: 783.99, type: 'high', icon: '🐦', label: 'Agudo (Fininho)' },
  { name: 'Dó Grave', freq: 130.81, type: 'low', icon: '🐻', label: 'Grave (Grosso)' },
  { name: 'Mi Agudo', freq: 659.25, type: 'high', icon: '🐦', label: 'Agudo (Fininho)' },
  { name: 'Lá Grave', freq: 220.00, type: 'low', icon: '🐻', label: 'Grave (Grosso)' }
];
