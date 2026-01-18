import React, { useState, useEffect, useRef } from 'react';
import { database, functions } from './firebaseConfig';
import { ref, set, get, onValue, update } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { Calendar, Check, Trophy, Users, BookOpen, Flame, Clock, Sparkles, PlusCircle, Trash2, User, Share2, Globe, Send, Bell, X } from 'lucide-react';

// OneSignal App ID - Get this from https://onesignal.com dashboard > Settings > Keys & IDs
const ONESIGNAL_APP_ID = '4aceee22-b1f2-444b-8cae-557d9128bbf8';

// Translation system
const TRANSLATIONS = {
  en: {
    // App titles and headers
    appTitle: "Bible Challenge",
    appSubtitle: "2026 Reading Journey",
    appTagline: "Read Together, Grow Together",
    
    // Login/Signup
    enterName: "Enter your name",
    joinChallenge: "Join the Challenge",
    selectLanguage: "Select Language",
    
    // Navigation
    home: "Home",
    calendar: "Calendar", 
    community: "Community",
    profile: "Profile",
    
    // Main content
    hiUser: "Hi, {name}! 👋",
    dayOfTotal: "Day {day} of {total}",
    planBeginsIn: "Plan begins in {days} {unit} on {date}",
    day: "day",
    days: "days",
    
    // Stats
    streak: "Streak",
    chapters: "Chapters",
    bonus: "bonus",
    done: "Done",
    
    // Today's Reading
    todaysReading: "Today's Reading",
    markComplete: "Mark as Complete",
    completed: "Completed! Well done! 🎉",
    undo: "Undo",
    viewFullCalendar: "View Full Calendar",
    
    // Verse of the Day
    verseOfTheDay: "Verse of the Day",
    
    // Milestones
    milestoneRewards: "Milestone Rewards",
    milestoneDesc: "complete • unlock badges as the community cheers you on.",
    
    // Books A-Z
    booksAZ: "Books (A–Z)",
    booksDesc: "Need a quick refresher on the books of the Bible? Browse the alphabetical index below.",
    
    // Calendar
    backToCalendar: "← Back to Calendar",
    dayReading: "Day {day} Reading:",
    markIncomplete: "Mark as Incomplete",
    
    // Community
    communityProgress: "Community Progress",
    bibleChallenge: "Bible Challenge",
    
    // Badges
    finisher: "👑 Finisher",
    torchbearer: "🔥 Torchbearer", 
    steadfast: "🏅 Steadfast",
    determined: "💪 Determined",
    starter: "🌱 Starter",
    
    // Settings
    profileSettings: "Profile & Settings",
    displayName: "Display Name",
    displayNameDesc: "This name appears on the community leaderboard and shared stats.",
    saveDisplayName: "Save Display Name",
    dailyReadingTime: "Daily Reading Time",
    reminderDesc: "Set your preferred daily reading time. You'll be reminded to complete your reading.",
    saveReminder: "Save Reminder",
    tip: "💡 Tip: Enable browser notifications to receive daily reminders!",
    installAsApp: "📱 Install as App",
    androidInstall: "📱 Android: Menu (⋮) → Add to Home screen",
    iphoneInstall: "🍎 iPhone: Share → Add to Home Screen",
    installBenefit: "✨ Install as an app for the best experience with offline access and push notifications!",
    installBibleChallenge: "Install Bible Challenge",
    appTheme: "App Theme",
    logExtraReading: "Log Extra Reading",
    extraReadingDesc: "Read more than the scheduled chapters today? Add them here so your progress reflects the extra effort.",
    chaptersRead: "Number of extra chapters",
    recordExtra: "Record Extra Chapters",
    extraLogged: "You have logged {chapters} bonus chapters so far.",
    removeExtraReading: "Remove Extra Reading",
    removeExtraDesc: "Made a mistake? Remove extra chapters you previously logged.",
    chaptersToRemove: "Number of chapters to remove",
    removeChapters: "Remove Chapters",
    removeNote: "This will only remove from your bonus chapters count.",
    deleteAccount: "Need to step away? You can remove your account and all progress anytime. This only affects your data.",
    deleteProgress: "Delete My Account",
    shareApp: "Share Bible Challenge with Friends",
    shareDesc: "Invite others to join this amazing journey! 📖✨",
    
    // Daily verses
    verses: [
      "For I know the plans I have for you, declares the Lord... - Jeremiah 29:11",
      "Trust in the Lord with all your heart... - Proverbs 3:5-6", 
      "I can do all things through Christ who strengthens me. - Philippians 4:13",
      "The Lord is my shepherd; I shall not want. - Psalm 23:1",
      "Be strong and courageous. Do not be afraid... - Joshua 1:9",
      "Love the Lord your God with all your heart... - Matthew 22:37",
      "In the beginning was the Word, and the Word was with God... - John 1:1"
    ],
    
    // Bible books
    books: [
      "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
      "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
      "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
      "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
      "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah",
      "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians",
      "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
      "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
      "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
    ]
  },
  
  es: {
    appTitle: "Desafío Bíblico",
    appSubtitle: "Viaje de Lectura 2026",
    appTagline: "Leamos Juntos, Crezcamos Juntos",
    enterName: "Ingresa tu nombre",
    joinChallenge: "Únete al Desafío",
    selectLanguage: "Seleccionar Idioma",
    home: "Inicio",
    calendar: "Calendario",
    community: "Comunidad", 
    profile: "Perfil",
    hiUser: "¡Hola, {name}! 👋",
    dayOfTotal: "Día {day} de {total}",
    planBeginsIn: "El plan comienza en {days} {unit} el {date}",
    day: "día",
    days: "días",
    streak: "Racha",
    chapters: "Capítulos",
    bonus: "extra",
    done: "Completado",
    todaysReading: "Lectura de Hoy",
    markComplete: "Marcar como Completo",
    completed: "¡Completado! ¡Bien hecho! 🎉",
    undo: "Deshacer",
    viewFullCalendar: "Ver Calendario Completo",
    
    // Verse of the Day
    verseOfTheDay: "Versículo del Día",
    milestoneRewards: "Recompensas de Hitos",
    milestoneDesc: "completado • desbloquea insignias mientras la comunidad te anima.",
    booksAZ: "Libros (A-Z)",
    booksDesc: "¿Necesitas un repaso rápido de los libros de la Biblia? Navega el índice alfabético a continuación.",
    backToCalendar: "← Volver al Calendario",
    dayReading: "Lectura del Día {day}:",
    markIncomplete: "Marcar como Incompleto",
    communityProgress: "Progreso de la Comunidad",
    bibleChallenge: "Desafío Bíblico",
    finisher: "👑 Terminador",
    torchbearer: "🔥 Portador de Antorcha",
    steadfast: "🏅 Firme",
    determined: "💪 Determinado", 
    starter: "🌱 Principiante",
    profileSettings: "Perfil y Configuración",
    displayName: "Nombre para Mostrar",
    displayNameDesc: "Este nombre aparece en la tabla de clasificación de la comunidad y estadísticas compartidas.",
    saveDisplayName: "Guardar Nombre para Mostrar",
    dailyReadingTime: "Hora de Lectura Diaria",
    reminderDesc: "Establece tu hora preferida de lectura diaria. Se te recordará completar la lectura.",
    saveReminder: "Guardar Recordatorio",
    tip: "💡 Consejo: ¡Habilita las notificaciones del navegador para recibir recordatorios diarios!",
    installAsApp: "📱 Instalar como App",
    androidInstall: "📱 Android: Menú (⋮) → Agregar a pantalla de inicio",
    iphoneInstall: "🍎 iPhone: Compartir → Agregar a Pantalla de Inicio",
    installBenefit: "✨ ¡Instala como app para la mejor experiencia con acceso offline y notificaciones push!",
    installBibleChallenge: "Instalar Bible Challenge",
    appTheme: "Tema de la App",
    logExtraReading: "Registrar Lectura Extra",
    extraReadingDesc: "¿Leíste más capítulos de los programados hoy? Agrégalos aquí para que tu progreso refleje el esfuerzo extra.",
    chaptersRead: "Número de capítulos extra",
    recordExtra: "Registrar Capítulos Extra",
    extraLogged: "Has registrado {chapters} capítulos de bonificación hasta ahora.",
    removeExtraReading: "Eliminar Lectura Extra",
    removeExtraDesc: "¿Te equivocaste? Elimina capítulos extra que registraste anteriormente.",
    chaptersToRemove: "Número de capítulos a eliminar",
    removeChapters: "Eliminar Capítulos",
    removeNote: "Esto solo eliminará del conteo de capítulos de bonificación.",
    deleteAccount: "¿Necesitas alejarte? Puedes eliminar tu cuenta y todo el progreso en cualquier momento. Esto solo afecta tus datos.",
    deleteProgress: "Eliminar Mi Progreso",
    shareApp: "Comparte Desafío Bíblico con Amigos",
    shareDesc: "¡Invita a otros a unirse a este increíble viaje! 📖✨",
    verses: [
      "Porque yo sé los planes que tengo para ustedes, declara el Señor... - Jeremías 29:11",
      "Confía en el Señor con todo tu corazón... - Proverbios 3:5-6",
      "Todo lo puedo en Cristo que me fortalece. - Filipenses 4:13",
      "El Señor es mi pastor; no me falta nada. - Salmo 23:1",
      "Sé fuerte y valiente. No temas... - Josué 1:9",
      "Ama al Señor tu Dios con todo tu corazón... - Mateo 22:37",
      "En el principio era el Verbo, y el Verbo estaba con Dios... - Juan 1:1"
    ],
    books: [
      "Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio", "Josué", "Jueces", "Rut",
      "1 Samuel", "2 Samuel", "1 Reyes", "2 Reyes", "1 Crónicas", "2 Crónicas", "Esdras",
      "Nehemías", "Ester", "Job", "Salmos", "Proverbios", "Eclesiastés", "Cantares",
      "Isaías", "Jeremías", "Lamentaciones", "Ezequiel", "Daniel", "Oseas", "Joel", "Amós",
      "Abdías", "Jonás", "Miqueas", "Nahúm", "Habacuc", "Sofonías", "Hageo", "Zacarías",
      "Malaquías", "Mateo", "Marcos", "Lucas", "Juan", "Hechos", "Romanos", "1 Corintios",
      "2 Corintios", "Gálatas", "Efesios", "Filipenses", "Colosenses", "1 Tesalonicenses",
      "2 Tesalonicenses", "1 Timoteo", "2 Timoteo", "Tito", "Filemón", "Hebreos", "Santiago",
      "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan", "Judas", "Apocalipsis"
    ]
  },

  ml: {
    appTitle: "ബൈബിൾ ചലഞ്ച്",
    appSubtitle: "2026 വായനയാത്ര",
    appTagline: "ഒരുമിച്ച് വായിക്കുക, ഒരുമിച്ച് വളരുക",
    enterName: "നിങ്ങളുടെ പേര് നൽകുക",
    joinChallenge: "ചലഞ്ചിൽ ചേരുക",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    home: "ഹോം",
    calendar: "കലണ്ടർ",
    community: "സമൂഹം",
    profile: "പ്രൊഫൈൽ",
    hiUser: "ഹലോ, {name}! 👋",
    dayOfTotal: "{total} ലെ {day} ദിവസം",
    planBeginsIn: "പ്ലാൻ {date} ന് {days} {unit} കൊണ്ട് ആരംഭിക്കും",
    day: "ദിവസം",
    days: "ദിവസങ്ങൾ",
    streak: "സ്ട്രീക്ക്",
    chapters: "അധ്യായങ്ങൾ",
    bonus: "ബോണസ്",
    done: "പൂർത്തിയായി",
    todaysReading: "ഇന്നത്തെ വായന",
    markComplete: "പൂർത്തിയായി അടയാളപ്പെടുത്തുക",
    completed: "പൂർത്തിയായി! നന്നായി ചെയ്തു! 🎉",
    undo: "പഴയപടിയാക്കുക",
    viewFullCalendar: "പൂർണ്ണ കലണ്ടർ കാണുക",
    
    // Verse of the Day
    verseOfTheDay: "ദിവസത്തെ വചനം",
    milestoneRewards: "മൈൽസ്റ്റോൺ റിവാർഡുകൾ",
    milestoneDesc: "പൂർത്തിയാക്കുക • സമൂഹം നിങ്ങളെ പ്രോത്സാഹിപ്പിക്കുമ്പോൾ ബാഡ്ജുകൾ അൺലോക്ക് ചെയ്യുക.",
    booksAZ: "പുസ്തകങ്ങൾ (A-Z)",
    booksDesc: "ബൈബിളിലെ പുസ്തകങ്ങൾക്ക് ഒരു വേഗമായ റിഫ്രഷർ ആവശ്യമുണ്ടോ? ചുവടെയുള്ള അക്ഷരമാലാ സൂചിക നോക്കുക.",
    backToCalendar: "← കലണ്ടറിലേക്ക് മടങ്ങുക",
    dayReading: "{day} ദിവസം വായന:",
    markIncomplete: "അപൂർണ്ണമായി അടയാളപ്പെടുത്തുക",
    communityProgress: "സമൂഹ പുരോഗതി",
    bibleChallenge: "ബൈബിൾ ചലഞ്ച്",
    finisher: "👑 ഫിനിഷർ",
    torchbearer: "🔥 ടോർച്ച്ബെയറർ",
    steadfast: "🏅 സ്റ്റെഡ്ഫാസ്റ്റ്",
    determined: "💪 ഡിട്ടർമൈൻഡ്",
    starter: "🌱 സ്റ്റാർട്ടർ",
    profileSettings: "പ്രൊഫൈൽ & സെറ്റിംഗ്സ്",
    displayName: "ഡിസ്പ്ലേ നെയിം",
    displayNameDesc: "ഈ പേര് സമൂഹ ലീഡർബോർഡിലും പങ്കിട്ട സ്റ്റാറ്റിസ്റ്റിക്സിലും പ്രത്യക്ഷപ്പെടും.",
    saveDisplayName: "ഡിസ്പ്ലേ നെയിം സേവ് ചെയ്യുക",
    dailyReadingTime: "ദൈനംദിന വായന സമയം",
    reminderDesc: "നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ദൈനംദിന വായന സമയം സജ്ജമാക്കുക. വായന പൂർത്തിയാക്കാൻ നിങ്ങളെ ഓർമ്മിപ്പിക്കും.",
    saveReminder: "റിമൈൻഡർ സേവ് ചെയ്യുക",
    tip: "💡 ടിപ്പ്: ദൈനംദിന റിമൈൻഡറുകൾ ലഭിക്കാൻ ബ്രൗസർ നോട്ടിഫിക്കേഷനുകൾ പ്രവർത്തനക്ഷമമാക്കുക!",
    installAsApp: "📱 ആപ്പ് ആയി ഇൻസ്റ്റാൾ ചെയ്യുക",
    androidInstall: "📱 ആൻഡ്രോയിഡ്: മെനു (⋮) → ഹോം സ്ക്രീനിലേക്ക് ചേർക്കുക",
    iphoneInstall: "🍎 ഐഫോൺ: ഷെയർ → ഹോം സ്ക്രീനിലേക്ക് ചേർക്കുക",
    installBenefit: "✨ ഓഫ്ലൈൻ ആക്സസും പുഷ് നോട്ടിഫിക്കേഷനുകളും ഉള്ള മികച്ച അനുഭവത്തിന് ആപ്പ് ആയി ഇൻസ്റ്റാൾ ചെയ്യുക!",
    installBibleChallenge: "ബൈബിൾ ചലഞ്ച് ഇൻസ്റ്റാൾ ചെയ്യുക",
    appTheme: "ആപ്പ് തീം",
    logExtraReading: "എക്സ്ട്രാ വായന ലോഗ് ചെയ്യുക",
    extraReadingDesc: "ഇന്ന് ഷെഡ്യൂൾ ചെയ്തതിലും കൂടുതൽ അധ്യായങ്ങൾ വായിച്ചോ? നിങ്ങളുടെ പുരോഗതി അധിക പരിശ്രമം പ്രതിഫലിപ്പിക്കുന്നതിന് അവ ഇവിടെ ചേർക്കുക.",
    chaptersRead: "എക്സ്ട്രാ അധ്യായങ്ങളുടെ എണ്ണം",
    recordExtra: "എക്സ്ട്രാ അധ്യായങ്ങൾ റെക്കോർഡ് ചെയ്യുക",
    extraLogged: "നിങ്ങൾ ഇതുവരെ {chapters} ബോണസ് അധ്യായങ്ങൾ ലോഗ് ചെയ്തിട്ടുണ്ട്.",
    removeExtraReading: "എക്സ്ട്രാ വായന നീക്കം ചെയ്യുക",
    removeExtraDesc: "തെറ്റ് സംഭവിച്ചോ? മുമ്പ് ലോഗ് ചെയ്ത എക്സ്ട്രാ അധ്യായങ്ങൾ നീക്കം ചെയ്യുക.",
    chaptersToRemove: "നീക്കം ചെയ്യേണ്ട അധ്യായങ്ങളുടെ എണ്ണം",
    removeChapters: "അധ്യായങ്ങൾ നീക്കം ചെയ്യുക",
    removeNote: "ഇത് ബോണസ് അധ്യായങ്ങളുടെ എണ്ണത്തിൽ നിന്ന് മാത്രം നീക്കം ചെയ്യും.",
    deleteAccount: "ഒഴിഞ്ഞുപോകണമോ? നിങ്ങൾക്ക് എപ്പോൾ വേണമെങ്കിലും നിങ്ങളുടെ അക്കൗണ്ടും എല്ലാ പുരോഗതിയും നീക്കം ചെയ്യാം. ഇത് നിങ്ങളുടെ ഡാറ്റയെ മാത്രം ബാധിക്കും.",
    deleteProgress: "എന്റെ പുരോഗതി ഡിലീറ്റ് ചെയ്യുക",
    shareApp: "ബൈബിൾ ചലഞ്ച് സുഹൃത്തുക്കളുമായി പങ്കിടുക",
    shareDesc: "ഈ അത്ഭുതകരമായ യാത്രയിൽ മറ്റുള്ളവരെ ചേരാൻ ക്ഷണിക്കുക! 📖✨",
    verses: [
      "നിങ്ങൾക്കായി എനിക്കുള്ള പദ്ധതികൾ എനിക്കറിയാം, എന്ന് കർത്താവ് പ്രഖ്യാപിക്കുന്നു... - യിരെമ്യാവ് 29:11",
      "നിങ്ങളുടെ മുഴുവൻ ഹൃദയത്തോടും കർത്താവിൽ വിശ്വസിക്കുക... - സദൃശ്യവാക്യങ്ങൾ 3:5-6",
      "ക്രിസ്തുസ് എന്നെ ശക്തിപ്പെടുത്തുന്നതിനാൽ എല്ലാം ചെയ്യാൻ എനിക്ക് കഴിയും. - ഫിലിപ്പിയർ 4:13",
      "കർത്താവ് എന്റെ ഇടയൻ; എനിക്ക് ഒന്നും കുറവില്ല. - സങ്കീർത്തനങ്ങൾ 23:1",
      "ശക്തനും ധൈര്യവാനും ആകുക. ഭയപ്പെടരുത്... - യോശുവ 1:9",
      "നിങ്ങളുടെ മുഴുവൻ ഹൃദയത്തോടും കർത്താവ് നിങ്ങളുടെ ദൈവത്തെ സ്നേഹിക്കുക... - മത്തായി 22:37",
      "ആദ്യത്തിൽ വചനം ഉണ്ടായിരുന്നു, വചനം ദൈവത്തോടുകൂടെ ഉണ്ടായിരുന്നു... - യോഹന്നാൻ 1:1"
    ],
    books: [
      "ഉൽപ്പത്തി", "പുറപ്പാട്", "ലേവ്യപുസ്തകം", "സംഖ്യാപുസ്തകം", "ആവർത്തനം", "യോശുവ", "ന്യായാധിപന്മാർ", "രൂത്ത്",
      "1 ശമൂവേൽ", "2 ശമൂവേൽ", "1 രാജാക്കന്മാർ", "2 രാജാക്കന്മാർ", "1 ദിനവൃത്താന്തം", "2 ദിനവൃത്താന്തം", "എസ്രാ",
      "നെഹെമ്യാവ്", "എസ്ഥർ", "ഇയ്യോബ്", "സങ്കീർത്തനങ്ങൾ", "സദൃശ്യവാക്യങ്ങൾ", "സഭാപ്രസംഗി", "ഉത്തമഗീതം",
      "യെശയ്യാവ്", "യിരെമ്യാവ്", "വിലാപങ്ങൾ", "യെഹെസ്കേൽ", "ദാനിയേൽ", "ഹോശേയ", "യോവേൽ", "ആമോസ്",
      "ഒബദ്യാവ്", "യോനാ", "മീഖാ", "നഹൂം", "ഹബക്കൂക്ക്", "സെഫന്യാവ്", "ഹഗ്ഗായി", "സെഖര്യാവ്",
      "മലാഖി", "മത്തായി", "മർക്കൊസ്", "ലൂക്കാ", "യോഹന്നാൻ", "പ്രവൃത്തികൾ", "റോമർ", "1 കൊരിന്ത്യർ",
      "2 കൊരിന്ത്യർ", "ഗലാത്യർ", "എഫെസ്യർ", "ഫിലിപ്പിയർ", "കൊലൊസ്സ്യർ", "1 തെസ്സലോനീക്യർ",
      "2 തെസ്സലോനീക്യർ", "1 തിമൊഥെയൊസ്", "2 തിമൊഥെയൊസ്", "തീത്തൊസ്", "ഫിലേമോൻ", "ഹെബ്രായർ", "യാക്കോബ്",
      "1 പത്രൊസ്", "2 പത്രൊസ്", "1 യോഹന്നാൻ", "2 യോഹന്നാൻ", "3 യോഹന്നാൻ", "യൂദാ", "വെളിപ്പാട്"
    ]
  },

  hi: {
    appTitle: "बाइबल चैलेंज",
    appSubtitle: "2026 पठन यात्रा",
    appTagline: "साथ पढ़ें, साथ बढ़ें",
    enterName: "अपना नाम दर्ज करें",
    joinChallenge: "चैलेंज में शामिल हों",
    selectLanguage: "भाषा चुनें",
    home: "होम",
    calendar: "कैलेंडर",
    community: "समुदाय",
    profile: "प्रोफ़ाइल",
    hiUser: "नमस्ते, {name}! 👋",
    dayOfTotal: "{total} में से {day} दिन",
    planBeginsIn: "योजना {date} को {days} {unit} में शुरू होगी",
    day: "दिन",
    days: "दिन",
    streak: "स्ट्रीक",
    chapters: "अध्याय",
    bonus: "बोनस",
    done: "पूर्ण",
    todaysReading: "आज की पठन",
    markComplete: "पूर्ण के रूप में चिह्नित करें",
    completed: "पूर्ण! बहुत बढ़िया! 🎉",
    undo: "पूर्ववत करें",
    viewFullCalendar: "पूर्ण कैलेंडर देखें",
    
    // Verse of the Day
    verseOfTheDay: "आज का श्लोक",
    milestoneRewards: "माइलस्टोन इनाम",
    milestoneDesc: "पूर्ण करें • समुदाय के उत्साहित करते समय बैज अनलॉक करें।",
    booksAZ: "पुस्तकें (A-Z)",
    booksDesc: "बाइबल की पुस्तकों पर एक त्वरित रिफ्रेशर चाहिए? नीचे वर्णानुक्रम सूची ब्राउज़ करें।",
    backToCalendar: "← कैलेंडर पर वापस जाएं",
    dayReading: "{day} दिन पठन:",
    markIncomplete: "अपूर्ण के रूप में चिह्नित करें",
    communityProgress: "समुदाय प्रगति",
    bibleChallenge: "बाइबल चैलेंज",
    finisher: "👑 फिनिशर",
    torchbearer: "🔥 टॉर्चबियरर",
    steadfast: "🏅 स्थिर",
    determined: "💪 दृढ़",
    starter: "🌱 स्टार्टर",
    profileSettings: "प्रोफ़ाइल & सेटिंग्स",
    displayName: "प्रदर्शित नाम",
    displayNameDesc: "यह नाम समुदाय लीडरबोर्ड और साझा आंकड़ों में दिखाई देता है।",
    saveDisplayName: "प्रदर्शित नाम सहेजें",
    dailyReadingTime: "दैनिक पठन समय",
    reminderDesc: "अपना पसंदीदा दैनिक पठन समय निर्धारित करें। आपको पठन पूरा करने की याद दिलाई जाएगी।",
    saveReminder: "रिमाइंडर सहेजें",
    tip: "💡 टिप: दैनिक रिमाइंडर प्राप्त करने के लिए ब्राउज़र सूचनाएं सक्षम करें!",
    installAsApp: "📱 ऐप के रूप में इंस्टॉल करें",
    androidInstall: "📱 एंड्रॉइड: मेनू (⋮) → होम स्क्रीन में जोड़ें",
    iphoneInstall: "🍎 iPhone: शेयर → होम स्क्रीन में जोड़ें",
    installBenefit: "✨ ऑफलाइन एक्सेस और पुश नोटिफिकेशन के साथ सर्वोत्तम अनुभव के लिए ऐप के रूप में इंस्टॉल करें!",
    installBibleChallenge: "बाइबल चैलेंज इंस्टॉल करें",
    appTheme: "ऐप थीम",
    logExtraReading: "अतिरिक्त पठन लॉग करें",
    extraReadingDesc: "आज निर्धारित अध्यायों से अधिक पढ़ा? आपकी प्रगति अतिरिक्त प्रयास को दर्शाने के लिए उन्हें यहां जोड़ें।",
    chaptersRead: "अतिरिक्त अध्यायों की संख्या",
    recordExtra: "अतिरिक्त अध्याय रिकॉर्ड करें",
    extraLogged: "आपने अब तक {chapters} बोनस अध्याय लॉग किए हैं।",
    removeExtraReading: "अतिरिक्त पठन हटाएं",
    removeExtraDesc: "गलती हुई? पहले लॉग किए गए अतिरिक्त अध्याय हटाएं।",
    chaptersToRemove: "हटाने के लिए अध्यायों की संख्या",
    removeChapters: "अध्याय हटाएं",
    removeNote: "यह केवल बोनस अध्यायों की गिनती से हटाएगा।",
    deleteAccount: "दूर जाना है? आप कभी भी अपना खाता और सभी प्रगति हटा सकते हैं। यह केवल आपके डेटा को प्रभावित करता है।",
    deleteProgress: "मेरी प्रगति हटाएं",
    shareApp: "बाइबल चैलेंज दोस्तों के साथ साझा करें",
    shareDesc: "दूसरों को इस अद्भुत यात्रा में शामिल होने के लिए आमंत्रित करें! 📖✨",
    verses: [
      "क्योंकि मुझे तुम्हारे लिए जो विचार हैं, वे मुझे ज्ञात हैं, यहोवा की घोषणा... - यिर्मयाह 29:11",
      "सारे मन से यहोवा पर भरोसा रख... - नीतिवचन 3:5-6",
      "मैं सब कुछ कर सकता हूं उसमें जो मुझे शक्ति देता है। - फिलिप्पियों 4:13",
      "यहोवा मेरा चरवाहा है, मुझे कुछ भी अभाव नहीं। - भजन 23:1",
      "दृढ़ और निर्भय बनो। मत डरो... - यहोशू 1:9",
      "सारे मन से अपने परमेश्वर यहोवा से प्रेम करो... - मत्ती 22:37",
      "आरंभ में वचन था, और वचन परमेश्वर के साथ था... - यूहन्ना 1:1"
    ],
    books: [
      "उत्पत्ति", "निर्गमन", "लैव्यव्यवस्था", "गिनती", "व्यवस्थाविवरण", "यहोशू", "न्यायियों", "रूत",
      "1 शमूएल", "2 शमूएल", "1 राजाओं", "2 राजाओं", "1 इतिहास", "2 इतिहास", "एज्रा",
      "नहेम्याह", "एस्तेर", "अय्यूब", "भजन", "नीतिवचन", "सभोपदेशक", "गीत-गीत",
      "यशायाह", "यिर्मयाह", "विलापगीत", "यहेजकेल", "दानिय्येल", "होशे", "योएल", "आमोस",
      "ओबद्याह", "योना", "मीका", "नहूम", "हबक्कूक", "सपन्याह", "हाग्गै", "जकर्याह",
      "मलाकी", "मत्ती", "मरकुस", "लूका", "यूहन्ना", "प्रेरितों", "रोमियों", "1 कुरिन्थियों",
      "2 कुरिन्थियों", "गलातियों", "इफिसियों", "फिलिप्पियों", "कुलुस्सियों", "1 थिस्सलुनीकियों",
      "2 थिस्सलुनीकियों", "1 तीमुथियुस", "2 तीमुथियुस", "तीतस", "फिलेमोन", "इब्रानियों", "याकूब",
      "1 पतरस", "2 पतरस", "1 यूहन्ना", "2 यूहन्ना", "3 यूहन्ना", "यहूदा", "प्रकाशित वाक्य"
    ]
  },

  ta: {
    appTitle: "பைபிள் சவால்",
    appSubtitle: "2026 வாசிப்பு பயணம்",
    appTagline: "ஒன்றாக வாசியுங்கள், ஒன்றாக வளருங்கள்",
    enterName: "உங்கள் பெயரை உள்ளீடு செய்யவும்",
    joinChallenge: "சவாலில் சேரவும்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    home: "முகப்பு",
    calendar: "காலண்டர்",
    community: "சமூகம்",
    profile: "சுயவிவரம்",
    hiUser: "வணக்கம், {name}! 👋",
    dayOfTotal: "{total} இல் {day} நாள்",
    planBeginsIn: "திட்டம் {date} அன்று {days} {unit} இல் தொடங்கும்",
    day: "நாள்",
    days: "நாட்கள்",
    streak: "தொடர்ச்சி",
    chapters: "அத்தியாயங்கள்",
    bonus: "போனஸ்",
    done: "முடிந்தது",
    todaysReading: "இன்றைய வாசிப்பு",
    markComplete: "முழுமையாகக் குறிக்கவும்",
    completed: "முடிந்தது! நன்றாகச் செய்தீர்கள்! 🎉",
    undo: "மீளமை",
    viewFullCalendar: "முழு காலண்டரையும் காண்க",
    
    // Verse of the Day
    verseOfTheDay: "இன்றைய வசனம்",
    milestoneRewards: "மைல்கல் வெகுமதிகள்",
    milestoneDesc: "முடிக்கவும் • சமூகம் உங்களை ஊக்குவிக்கும் போது பேட்ஜ்களைத் திறக்கவும்.",
    booksAZ: "புத்தகங்கள் (A-Z)",
    booksDesc: "பைபிள் புத்தகங்களுக்கு விரைவான புதுப்பித்தல் தேவையா? கீழே உள்ள எழுத்து வரிசை குறியீட்டை உலாவுக.",
    backToCalendar: "← காலண்டருக்கு மீண்டும் செல்லவும்",
    dayReading: "{day} நாள் வாசிப்பு:",
    markIncomplete: "முழுமையற்றதாகக் குறிக்கவும்",
    communityProgress: "சமூக முன்னேற்றம்",
    bibleChallenge: "பைபிள் சவால்",
    finisher: "👑 முடிப்பவர்",
    torchbearer: "🔥 தீப்பந்தம் தாங்குபவர்",
    steadfast: "🏅 உறுதியான",
    determined: "💪 தீர்மானமான",
    starter: "🌱 தொடங்குபவர்",
    profileSettings: "சுயவிவரம் & அமைப்புகள்",
    displayName: "காட்சி பெயர்",
    displayNameDesc: "இந்தப் பெயர் சமூக தலைமைப் பட்டியலிலும் பகிரப்பட்ட புள்ளியியலிலும் தோன்றும்.",
    saveDisplayName: "காட்சி பெயரைச் சேமிக்கவும்",
    dailyReadingTime: "தினசரி வாசிப்பு நேரம்",
    reminderDesc: "உங்கள் விருப்பமான தினசரி வாசிப்பு நேரத்தை அமைக்கவும். வாசிப்பை முடிக்க உங்களுக்கு நினைவூட்டல் செய்யப்படும்.",
    saveReminder: "நினைவூட்டலைச் சேமிக்கவும்",
    tip: "💡 குறிப்பு: தினசரி நினைவூட்டல்களைப் பெற உலாவி அறிவிப்புகளை இயக்கவும்!",
    installAsApp: "📱 ஆப்பாக நிறுவவும்",
    androidInstall: "📱 ஆண்ட்ராய்டு: மெனு (⋮) → முகப்புத் திரையில் சேர்க்கவும்",
    iphoneInstall: "🍎 iPhone: பகிர் → முகப்புத் திரையில் சேர்க்கவும்",
    installBenefit: "✨ ஆஃப்லைன் அணுகல் மற்றும் புஷ் அறிவிப்புகளுடன் சிறந்த அனுபவத்திற்கு ஆப்பாக நிறுவவும்!",
    installBibleChallenge: "பைபிள் சவாலை நிறுவவும்",
    appTheme: "ஆப் தீம்",
    logExtraReading: "கூடுதல் வாசிப்பைப் பதிவு செய்யவும்",
    extraReadingDesc: "இன்று திட்டமிடப்பட்ட அத்தியாயங்களை விட அதிகமாக வாசித்தீர்களா? உங்கள் முன்னேற்றம் கூடுதல் முயற்சியைப் பிரதிபலிக்கும் வகையில் அவற்றை இங்கே சேர்க்கவும்.",
    chaptersRead: "கூடுதல் அத்தியாயங்களின் எண்ணிக்கை",
    recordExtra: "கூடுதல் அத்தியாயங்களைப் பதிவு செய்யவும்",
    extraLogged: "நீங்கள் இதுவரை {chapters} போனஸ் அத்தியாயங்களைப் பதிவு செய்துள்ளீர்கள்.",
    removeExtraReading: "கூடுதல் வாசிப்பை அகற்றவும்",
    removeExtraDesc: "தவறு செய்தீர்களா? முன்பு பதிவு செய்த கூடுதல் அத்தியாயங்களை அகற்றவும்.",
    chaptersToRemove: "அகற்ற வேண்டிய அத்தியாயங்களின் எண்ணிக்கை",
    removeChapters: "அத்தியாயங்களை அகற்றவும்",
    removeNote: "இது போனஸ் அத்தியாயங்களின் எண்ணிக்கையில் இருந்து மட்டுமே அகற்றும்.",
    deleteAccount: "விலக வேண்டுமா? நீங்கள் எப்போது வேண்டுமானாலும் உங்கள் கணக்கையும் அனைத்து முன்னேற்றத்தையும் நீக்கலாம். இது உங்கள் தரவை மட்டுமே பாதிக்கும்.",
    deleteProgress: "எனது முன்னேற்றத்தை நீக்கவும்",
    shareApp: "பைபிள் சவாலை நண்பர்களுடன் பகிரவும்",
    shareDesc: "இந்த அற்புதமான பயணத்தில் மற்றவர்களைச் சேர சம்மதிக்கவும்! 📖✨",
    verses: [
      "உங்களுக்காக எனக்கு இருக்கும் எண்ணங்களை எனக்குத் தெரியும், கர்த்தர் அறிவிக்கிறார்... - எரேமியா 29:11",
      "உன் முழு இருதயத்தோடும் கர்த்தரிடம் நம்பிக்கை வை... - நீதிமொழிகள் 3:5-6",
      "என்னை வலுப்படுத்துகிற கிறிஸ்துவினாலே எல்லாவற்றையும் செய்ய என்னால் கூடும். - பிலிப்பியர் 4:13",
      "கர்த்தர் என் மேய்ப்பர்; எனக்கு ஒன்றும் குறைவில்லை. - சங்கீதம் 23:1",
      "வலுத்து தைரியமாயிரு; பயப்படாதே... - யோசுவா 1:9",
      "உன் முழு இருதயத்தோடும் கர்த்தராகிய உன் தேவனை சிநேகி... - மத்தேயு 22:37",
      "ஆரம்பத்தில் வார்த்தை இருந்தது, வார்த்தை தேவனோடு இருந்தது... - யோவான் 1:1"
    ],
    books: [
      "ஆதியாகமம்", "யாத்திராகமம்", "லேவியராகமம்", "எண்ணாகமம்", "உபாகமம்", "யோசுவா", "நீதித்தலைவர்கள்", "ரூத்",
      "1 சாமுவேல்", "2 சாமுவேல்", "1 இராஜாக்கள்", "2 இராஜாக்கள்", "1 நாளாகமம்", "2 நாளாகமம்", "எஸ்றா",
      "நெகேமியா", "எஸ்தர்", "யோபு", "சங்கீதம்", "நீதிமொழிகள்", "சபை உரைப்பவர்", "உன்னதப்பாட்டு",
      "எசாயா", "எரேமியா", "புலம்பல்", "எசேக்கியேல்", "தானியேல்", "ஓசியா", "யோவேல்", "ஆமோஸ்",
      "ஒபதியா", "யோனா", "மீகா", "நாகூம்", "அபக்கூக்", "செபனியா", "அக்காய்", "சகரியா",
      "மலாக்கி", "மத்தேயு", "மாற்கு", "லூக்கா", "யோவான்", "அப்போஸ்தலர்", "ரோமர்", "1 கொரிந்தியர்",
      "2 கொரிந்தியர்", "கலாத்தியர்", "எபேசியர்", "பிலிப்பியர்", "கொலோசெயர்", "1 தெசலோனிக்கேயர்",
      "2 தெசலோனிக்கேயர்", "1 திமொத்தேயு", "2 திமொத்தேயு", "தீத்து", "பிலேமோன்", "எபிரெயர்", "யாக்கோபு",
      "1 பேதுரு", "2 பேதுரு", "1 யோவான்", "2 யோவான்", "3 யோவான்", "யூதா", "வெளிப்படுத்தல்"
    ]
  },

  te: {
    appTitle: "బైబిల్ ఛాలెంజ్",
    appSubtitle: "2026 చదువు ప్రయాణం",
    appTagline: "కలిసి చదవండి, కలిసి పెరుగుదలు సాధించండి",
    enterName: "మీ పేరు నమోదు చేయండి",
    joinChallenge: "ఛాలెంజ్‌లో చేరండి",
    selectLanguage: "భాష ఎంచుకోండి",
    home: "హోమ్",
    calendar: "క్యాలెండర్",
    community: "సమాజం",
    profile: "ప్రొఫైల్",
    hiUser: "హలో, {name}! 👋",
    dayOfTotal: "{total} లో {day} రోజు",
    planBeginsIn: "ప్రణాళిక {date} న {days} {unit} లో ప్రారంభమవుతుంది",
    day: "రోజు",
    days: "రోజులు",
    streak: "స్ట్రీక్",
    chapters: "అధ్యాయాలు",
    bonus: "బోనస్",
    done: "పూర్తైనది",
    todaysReading: "నేటి చదువు",
    markComplete: "పూర్తైనట్టు గుర్తించండి",
    completed: "పూర్తైంది! బాగా చేశారు! 🎉",
    undo: "రద్దు చేయండి",
    viewFullCalendar: "పూర్తి క్యాలెండర్ చూడండి",
    
    // Verse of the Day
    verseOfTheDay: "నేటి వచనం",
    milestoneRewards: "మైలురాయి రివార్డులు",
    milestoneDesc: "పూర్తి చేయండి • సమాజం మిమ్మల్ని ప్రోత్సహించే సమయంలో బ్యాడ్జులను అన్‌లాక్ చేయండి.",
    booksAZ: "పుస్తకాలు (A-Z)",
    booksDesc: "బైబిల్ పుస్తకాలపై త్వరిత రిఫ్రెషర్ కావాలా? దిగువ అక్షర క్రమ సూచికను బ్రౌజ్ చేయండి.",
    backToCalendar: "← క్యాలెండర్‌కు తిరిగి వెళ్ళండి",
    dayReading: "{day} రోజు చదువు:",
    markIncomplete: "అపూర్తిగా గుర్తించండి",
    communityProgress: "సమాజ పురోగతి",
    bibleChallenge: "బైబిల్ ఛాలెంజ్",
    finisher: "👑 ఫినిషర్",
    torchbearer: "🔥 టార్చ్‌బేరర్",
    steadfast: "🏅 స్టెడ్‌ఫాస్ట్",
    determined: "💪 డిటర్మైండ్",
    starter: "🌱 స్టార్టర్",
    profileSettings: "ప్రొఫైల్ & సెట్టింగులు",
    displayName: "ప్రదర్శన పేరు",
    displayNameDesc: "ఈ పేరు సమాజ లీడర్‌బోర్డ్ మరియు భాగస్వామ్యం చేసిన గణాంకాలలో కనిపిస్తుంది.",
    saveDisplayName: "ప్రదర్శన పేరు సేవ్ చేయండి",
    dailyReadingTime: "రోజువారీ చదువు సమయం",
    reminderDesc: "మీకు ఇష్టమైన రోజువారీ చదువు సమయాన్ని సెట్ చేయండి. చదువు పూర్తి చేయడానికి మిమ్మల్ని రిమైండ్ చేస్తారు.",
    saveReminder: "రిమైండర్ సేవ్ చేయండి",
    tip: "💡 చిట్కా: రోజువారీ రిమైండర్‌లను పొందడానికి బ్రౌజర్ నోటిఫికేషన్‌లను ప్రారంభించండి!",
    installAsApp: "📱 యాప్‌గా ఇన్‌స్టాల్ చేయండి",
    androidInstall: "📱 ఆండ్రాయిడ్: మెను (⋮) → హోమ్ స్క్రీన్‌లో జోడించు",
    iphoneInstall: "🍎 iPhone: షేర్ → హోమ్ స్క్రీన్‌లో జోడించు",
    installBenefit: "✨ ఆఫ్‌లైన్ యాక్సెస్ మరియు పుష్ నోటిఫికేషన్‌లతో ఉత్తమ అనుభవం కోసం యాప్‌గా ఇన్‌స్టాల్ చేయండి!",
    installBibleChallenge: "బైబిల్ ఛాలెంజ్‌ను ఇన్‌స్టాల్ చేయండి",
    appTheme: "యాప్ థీమ్",
    logExtraReading: "అదనపు చదువు లాగ్ చేయండి",
    extraReadingDesc: "నేటి షెడ్యూల్ చేసిన అధ్యాయాల కంటే ఎక్కువ చదివారా? మీ పురోగతి అదనపు ప్రయత్నాన్ని ప్రతిబింబించేలా వాటిని ఇక్కడ జోడించండి.",
    chaptersRead: "అదనపు అధ్యాయాల సంఖ్య",
    recordExtra: "అదనపు అధ్యాయాలను రికార్డ్ చేయండి",
    extraLogged: "మీరు ఇప్పటివరకు {chapters} బోనస్ అధ్యాయాలను లాగ్ చేసారు.",
    removeExtraReading: "అదనపు చదువు తీసివేయండి",
    removeExtraDesc: "తప్పు జరిగిందా? ముందు లాగ్ చేసిన అదనపు అధ్యాయాలను తీసివేయండి.",
    chaptersToRemove: "తీసివేయాల్సిన అధ్యాయాల సంఖ్య",
    removeChapters: "అధ్యాయాలను తీసివేయండి",
    removeNote: "ఇది బోనస్ అధ్యాయాల కౌంట్ నుండి మాత్రమే తీసివేస్తుంది.",
    deleteAccount: "వెళ్ళిపోవాలా? మీరు ఎప్పుడైనా మీ ఖాతాను మరియు అన్ని పురోగతిని తీసివేయవచ్చు. ఇది మీ డేటాను మాత్రమే ప్రభావితం చేస్తుంది.",
    deleteProgress: "నా పురోగతిని తొలగించు",
    shareApp: "బైబిల్ ఛాలెంజ్‌ను స్నేహితులతో భాగస్వామ్యం చేయండి",
    shareDesc: "ఈ అద్భుతమైన ప్రయాణంలో ఇతరులను చేరడానికి ఆహ్వానించండి! 📖✨",
    verses: [
      "మీ కోసం నేను ఉన్న ప్రణాళికలు నాకు తెలుసు, ప్రభువు ప్రకటించును... - యిర్మీయా 29:11",
      "నీ మొత్తం హృదయంతో ప్రభువును నమ్ము... - సామెతలు 3:5-6",
      "నన్ను బలపరిచే క్రీస్తుసులో నేను ప్రతిదీ చేయగలను. - ఫిలిప్పీయులకు 4:13",
      "ప్రభువు నా కాపరి; నాకు ఏమీ కొరత లేదు. - కీర్తనలు 23:1",
      "దృఢంగా మరియు ధైర్యంగా ఉండు. భయపడకు... - యెహొషువ 1:9",
      "నీ మొత్తం హృదయంతో నీ దేవుడైన ప్రభువును ప్రేమించు... - మత్తయి 22:37",
      "ఆదిలో వాక్యము ఉండెను, వాక్యము దేవునితో ఉండెను... - యోహాను 1:1"
    ],
    books: [
      "ఆదికాండం", "నిర్గమకాండం", "లేవీయకాండం", "సంఖ్యాకాండం", "ద్వితీయకాండం", "యెహొషువ", "న్యాయాధిపతులు", "రూత్",
      "1 సమూయేలు", "2 సమూయేలు", "1 రాజులు", "2 రాజులు", "1 దినవృత్తాంతాలు", "2 దినవృత్తాంతాలు", "ఎజ్రా",
      "నెహెమ్యా", "ఎస్తేరు", "యోబు", "కీర్తనలు", "సామెతలు", "ప్రసంగి", "పరమగీతం",
      "యెశయ్యా", "యిర్మీయా", "విలాపవాక్యాలు", "యెహెజ్కేలు", "దానియేలు", "హొషే", "యోవేలు", "ఆమోసు",
      "ఓబద్యా", "యోనా", "మీకా", "నహూం", "హబక్కూకు", "జెఫన్యా", "హగ్గయి", "జెకర్యా",
      "మలాకీ", "మత్తయి", "మార్కు", "లూకా", "యోహాను", "అపొస్తలుల కార్యములు", "రోమీయులకు", "1 కొరింథీయులకు",
      "2 కొరింథీయులకు", "గలతీయులకు", "ఎఫెసీయులకు", "ఫిలిప్పీయులకు", "కొలొస్సీయులకు", "1 థెస్సలొనీకయులకు",
      "2 థెస్సలొనీకయులకు", "1 తిమోతికి", "2 తిమోతికి", "తీతుకు", "ఫిలేమోనుకు", "హెబ్రీయులకు", "యాకోబు",
      "1 పేతురు", "2 పేతురు", "1 యోహాను", "2 యోహాను", "3 యోహాను", "యూదా", "ప్రకటన"
    ]
  },

  fr: {
    appTitle: "Défi Biblique",
    appSubtitle: "Voyage de Lecture 2026",
    appTagline: "Lisons Ensemble, Grandissons Ensemble",
    enterName: "Entrez votre nom",
    joinChallenge: "Rejoignez le Défi",
    selectLanguage: "Sélectionner la Langue",
    home: "Accueil",
    calendar: "Calendrier",
    community: "Communauté",
    profile: "Profil",
    hiUser: "Salut, {name}! 👋",
    dayOfTotal: "{day} jour sur {total}",
    planBeginsIn: "Le plan commence dans {days} {unit} le {date}",
    day: "jour",
    days: "jours",
    streak: "Série",
    chapters: "Chapitres",
    bonus: "bonus",
    done: "Terminé",
    todaysReading: "Lecture d'Aujourd'hui",
    markComplete: "Marquer comme Terminé",
    completed: "Terminé ! Bravo ! 🎉",
    undo: "Annuler",
    viewFullCalendar: "Voir le Calendrier Complet",
    verseOfTheDay: "Verset du Jour",
    milestoneRewards: "Récompenses d'Étapes",
    milestoneDesc: "terminé • débloquez des badges pendant que la communauté vous encourage.",
    booksAZ: "Livres (A-Z)",
    booksDesc: "Besoin d'un rafraîchissement rapide sur les livres de la Bible ? Parcourez l'index alphabétique ci-dessous.",
    backToCalendar: "← Retour au Calendrier",
    dayReading: "Lecture du Jour {day} :",
    markIncomplete: "Marquer comme Incomplet",
    communityProgress: "Progrès de la Communauté",
    bibleChallenge: "Défi Biblique",
    finisher: "👑 Terminateur",
    torchbearer: "🔥 Porteur de Torche",
    steadfast: "🏅 Constant",
    determined: "💪 Déterminé",
    starter: "🌱 Débutant",
    profileSettings: "Profil & Paramètres",
    displayName: "Nom d'Affichage",
    displayNameDesc: "Ce nom apparaît sur le leaderboard communautaire et les statistiques partagées.",
    saveDisplayName: "Enregistrer le Nom d'Affichage",
    dailyReadingTime: "Heure de Lecture Quotidienne",
    reminderDesc: "Définissez votre heure de lecture quotidienne préférée. Vous serez rappelé d'achever votre lecture.",
    saveReminder: "Enregistrer le Rappel",
    tip: "💡 Conseil : Activez les notifications du navigateur pour recevoir des rappels quotidiens !",
    installAsApp: "📱 Installer comme App",
    androidInstall: "📱 Android : Menu (⋮) → Ajouter à l'écran d'accueil",
    iphoneInstall: "🍎 iPhone : Partager → Ajouter à l'écran d'accueil",
    installBenefit: "✨ Installez comme une app pour la meilleure expérience avec accès hors ligne et notifications push !",
    installBibleChallenge: "Installer Bible Challenge",
    appTheme: "Thème de l'App",
    logExtraReading: "Enregistrer une Lecture Supplémentaire",
    extraReadingDesc: "Vous avez lu plus de chapitres que prévu aujourd'hui ? Ajoutez-les ici pour que votre progression reflète l'effort supplémentaire.",
    chaptersRead: "Nombre de chapitres supplémentaires",
    recordExtra: "Enregistrer les Chapitres Supplémentaires",
    extraLogged: "Vous avez enregistré {chapters} chapitres bonus jusqu'à présent.",
    removeExtraReading: "Supprimer la Lecture Supplémentaire",
    removeExtraDesc: "Vous vous êtes trompé ? Supprimez les chapitres supplémentaires que vous avez enregistrés précédemment.",
    chaptersToRemove: "Nombre de chapitres à supprimer",
    removeChapters: "Supprimer les Chapitres",
    removeNote: "Cela ne supprimera que du décompte des chapitres bonus.",
    deleteAccount: "Vous voulez partir ? Vous pouvez supprimer votre compte et toute progression à tout moment. Cela n'affecte que vos données.",
    deleteProgress: "Supprimer Ma Progression",
    shareApp: "Partager Bible Challenge avec des Amis",
    shareDesc: "Invitez d'autres personnes à rejoindre ce merveilleux voyage ! 📖✨",
    verses: [
      "Car je connais les projets que j'ai formés pour vous, déclare l'Éternel... - Jérémie 29:11",
      "Confie-toi en l'Éternel de tout ton cœur... - Proverbes 3:5-6",
      "Je puis tout par celui qui me fortifie. - Philippiens 4:13",
      "L'Éternel est mon berger ; je ne manquerai de rien. - Psaume 23:1",
      "Fortifie-toi et prends courage. Ne crains point... - Josué 1:9",
      "Tu aimeras l'Éternel, ton Dieu, de tout ton cœur... - Matthieu 22:37",
      "Au commencement était la Parole, et la Parole était avec Dieu... - Jean 1:1"
    ],
    books: [
      "Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome", "Josué", "Juges", "Ruth",
      "1 Samuel", "2 Samuel", "1 Rois", "2 Rois", "1 Chroniques", "2 Chroniques", "Esdras",
      "Néhémie", "Esther", "Job", "Psaumes", "Proverbes", "Ecclésiaste", "Cantique des Cantiques",
      "Ésaïe", "Jérémie", "Lamentations", "Ézéchiel", "Daniel", "Osée", "Joël", "Amos",
      "Abdias", "Jonas", "Michée", "Nahum", "Habacuc", "Sophonie", "Aggée", "Zacharie",
      "Malachie", "Matthieu", "Marc", "Luc", "Jean", "Actes", "Romains", "1 Corinthiens",
      "2 Corinthiens", "Galates", "Éphésiens", "Philippiens", "Colossiens", "1 Thessaloniciens",
      "2 Thessaloniciens", "1 Timothée", "2 Timothée", "Tite", "Philémon", "Hébreux", "Jacques",
      "1 Pierre", "2 Pierre", "1 Jean", "2 Jean", "3 Jean", "Jude", "Apocalypse"
    ]
  },

  de: {
    appTitle: "Bibel Challenge",
    appSubtitle: "Lese-Reise 2026",
    appTagline: "Lasst uns zusammen lesen, zusammen wachsen",
    enterName: "Geben Sie Ihren Namen ein",
    joinChallenge: "Der Challenge beitreten",
    selectLanguage: "Sprache auswählen",
    home: "Startseite",
    calendar: "Kalender",
    community: "Gemeinschaft",
    profile: "Profil",
    hiUser: "Hallo, {name}! 👋",
    dayOfTotal: "Tag {day} von {total}",
    planBeginsIn: "Der Plan beginnt in {days} {unit} am {date}",
    day: "Tag",
    days: "Tage",
    streak: "Serie",
    chapters: "Kapitel",
    bonus: "Bonus",
    done: "Fertig",
    todaysReading: "Heutige Lesung",
    markComplete: "Als vollständig markieren",
    completed: "Abgeschlossen! Gut gemacht! 🎉",
    undo: "Rückgängig machen",
    viewFullCalendar: "Vollständigen Kalender anzeigen",
    verseOfTheDay: "Vers des Tages",
    milestoneRewards: "Meilenstein-Belohnungen",
    milestoneDesc: "abgeschlossen • schalte Abzeichen frei, während die Gemeinschaft dich anfeuert.",
    booksAZ: "Bücher (A-Z)",
    booksDesc: "Brauchst du eine schnelle Auffrischung über die Bücher der Bibel? Durchsuche den alphabetischen Index unten.",
    backToCalendar: "← Zurück zum Kalender",
    dayReading: "Lesung Tag {day}:",
    markIncomplete: "Als unvollständig markieren",
    communityProgress: "Gemeinschaftsfortschritt",
    bibleChallenge: "Bibel Challenge",
    finisher: "👑 Absolvent",
    torchbearer: "🔥 Fackelträger",
    steadfast: "🏅 Standhaft",
    determined: "💪 Entschlossen",
    starter: "🌱 Anfänger",
    profileSettings: "Profil & Einstellungen",
    displayName: "Anzeigename",
    displayNameDesc: "Dieser Name erscheint auf der Gemeinschafts-Rangliste und geteilten Statistiken.",
    saveDisplayName: "Anzeigenamen speichern",
    dailyReadingTime: "Tägliche Lesezeit",
    reminderDesc: "Stellen Sie Ihre bevorzugte tägliche Lesezeit ein. Sie werden daran erinnert, Ihre Lesung zu beenden.",
    saveReminder: "Erinnerung speichern",
    tip: "💡 Tipp: Aktivieren Sie Browser-Benachrichtigungen, um tägliche Erinnerungen zu erhalten!",
    installAsApp: "📱 Als App installieren",
    androidInstall: "📱 Android: Menü (⋮) → Zum Startbildschirm hinzufügen",
    iphoneInstall: "🍎 iPhone: Teilen → Zum Startbildschirm hinzufügen",
    installBenefit: "✨ Als App installieren für die beste Erfahrung mit Offline-Zugang und Push-Benachrichtigungen!",
    installBibleChallenge: "Bible Challenge installieren",
    appTheme: "App-Thema",
    logExtraReading: "Zusätzliche Lesung protokollieren",
    extraReadingDesc: "Haben Sie heute mehr Kapitel gelesen als geplant? Fügen Sie sie hier hinzu, damit Ihr Fortschritt den zusätzlichen Aufwand widerspiegelt.",
    chaptersRead: "Anzahl zusätzlicher Kapitel",
    recordExtra: "Zusätzliche Kapitel aufzeichnen",
    extraLogged: "Sie haben bisher {chapters} Bonus-Kapitel protokolliert.",
    removeExtraReading: "Zusätzliche Lesung entfernen",
    removeExtraDesc: "Haben Sie sich geirrt? Entfernen Sie zusätzliche Kapitel, die Sie zuvor protokolliert haben.",
    chaptersToRemove: "Anzahl zu entfernender Kapitel",
    removeChapters: "Kapitel entfernen",
    removeNote: "Dies entfernt nur aus der Bonus-Kapitel-Anzahl.",
    deleteAccount: "Möchten Sie gehen? Sie können Ihr Konto und den gesamten Fortschritt jederzeit löschen. Dies betrifft nur Ihre Daten.",
    deleteProgress: "Meinen Fortschritt löschen",
    shareApp: "Bible Challenge mit Freunden teilen",
    shareDesc: "Laden Sie andere ein, dieser wunderbaren Reise beizutreten! 📖✨",
    verses: [
      "Denn ich kenne die Pläne, die ich für euch habe, spricht der Herr... - Jeremia 29:11",
      "Vertraue dem Herrn von ganzem Herzen... - Sprüche 3:5-6",
      "Ich vermag alles durch den, der mich mächtig macht. - Philipper 4:13",
      "Der Herr ist mein Hirte; mir wird nichts mangeln. - Psalm 23:1",
      "Sei stark und mutig. Fürchte dich nicht... - Josua 1:9",
      "Du sollst den Herrn, deinen Gott, lieben von ganzem Herzen... - Matthäus 22:37",
      "Im Anfang war das Wort, und das Wort war bei Gott... - Johannes 1:1"
    ],
    books: [
      "1. Mose", "2. Mose", "3. Mose", "4. Mose", "5. Mose", "Josua", "Richter", "Rut",
      "1. Samuel", "2. Samuel", "1. Könige", "2. Könige", "1. Chronik", "2. Chronik", "Esra",
      "Nehemia", "Esther", "Hiob", "Psalmen", "Sprüche", "Prediger", "Hohelied",
      "Jesaja", "Jeremia", "Klagelieder", "Hesekiel", "Daniel", "Hosea", "Joel", "Amos",
      "Obadja", "Jona", "Micha", "Nahum", "Habakuk", "Zefanja", "Haggai", "Sacharja",
      "Maleachi", "Matthäus", "Markus", "Lukas", "Johannes", "Apostelgeschichte", "Römer", "1. Korinther",
      "2. Korinther", "Galater", "Epheser", "Philipper", "Kolosser", "1. Thessalonicher",
      "2. Thessalonicher", "1. Timotheus", "2. Timotheus", "Titus", "Philemon", "Hebräer", "Jakobus",
      "1. Petrus", "2. Petrus", "1. Johannes", "2. Johannes", "3. Johannes", "Judas", "Offenbarung"
    ]
  },

  sv: {
    appTitle: "Bibelutmaning",
    appSubtitle: "Läsresa 2026",
    appTagline: "Låt oss läsa tillsammans, växa tillsammans",
    enterName: "Ange ditt namn",
    joinChallenge: "Gå med i utmaningen",
    selectLanguage: "Välj språk",
    home: "Hem",
    calendar: "Kalender",
    community: "Gemenskap",
    profile: "Profil",
    hiUser: "Hej, {name}! 👋",
    dayOfTotal: "Dag {day} av {total}",
    planBeginsIn: "Planen börjar om {days} {unit} den {date}",
    day: "dag",
    days: "dagar",
    streak: "Serie",
    chapters: "Kapitel",
    bonus: "bonus",
    done: "Klar",
    todaysReading: "Dagens läsning",
    markComplete: "Markera som klar",
    completed: "Klar! Bra jobbat! 🎉",
    undo: "Ångra",
    viewFullCalendar: "Visa hela kalendern",
    verseOfTheDay: "Dagens vers",
    milestoneRewards: "Milstolpebelöningar",
    milestoneDesc: "klar • lås upp märken medan gemenskapen hejar på dig.",
    booksAZ: "Böcker (A-Ö)",
    booksDesc: "Behöver du en snabb repetition av Bibelns böcker? Bläddra i det alfabetiska indexet nedan.",
    backToCalendar: "← Tillbaka till kalendern",
    dayReading: "Dag {day} läsning:",
    markIncomplete: "Markera som ofullständig",
    communityProgress: "Gemenskapsframsteg",
    bibleChallenge: "Bibelutmaning",
    finisher: "👑 Avslutare",
    torchbearer: "🔥 Fackelbärare",
    steadfast: "🏅 Stadig",
    determined: "💪 Bestämd",
    starter: "🌱 Nybörjare",
    profileSettings: "Profil & inställningar",
    displayName: "Visningsnamn",
    displayNameDesc: "Detta namn visas på gemenskapens topplista och delade statistik.",
    saveDisplayName: "Spara visningsnamn",
    dailyReadingTime: "Daglig lästid",
    reminderDesc: "Ställ in din föredragna dagliga lästid. Du kommer att påminnas att slutföra din läsning.",
    saveReminder: "Spara påminnelse",
    tip: "💡 Tips: Aktivera webbläsarmeddelanden för att få dagliga påminnelser!",
    installAsApp: "📱 Installera som app",
    androidInstall: "📱 Android: Meny (⋮) → Lägg till på startskärmen",
    iphoneInstall: "🍎 iPhone: Dela → Lägg till på startskärmen",
    installBenefit: "✨ Installera som en app för den bästa upplevelsen med offlineåtkomst och push-meddelanden!",
    installBibleChallenge: "Installera Bible Challenge",
    appTheme: "App-tema",
    logExtraReading: "Logga extra läsning",
    extraReadingDesc: "Har du läst fler kapitel än planerat idag? Lägg till dem här så att din framsteg återspeglar det extra arbetet.",
    chaptersRead: "Antal extra kapitel",
    recordExtra: "Spela in extra kapitel",
    extraLogged: "Du har loggat {chapters} bonuskapitel hittills.",
    removeExtraReading: "Ta bort extra läsning",
    removeExtraDesc: "Har du gjort fel? Ta bort extra kapitel som du tidigare loggat.",
    chaptersToRemove: "Antal kapitel att ta bort",
    removeChapters: "Ta bort kapitel",
    removeNote: "Detta tar endast bort från bonuskapitel-räkningen.",
    deleteAccount: "Vill du sluta? Du kan ta bort ditt konto och all framsteg när som helst. Detta påverkar endast dina data.",
    deleteProgress: "Ta bort min framsteg",
    shareApp: "Dela Bible Challenge med vänner",
    shareDesc: "Bjud in andra att gå med i denna underbara resa! 📖✨",
    verses: [
      "Ty jag känner de tankar jag har för er, säger Herren... - Jeremia 29:11",
      "Förtrösta på Herren av allt ditt hjärta... - Ordspråken 3:5-6",
      "Jag förmår allt genom honom som ger mig kraft. - Filipperbrevet 4:13",
      "Herren är min herde; mig skall intet fattas. - Psalm 23:1",
      "Var stark och modig. Frukta icke... - Josua 1:9",
      "Du skall älska Herren, din Gud, av allt ditt hjärta... - Matteus 22:37",
      "I begynnelsen var Ordet, och Ordet var hos Gud... - Johannes 1:1"
    ],
    books: [
      "1 Mosebok", "2 Mosebok", "3 Mosebok", "4 Mosebok", "5 Mosebok", "Josua", "Domarboken", "Rut",
      "1 Samuelsboken", "2 Samuelsboken", "1 Kungaboken", "2 Kungaboken", "1 Krönikeboken", "2 Krönikeboken", "Esra",
      "Nehemja", "Ester", "Job", "Psaltaren", "Ordspråken", "Predikaren", "Höga Visan",
      "Jesaja", "Jeremia", "Klagovisorna", "Hesekiel", "Daniel", "Hosea", "Joel", "Amos",
      "Obadja", "Jona", "Mika", "Nahum", "Habackuk", "Sefanja", "Haggai", "Sakaria",
      "Malaki", "Matteus", "Markus", "Lukas", "Johannes", "Apostlagärningarna", "Romarbrevet", "1 Korintierbrevet",
      "2 Korintierbrevet", "Galaterbrevet", "Efesierbrevet", "Filipperbrevet", "Kolosserbrevet", "1 Tessalonikerbrevet",
      "2 Tessalonikerbrevet", "1 Timoteusbrevet", "2 Timoteusbrevet", "Titusbrevet", "Filemonbrevet", "Hebreerbrevet", "Jakobsbrevet",
      "1 Petrusbrevet", "2 Petrusbrevet", "1 Johannesbrevet", "2 Johannesbrevet", "3 Johannesbrevet", "Judasbrevet", "Uppenbarelseboken"
    ]
  },

  pl: {
    appTitle: "Wyzwanie Biblijne",
    appSubtitle: "Podróż Czytelnicza 2026",
    appTagline: "Czytajmy Razem, Rozwijajmy Się Razem",
    enterName: "Wpisz swoje imię",
    joinChallenge: "Dołącz do Wyzwania",
    selectLanguage: "Wybierz Język",
    home: "Strona Główna",
    calendar: "Kalendarz",
    community: "Społeczność",
    profile: "Profil",
    hiUser: "Cześć, {name}! 👋",
    dayOfTotal: "Dzień {day} z {total}",
    planBeginsIn: "Plan rozpoczyna się za {days} {unit} {date}",
    day: "dzień",
    days: "dni",
    streak: "Seria",
    chapters: "Rozdziały",
    bonus: "bonus",
    done: "Ukończone",
    todaysReading: "Dzisiejsze Czytanie",
    markComplete: "Oznacz jako Ukończone",
    completed: "Ukończone! Świetnie! 🎉",
    undo: "Cofnij",
    viewFullCalendar: "Zobacz Pełny Kalendarz",
    verseOfTheDay: "Werset Dnia",
    milestoneRewards: "Nagrody Kamieni Milowych",
    milestoneDesc: "ukończone • odblokuj odznaki podczas gdy społeczność cię dopinguje.",
    booksAZ: "Księgi (A-Z)",
    booksDesc: "Potrzebujesz szybkiego przypomnienia o księgach Biblii? Przejrzyj alfabetyczny indeks poniżej.",
    backToCalendar: "← Powrót do Kalendarza",
    dayReading: "Czytanie Dnia {day}:",
    markIncomplete: "Oznacz jako Nieukończone",
    communityProgress: "Postęp Społeczności",
    bibleChallenge: "Wyzwanie Biblijne",
    finisher: "👑 Ukończyciel",
    torchbearer: "🔥 Niosący Pochodnię",
    steadfast: "🏅 Wytrwały",
    determined: "💪 Zdeterminowany",
    starter: "🌱 Początkujący",
    profileSettings: "Profil & Ustawienia",
    displayName: "Nazwa Wyświetlana",
    displayNameDesc: "Ta nazwa pojawia się na tablicy społecznościowej i udostępnionych statystykach.",
    saveDisplayName: "Zapisz Nazwę Wyświetlaną",
    dailyReadingTime: "Codzienna Godzina Czytania",
    reminderDesc: "Ustaw swoją preferowaną codzienną godzinę czytania. Będziesz przypomniany o ukończeniu czytania.",
    saveReminder: "Zapisz Przypomnienie",
    tip: "💡 Wskazówka: Włącz powiadomienia przeglądarki, aby otrzymywać codzienne przypomnienia!",
    installAsApp: "📱 Zainstaluj jako Aplikację",
    androidInstall: "📱 Android: Menu (⋮) → Dodaj do ekranu głównego",
    iphoneInstall: "🍎 iPhone: Udostępnij → Dodaj do ekranu głównego",
    installBenefit: "✨ Zainstaluj jako aplikację dla najlepszego doświadczenia z dostępem offline i powiadomieniami push!",
    installBibleChallenge: "Zainstaluj Bible Challenge",
    appTheme: "Motyw Aplikacji",
    logExtraReading: "Zaloguj Dodatkowe Czytanie",
    extraReadingDesc: "Przeczytałeś dziś więcej rozdziałów niż zaplanowano? Dodaj je tutaj, aby Twój postęp odzwierciedlał dodatkowy wysiłek.",
    chaptersRead: "Liczba dodatkowych rozdziałów",
    recordExtra: "Zapisz Dodatkowe Rozdziały",
    extraLogged: "Zalogowałeś dotychczas {chapters} bonusowych rozdziałów.",
    removeExtraReading: "Usuń Dodatkowe Czytanie",
    removeExtraDesc: "Pomyliłeś się? Usuń dodatkowe rozdziały, które wcześniej zalogowałeś.",
    chaptersToRemove: "Liczba rozdziałów do usunięcia",
    removeChapters: "Usuń Rozdziały",
    removeNote: "To usunie tylko z licznika bonusowych rozdziałów.",
    deleteAccount: "Chcesz odejść? Możesz usunąć swoje konto i cały postęp w dowolnym momencie. To dotyczy tylko Twoich danych.",
    deleteProgress: "Usuń Mój Postęp",
    shareApp: "Udostępnij Bible Challenge Przyjaciołom",
    shareDesc: "Zaproś innych do dołączenia do tej wspaniałej podróży! 📖✨",
    verses: [
      "Albowiem Ja wiem, jakie myśli mam o was, mówi Pan... - Jeremiasz 29:11",
      "Zaufaj Panu całym sercem swoim... - Przysłów 3:5-6",
      "Wszystko mogę w Tym, który mnie wzmacnia. - Filipian 4:13",
      "Pan jest moim pasterzem, niczego mi nie braknie. - Psalm 23:1",
      "Bądź mężny i odważny. Nie bój się... - Jozue 1:9",
      "Będziesz miłował Pana, Boga swego, całym sercem swoim... - Mateusz 22:37",
      "Na początku było Słowo, a Słowo było u Boga... - Jan 1:1"
    ],
    books: [
      "Rodzaju", "Wyjścia", "Kapłańska", "Liczb", "Powtórzonego Prawa", "Jozuego", "Sędziów", "Rut",
      "1 Samuela", "2 Samuela", "1 Królewska", "2 Królewska", "1 Kronik", "2 Kronik", "Ezdrasza",
      "Nehemiasza", "Estery", "Hioba", "Psalmy", "Przysłów", "Kaznodziei", "Pieśń nad Pieśniami",
      "Izajasza", "Jeremiasza", "Lamentacje", "Ezechiela", "Daniela", "Ozeasza", "Joela", "Amosa",
      "Abdiasza", "Jonasza", "Micheasza", "Nahuma", "Habakuka", "Sofoniasza", "Aggeusza", "Zachariasza",
      "Malachiasza", "Mateusza", "Marka", "Łukasza", "Jana", "Dzieje Apostolskie", "Rzymian", "1 Koryntian",
      "2 Koryntian", "Galatów", "Efezjan", "Filipian", "Kolosan", "1 Tesaloniczan",
      "2 Tesaloniczan", "1 Tymoteusza", "2 Tymoteusza", "Tytusa", "Filemona", "Hebrajczyków", "Jakuba",
      "1 Piotra", "2 Piotra", "1 Jana", "2 Jana", "3 Jana", "Judy", "Objawienie"
    ]
  },

  kn: {
    appTitle: "ಬೈಬಲ್ ಚಾಲೆಂಜ್",
    appSubtitle: "2026 ಓದು ಪ್ರಯಾಣ",
    appTagline: "ಒಟ್ಟಿಗೆ ಓದೋಣ, ಒಟ್ಟಿಗೆ ಬೆಳೆಯೋಣ",
    enterName: "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    joinChallenge: "ಚಾಲೆಂಜ್‌ಗೆ ಸೇರಿಕೊಳ್ಳಿ",
    selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
    home: "ಮುಖ್ಯ",
    calendar: "ಕ್ಯಾಲೆಂಡರ್",
    community: "ಸಮುದಾಯ",
    profile: "ಪ್ರೊಫೈಲ್",
    hiUser: "ನಮಸ್ಕಾರ, {name}! 👋",
    dayOfTotal: "{total} ರಲ್ಲಿ {day} ದಿನ",
    planBeginsIn: "ಯೋಜನೆ {date} ರಂದು {days} {unit} ನಲ್ಲಿ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ",
    day: "ದಿನ",
    days: "ದಿನಗಳು",
    streak: "ಸ್ಟ್ರೀಕ್",
    chapters: "ಅಧ್ಯಾಯಗಳು",
    bonus: "ಬೋನಸ್",
    done: "ಮುಗಿದಿದೆ",
    todaysReading: "ಇಂದಿನ ಓದು",
    markComplete: "ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    completed: "ಪೂರ್ಣಗೊಂಡಿದೆ! ಚೆನ್ನಾಗಿ ಮಾಡಿದ್ದೀರಿ! 🎉",
    undo: "ರದ್ದುಗೊಳಿಸಿ",
    viewFullCalendar: "ಪೂರ್ಣ ಕ್ಯಾಲೆಂಡರ್ ನೋಡಿ",
    verseOfTheDay: "ದಿನದ ವಚನ",
    milestoneRewards: "ಮೈಲಿಗಲ್ಲು ಬಹುಮಾನಗಳು",
    milestoneDesc: "ಪೂರ್ಣಗೊಂಡಿದೆ • ಸಮುದಾಯ ನಿಮ್ಮನ್ನು ಪ್ರೋತ್ಸಾಹಿಸುತ್ತಿರುವಾಗ ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ.",
    booksAZ: "ಪುಸ್ತಕಗಳು (A-Z)",
    booksDesc: "ಬೈಬಲ್ ಪುಸ್ತಕಗಳ ಬಗ್ಗೆ ತ್ವರಿತ ರಿಫ್ರೆಶರ್ ಬೇಕೇ? ಕೆಳಗಿನ ಅಕ್ಷರಾನುಕ್ರಮ ಸೂಚಿಯನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ.",
    backToCalendar: "← ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    dayReading: "{day} ದಿನ ಓದು:",
    markIncomplete: "ಅಪೂರ್ಣ ಎಂದು ಗುರುತಿಸಿ",
    communityProgress: "ಸಮುದಾಯ ಪ್ರಗತಿ",
    bibleChallenge: "ಬೈಬಲ್ ಚಾಲೆಂಜ್",
    finisher: "👑 ಮುಗಿಸುವವರು",
    torchbearer: "🔥 ಟಾರ್ಚ್‌ಬೇರರ್",
    steadfast: "🏅 ಸ್ಥಿರ",
    determined: "💪 ನಿರ್ಧಾರಿತ",
    starter: "🌱 ಪ್ರಾರಂಭಿಕ",
    profileSettings: "ಪ್ರೊಫೈಲ್ & ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    displayName: "ಪ್ರದರ್ಶನ ಹೆಸರು",
    displayNameDesc: "ಈ ಹೆಸರು ಸಮುದಾಯ ಲೀಡರ್‌ಬೋರ್ಡ್ ಮತ್ತು ಹಂಚಿದ ಸ್ಟ್ಯಾಟಿಸ್ಟಿಕ್ಸ್‌ಗಳಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
    saveDisplayName: "ಪ್ರದರ್ಶನ ಹೆಸರನ್ನು ಉಳಿಸಿ",
    dailyReadingTime: "ದೈನಂದಿನ ಓದು ಸಮಯ",
    reminderDesc: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ದೈನಂದಿನ ಓದು ಸಮಯವನ್ನು ಹೊಂದಿಸಿ. ನಿಮ್ಮ ಓದನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ನಿಮಗೆ ಜ್ಞಾಪನೆಯಾಗುತ್ತದೆ.",
    saveReminder: "ಜ್ಞಾಪನೆಯನ್ನು ಉಳಿಸಿ",
    tip: "💡 ಸಲಹೆ: ದೈನಂದಿನ ಜ್ಞಾಪನೆಗಳನ್ನು ಪಡೆಯಲು ಬ್ರೌಸರ್ ಅಧಿಸೂಚನೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ!",
    installAsApp: "📱 ಅಪ್ಲಿಕೇಶನ್ ಆಗಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ",
    androidInstall: "📱 ಆಂಡ್ರಾಯ್ಡ್: ಮೆನು (⋮) → ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ",
    iphoneInstall: "🍎 iPhone: ಹಂಚಿಕೊಳ್ಳಿ → ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ",
    installBenefit: "✨ ಆಫ್‌ಲೈನ್ ಪ್ರವೇಶ ಮತ್ತು ಪುಷ್ ಅಧಿಸೂಚನೆಗಳೊಂದಿಗೆ ಉತ್ತಮ ಅನುಭವಕ್ಕಾಗಿ ಅಪ್ಲಿಕೇಶನ್ ಆಗಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ!",
    installBibleChallenge: "ಬೈಬಲ್ ಚಾಲೆಂಜ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ",
    appTheme: "ಅಪ್ಲಿಕೇಶನ್ ಥೀಮ್",
    logExtraReading: "ಹೆಚ್ಚುವರಿ ಓದನ್ನು ಲಾಗ್ ಮಾಡಿ",
    extraReadingDesc: "ಇಂದು ಯೋಜಿತ ಅಧ್ಯಾಯಗಳಿಗಿಂತ ಹೆಚ್ಚು ಓದಿದ್ದೀರಾ? ನಿಮ್ಮ ಪ್ರಗತಿಯು ಹೆಚ್ಚುವರಿ ಪ್ರಯತ್ನವನ್ನು ಪ್ರತಿಬಿಂಬಿಸುವಂತೆ ಅವುಗಳನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಿ.",
    chaptersRead: "ಹೆಚ್ಚುವರಿ ಅಧ್ಯಾಯಗಳ ಸಂಖ್ಯೆ",
    recordExtra: "ಹೆಚ್ಚುವರಿ ಅಧ್ಯಾಯಗಳನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ",
    extraLogged: "ನೀವು ಇಲ್ಲಿಯವರೆಗೆ {chapters} ಬೋನಸ್ ಅಧ್ಯಾಯಗಳನ್ನು ಲಾಗ್ ಮಾಡಿದ್ದೀರಿ.",
    removeExtraReading: "ಹೆಚ್ಚುವರಿ ಓದನ್ನು ತೆಗೆದುಹಾಕಿ",
    removeExtraDesc: "ತಪ್ಪು ಮಾಡಿದ್ದೀರಾ? ಮೊದಲು ಲಾಗ್ ಮಾಡಿದ ಹೆಚ್ಚುವರಿ ಅಧ್ಯಾಯಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.",
    chaptersToRemove: "ತೆಗೆದುಹಾಕಬೇಕಾದ ಅಧ್ಯಾಯಗಳ ಸಂಖ್ಯೆ",
    removeChapters: "ಅಧ್ಯಾಯಗಳನ್ನು ತೆಗೆದುಹಾಕಿ",
    removeNote: "ಇದು ಕೇವಲ ಬೋನಸ್ ಅಧ್ಯಾಯಗಳ ಎಣಿಕೆಯಿಂದ ತೆಗೆದುಹಾಕುತ್ತದೆ.",
    deleteAccount: "ಹೋಗಲು ಬಯಸುತ್ತೀರಾ? ನೀವು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಎಲ್ಲಾ ಪ್ರಗತಿಯನ್ನು ಅಳಿಸಬಹುದು. ಇದು ಕೇವಲ ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಪ್ರಭಾವಿಸುತ್ತದೆ.",
    deleteProgress: "ನನ್ನ ಪ್ರಗತಿಯನ್ನು ಅಳಿಸಿ",
    shareApp: "ಬೈಬಲ್ ಚಾಲೆಂಜ್ ಅನ್ನು ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ",
    shareDesc: "ಈ ಅದ್ಭುತ ಪ್ರಯಾಣಕ್ಕೆ ಇತರರನ್ನು ಆಹ್ವಾನಿಸಿ! 📖✨",
    verses: [
      "ನಿಮ್ಮ ಬಗ್ಗೆ ನಾನು ಉಳ್ಳ ಯೋಜನೆಗಳನ್ನು ನಾನು ಬಲ್ಲೆನು, ಕರ್ತನು ಘೋಷಿಸುತ್ತಾನೆ... - ಯೆರೆಮೀಯನು 29:11",
      "ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಹೃದಯದಿಂದ ಕರ್ತನನ್ನು ನಂಬಿರಿ... - ಸಾಮೆತ 3:5-6",
      "ನನ್ನನ್ನು ಬಲಪಡಿಸುವಾತನ ಮೂಲಕ ನಾನು ಎಲ್ಲವನ್ನೂ ಮಾಡಬಲ್ಲೆ. - ಫಿಲಿಪ್ಪಿಯರಿಗೆ 4:13",
      "ಕರ್ತನು ನನ್ನ ಕುರುಬನು; ನನಗೆ ಏನೂ ಕೊರತೆಯಿಲ್ಲ. - ಕೀರ್ತನೆ 23:1",
      "ದೃಢರಾಗಿರಿ ಮತ್ತು ಧೈರ್ಯವಂತರಾಗಿರಿ. ಹೆದರಬೇಡಿ... - ಯೋಶುವ 1:9",
      "ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಹೃದಯದಿಂದ ಕರ್ತನಾದ ನಿಮ್ಮ ದೇವರನ್ನು ಪ್ರೀತಿಸಬೇಕು... - ಮತ್ತಾಯ 22:37",
      "ಆದಿಯಲ್ಲಿ ವಾಕ್ಯವಿತ್ತು, ವಾಕ್ಯವು ದೇವರ ಸಂಗಡವಿತ್ತು... - ಯೋಹಾನ 1:1"
    ],
    books: [
      "ಆದಿಕಾಂಡ", "ವಿಮೋಚನಕಾಂಡ", "ಯಾಜಕಕಾಂಡ", "ಸಂಖ್ಯಾಕಾಂಡ", "ದ್ವಿತೀಯೋಪದೇಶಕಾಂಡ", "ಯೋಶುವ", "ನ್ಯಾಯಸ್ಥಾಪಕರು", "ರೂತ್",
      "1 ಸಮುವೇಲ", "2 ಸಮುವೇಲ", "1 ಅರಸುಗಳು", "2 ಅರಸುಗಳು", "1 ದಿನವೃತ್ತ", "2 ದಿನವೃತ್ತ", "ಎಜ್ರಾ",
      "ನೆಹೆಮ್ಯಾ", "ಎಸ್ತೇರ್", "ಯೋಬ್", "ಕೀರ್ತನೆಗಳು", "ಸಾಮೆತ", "ಉಪದೇಶಕ", "ಪರಮಗೀತ",
      "ಯೆಶಾಯ", "ಯೆರೆಮೀಯ", "ಪ್ರಲಾಪಗಳು", "ಯೆಹೆಜ್ಕೇಲ್", "ದಾನಿಯೇಲ್", "ಹೋಶೇ", "ಯೋವೇಲ್", "ಆಮೋಸ್",
      "ಓಬದ್ಯ", "ಯೋನ", "ಮೀಕಾ", "ನಹೂಮ್", "ಹಬಕ್ಕೂಕ್", "ಸೆಫನ್ಯಾ", "ಹಗ್ಗೈ", "ಜೆಕರ್ಯಾ",
      "ಮಲಾಕಿ", "ಮತ್ತಾಯ", "ಮಾರ್ಕ", "ಲೂಕ", "ಯೋಹಾನ", "ಅಪೊಸ್ತಲರ ಕೃತ್ಯಗಳು", "ರೋಮಾಪುರದವರಿಗೆ", "1 ಕೊರಿಂಥದವರಿಗೆ",
      "2 ಕೊರಿಂಥದವರಿಗೆ", "ಗಲಾತ್ಯದವರಿಗೆ", "ಎಫೆಸದವರಿಗೆ", "ಫಿಲಿಪ್ಪಿಯರಿಗೆ", "ಕೊಲೊಸ್ಸೆದವರಿಗೆ", "1 ಥೆಸಲೋನೀಕದವರಿಗೆ",
      "2 ಥೆಸಲೋನೀಕದವರಿಗೆ", "1 ತಿಮೋಥೆಯನಿಗೆ", "2 ತಿಮೋಥೆಯನಿಗೆ", "ತೀತನಿಗೆ", "ಫಿಲೇಮೋನನಿಗೆ", "ಹೆಬ್ರಿಯರಿಗೆ", "ಯಾಕೋಬನಿಗೆ",
      "1 ಪೇತ್ರನಿಗೆ", "2 ಪೇತ್ರನಿಗೆ", "1 ಯೋಹಾನನಿಗೆ", "2 ಯೋಹಾನನಿಗೆ", "3 ಯೋಹಾನನಿಗೆ", "ಯೂದನಿಗೆ", "ಪ್ರಕಟನೆ"
    ]
  },

  pa: {
    appTitle: "ਬਾਈਬਲ ਚੈਲੇਂਜ",
    appSubtitle: "2026 ਪੜ੍ਹਨ ਦੀ ਯਾਤਰਾ",
    appTagline: "ਇਕੱਠੇ ਪੜ੍ਹੀਏ, ਇਕੱਠੇ ਵਧੀਏ",
    enterName: "ਆਪਣਾ ਨਾਮ ਦਾਖਲ ਕਰੋ",
    joinChallenge: "ਚੈਲੇਂਜ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    home: "ਹੋਮ",
    calendar: "ਕੈਲੰਡਰ",
    community: "ਕਮਿਊਨਿਟੀ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    hiUser: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, {name}! 👋",
    dayOfTotal: "{total} ਵਿੱਚੋਂ {day} ਦਿਨ",
    planBeginsIn: "ਯੋਜਨਾ {date} ਨੂੰ {days} {unit} ਵਿੱਚ ਸ਼ੁਰੂ ਹੋਵੇਗੀ",
    day: "ਦਿਨ",
    days: "ਦਿਨ",
    streak: "ਸਟ੍ਰੀਕ",
    chapters: "ਅਧਿਆਏ",
    bonus: "ਬੋਨਸ",
    done: "ਹੋ ਗਿਆ",
    todaysReading: "ਅੱਜ ਦੀ ਪੜ੍ਹਾਈ",
    markComplete: "ਪੂਰਾ ਹੋਇਆ ਮਾਰਕ ਕਰੋ",
    completed: "ਪੂਰਾ ਹੋ ਗਿਆ! ਵਧੀਆ ਕੰਮ! 🎉",
    undo: "ਵਾਪਸ ਕਰੋ",
    viewFullCalendar: "ਪੂਰਾ ਕੈਲੰਡਰ ਵੇਖੋ",
    verseOfTheDay: "ਦਿਨ ਦਾ ਸ਼ਲੋਕ",
    milestoneRewards: "ਮੀਲ ਪੱਥਰ ਇਨਾਮ",
    milestoneDesc: "ਪੂਰਾ ਹੋਇਆ • ਕਮਿਊਨਿਟੀ ਤੁਹਾਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਦੀ ਹੋਈ ਬੈਜ ਅਨਲਾਕ ਕਰੋ।",
    booksAZ: "ਕਿਤਾਬਾਂ (A-Z)",
    booksDesc: "ਬਾਈਬਲ ਦੀਆਂ ਕਿਤਾਬਾਂ ਬਾਰੇ ਤੇਜ਼ ਰਿਫ੍ਰੈਸ਼ਰ ਚਾਹੀਦਾ ਹੈ? ਹੇਠਾਂ ਦਿੱਤੇ ਅੱਖਰ ਵਰਗੇ ਸੂਚਕਾਂਕ ਨੂੰ ਬ੍ਰਾਊਜ਼ ਕਰੋ।",
    backToCalendar: "← ਕੈਲੰਡਰ ਵਾਪਸ ਜਾਓ",
    dayReading: "{day} ਦਿਨ ਪੜ੍ਹਾਈ:",
    markIncomplete: "ਅਧੂਰਾ ਮਾਰਕ ਕਰੋ",
    communityProgress: "ਕਮਿਊਨਿਟੀ ਪ੍ਰਗਤੀ",
    bibleChallenge: "ਬਾਈਬਲ ਚੈਲੇਂਜ",
    finisher: "👑 ਫਿਨਿਸ਼ਰ",
    torchbearer: "🔥 ਟਾਰਚਬੇਅਰਰ",
    steadfast: "🏅 ਸਟੈਡਫਾਸਟ",
    determined: "💪 ਡਿਟਰਮਾਈਂਡ",
    starter: "🌱 ਸਟਾਰਟਰ",
    profileSettings: "ਪ੍ਰੋਫਾਈਲ & ਸੈਟਿੰਗਾਂ",
    displayName: "ਡਿਸਪਲੇਅ ਨਾਮ",
    displayNameDesc: "ਇਹ ਨਾਮ ਕਮਿਊਨਿਟੀ ਲੀਡਰਬੋਰਡ ਅਤੇ ਸ਼ੇਅਰ ਕੀਤੀਆਂ ਅੰਕੜਿਆਂ ਵਿੱਚ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।",
    saveDisplayName: "ਡਿਸਪਲੇਅ ਨਾਮ ਸੇਵ ਕਰੋ",
    dailyReadingTime: "ਰੋਜ਼ਾਨਾ ਪੜ੍ਹਨ ਦਾ ਸਮਾਂ",
    reminderDesc: "ਆਪਣਾ ਤਰਜੀਹੀ ਰੋਜ਼ਾਨਾ ਪੜ੍ਹਨ ਦਾ ਸਮਾਂ ਸੈੱਟ ਕਰੋ। ਤੁਹਾਨੂੰ ਆਪਣੀ ਪੜ੍ਹਾਈ ਪੂਰੀ ਕਰਨ ਲਈ ਯਾਦ ਦਿਵਾਇਆ ਜਾਵੇਗਾ।",
    saveReminder: "ਰਿਮਾਈਂਡਰ ਸੇਵ ਕਰੋ",
    tip: "💡 ਟਿਪ: ਰੋਜ਼ਾਨਾ ਰਿਮਾਈਂਡਰ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਬ੍ਰਾਊਜ਼ਰ ਨੋਟੀਫਿਕੇਸ਼ਨਾਂ ਨੂੰ ਐਕਟੀਵੇਟ ਕਰੋ!",
    installAsApp: "📱 ਐਪ ਵਜੋਂ ਇੰਸਟਾਲ ਕਰੋ",
    androidInstall: "📱 ਐਂਡਰਾਇਡ: ਮੇਨੂ (⋮) → ਹੋਮ ਸਕ੍ਰੀਨ ਵਿੱਚ ਐਡ ਕਰੋ",
    iphoneInstall: "🍎 iPhone: ਸ਼ੇਅਰ → ਹੋਮ ਸਕ੍ਰੀਨ ਵਿੱਚ ਐਡ ਕਰੋ",
    installBenefit: "✨ ਆਫਲਾਈਨ ਐਕਸੈਸ ਅਤੇ ਪੁਸ਼ ਨੋਟੀਫਿਕੇਸ਼ਨਾਂ ਨਾਲ ਵਧੀਆ ਅਨੁਭਵ ਲਈ ਐਪ ਵਜੋਂ ਇੰਸਟਾਲ ਕਰੋ!",
    installBibleChallenge: "ਬਾਈਬਲ ਚੈਲੇਂਜ ਇੰਸਟਾਲ ਕਰੋ",
    appTheme: "ਐਪ ਥੀਮ",
    logExtraReading: "ਐਕਸਟਰਾ ਪੜ੍ਹਾਈ ਲੌਗ ਕਰੋ",
    extraReadingDesc: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਨਿਰਧਾਰਿਤ ਅਧਿਆਏਂ ਤੋਂ ਵੱਧ ਪੜ੍ਹ ਲਿਆ ਹੈ? ਆਪਣੀ ਪ੍ਰਗਤੀ ਨੂੰ ਐਕਸਟਰਾ ਮਿਹਨਤ ਨੂੰ ਦਰਸਾਉਣ ਲਈ ਉਨ੍ਹਾਂ ਨੂੰ ਇੱਥੇ ਐਡ ਕਰੋ।",
    chaptersRead: "ਐਕਸਟਰਾ ਅਧਿਆਏਂ ਦੀ ਗਿਣਤੀ",
    recordExtra: "ਐਕਸਟਰਾ ਅਧਿਆਏ ਰਿਕਾਰਡ ਕਰੋ",
    extraLogged: "ਤੁਸੀਂ ਹੁਣ ਤੱਕ {chapters} ਬੋਨਸ ਅਧਿਆਏ ਲੌਗ ਕੀਤੇ ਹਨ।",
    removeExtraReading: "ਐਕਸਟਰਾ ਪੜ੍ਹਾਈ ਹਟਾਓ",
    removeExtraDesc: "ਕੀ ਤੁਸੀਂ ਗਲਤੀ ਕਰ ਦਿੱਤੀ ਹੈ? ਪਹਿਲਾਂ ਲੌਗ ਕੀਤੇ ਐਕਸਟਰਾ ਅਧਿਆਏ ਹਟਾਓ।",
    chaptersToRemove: "ਹਟਾਉਣ ਲਈ ਅਧਿਆਏਂ ਦੀ ਗਿਣਤੀ",
    removeChapters: "ਅਧਿਆਏ ਹਟਾਓ",
    removeNote: "ਇਹ ਸਿਰਫ਼ ਬੋਨਸ ਅਧਿਆਏਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚੋਂ ਹਟਾ ਦੇਵੇਗਾ।",
    deleteAccount: "ਕੀ ਤੁਸੀਂ ਜਾਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਤੁਸੀਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਆਪਣਾ ਖਾਤਾ ਅਤੇ ਸਾਰੀ ਪ੍ਰਗਤੀ ਮਿਟਾ ਸਕਦੇ ਹੋ। ਇਹ ਸਿਰਫ਼ ਤੁਹਾਡੇ ਡੇਟਾ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰੇਗਾ।",
    deleteProgress: "ਮੇਰੀ ਪ੍ਰਗਤੀ ਮਿਟਾਓ",
    shareApp: "ਬਾਈਬਲ ਚੈਲੇਂਜ ਨੂੰ ਦੋਸਤਾਂ ਨਾਲ ਸ਼ੇਅਰ ਕਰੋ",
    shareDesc: "ਇਸ ਵਧੀਆ ਯਾਤਰਾ ਵਿੱਚ ਹੋਰਾਂ ਨੂੰ ਸ਼ਾਮਲ ਹੋਣ ਲਈ ਸੱਦੋ! 📖✨",
    verses: [
      "ਕਿਉਂਕਿ ਮੈਂ ਤੁਹਾਡੇ ਬਾਰੇ ਜੋ ਵਿਚਾਰ ਰੱਖਦਾ ਹਾਂ, ਉਹ ਮੈਨੂੰ ਪਤਾ ਹਨ, ਯਹੋਵਾਹ ਘੋਸ਼ਣਾ ਕਰਦਾ ਹੈ... - ਯਿਰਮਿਯਾਹ 29:11",
      "ਆਪਣੇ ਪੂਰੇ ਦਿਲ ਨਾਲ ਯਹੋਵਾਹ ਉੱਤੇ ਭਰੋਸਾ ਕਰੋ... - ਕਹਾਵਤਾਂ 3:5-6",
      "ਮੈਂ ਉਸ ਵਿੱਚ ਸਭ ਕੁਝ ਕਰ ਸਕਦਾ ਹਾਂ ਜੋ ਮੈਨੂੰ ਤਾਕਤ ਦਿੰਦਾ ਹੈ। - ਫਿਲਿੱਪੀਆਂ 4:13",
      "ਯਹੋਵਾਹ ਮੇਰਾ ਚਰਵਾਹਾ ਹੈ; ਮੈਨੂੰ ਕੁਝ ਵੀ ਕਮੀ ਨਹੀਂ। - ਭਜਨ 23:1",
      "ਹਿੰਮਤ ਵਾਲੇ ਅਤੇ ਦਲੇਰ ਬਣੋ। ਨਾ ਡਰੋ... - ਯਹੋਸ਼ੁਆ 1:9",
      "ਤੂੰ ਆਪਣੇ ਪੂਰੇ ਦਿਲ ਨਾਲ ਯਹੋਵਾਹ ਨੂੰ, ਆਪਣੇ ਪਰਮੇਸ਼ੁਰ ਨੂੰ, ਪਿਆਰ ਕਰੇਗਾ... - ਮੱਤੀ 22:37",
      "ਸ਼ੁਰੂ ਵਿੱਚ ਕਲਾਮ ਸੀ, ਅਤੇ ਕਲਾਮ ਪਰਮੇਸ਼ੁਰ ਕੋਲ ਸੀ... - ਯੂਹੰਨਾ 1:1"
    ],
    books: [
      "ਉਤਪਤਿ", "ਨਿਰਗਮਨ", "ਯਾਜਕਾਂ", "ਗਿਣਤੀ", "ਵਿਧੀ ਦੀ ਦੁਹਰਾਵ", "ਯਹੋਸ਼ੁਆ", "ਨਿਆਂਈਆਂ", "ਰੂਤ",
      "1 ਸਮੂਏਲ", "2 ਸਮੂਏਲ", "1 ਰਾਜਿਆਂ", "2 ਰਾਜਿਆਂ", "1 ਇਤਿਹਾਸਕ ਕਿਤਾਬਾਂ", "2 ਇਤਿਹਾਸਕ ਕਿਤਾਬਾਂ", "ਅਜ਼ਰਾ",
      "ਨਹਿਮਿਆਹ", "ਅਸਤਰ", "ਅੱਯੂਬ", "ਭਜਨ ਵਾਲੀ ਕਿਤਾਬ", "ਕਹਾਵਤਾਂ", "ਉਪਦੇਸ਼ਕ", "ਗੀਤ ਦਾ ਗੀਤ",
      "ਯਸਾਯਾਹ", "ਯਿਰਮਿਆਹ", "ਵਿਲਾਪ", "ਹਿਜ਼ਕੀਏਲ", "ਦਾਨਿਏਲ", "ਹੋਸ਼ੇਆ", "ਯੋਏਲ", "ਆਮੋਸ",
      "ਓਬਦਯਾਹ", "ਯੂਨਾਹ", "ਮੀਕਾਹ", "ਨਹੂਮ", "ਹਬਕੱਕੂਕ", "ਸਫਨਯਾਹ", "ਹਗਾਏ", "ਜ਼ਕਰਯਾਹ",
      "ਮਲਾਕੀ", "ਮੱਤੀ", "ਮਾਰਕੁਸ", "ਲੂਕਾ", "ਯੂਹੰਨਾ", "ਰਸੂਲਾਂ ਦੇ ਕਰਤੱਬ", "ਰੋਮੀਆਂ ਨੂੰ", "1 ਕੁਰਿੰਥੀਆਂ ਨੂੰ",
      "2 ਕੁਰਿੰਥੀਆਂ ਨੂੰ", "ਗਲਾਤੀਆਂ ਨੂੰ", "ਅਫ਼ਸੀਆਂ ਨੂੰ", "ਫਿਲਿੱਪੀਆਂ ਨੂੰ", "ਕੁਲੁੱਸੀਆਂ ਨੂੰ", "1 ਥੱਸਲੁਨੀਕੀਆਂ ਨੂੰ",
      "2 ਥੱਸਲੁਨੀਕੀਆਂ ਨੂੰ", "1 ਤਿਮੋਥਿਉਸ ਨੂੰ", "2 ਤਿਮੋਥਿਉਸ ਨੂੰ", "ਤੀਤੁਸ ਨੂੰ", "ਫਿਲੇਮੋਨ ਨੂੰ", "ਇਬਰਾਨੀਆਂ ਨੂੰ", "ਯਾਕੂਬ ਨੂੰ",
      "1 ਪਤਰਸ ਨੂੰ", "2 ਪਤਰਸ ਨੂੰ", "1 ਯੂਹੰਨਾ ਨੂੰ", "2 ਯੂਹੰਨਾ ਨੂੰ", "3 ਯੂਹੰਨਾ ਨੂੰ", "ਯਹੂਦਾ ਨੂੰ", "ਪ੍ਰਕਾਸ਼ਨ"
    ]
  }
};

// Available languages
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
];

// Translation hook
const useTranslation = (language) => {
  const t = (key, params = {}) => {
    const translation = TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
    if (typeof translation === 'string') {
      return translation.replace(/{(\w+)}/g, (match, param) => params[param] || match);
    }
    return translation;
  };
  
  return { t, currentLanguage: language };
};

// Get translated Bible books
const getTranslatedBooks = (language) => {
  const bookNames = TRANSLATIONS[language]?.books || TRANSLATIONS.en.books;
  return BIBLE_BOOKS.map((book, index) => ({
    ...book,
    name: bookNames[index] || book.name
  }));
};

const BIBLE_BOOKS = [
  { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 }, { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 }, { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 }
];

const BOOKS_AZ = [...BIBLE_BOOKS].map(book => ({ ...book })).sort((a, b) => a.name.localeCompare(b.name));

const USER_STORAGE_KEY = 'bibleChallengeUser';
const LEGACY_STORAGE_KEY = 'bethelBibleUser';

const getInitialUser = () => {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (stored) return stored;
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy) {
    localStorage.setItem(USER_STORAGE_KEY, legacy);
    return legacy;
  }
  return '';
};

// Bible Gateway versions for different languages
const BIBLE_VERSIONS = {
  en: 'NIV', // New International Version
  es: 'NVI', // Nueva Versión Internacional
  ml: 'NIV', // NIV is available in multiple languages
  hi: 'NIV', // NIV is available in multiple languages
  ta: 'NIV', // NIV is available in multiple languages
  te: 'NIV', // NIV is available in multiple languages
  fr: 'BDS', // La Bible du Semeur
  de: 'LUT', // Luther Bibel
  sv: 'SVL', // Svenska Folkbibeln
  pl: 'UBG', // Uwspółcześniona Biblia Gdańska
  kn: 'NIV', // NIV for Kannada
  pa: 'NIV'  // NIV for Punjabi
};

// Get Bible Gateway link based on language
const getBibleGatewayLink = (bookName, chapter, language = 'en') => {
  const version = BIBLE_VERSIONS[language] || 'NIV';
  
  // Map book names to Bible Gateway abbreviations
  const bookAbbreviations = {
    // Old Testament
    'Genesis': 'Gen',
    'Exodus': 'Exod',
    'Leviticus': 'Lev',
    'Numbers': 'Num',
    'Deuteronomy': 'Deut',
    'Joshua': 'Josh',
    'Judges': 'Judg',
    'Ruth': 'Ruth',
    '1 Samuel': '1Sam',
    '2 Samuel': '2Sam',
    '1 Kings': '1Kgs',
    '2 Kings': '2Kgs',
    '1 Chronicles': '1Chr',
    '2 Chronicles': '2Chr',
    'Ezra': 'Ezra',
    'Nehemiah': 'Neh',
    'Esther': 'Esth',
    'Job': 'Job',
    'Psalms': 'Ps',
    'Proverbs': 'Prov',
    'Ecclesiastes': 'Eccl',
    'Song of Solomon': 'Song',
    'Isaiah': 'Isa',
    'Jeremiah': 'Jer',
    'Lamentations': 'Lam',
    'Ezekiel': 'Ezek',
    'Daniel': 'Dan',
    'Hosea': 'Hos',
    'Joel': 'Joel',
    'Amos': 'Amos',
    'Obadiah': 'Obad',
    'Jonah': 'Jonah',
    'Micah': 'Mic',
    'Nahum': 'Nah',
    'Habakkuk': 'Hab',
    'Zephaniah': 'Zeph',
    'Haggai': 'Hag',
    'Zechariah': 'Zech',
    'Malachi': 'Mal',
    // New Testament
    'Matthew': 'Matt',
    'Mark': 'Mark',
    'Luke': 'Luke',
    'John': 'John',
    'Acts': 'Acts',
    'Romans': 'Rom',
    '1 Corinthians': '1Cor',
    '2 Corinthians': '2Cor',
    'Galatians': 'Gal',
    'Ephesians': 'Eph',
    'Philippians': 'Phil',
    'Colossians': 'Col',
    '1 Thessalonians': '1Thess',
    '2 Thessalonians': '2Thess',
    '1 Timothy': '1Tim',
    '2 Timothy': '2Tim',
    'Titus': 'Titus',
    'Philemon': 'Phlm',
    'Hebrews': 'Heb',
    'James': 'Jas',
    '1 Peter': '1Pet',
    '2 Peter': '2Pet',
    '1 John': '1John',
    '2 John': '2John',
    '3 John': '3John',
    'Jude': 'Jude',
    'Revelation': 'Rev'
  };
  
  const abbreviation = bookAbbreviations[bookName] || bookName;
  const safeChapter = Math.max(1, Number(chapter) || 1);
  
  return `https://www.biblegateway.com/passage/?search=${abbreviation}+${safeChapter}&version=${version}`;
};

const ICON_SRC = `${process.env.PUBLIC_URL || ''}/bible-challenge-icon.svg`;

const MILESTONE_BADGES = [
  { threshold: 1, label: 'Faithful Start', description: 'Logged your very first reading day', icon: '🌱' },
  { threshold: 25, label: 'Quarter Champion', description: '25% of the journey completed', icon: '💪' },
  { threshold: 50, label: 'Halfway Hero', description: 'Halfway through the Bible plan', icon: '🏅' },
  { threshold: 75, label: 'Persevering Heart', description: 'Three quarters accomplished', icon: '🔥' },
  { threshold: 100, label: 'Bible Finisher', description: 'Entire plan completed!', icon: '👑' }
];

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, book) => sum + book.chapters, 0);
// Use UTC dates to avoid timezone issues
const START_DATE = new Date(Date.UTC(2026, 0, 1)); // January 1, 2026 UTC
const END_DATE = new Date(Date.UTC(2026, 11, 31)); // December 31, 2026 UTC
const TOTAL_DAYS = Math.floor((END_DATE - START_DATE) / MS_PER_DAY) + 1;
const CHAPTERS_PER_DAY = Math.ceil(TOTAL_CHAPTERS / TOTAL_DAYS);

function getDailyVerse(language) {
  const verses = TRANSLATIONS[language]?.verses || TRANSLATIONS.en.verses;
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / MS_PER_DAY);
  return verses[dayOfYear % verses.length];
}

const THEMES = {
  'purple-blue': {
    name: 'Purple & Blue',
    primary: 'from-purple-600 to-blue-600',
    secondary: 'from-purple-500 to-blue-500',
    hover: 'from-purple-700 to-blue-700',
    accent: 'purple-600'
  },
  'green-teal': {
    name: 'Green & Teal',
    primary: 'from-green-600 to-teal-600',
    secondary: 'from-green-500 to-teal-500',
    hover: 'from-green-700 to-teal-700',
    accent: 'green-600'
  },
  'orange-red': {
    name: 'Orange & Red',
    primary: 'from-orange-600 to-red-600',
    secondary: 'from-orange-500 to-red-500',
    hover: 'from-orange-700 to-red-700',
    accent: 'orange-600'
  },
  'pink-purple': {
    name: 'Pink & Purple',
    primary: 'from-pink-600 to-purple-600',
    secondary: 'from-pink-500 to-purple-500',
    hover: 'from-pink-700 to-purple-700',
    accent: 'pink-600'
  }
};

const getThemeClasses = (themeKey) => THEMES[themeKey] || THEMES['purple-blue'];

const clampDateToPlan = (date) => {
  const normalized = new Date(date);
  // Use UTC to avoid timezone issues
  const utcYear = normalized.getUTCFullYear();
  const utcMonth = normalized.getUTCMonth();
  const utcDate = normalized.getUTCDate();

  const utcDateObj = new Date(Date.UTC(utcYear, utcMonth, utcDate));

  const minTime = START_DATE.getTime();
  const maxTime = END_DATE.getTime();
  const safeTime = Math.min(Math.max(utcDateObj.getTime(), minTime), maxTime);
  const withinPlan = new Date(safeTime);
  return withinPlan;
};

const getCommunityBadgeLabel = (progress, completedDays = 0) => {
  if (progress >= 100) return '👑 Finisher';
  if (progress >= 75) return '🔥 Torchbearer';
  if (progress >= 50) return '🏅 Steadfast';
  if (progress >= 25) return '💪 Determined';
  if (completedDays >= 1) return '🌱 Starter';
  return '';
};

function App() {
  const initialUserRef = useRef(getInitialUser());
  const [currentUser, setCurrentUser] = useState(() => initialUserRef.current);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(() => (initialUserRef.current ? 'home' : 'login'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reminderTime, setReminderTime] = useState('07:00');
  const [dailyVerse, setDailyVerse] = useState('');
  const [loading, setLoading] = useState(true);
  const [extraChaptersInput, setExtraChaptersInput] = useState('');
  const [removeExtraChaptersInput, setRemoveExtraChaptersInput] = useState('');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [announcementInput, setAnnouncementInput] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState(() => {
    const saved = localStorage.getItem('dismissedAnnouncements');
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState('purple-blue'); // Default theme
  const [language, setLanguage] = useState('en'); // Default language
  const [completedChapters, setCompletedChapters] = useState({}); // { 'date': ['Book Chapter', ...] }
  const [showCatchUp, setShowCatchUp] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [showFixChapterCount, setShowFixChapterCount] = useState(false);
  const [showBadgeExplanation, setShowBadgeExplanation] = useState(false);
  const [showLogExtraReading, setShowLogExtraReading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Simple mount effect - ensure loading is set to false quickly
  useEffect(() => {
    console.log('🚀 App mounted');
    const quickTimeout = setTimeout(() => {
      console.log('⚡ Setting loading to false');
      setLoading(false);
    }, 1000); // Just 1 second
    return () => clearTimeout(quickTimeout);
  }, []);

  // Helper to convert VAPID public key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Translation hook
  const { t } = useTranslation(language);

  // Initialize OneSignal - DISABLED TEMPORARILY FOR DEBUGGING
  /*
  useEffect(() => {
    if (ONESIGNAL_APP_ID && !window.OneSignalInitialized) {
      window.OneSignalInitialized = true;
      // Load OneSignal SDK
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        window.OneSignalDeferred.push(async function(OneSignal) {
          await OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: true
          });
          console.log('OneSignal initialized');
        });
      };
    }
  }, []);

  // Handle user login to OneSignal
  useEffect(() => {
    if (currentUser && window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async function(OneSignal) {
        try {
          await OneSignal.login(currentUser);
          console.log('Registered current user with OneSignal:', currentUser);
          
          // Auto-prompt for push notifications after a short delay
          setTimeout(async () => {
            try {
              const permission = await OneSignal.Notifications.permission;
              if (!permission) {
                // User hasn't granted permission yet, show the prompt
                console.log('Auto-prompting user for push notifications...');
                await OneSignal.Slidedown.promptPush();
              }
            } catch (err) {
              console.log('Error prompting for notifications:', err.message);
            }
          }, 2000);
        } catch (err) {
          console.log('Login deferred, will set on next interaction:', err.message);
        }
      });
    }
  }, [currentUser]);
  */

  useEffect(() => {
    console.log('🚀 Main useEffect triggered, language:', language);
    loadData();
    loadAnnouncements();
    // Set daily verse based on current language
    setDailyVerse(getDailyVerse(language));
    
    // Fallback timeout: if data doesn't load within 5 seconds, stop showing loading screen
    const timeoutId = setTimeout(() => {
      console.warn('⏰ Firebase data loading timeout (5s) - showing app anyway');
      setLoading(false);
    }, 5000);
    
    // Check notification permission on load
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    
    // Check if app is running as PWA or in browser
    const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                        window.navigator.standalone === true ||
                        document.referrer.includes('android-app://');
    
    if (!isStandalone) {
      // Show install prompt after a delay
      setTimeout(() => setShowInstallPrompt(true), 3000);
    }

    // Capture the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [language]);

  // Setup daily reminder notification
  useEffect(() => {
    if (!reminderTime || !currentUser) return;
    
    // Clear any existing interval
    if (window.reminderInterval) {
      clearInterval(window.reminderInterval);
    }
    
    // Only setup if notifications are granted
    if ('Notification' in window && Notification.permission === 'granted') {
      // Check every minute if it's reminder time
      window.reminderInterval = setInterval(() => {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        
        if (currentTime === reminderTime) {
          // Get current user data
          const userData = users.find(u => u.id === currentUser);
          const today = new Date().toISOString().split('T')[0];
          const completed = userData?.completedDates?.includes(today);
          
          if (!completed) {
            const dayNumber = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
            new Notification('Bible Challenge Reminder', {
              body: `Time to read Day ${dayNumber}'s chapters! 📖`,
              icon: '/logo192.png',
              badge: '/logo192.png',
              tag: 'bible-reminder',
              requireInteraction: false
            });
          }
        }
      }, 60000); // Check every minute
    }
    
    return () => {
      if (window.reminderInterval) {
        clearInterval(window.reminderInterval);
      }
    };
  }, [reminderTime, currentUser, users]);

  // Register push subscription with server (store per-user) when service worker ready and permission granted
  // NOTE: This code is for the old server/Cloud Functions approach and is currently not being used.
  // OneSignal is now handling push notifications. This can be removed once OneSignal is fully working.
  /*
  useEffect(() => {
    if (!currentUser) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (Notification.permission !== 'granted') return;

    let mounted = true;

    const registerPush = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        // ask server for vapid key - use Cloud Function URL
        const vapidRes = await fetch('https://us-central1-bethel-bible-2026.cloudfunctions.net/getVapidPublicKey');
        if (!vapidRes.ok) return;
        const { publicKey } = await vapidRes.json();

        const applicationServerKey = publicKey ? urlBase64ToUint8Array(publicKey) : null;

        let sub = existing;
        if (!existing) {
          sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
        }

        if (sub && mounted) {
          const tzOffsetMinutes = -new Date().getTimezoneOffset();
          await fetch('https://us-central1-bethel-bible-2026.cloudfunctions.net/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser, reminderTime: reminderTime || '07:00', tzOffsetMinutes, subscription: sub })
          });
          console.log('Registered push subscription for user', currentUser);
        }
      } catch (e) {
        console.warn('Push register failed', e);
      }
    };

    registerPush();

    return () => { mounted = false; };
  }, [currentUser, reminderTime]);
  */

  const loadAnnouncements = () => {
    const announcementsRef = ref(database, 'announcements');
    
    onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const announcementList = Object.keys(data)
          .map(key => ({
            ...data[key],
            id: key
          }))
          .sort((a, b) => b.id - a.id) // Most recent first
          .slice(0, 5); // Only keep last 5 announcements
        setAnnouncements(announcementList);
      }
    });
  };

  const loadData = () => {
    console.log('🔄 loadData called - attempting to connect to Firebase...');
    const usersRef = ref(database, 'users');

    onValue(usersRef, (snapshot) => {
      console.log('✅ Firebase onValue callback triggered');
      const data = snapshot.val();
      console.log('📊 Firebase data received:', data ? `${Object.keys(data).length} users` : 'null/empty');
      
      if (data) {
        const userList = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        setUsers(userList);
      } else {
        // No data in database, still set empty users array
        console.log('⚠️ No data in Firebase, setting empty users array');
        setUsers([]);
      }
      console.log('✅ Setting loading to false');
      setLoading(false);
    }, (error) => {
      // Handle errors - still set loading to false so app doesn't stay stuck
      console.error('❌ Error loading data from Firebase:', error);
      console.log('Setting loading to false due to error');
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!currentUser) return;
    const userData = users.find(u => u.id === currentUser);
    if (userData?.reminderTime) {
      setReminderTime(userData.reminderTime);
    }
    if (userData?.language) {
      setLanguage(userData.language);
    }
    if (userData?.name) {
      setDisplayNameInput(userData.name);
    }
    if (userData?.completedChapters) {
      setCompletedChapters(userData.completedChapters);
    }
  }, [currentUser, users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, currentUser);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      if (view === 'login') {
        setView('home');
      }
    }
  }, [currentUser, view]);

  useEffect(() => {
    // Update daily verse when language changes
    setDailyVerse(getDailyVerse(language));
  }, [language]);

  const login = async (name) => {
    if (!name.trim()) return;
    
    const sanitizedName = name.trim().replace(/[.#$[\]]/g, '_');
    const userRef = ref(database, `users/${sanitizedName}`);
    
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setCurrentUser(sanitizedName);
        localStorage.setItem(USER_STORAGE_KEY, sanitizedName);
        setReminderTime(userData.reminderTime || '07:00');
        setLanguage(userData.language || 'en'); // Load user's language preference
        
        // Link OneSignal user ID to this app user
        if (window.OneSignalDeferred) {
          window.OneSignalDeferred.push(function(OneSignal) {
            OneSignal.login(sanitizedName);
          });
        }
        
        setView('home');
      } else {
        const newUser = {
          name: name.trim(),
          completedDates: [],
          streak: 0,
          totalChapters: 0,
          reminderTime: '07:00',
          extraChapters: 0,
          language: language // Save selected language
        };
        await set(userRef, newUser);
        setCurrentUser(sanitizedName);
        localStorage.setItem(USER_STORAGE_KEY, sanitizedName);
        
        // Link OneSignal user ID to this app user
        if (window.OneSignalDeferred) {
          window.OneSignalDeferred.push(function(OneSignal) {
            OneSignal.login(sanitizedName);
          });
        }
        
        setView('home');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
  };

  const saveReminderTime = async (time) => {
    const userRef = ref(database, `users/${currentUser}`);
    try {
      // Save reminder time and timezone offset
      const tzOffsetMinutes = -new Date().getTimezoneOffset();
      await update(userRef, { 
        reminderTime: time || reminderTime,
        tzOffsetMinutes: tzOffsetMinutes
      });
      
      // Request OneSignal subscription for push notifications
      if (window.OneSignalDeferred) {
        window.OneSignalDeferred.push(async function(OneSignal) {
          try {
            // First, ensure user is logged in to OneSignal
            try {
              await OneSignal.login(currentUser);
              console.log('User logged in to OneSignal:', currentUser);
            } catch (loginErr) {
              console.log('User already logged in or login not needed:', loginErr.message);
            }
            
            // Show OneSignal's permission prompt slidedown
            await OneSignal.Slidedown.promptPush();
            
            // Wait for user to respond to the prompt
            setTimeout(async () => {
              const isPushSupported = await OneSignal.Notifications.isPushSupported();
              const permission = await OneSignal.Notifications.permission;
              
              console.log('Push supported:', isPushSupported);
              console.log('Permission:', permission);
              
              if (permission) {
                // Tag user with their reminder time
                await OneSignal.User.addTags({
                  reminderTime: time || reminderTime,
                  userId: currentUser,
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                });
                
                console.log('OneSignal subscription successful');
                alert('✅ Notifications enabled! You\'ll receive daily reminders at ' + (time || reminderTime));
                
                // Start the in-app reminder (fallback)
                scheduleDailyReminder(time || reminderTime);
              } else {
                alert('⚠️ Please allow notifications to receive reminders');
              }
            }, 1000);
          } catch (err) {
            console.error('OneSignal setup failed:', err);
            // Fallback to just in-app notifications
            if ('Notification' in window && Notification.permission === 'granted') {
              alert('✅ In-app notifications enabled at ' + (time || reminderTime));
              scheduleDailyReminder(time || reminderTime);
            } else {
              alert('⚠️ Notification setup failed: ' + err.message);
            }
          }
        });
      } else {
        // OneSignal not loaded, use in-app fallback
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            alert('✅ In-app notifications enabled at ' + (time || reminderTime));
            scheduleDailyReminder(time || reminderTime);
          }
        }
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const scheduleDailyReminder = (time) => {
    // Clear any existing reminder check
    if (window.reminderInterval) {
      clearInterval(window.reminderInterval);
    }
    
    // Check every minute if it's time to send reminder
    window.reminderInterval = setInterval(() => {
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      
      if (currentTime === time && 'Notification' in window && Notification.permission === 'granted') {
        // Check if today's reading is not yet completed
        const today = new Date().toISOString().split('T')[0];
        // Get current user data from users array
        const userData = users.find(u => u.id === currentUser);
        const completed = userData?.completedDates?.includes(today);
        
        if (!completed) {
          const dayNumber = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
          new Notification('Bible Challenge Reminder', {
            body: `Time to read Day ${dayNumber}'s chapters! 📖`,
            icon: '/logo192.png',
            badge: '/logo192.png',
            tag: 'bible-reminder',
            requireInteraction: false
          });
        }
      }
    }, 60000); // Check every minute
  };

  const sendAnnouncement = async () => {
    if (!announcementInput.trim()) {
      alert('Please enter an announcement message');
      return;
    }
    
    const timestamp = Date.now();
    const announcementData = {
      id: timestamp,
      text: announcementInput,
      sender: currentUser,
      date: new Date().toISOString()
    };

    try {
      await set(ref(database, `announcements/${timestamp}`), announcementData);
      alert('✅ Announcement sent to everyone!');
      setAnnouncementInput('');
    } catch (error) {
      console.error('Error sending announcement:', error);
      alert('Failed to send announcement. Please try again.');
    }
  };

  const sendPushNotification = async () => {
    if (!announcementInput.trim()) {
      alert('Please enter a message to send as push notification');
      return;
    }

    try {
      // Use Firebase Cloud Function to send notification
      const sendPushToAll = httpsCallable(functions, 'sendPushToAll');
      const result = await sendPushToAll({
        message: announcementInput,
        title: 'Bible Challenge 2026 📖'
      });

      if (result.data.success) {
        alert('✅ Push notification sent to all subscribed users!');
        setAnnouncementInput('');
      } else {
        alert('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
      alert('Failed to send push notification: ' + error.message);
    }
  };

  const promptAllUsersForNotifications = async () => {
    // This will prompt the current user to enable notifications
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async function(OneSignal) {
        try {
          const permission = await OneSignal.Notifications.permission;
          if (!permission) {
            await OneSignal.Slidedown.promptPush();
            alert('Please allow notifications. Share this link with other users so they can also enable notifications when they open the app.');
          } else {
            alert('You already have notifications enabled! Other users will be prompted automatically when they next open the app.');
          }
        } catch (err) {
          console.error('Error prompting for notifications:', err);
          alert('Error prompting for notifications: ' + err.message);
        }
      });
    } else {
      alert('OneSignal not loaded yet. Please try again in a moment.');
    }
  };

  const saveLanguage = async (lang) => {
    const userRef = ref(database, `users/${currentUser}`);
    try {
      await update(userRef, { language: lang || language });
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const getDayNumber = (date) => {
    const withinPlan = clampDateToPlan(date);
    return Math.floor((withinPlan - START_DATE) / MS_PER_DAY) + 1;
  };

  const getReadingForDay = (dayNum, language = 'en') => {
    const startChapter = (dayNum - 1) * CHAPTERS_PER_DAY + 1;
    const endChapter = Math.min(startChapter + CHAPTERS_PER_DAY - 1, TOTAL_CHAPTERS);
    
    let chapters = [];
    let currentChapter = startChapter;
    let bookIndex = 0;
    let chapterInBook = 0;
    
    const translatedBooks = getTranslatedBooks(language);
    
    let counted = 0;
    for (let i = 0; i < BIBLE_BOOKS.length; i++) {
      if (counted + BIBLE_BOOKS[i].chapters >= startChapter) {
        bookIndex = i;
        chapterInBook = startChapter - counted - 1;
        break;
      }
      counted += BIBLE_BOOKS[i].chapters;
    }

    while (currentChapter <= endChapter && bookIndex < BIBLE_BOOKS.length) {
      const book = translatedBooks[bookIndex];
      if (chapterInBook < BIBLE_BOOKS[bookIndex].chapters) {
        chapters.push({
          book: book.name,
          chapter: chapterInBook + 1
        });
        chapterInBook++;
        currentChapter++;
      } else {
        bookIndex++;
        chapterInBook = 0;
      }
    }
    
    return chapters;
  };

  const markComplete = async (date) => {
    const planDate = clampDateToPlan(date);
    const dateStr = planDate.toISOString().split('T')[0];
    const userRef = ref(database, `users/${currentUser}`);
    
    try {
      const snapshot = await get(userRef);
      const userData = snapshot.val() || {};
      const completed = userData.completedDates || [];
      const chaptersData = userData.completedChapters || {};
      
      // Get the reading plan for this date
      const dayNumber = Math.floor((planDate - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
      const reading = getReadingForDay(dayNumber);
      
      // Mark all chapters for this day as completed
      const dayChapters = reading.map(({ book, chapter }) => `${book} ${chapter}`);
      const newChaptersData = {
        ...chaptersData,
        [dateStr]: dayChapters
      };
      
      // Update local state
      setCompletedChapters(newChaptersData);
      
      // Calculate total chapters from all dates
      const totalChaptersFromDates = Object.values(newChaptersData).reduce((sum, chapters) => sum + chapters.length, 0);
      
      // Update completedDates if not already included
      const newCompleted = completed.includes(dateStr) ? completed : [...completed, dateStr];
      
      // Track completion timestamps for daily badges
      const completionTimestamps = userData.completionTimestamps || {};
      if (!completionTimestamps[dateStr]) {
        completionTimestamps[dateStr] = Date.now();
      }
      
      await update(userRef, {
        completedDates: newCompleted,
        completedChapters: newChaptersData,
        totalChapters: totalChaptersFromDates + (userData.extraChapters || 0),
        streak: calculateStreak(newCompleted),
        completionTimestamps: completionTimestamps
      });
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const markIncomplete = async (date) => {
    const planDate = clampDateToPlan(date);
    const dateStr = planDate.toISOString().split('T')[0];
    const userRef = ref(database, `users/${currentUser}`);
    
    try {
      const snapshot = await get(userRef);
      const userData = snapshot.val() || {};
      const completed = (userData.completedDates || []).filter(d => d !== dateStr);
      const chaptersData = userData.completedChapters || {};
      
      // Remove all chapters for this date
      const newChaptersData = { ...chaptersData };
      delete newChaptersData[dateStr];
      
      // Update local state
      setCompletedChapters(newChaptersData);
      
      // Recalculate total chapters from all dates
      const totalChaptersFromDates = Object.values(newChaptersData).reduce((sum, chapters) => sum + chapters.length, 0);
      
      await update(userRef, {
        completedDates: completed,
        completedChapters: newChaptersData,
        totalChapters: totalChaptersFromDates + (userData.extraChapters || 0),
        streak: calculateStreak(completed)
      });
    } catch (error) {
      console.error('Error marking incomplete:', error);
    }
  };

  const toggleChapter = async (date, book, chapter) => {
    const planDate = clampDateToPlan(date);
    const dateStr = planDate.toISOString().split('T')[0];
    const chapterKey = `${book} ${chapter}`;
    const userRef = ref(database, `users/${currentUser}`);
    
    try {
      const snapshot = await get(userRef);
      const userData = snapshot.val() || {};
      const chaptersData = userData.completedChapters || {};
      const dateChapters = chaptersData[dateStr] || [];
      const completedDates = userData.completedDates || [];
      
      let newDateChapters;
      if (dateChapters.includes(chapterKey)) {
        // Remove chapter
        newDateChapters = dateChapters.filter(c => c !== chapterKey);
      } else {
        // Add chapter
        newDateChapters = [...dateChapters, chapterKey];
      }
      
      const newChaptersData = {
        ...chaptersData,
        [dateStr]: newDateChapters
      };
      
      // Update local state
      setCompletedChapters(newChaptersData);
      
      // Calculate total chapters across all dates
      const totalChaptersFromDates = Object.values(newChaptersData).reduce((sum, chapters) => sum + chapters.length, 0);
      
      // Check if all chapters for this day are completed
      const dayNumber = Math.floor((planDate - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
      const reading = getReadingForDay(dayNumber);
      const allDayChapters = reading.map(({ book, chapter }) => `${book} ${chapter}`);
      const allCompleted = allDayChapters.every(ch => newDateChapters.includes(ch));
      
      // Update completedDates based on whether all chapters are done
      let newCompletedDates = completedDates;
      const completionTimestamps = userData.completionTimestamps || {};
      
      if (allCompleted && !completedDates.includes(dateStr)) {
        newCompletedDates = [...completedDates, dateStr];
        // Track completion timestamp for daily badges
        if (!completionTimestamps[dateStr]) {
          completionTimestamps[dateStr] = Date.now();
        }
      } else if (!allCompleted && completedDates.includes(dateStr)) {
        newCompletedDates = completedDates.filter(d => d !== dateStr);
      }
      
      // Update Firebase
      await update(userRef, {
        completedChapters: newChaptersData,
        completedDates: newCompletedDates,
        totalChapters: totalChaptersFromDates + (userData.extraChapters || 0),
        streak: calculateStreak(newCompletedDates),
        completionTimestamps: completionTimestamps
      });
    } catch (error) {
      console.error('Error toggling chapter:', error);
    }
  };

  const logExtraChapters = async () => {
    const amount = parseInt(extraChaptersInput, 10);
    if (!currentUser || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    const userRef = ref(database, `users/${currentUser}`);

    try {
      const snapshot = await get(userRef);
      const userData = snapshot.val() || {};
      const newExtra = (userData.extraChapters || 0) + amount;
      const newTotal = (userData.totalChapters || 0) + amount;

      await update(userRef, {
        extraChapters: newExtra,
        totalChapters: newTotal
      });

      setExtraChaptersInput('');
    } catch (error) {
      console.error('Error logging extra chapters:', error);
    }
  };

  const removeExtraChapters = async () => {
    const amount = parseInt(removeExtraChaptersInput, 10);
    if (!currentUser || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    const userRef = ref(database, `users/${currentUser}`);

    try {
      const snapshot = await get(userRef);
      const userData = snapshot.val() || {};
      const currentExtra = userData.extraChapters || 0;
      const currentTotal = userData.totalChapters || 0;
      
      // Don't allow removing more than what exists
      const actualRemove = Math.min(amount, currentExtra);
      
      const newExtra = currentExtra - actualRemove;
      const newTotal = currentTotal - actualRemove;

      await update(userRef, {
        extraChapters: newExtra,
        totalChapters: newTotal
      });

      setRemoveExtraChaptersInput('');
    } catch (error) {
      console.error('Error removing extra chapters:', error);
    }
  };

  const handleUpdateDisplayName = async (name) => {
    if (!currentUser) return;
    const trimmed = (name || displayNameInput).trim();
    if (!trimmed) return;

    const userRef = ref(database, `users/${currentUser}`);

    try {
      await update(userRef, { name: trimmed });
    } catch (error) {
      console.error('Error updating display name:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const confirmed = window.confirm('Are you sure you want to leave the Bible Challenge? This will remove all of your progress.');
    if (!confirmed) return;

    const userRef = ref(database, `users/${currentUser}`);

    try {
      await set(userRef, null);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      setCurrentUser('');
      setView('login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const calculateStreak = (completedDates) => {
    if (!completedDates || !completedDates.length) return 0;

    // Normalize all entries to ISO date strings and use a Set for O(1) lookups
    const normalizedSet = new Set(
      completedDates.map(d => {
        if (!d) return '';
        if (typeof d === 'string') return d.split('T')[0];
        try {
          return new Date(d).toISOString().split('T')[0];
        } catch (e) {
          return '';
        }
      }).filter(Boolean)
    );

    let streak = 0;
    let checkDate = clampDateToPlan(new Date());

    // Count consecutive days backwards from today while dates exist in the set
    while (checkDate >= START_DATE) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (normalizedSet.has(checkStr)) {
        streak++;
        // Move back one day (use UTC-safe method)
        checkDate = new Date(Date.UTC(checkDate.getUTCFullYear(), checkDate.getUTCMonth(), checkDate.getUTCDate() - 1));
      } else {
        break;
      }
    }

    return streak;
  };

  const isDateCompleted = (date, userName) => {
    const user = users.find(u => u.id === userName);
    const planDate = clampDateToPlan(date);
    const dateStr = planDate.toISOString().split('T')[0];
    return user?.completedDates?.includes(dateStr) || false;
  };

  const getProgress = (userName) => {
    const user = users.find(u => u.id === userName);
    const percent = ((user?.totalChapters || 0) / TOTAL_CHAPTERS) * 100;
    return Math.min(100, percent);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (direction) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const shareApp = async () => {
    const shareData = {
      title: 'Bible Challenge 2026',
      text: 'Join me in reading through the entire Bible in 2026! 📖✨',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const text = `Join me in the Bible Challenge 2026! 📖✨ Read through the entire Bible together. ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard! Share it with your friends.');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard! Share it with your friends.');
    });
  };

  const currentTheme = getThemeClasses(theme);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
              <img src={ICON_SRC} alt="Bible Challenge icon" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">{t('appTitle')}</h1>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">{t('appSubtitle')}</h2>
            <p className="text-gray-600 mb-4">{t('appTagline')}</p>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-800">📖 {TOTAL_CHAPTERS} chapters in {TOTAL_DAYS} days</p>
              <p className="text-xs text-purple-600 mt-1">~{CHAPTERS_PER_DAY} chapters per day</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
              📱 {t('installAsApp')}
            </h3>
            <div className="space-y-3 text-sm text-blue-700">
              <div>
                <p className="font-semibold">{t('androidInstall')}</p>
              </div>
              <div>
                <p className="font-semibold">{t('iphoneInstall')}</p>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                {t('installBenefit')}
              </p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t('selectLanguage')}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg bg-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder={t('enterName')}
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl mb-4 focus:border-purple-500 focus:outline-none text-lg"
            onKeyPress={(e) => e.key === 'Enter' && login(e.target.value)}
          />
          <button
            onClick={(e) => {
              const input = e.target.previousSibling;
              login(input.value);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 transition text-lg shadow-lg"
          >
            {t('joinChallenge')}
          </button>
        </div>
      </div>
    );
  }

  const currentUserData = users.find(u => u.id === currentUser);
  const actualToday = new Date();
  const planToday = clampDateToPlan(actualToday);
  const hasPlanStarted = actualToday >= START_DATE;
  const daysUntilStart = hasPlanStarted ? 0 : Math.max(0, Math.ceil((START_DATE - actualToday) / MS_PER_DAY));
  const todayDayNumber = getDayNumber(planToday);
  const todayCompleted = isDateCompleted(planToday, currentUser);
  const todayReading = getReadingForDay(todayDayNumber, language);
  const progressPercent = (Math.round(getProgress(currentUser) * 10) / 10).toFixed(1);
  const milestoneBadges = MILESTONE_BADGES.map((badge) => ({
    ...badge,
    earned: progressPercent >= badge.threshold
  }));
  const latestEarnedBadge = milestoneBadges.filter(badge => badge.earned).slice(-1)[0];
  const detailDayNumber = getDayNumber(selectedDate);
  const detailReading = getReadingForDay(detailDayNumber, language);
  const extraAmount = parseInt(extraChaptersInput, 10);
  const canLogExtra = !Number.isNaN(extraAmount) && extraAmount > 0;
  const removeExtraAmount = parseInt(removeExtraChaptersInput, 10);
  const canRemoveExtra = !Number.isNaN(removeExtraAmount) && removeExtraAmount > 0 && (currentUserData?.extraChapters || 0) > 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} pb-20`}>
      {(view === 'calendar' || view === 'day-detail' || view === 'community' || view === 'profile') && (
        <div className={`bg-gradient-to-r ${currentTheme.primary} text-white p-4 rounded-b-3xl shadow-lg mb-4`}>
          <div className="text-center">
            <img src={ICON_SRC} alt="Bible Challenge icon" className="w-10 h-10 mx-auto mb-1 drop-shadow-md" />
            <h1 className="text-base font-bold opacity-90">{t('appTitle')}</h1>
            <p className="text-xs opacity-75">Global 2026 Plan</p>
          </div>
        </div>
      )}
      
      {view === 'home' && (
        <>
          <div className={`bg-gradient-to-r ${currentTheme.primary} text-white p-6 rounded-b-3xl shadow-lg mb-4`}>
        <div className="text-center mb-3">
          <img src={ICON_SRC} alt="Bible Challenge icon" className="w-12 h-12 mx-auto mb-2 drop-shadow-md" />
          <h1 className="text-lg font-bold opacity-90">{t('appTitle')}</h1>
          <p className="text-xs opacity-75">Global 2026 Plan</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{t('hiUser', { name: currentUserData?.name || currentUser })}</h2>
              {getCommunityBadgeLabel(progressPercent, currentUserData?.completedDates?.length || 0) && (
                <span className="text-lg">
                  {getCommunityBadgeLabel(progressPercent, currentUserData?.completedDates?.length || 0).split(' ')[0]}
                </span>
              )}
            </div>
            <p className="text-white opacity-90 text-sm">{t('dayOfTotal', { day: todayDayNumber, total: TOTAL_DAYS })}</p>
            {!hasPlanStarted && (
              <p className="text-purple-200 text-xs mt-1">
                {t('planBeginsIn', { 
                  days: daysUntilStart, 
                  unit: daysUntilStart === 1 ? t('day') : t('days'),
                  date: START_DATE.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'long', day: 'numeric' })
                })}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-2xl p-3 text-center">
            <Flame className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{currentUserData?.streak || 0}</p>
            <p className="text-xs opacity-90">{t('streak')}</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-2xl p-3 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{currentUserData?.totalChapters || 0}</p>
            <p className="text-xs opacity-90">{t('chapters')}</p>
            {!!currentUserData?.extraChapters && (
              <p className="text-[11px] opacity-80 mt-1">+{currentUserData.extraChapters} {t('bonus')}</p>
            )}
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-2xl p-3 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{progressPercent}%</p>
            <p className="text-xs opacity-90">{t('done')}</p>
          </div>
        </div>
      </div>

      {showInstallPrompt && (
        <div className="mx-4 mb-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-4 shadow-lg relative">
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100 text-xl"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">📱</div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">{t('installBibleChallenge')}</h4>
              <p className="text-xs opacity-90 mb-2">Get the full app experience with offline access!</p>
            </div>
            <button
              onClick={async () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  if (outcome === 'accepted') {
                    setShowInstallPrompt(false);
                  }
                  setDeferredPrompt(null);
                } else {
                  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                  const isAndroid = /Android/.test(navigator.userAgent);
                  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

                  if (isIOS) {
                    alert('📱 To install on iPhone/iPad:\n\n1. Tap the Share button (⬆️) at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
                  } else if (isAndroid && isChrome) {
                    alert('📱 To install on Android:\n\n1. Tap the menu (⋮) in the top right\n2. Tap "Add to Home screen" or "Install app"\n3. Tap "Install"');
                  } else {
                    alert('📱 To install:\n\nLook for the install option in your browser menu or address bar.');
                  }
                }
              }}
              className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition shadow-md whitespace-nowrap"
            >
              {deferredPrompt ? 'Install' : 'How to Install'}
            </button>
          </div>
        </div>
      )}

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 shadow-md border-2 border-amber-200 mx-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-amber-600" size={20} />
            <h3 className="font-bold text-amber-900">{t('verseOfTheDay')}</h3>
          </div>
          <p className="text-amber-800 italic">{dailyVerse}</p>
        </div>
        </>
      )}

      <div className="px-4 space-y-4">
        {view === 'home' && (
          <>
            {/* Announcements Display */}
            {announcements.filter(a => !dismissedAnnouncements.includes(a.id)).length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-4">
                <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <Bell size={16} />
                  📢 Announcements
                </h3>
                <div className="space-y-3">
                  {announcements
                    .filter(a => !dismissedAnnouncements.includes(a.id))
                    .map(announcement => {
                      const date = new Date(announcement.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      
                      return (
                        <div key={announcement.id} className="bg-white p-3 rounded-xl border border-blue-200 relative">
                          <button
                            onClick={() => {
                              const newDismissed = [...dismissedAnnouncements, announcement.id];
                              setDismissedAnnouncements(newDismissed);
                              localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
                            }}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
                            aria-label="Close announcement"
                          >
                            <X size={16} />
                          </button>
                          <p className="text-sm text-gray-800 mb-1 pr-6">{announcement.text}</p>
                          <p className="text-xs text-gray-500">
                            {date}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="text-purple-600" />
                {t('todaysReading')}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{planToday.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 mb-4">
                <div className="space-y-2 mb-4">
                  {todayReading.map(({ book, chapter }, idx) => {
                    const dateStr = planToday.toISOString().split('T')[0];
                    const chapterKey = `${book} ${chapter}`;
                    const isCompleted = (completedChapters[dateStr] || []).includes(chapterKey);
                    
                    return (
                      <div key={`${book}-${chapter}-${idx}`} className="flex items-center gap-3 bg-white rounded-xl p-3 border-2 border-purple-100">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleChapter(planToday, book, chapter)}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <a
                          href={getBibleGatewayLink(book, chapter, language)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-purple-800 font-semibold hover:text-purple-600 transition"
                        >
                          {`${book} ${chapter}`}
                        </a>
                      </div>
                    );
                  })}
                </div>
                {!todayCompleted ? (
                  <button
                    onClick={() => markComplete(planToday)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Check size={20} />
                    {t('markComplete')}
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold mb-2 flex items-center justify-center gap-2 shadow-lg">
                      <Check size={20} />
                      {t('completed')}
                    </div>
                    <button
                      onClick={() => markIncomplete(planToday)}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      {t('undo')}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Catch Up Section */}
              <button
                onClick={() => setShowCatchUp(!showCatchUp)}
                className="w-full bg-orange-100 text-orange-700 py-3 rounded-2xl font-semibold hover:bg-orange-200 transition flex items-center justify-center gap-2 mb-3"
              >
                <Clock size={18} />
                Catch Up on Missed Days
                <span className="text-sm">{showCatchUp ? '▲' : '▼'}</span>
              </button>
              
              {showCatchUp && (
                <div className="bg-orange-50 rounded-2xl p-4 mb-4 space-y-3">
                  <p className="text-sm text-orange-800 font-semibold mb-3">Missed readings from previous days:</p>
                  {(() => {
                    const missedDays = [];
                    const today = new Date(planToday);
                    
                    // Check last 7 days
                    for (let i = 1; i <= 7; i++) {
                      const checkDate = new Date(today);
                      checkDate.setDate(checkDate.getDate() - i);
                      
                      if (checkDate < START_DATE) break;
                      
                      const dateStr = checkDate.toISOString().split('T')[0];
                      const dayNumber = getDayNumber(checkDate);
                      const reading = getReadingForDay(dayNumber, language);
                      const dateChapters = completedChapters[dateStr] || [];
                      const allCompleted = reading.every(({ book, chapter }) => 
                        dateChapters.includes(`${book} ${chapter}`)
                      );
                      
                      if (!allCompleted) {
                        missedDays.push({ date: checkDate, reading, dateStr });
                      }
                    }
                    
                    if (missedDays.length === 0) {
                      return (
                        <p className="text-sm text-orange-600 text-center py-2">
                          🎉 You're all caught up! No missed readings in the last 7 days.
                        </p>
                      );
                    }
                    
                    return missedDays.map(({ date, reading, dateStr }) => (
                      <div key={dateStr} className="bg-white rounded-xl p-3 border-2 border-orange-200">
                        <p className="text-sm font-semibold text-orange-800 mb-2">
                          {date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <div className="space-y-2">
                          {reading.map(({ book, chapter }, idx) => {
                            const chapterKey = `${book} ${chapter}`;
                            const isCompleted = (completedChapters[dateStr] || []).includes(chapterKey);
                            
                            return (
                              <div key={`${book}-${chapter}-${idx}`} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isCompleted}
                                  onChange={() => toggleChapter(date, book, chapter)}
                                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                />
                                <a
                                  href={getBibleGatewayLink(book, chapter, language)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-orange-800 hover:text-orange-600 transition"
                                >
                                  {`${book} ${chapter}`}
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
              
              <button
                onClick={() => {
                  setSelectedMonth(planToday.getMonth());
                  setSelectedYear(planToday.getFullYear());
                  setView('calendar');
                }}
                className="w-full bg-purple-100 text-purple-700 py-3 rounded-2xl font-semibold hover:bg-purple-200 transition"
              >
                {t('viewFullCalendar')}
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                {t('milestoneRewards')}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{progressPercent}% complete • unlock badges as the community cheers you on.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {milestoneBadges.map((badge) => {
                  const isHighlighted = latestEarnedBadge && latestEarnedBadge.label === badge.label;
                  return (
                    <div
                      key={badge.label}
                      className={`border-2 rounded-2xl p-3 flex flex-col gap-1 ${
                        badge.earned ? 'border-green-200 bg-green-50 text-green-800' : 'border-gray-100 bg-gray-50 text-gray-500'
                      } ${isHighlighted ? 'milestone-celebrate milestone-glow' : ''}`}
                    >
                      <span className={`text-2xl ${isHighlighted ? 'inline-block' : ''}`}>{badge.icon}</span>
                      <p className="font-semibold text-gray-800">{badge.label}</p>
                      <p className="text-xs">{badge.description}</p>
                      <p className="text-[11px] text-gray-400">{badge.threshold}%</p>
                    </div>
                  );
                })}
              </div>
              {latestEarnedBadge ? (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm shadow-inner animate-pulse">
                  🎉 {currentUserData?.name || currentUser || 'Reader'} unlocked "{latestEarnedBadge.label}"! Share the win with your community!
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">Complete your first reading to unlock the Faithful Start badge.</p>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('booksAZ')}</h2>
              <p className="text-sm text-gray-500 mb-4">{t('booksDesc')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {BOOKS_AZ.map((book) => (
                  <a
                    key={book.name}
                    href={getBibleGatewayLink(book.name, 1, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-2 rounded-full bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition"
                  >
                    {book.name}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'calendar' && (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full text-2xl">
                ←
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full text-2xl">
                →
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={idx} className="text-center text-xs font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: getFirstDayOfMonth(selectedMonth, selectedYear) }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}
              
              {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }).map((_, idx) => {
                const day = idx + 1;
                const date = new Date(selectedYear, selectedMonth, day);
                const dateStr = date.toISOString().split('T')[0];
                const startStr = START_DATE.toISOString().split('T')[0];
                const endStr = END_DATE.toISOString().split('T')[0];
                
                if (dateStr < startStr || dateStr > endStr) {
                  return (
                    <div key={day} className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 text-sm font-semibold">
                      {day}
                    </div>
                  );
                }
                
                const completed = isDateCompleted(date, currentUser);
                const isToday = date.toDateString() === planToday.toDateString();
                
                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDate(date);
                      setView('day-detail');
                    }}
                    className={`aspect-square rounded-xl font-semibold text-sm transition shadow-md ${
                      completed
                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                    } ${isToday ? 'ring-4 ring-purple-400' : ''}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {view === 'day-detail' && (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <button
              onClick={() => setView('calendar')}
              className="text-purple-600 mb-4 flex items-center gap-2 hover:text-purple-700"
            >
              ← Back to Calendar
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Day {detailDayNumber} Reading:</p>
              <div className="space-y-2 mb-4">
                {detailReading.map(({ book, chapter }, idx) => {
                  const dateStr = selectedDate.toISOString().split('T')[0];
                  const chapterKey = `${book} ${chapter}`;
                  const isCompleted = (completedChapters && completedChapters[dateStr]) ? completedChapters[dateStr].includes(chapterKey) : false;
                  
                  return (
                    <div key={`${book}-${chapter}-${idx}`} className="flex items-center gap-3 bg-white rounded-xl p-3 border-2 border-blue-100">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleChapter(selectedDate, book, chapter)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <a
                        href={getBibleGatewayLink(book, chapter, language)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-blue-800 font-semibold hover:text-blue-900 transition"
                      >
                        {chapterKey}
                      </a>
                    </div>
                  );
                })}
              </div>
              {!isDateCompleted(selectedDate, currentUser) ? (
                <button
                  onClick={() => {
                    markComplete(selectedDate);
                    setView('calendar');
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition shadow-lg"
                >
                  Mark as Complete
                </button>
              ) : (
                <button
                  onClick={() => {
                    markIncomplete(selectedDate);
                    setView('calendar');
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transition shadow-lg"
                >
                  Mark as Incomplete
                </button>
              )}
            </div>
          </div>
        )}

{view === 'community' && (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="text-center mb-4 pb-4 border-b-2 border-gray-200">
          <h3 className="text-sm font-bold text-purple-600">Bible Challenge</h3>
          <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Users className="text-purple-600" />
            Community Progress
          </h2>
        </div>
        <div className="space-y-3">
          {(() => {
            // Calculate today's date and day number in the challenge
            const now = new Date();
            const todayMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).getTime();
            const today = new Date().toISOString().split('T')[0];
            const currentDayNumber = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
            
            // Get today's scheduled reading
            const todaysReading = getReadingForDay(currentDayNumber);
            const todaysChapterKeys = todaysReading.map(({ book, chapter }) => `${book} ${chapter}`);
            
            // Find who completed TODAY'S scheduled reading first (earliest timestamp)
            const usersWithTimestamps = users
              .filter(u => {
                // Check if they completed today's date with timestamp from today
                if (!u.completionTimestamps?.[today] || u.completionTimestamps[today] < todayMidnight) {
                  return false;
                }
                // Verify they actually completed TODAY's scheduled chapters
                const userTodayChapters = u.completedChapters?.[today] || [];
                const completedTodaysReading = todaysChapterKeys.every(ch => userTodayChapters.includes(ch));
                
                // Also verify they have at least currentDayNumber days completed (to prevent catch-up readers from getting the badge)
                const userDaysCompleted = u.completedDates?.length || 0;
                const hasEnoughDays = userDaysCompleted >= currentDayNumber;
                
                return completedTodaysReading && hasEnoughDays;
              })
              .sort((a, b) => {
                // Sort by timestamp ASCENDING (smallest/earliest first)
                const timeA = a.completionTimestamps[today] || Infinity;
                const timeB = b.completionTimestamps[today] || Infinity;
                return timeA - timeB; // Negative result means A comes first (earlier)
              });
            // First element has the EARLIEST (smallest) timestamp
            const firstTodayUserId = usersWithTimestamps.length > 0 ? usersWithTimestamps[0].id : null;
            
            return [...users].sort((a, b) => (b.totalChapters || 0) - (a.totalChapters || 0)).map((user, idx) => {
              const userProgress = (Math.round(getProgress(user.id) * 10) / 10).toFixed(1);
              const badgeLabel = getCommunityBadgeLabel(userProgress, user.completedDates?.length || 0);
              const isFirstToday = user.id === firstTodayUserId;
              
              // Check if user completed today's scheduled reading (not just any reading today)
              const userTodayChapters = user.completedChapters?.[today] || [];
              const hasCompletedToday = todaysChapterKeys.every(ch => userTodayChapters.includes(ch));
              
              return (
                <div key={user.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border-2 border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <Trophy className="text-yellow-500" size={20} />}
                      {idx === 1 && <Trophy className="text-gray-400" size={20} />}
                      {idx === 2 && <Trophy className="text-orange-400" size={20} />}
                      <span className="font-bold text-gray-800">{user.name}</span>
                      {isFirstToday && (
                        <span className="text-xl" title="First to complete today's challenge!">
                          🏆
                        </span>
                      )}
                      {!isFirstToday && hasCompletedToday && (
                        <span className="text-xs bg-gradient-to-r from-green-400 to-emerald-400 text-white px-2 py-1 rounded-full font-bold" title="Completed today's challenge!">
                          ✅
                        </span>
                      )}
                      {badgeLabel && (
                        <span className="text-lg" title={badgeLabel}>
                          {badgeLabel.split(' ')[0]}
                        </span>
                      )}
                      {user.streak >= 7 && <Flame className="text-orange-500" size={16} />}
                    </div>
                    <span className="text-xl font-bold text-purple-600">{userProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${userProgress}%` }}
                    />
                  </div>
                  <div className="flex gap-3 text-xs text-gray-600">
                    <span>🔥 {user.streak || 0} days</span>
                    <span>📖 {user.totalChapters || 0}/{TOTAL_CHAPTERS}</span>
                    <span>✅ {user.completedDates?.length || 0}/{TOTAL_DAYS}</span>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    )}
  </div>

  <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-3 flex justify-around items-center shadow-lg rounded-t-3xl">
    <button
      onClick={() => setView('home')}
      className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-purple-600' : 'text-gray-400'}`}
    >
      <BookOpen size={24} />
      <span className="text-xs font-semibold">Home</span>
    </button>
    <button
      onClick={() => setView('calendar')}
      className={`flex flex-col items-center gap-1 ${view === 'calendar' || view === 'day-detail' ? 'text-purple-600' : 'text-gray-400'}`}
    >
      <Calendar size={24} />
      <span className="text-xs font-semibold">Calendar</span>
    </button>
    <button
      onClick={() => setView('community')}
      className={`flex flex-col items-center gap-1 ${view === 'community' ? 'text-purple-600' : 'text-gray-400'}`}
    >
      <Users size={24} />
      <span className="text-xs font-semibold">Community</span>
    </button>
    <button
      onClick={() => setView('profile')}
      className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-purple-600' : 'text-gray-400'}`}
    >
      <User size={24} />
      <span className="text-xs font-semibold">Profile</span>
    </button>
  </div>

  {/* Floating Share Button */}
  <button
    onClick={shareApp}
    className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 z-40"
    title="Share Bible Challenge"
  >
    <Share2 size={24} />
  </button>

  {view === 'profile' && (
    <div className="px-4 space-y-4">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="text-purple-600" />
          Profile & Settings
        </h2>
        
        {(currentUser === 'Amar' || currentUser === 'Amaresh') && (
          <div className="mb-6">
            <button
              onClick={() => setShowAdminTools(!showAdminTools)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Globe size={18} />
              🔐 Admin Tools
              <span className="text-sm">{showAdminTools ? '▲' : '▼'}</span>
            </button>
            
            {showAdminTools && (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200">
                  <h3 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <Trophy size={16} />
                    🔧 Fix All Users Data
                  </h3>
                  <p className="text-xs text-gray-700 mb-3">
                    This will sync days with chapters for all users (days = chapters/4)
                  </p>
                  <button
                    onClick={async () => {
                      if (!window.confirm('Fix all users data? This will update completedDates and streak for everyone')) return;
                      
                      const usersRef = ref(database, 'users');
                      const snapshot = await get(usersRef);
                      const data = snapshot.val();
                      
                      if (!data) {
                        alert('No users found');
                        return;
                      }
                      
                      let fixed = 0;
                      for (const userId of Object.keys(data)) {
                        const userData = data[userId];
                        const completedDates = userData.completedDates || [];
                        const currentTotal = userData.totalChapters || 0;
                        const expectedDays = Math.floor(currentTotal / 4);
                        const actualDays = completedDates.length;
                        const currentStreak = userData.streak || 0;
                        
                        // Fix if days don't match OR streak is wrong
                        if (currentTotal > 0 && (expectedDays !== actualDays || currentStreak !== expectedDays)) {
                          const newCompletedDates = [];
                          const startDate = new Date('2026-01-01');
                          for (let i = 0; i < expectedDays; i++) {
                            const date = new Date(startDate);
                            date.setDate(startDate.getDate() + i);
                            newCompletedDates.push(date.toISOString().split('T')[0]);
                          }
                          
                          const userRef = ref(database, `users/${userId}`);
                          await update(userRef, { 
                            completedDates: newCompletedDates,
                            streak: expectedDays
                          });
                          console.log(`Fixed ${userId}: ${currentTotal} chapters → ${expectedDays} days (was ${actualDays}), streak: ${expectedDays} (was ${currentStreak})`);
                          fixed++;
                        }
                      }
                      
                      alert(`✅ Fixed ${fixed} users!`);
                      loadData(); // Reload data
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition shadow flex items-center justify-center gap-2"
                  >
                    <Trophy size={16} />
                    Fix All Users Now
                  </button>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
                  <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <Send size={16} />
                    📢 Send Announcement
                  </h3>
                  <textarea
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    placeholder="Type your announcement message here..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none text-sm mb-3 min-h-[100px]"
                  />
                  <div className="space-y-2">
                    <button
                      onClick={sendAnnouncement}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition shadow flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      Send In-App Announcement
                    </button>
                    <button
                      onClick={sendPushNotification}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-teal-600 transition shadow flex items-center justify-center gap-2"
                    >
                      <Bell size={16} />
                      Send Push Notification to All
                    </button>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-xs text-yellow-800 mb-2">
                      💡 <strong>Note:</strong> Only {users.length} total users, but only subscribed users will receive push notifications.
                    </p>
                    <button
                      onClick={promptAllUsersForNotifications}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition shadow flex items-center justify-center gap-2 text-sm"
                    >
                      <Bell size={14} />
                      Enable My Notifications
                    </button>
                    <p className="text-xs text-yellow-700 mt-2">
                      Users will be auto-prompted when they next open the app.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User size={16} />
              Display Name
            </label>
            <input
              type="text"
              value={displayNameInput}
              onChange={(e) => {
                setDisplayNameInput(e.target.value);
                handleUpdateDisplayName(e.target.value);
              }}
              placeholder="Name shown on leaderboards"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              This name appears on the community leaderboard and shared stats.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={16} />
              Daily Reading Time
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => {
                setReminderTime(e.target.value);
                saveReminderTime(e.target.value);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              Set your preferred daily reading time. You'll be reminded to complete your reading.
            </p>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-2xl">
          <h4 className="text-sm font-bold text-green-800 mb-2">📱 Install as App</h4>
          <p className="text-xs text-green-700 mb-3">
            Get offline access and push notifications!
          </p>
          <button
            onClick={async () => {
              // Try to use the native install prompt first
              if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                  console.log('User accepted the install prompt');
                }
                setDeferredPrompt(null);
              } else {
                // Fall back to showing instructions
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const isAndroid = /Android/.test(navigator.userAgent);
                const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
                const isSamsung = /SamsungBrowser/.test(navigator.userAgent);

                if (isIOS) {
                  alert('📱 How to install on iPhone/iPad:\n\n1. Tap the Share button (square with arrow pointing up) at the bottom of your screen\n2. Scroll down in the share menu\n3. Tap "Add to Home Screen"\n4. Tap "Add" in the top right corner\n\nThe app will appear on your home screen like a native app!');
                } else if (isAndroid) {
                  if (isChrome) {
                    alert('📱 How to install on Android Chrome:\n\n1. Look for the "Install" icon in your address bar (it looks like a computer monitor with a down arrow)\n2. Tap the "Install" icon\n3. Tap "Install" in the popup\n\nIf you don\'t see the icon, tap the ⋮ menu → "Add to Home screen"');
                  } else if (isSamsung) {
                    alert('📱 How to install on Samsung Internet:\n\n1. Tap the ⋮ menu in the top right\n2. Tap "Add to Home screen"\n3. Tap "Add" to confirm\n\nThe app will appear on your home screen!');
                  } else {
                    alert('📱 How to install on Android:\n\n1. Tap the ⋮ menu in the top right\n2. Look for "Add to Home screen" or "Install app"\n3. Tap it and follow the prompts\n\nThe app will appear on your home screen like a native app!');
                  }
                } else {
                  alert('📱 How to install this app:\n\n• Chrome: Look for "Install" icon in address bar or ⋮ menu → Install\n• Edge: ⋮ menu → Apps → Install this site as an app\n• Safari (iPhone): Share button → Add to Home Screen\n• Firefox: ⋮ menu → Install This Site as an App\n\nTry refreshing the page if you don\'t see the option!');
                }
              }
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition shadow text-sm"
          >
            {deferredPrompt ? 'Install App' : 'How to Install App'}
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="text-blue-600" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                saveLanguage(e.target.value);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Choose your preferred language for the app interface and Bible content.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="text-purple-600" />
              App Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(THEMES).map(([key, themeData]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`p-3 rounded-2xl border-2 transition ${
                    theme === key
                      ? 'border-purple-600 bg-purple-50 text-purple-800'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-3 rounded-full bg-gradient-to-r ${themeData.primary} mb-2`}></div>
                  <p className="text-xs font-semibold">{themeData.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
          <button
            onClick={() => setShowLogExtraReading(!showLogExtraReading)}
            className="w-full flex items-center justify-between text-left mb-3"
          >
            <h3 className="text-sm font-bold text-green-800 flex items-center gap-2">
              <PlusCircle size={16} />
              Log Extra Reading
            </h3>
            <span className="text-green-800 font-bold text-lg">{showLogExtraReading ? '▲' : '▼'}</span>
          </button>
          {showLogExtraReading && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-green-700 mb-3">
                  Read more than the scheduled chapters today? Add them here so your progress reflects the extra effort.
                </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min="1"
                value={extraChaptersInput}
                onChange={(e) => setExtraChaptersInput(e.target.value)}
                placeholder="Number of extra chapters"
                className="flex-1 border-2 border-gray-300 rounded-2xl px-4 py-3 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={logExtraChapters}
                disabled={!canLogExtra}
                className={`sm:w-auto w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-2xl font-semibold transition shadow ${
                  canLogExtra ? 'hover:from-green-600 hover:to-green-700' : 'opacity-60 cursor-not-allowed'
                }`}
              >
                Record Extra Chapters
              </button>
            </div>
            {!!currentUserData?.extraChapters && (
              <p className="text-sm text-gray-500 mt-3">
                You have logged <span className="font-semibold text-purple-600">{currentUserData.extraChapters}</span> bonus chapters so far.
              </p>
            )}
          </div>

          {!!currentUserData?.extraChapters && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Trash2 className="text-red-600" />
                Remove Extra Reading
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Made a mistake? Remove extra chapters you previously logged.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  min="1"
                  max={currentUserData.extraChapters}
                  value={removeExtraChaptersInput}
                  onChange={(e) => setRemoveExtraChaptersInput(e.target.value)}
                  placeholder="Number of chapters to remove"
                  className="flex-1 border-2 border-gray-300 rounded-2xl px-4 py-3 focus:border-red-500 focus:outline-none"
                />
                <button
                  onClick={removeExtraChapters}
                  disabled={!canRemoveExtra}
                  className={`sm:w-auto w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-3 rounded-2xl font-semibold transition shadow ${
                    canRemoveExtra ? 'hover:from-red-600 hover:to-red-700' : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  Remove Chapters
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                This will only remove from your bonus chapters count.
              </p>
            </div>
          )}
            </div>
          )}
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
          <button
            onClick={() => setShowFixChapterCount(!showFixChapterCount)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-sm font-bold text-red-800 flex items-center gap-2">
              <Trophy size={16} />
              🔧 Fix Chapter Count
            </h3>
            <span className="text-red-800 font-bold text-lg">{showFixChapterCount ? '▲' : '▼'}</span>
          </button>
          {showFixChapterCount && (
            <>
              <p className="text-xs text-red-700 mb-3 mt-3">
                If your chapter count is incorrect, use one of these options:
              </p>
              <div className="space-y-2">
            <button
              onClick={async () => {
                const userRef = ref(database, `users/${currentUser}`);
                try {
                  const snapshot = await get(userRef);
                  const userData = snapshot.val() || {};
                  const completedDates = userData.completedDates || [];
                  const extraChapters = userData.extraChapters || 0;
                  
                  // Calculate from completed dates (4 chapters per day)
                  const totalFromDates = completedDates.length * 4;
                  const newTotal = totalFromDates + extraChapters;
                  
                  await update(userRef, {
                    totalChapters: newTotal
                  });
                  
                  alert(`✅ Recovered! Your chapter count is now ${newTotal} (${completedDates.length} days × 4 chapters + ${extraChapters} bonus)`);
                } catch (error) {
                  console.error('Error recovering:', error);
                  alert('❌ Failed to recover. Please try again.');
                }
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition shadow text-sm"
            >
              🔄 Recover from Completed Days
            </button>
            
            <button
              onClick={async () => {
                const userRef = ref(database, `users/${currentUser}`);
                try {
                  const snapshot = await get(userRef);
                  const userData = snapshot.val() || {};
                  const chaptersData = userData.completedChapters || {};
                  
                  // Calculate total from completed chapters
                  const totalFromChapters = Object.values(chaptersData).reduce((sum, chapters) => sum + chapters.length, 0);
                  const extraChapters = userData.extraChapters || 0;
                  const newTotal = totalFromChapters + extraChapters;
                  
                  await update(userRef, {
                    totalChapters: newTotal
                  });
                  
                  alert(`✅ Recalculated! Your chapter count is now ${newTotal} (${totalFromChapters} completed + ${extraChapters} bonus)`);
                } catch (error) {
                  console.error('Error recalculating:', error);
                  alert('❌ Failed to recalculate. Please try again.');
                }
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition shadow text-sm"
            >
              Recalculate from Completed Chapters
            </button>
            
            <button
              onClick={async () => {
                if (!window.confirm('This will reset ALL your progress to 0. Are you sure?')) return;
                
                const userRef = ref(database, `users/${currentUser}`);
                try {
                  await update(userRef, {
                    totalChapters: 0,
                    extraChapters: 0,
                    completedChapters: {},
                    completedDates: [],
                    streak: 0
                  });
                  
                  setCompletedChapters({});
                  alert('✅ All progress reset to 0!');
                } catch (error) {
                  console.error('Error resetting:', error);
                  alert('❌ Failed to reset. Please try again.');
                }
              }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition shadow text-sm"
            >
              ⚠️ Reset ALL Progress to 0
            </button>
              </div>
            </>
          )}
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200">
          <button
            onClick={() => setShowBadgeExplanation(!showBadgeExplanation)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-sm font-bold text-purple-800 flex items-center gap-2">
              <Trophy size={16} />
              🏆 Badge Meanings
            </h3>
            <span className="text-purple-800 font-bold text-lg">{showBadgeExplanation ? '▲' : '▼'}</span>
          </button>
          {showBadgeExplanation && (
            <div className="mt-3 space-y-2 text-xs text-purple-700">
              <div className="flex items-start gap-2">
                <span className="text-base">✅</span>
                <div>
                  <span className="font-semibold">Green Checkmark:</span> Completed today's scheduled chapters
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base">🏆</span>
                <div>
                  <span className="font-semibold">Golden Trophy:</span> First person to complete today's challenge
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base">🌱</span>
                <div>
                  <span className="font-semibold">Seedling:</span> Faithful Start - First day completed
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base">🔥</span>
                <div>
                  <span className="font-semibold">Fire:</span> On fire - 7+ day streak
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base">🏆</span>
                <div>
                  <span className="font-semibold">Trophy Icons (Gold/Silver/Bronze):</span> Top 3 positions on leaderboard
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 mb-3">Need to step away? You can remove your account and all progress anytime. This only affects your data.</p>
          <button
            onClick={handleDeleteAccount}
            className="w-full border-2 border-red-200 text-red-600 py-3 rounded-2xl font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Delete My Account
          </button>
        </div>
      </div>
    </div>
  )}
</div>

);
}
export default App;
