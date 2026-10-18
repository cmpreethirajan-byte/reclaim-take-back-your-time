export type SupportedLanguage =
  | 'English'
  | 'Tamil'
  | 'Hindi'
  | 'Kannada'
  | 'Telugu'
  | 'Malayalam'
  | 'Spanish'
  | 'Italian'
  | 'German'
  | 'Korean'
  | 'Chinese'
  | 'Japanese'
  | 'Filipino';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
  { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  { code: 'Malayalam', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'Spanish', label: 'Spanish', native: 'Español' },
  { code: 'Italian', label: 'Italian', native: 'Italiano' },
  { code: 'German', label: 'German', native: 'Deutsch' },
  { code: 'Korean', label: 'Korean', native: '한국어' },
  { code: 'Chinese', label: 'Chinese', native: '中文' },
  { code: 'Japanese', label: 'Japanese', native: '日本語' },
  { code: 'Filipino', label: 'Filipino', native: 'Filipino' },
];

export interface TranslationSchema {
  appTitle: string;
  appSubtitle: string;
  personalMode: string;
  personalModeDesc: string;
  familyShield: string;
  familyShieldDesc: string;
  poweredByGemini: string;
  privacyNote: string;
  navHome: string;
  navPersonal: string;
  navPause: string;
  navCoach: string;
  navDashboard: string;
  navFamily: string;
  dailyGoalTitle: string;
  enteredByYou: string;
  sampleData: string;
  noRealTrackingNote: string;
  minutesUsedOfGoal: string;
  editGoal: string;
  saveGoal: string;
  logScrollingTitle: string;
  customMinutesPlaceholder: string;
  addMinutesBtn: string;
  pauseAndReflectBtn: string;
  aiActivityCoachBtn: string;
  voiceNudgesTitle: string;
  voicePrivacyNote: string;
  suggestedLineLabel: string;
  suggestedLineText: string;
  selectPersonLabel: string;
  recordBtn: string;
  stopRecordingBtn: string;
  reRecordBtn: string;
  playBtn: string;
  renameBtn: string;
  deleteBtn: string;
  messageFromPrefix: string;
  noRecordingReminder: string;
  step1Question: string;
  moodBored: string;
  moodStressed: string;
  moodLonely: string;
  moodTired: string;
  moodHabit: string;
  step2Title: string;
  step3Title: string;
  continueBtn: string;
  take5BreakBtn: string;
  tryActivityBtn: string;
  coachCardTitle: string;
  coachDurationUnit: string;
  coachWhyLabel: string;
  regenerateBtn: string;
  doThisActivityBtn: string;
  dashboardTitle: string;
  timeReclaimedLabel: string;
  breaksCompletedLabel: string;
  dailyGoalStatusLabel: string;
  triggersChartTitle: string;
  weeklySummaryTitle: string;
  loadDemoDataBtn: string;
  clearAllDataBtn: string;
  familyChecklistTitle: string;
  familyPactTitle: string;
  familyTrustDisclaimer: string;
}

export const BUILTIN_TRANSLATIONS: Partial<Record<SupportedLanguage, TranslationSchema>> & {
  English: TranslationSchema;
} = {
  English: {
    appTitle: 'RECLAIM: Take Back Your Time',
    appSubtitle: 'Mindful digital habits for you and your family. Step out of endless feeds and back into real life.',
    personalMode: 'Personal Mode',
    personalModeDesc: 'Set a daily scrolling goal, log time consciously, record family voice nudges, and take mindful pauses.',
    familyShield: 'Family Shield',
    familyShieldDesc: 'Parent-friendly Google Family Link checklist and a shared Family Pact for healthy boundaries at home.',
    poweredByGemini: 'Powered by Gemini',
    privacyNote: 'Data stays on this device. Only your mood and goal text is sent to Gemini through the server.',
    navHome: 'Welcome',
    navPersonal: 'Personal',
    navPause: 'Reflect',
    navCoach: 'Coach',
    navDashboard: 'Progress',
    navFamily: 'Family',
    dailyGoalTitle: 'Daily Scrolling Goal',
    enteredByYou: 'Entered by you',
    sampleData: 'Sample data',
    noRealTrackingNote: 'Self-reported log. RECLAIM does not monitor or measure real phone usage.',
    minutesUsedOfGoal: 'mins used of',
    editGoal: 'Set Goal',
    saveGoal: 'Save',
    logScrollingTitle: 'Log Scrolling Time',
    customMinutesPlaceholder: 'Minutes',
    addMinutesBtn: 'Add Time',
    pauseAndReflectBtn: 'Pause and Reflect',
    aiActivityCoachBtn: 'AI Activity Coach',
    voiceNudgesTitle: 'Voice Nudges',
    voicePrivacyNote: 'Voice messages stay on this device and are never uploaded or sent to AI.',
    suggestedLineLabel: 'Suggested line to read aloud:',
    suggestedLineText: '"You have been scrolling for a long time. Why not study, play or do something productive?"',
    selectPersonLabel: 'Choose speaker:',
    recordBtn: 'Record (up to 30s)',
    stopRecordingBtn: 'Stop Recording',
    reRecordBtn: 'Re-record',
    playBtn: 'Play',
    renameBtn: 'Rename',
    deleteBtn: 'Delete',
    messageFromPrefix: 'A message from',
    noRecordingReminder: 'No voice recording saved for this person yet. Reminder: You have been scrolling for a while—take a gentle breath and step away for a few minutes.',
    step1Question: 'How are you feeling right now?',
    moodBored: 'Bored',
    moodStressed: 'Stressed',
    moodLonely: 'Lonely',
    moodTired: 'Tired',
    moodHabit: 'Just habit',
    step2Title: 'A Kind Reflection for This Moment',
    step3Title: 'What would you like to do next?',
    continueBtn: 'Continue',
    take5BreakBtn: 'Take a 5-minute break',
    tryActivityBtn: 'Try an activity',
    coachCardTitle: 'AI Activity Coach',
    coachDurationUnit: 'mins',
    coachWhyLabel: 'Why this helps:',
    regenerateBtn: 'Regenerate',
    doThisActivityBtn: 'Start This Activity',
    dashboardTitle: 'Progress Dashboard',
    timeReclaimedLabel: 'Time Reclaimed',
    breaksCompletedLabel: 'Breaks Completed',
    dailyGoalStatusLabel: 'Daily Goal Status',
    triggersChartTitle: 'What triggers my scrolling',
    weeklySummaryTitle: 'Weekly Summary (7 Days)',
    loadDemoDataBtn: 'Load demo data',
    clearAllDataBtn: 'Clear all data',
    familyChecklistTitle: 'Google Family Link Checklist',
    familyPactTitle: 'Our Family Pact',
    familyTrustDisclaimer: 'RECLAIM does not block, monitor, or control other apps.',
  },
  Tamil: {
    appTitle: 'RECLAIM: உங்கள் நேரத்தை மீட்டெடுங்கள்',
    appSubtitle: 'உங்களுக்கும் உங்கள் குடும்பத்திற்கும் ஆரோக்கியமான டிஜிட்டல் பழக்கங்கள்.',
    personalMode: 'தனிப்பட்ட பயன்முறை (Personal Mode)',
    personalModeDesc: 'தினசரி திரை நேர இலக்கை அமைக்கவும், நேரத்தைப் பதிவு செய்யவும் மற்றும் குரல் நினைவூட்டல்களைப் பெறவும்.',
    familyShield: 'குடும்பக் கவசம் (Family Shield)',
    familyShieldDesc: 'Google Family Link வழிகாட்டி மற்றும் பெற்றோர்-குழந்தைக்கான குடும்ப ஒப்பந்தம்.',
    poweredByGemini: 'Gemini மூலம் இயங்குகிறது',
    privacyNote: 'தரவு இந்தச் சாதனத்திலேயே இருக்கும். மனநிலை மற்றும் இலக்கு உரை மட்டுமே சேவையகம் வழியாக Gemini-க்கு அனுப்பப்படும்.',
    navHome: 'முகப்பு',
    navPersonal: 'தனிப்பட்ட',
    navPause: 'சிந்தி',
    navCoach: 'பயிற்சி',
    navDashboard: 'முன்னேற்றம்',
    navFamily: 'குடும்பம்',
    dailyGoalTitle: 'தினசரி ஸ்க்ரோலிங் இலக்கு',
    enteredByYou: 'நீங்களாகப் பதிவிட்டது',
    sampleData: 'மாதிரித் தரவு',
    noRealTrackingNote: 'சுயமாகப் பதிவிட்ட நேரம். RECLAIM உங்கள் போனின் உண்மையான பயன்பாட்டைக் கண்காணிப்பதில்லை.',
    minutesUsedOfGoal: 'நிமிடங்கள் / இலக்கு',
    editGoal: 'இலக்கை மாற்று',
    saveGoal: 'சேமி',
    logScrollingTitle: 'ஸ்க்ரோலிங் நேரத்தைப் பதிவு செய்',
    customMinutesPlaceholder: 'நிமிடங்கள்',
    addMinutesBtn: 'சேர்',
    pauseAndReflectBtn: 'நிறுத்திச் சிந்தியுங்கள்',
    aiActivityCoachBtn: 'AI செயல்பாட்டுப் பயிற்சியாளர்',
    voiceNudgesTitle: 'குரல் நினைவூட்டல்கள்',
    voicePrivacyNote: 'குரல் செய்திகள் இந்தச் சாதனத்திலேயே இருக்கும், அவை ஒருபோதும் பதிவேற்றப்படுவதோ AI-க்கு அனுப்பப்படுவதோ இல்லை.',
    suggestedLineLabel: 'படிக்கப் பரிந்துரைக்கப்படும் வாக்கியம்:',
    suggestedLineText: '"நீங்கள் நீண்ட நேரமாக ஸ்க்ரோல் செய்து கொண்டிருக்கிறீர்கள். ஏன் படிக்கவோ, விளையாடவோ அல்லது பயனுள்ள ஒன்றைச் செய்யவோ கூடாது?"',
    selectPersonLabel: 'குரலைத் தேர்ந்தெடுக்கவும்:',
    recordBtn: 'பதிவு செய் (30 வினாடி வரை)',
    stopRecordingBtn: 'பதிவை நிறுத்து',
    reRecordBtn: 'மீண்டும் பதிவு செய்',
    playBtn: 'இயக்கு',
    renameBtn: 'பெயர் மாற்று',
    deleteBtn: 'நீக்கு',
    messageFromPrefix: 'செய்தி அனுப்பியவர்:',
    noRecordingReminder: 'இவருக்கான குரல் பதிவு இன்னும் சேமிக்கப்படவில்லை. நினைவூட்டல்: சிறிது நேரம் திரையை விட்டு விலகி ஆழ்ந்த மூச்சு விடுங்கள்.',
    step1Question: 'இப்போது நீங்கள் எப்படி உணர்கிறீர்கள்?',
    moodBored: 'சலிப்பு',
    moodStressed: 'மன அழுத்தம்',
    moodLonely: 'தனிமை',
    moodTired: 'சோர்வு',
    moodHabit: 'வெறும் பழக்கம்',
    step2Title: 'இந்தத் தருணத்திற்கான அன்பான சிந்தனை',
    step3Title: 'அடுத்து என்ன செய்ய விரும்புகிறீர்கள்?',
    continueBtn: 'தொடரவும்',
    take5BreakBtn: '5 நிமிட இடைவேளை எடு',
    tryActivityBtn: 'ஒரு செயலை முயற்சி செய்',
    coachCardTitle: 'AI செயல்பாட்டுப் பயிற்சியாளர்',
    coachDurationUnit: 'நிமிடங்கள்',
    coachWhyLabel: 'இது ஏன் உதவுகிறது:',
    regenerateBtn: 'மீண்டும் உருவாக்கு',
    doThisActivityBtn: 'இதைச் செய்வேன்',
    dashboardTitle: 'முன்னேற்றப் பலகை',
    timeReclaimedLabel: 'மீட்டெடுத்த நேரம்',
    breaksCompletedLabel: 'எடுத்த இடைவேளைகள்',
    dailyGoalStatusLabel: 'தினசரி இலக்கு நிலை',
    triggersChartTitle: 'எனது ஸ்க்ரோலிங்கைத் தூண்டுவது எது',
    weeklySummaryTitle: 'வாராந்திரச் சுருக்கம் (7 நாட்கள்)',
    loadDemoDataBtn: 'மாதிரித் தரவை ஏற்று',
    clearAllDataBtn: 'அனைத்துத் தரவையும் அழி',
    familyChecklistTitle: 'Google Family Link சரிபார்ப்புப் பட்டியல்',
    familyPactTitle: 'எங்கள் குடும்ப ஒப்பந்தம்',
    familyTrustDisclaimer: 'RECLAIM பிற செயலிகளைத் தடுக்கவோ, கண்காணிக்கவோ அல்லது கட்டுப்படுத்தவோ செய்யாது.',
  },
  Hindi: {
    appTitle: 'RECLAIM: अपना समय वापस पाएं',
    appSubtitle: 'आपके और आपके परिवार के लिए सचेत डिजिटल आदतें। बिना सोचे स्क्रॉलिंग से बाहर निकलें।',
    personalMode: 'पर्सनल मोड (Personal Mode)',
    personalModeDesc: 'दैनिक स्क्रॉलिंग लक्ष्य तय करें, समय दर्ज करें, परिवार के वॉइस संदेश रिकॉर्ड करें और शांत ब्रेक लें।',
    familyShield: 'फैमिली शील्ड (Family Shield)',
    familyShieldDesc: 'माता-पिता के लिए Google Family Link चेकलिस्ट और साझा पारिवारिक डिजिटल समझौता।',
    poweredByGemini: 'Gemini द्वारा संचालित',
    privacyNote: 'डेटा इसी डिवाइस पर रहता है। केवल आपका मूड और लक्ष्य टेक्स्ट सर्वर के माध्यम से Gemini को भेजा जाता है।',
    navHome: 'स्वागत',
    navPersonal: 'पर्सनल',
    navPause: 'विचार',
    navCoach: 'कोच',
    navDashboard: 'प्रगति',
    navFamily: 'परिवार',
    dailyGoalTitle: 'दैनिक स्क्रॉलिंग लक्ष्य',
    enteredByYou: 'आपके द्वारा दर्ज',
    sampleData: 'सैंपल डेटा',
    noRealTrackingNote: 'स्वयं दर्ज किया गया समय। RECLAIM फोन के वास्तविक उपयोग को मापता या ट्रैक नहीं करता है।',
    minutesUsedOfGoal: 'मिनट उपयोग / लक्ष्य',
    editGoal: 'लक्ष्य बदलें',
    saveGoal: 'सहेजें',
    logScrollingTitle: 'स्क्रॉलिंग समय दर्ज करें',
    customMinutesPlaceholder: 'मिनट',
    addMinutesBtn: 'समय जोड़ें',
    pauseAndReflectBtn: 'रुकें और विचार करें',
    aiActivityCoachBtn: 'AI एक्टिविटी कोच',
    voiceNudgesTitle: 'वॉइस संदेश (Voice Nudges)',
    voicePrivacyNote: 'वॉइस संदेश इसी डिवाइस पर रहते हैं और कभी भी अपलोड या AI को नहीं भेजे जाते।',
    suggestedLineLabel: 'बोलकर रिकॉर्ड करने के लिए सुझाई गई पंक्ति:',
    suggestedLineText: '"आप काफी देर से स्क्रॉल कर रहे हैं। क्यों न थोड़ी पढ़ाई करें, खेलें या कुछ उपयोगी करें?"',
    selectPersonLabel: 'किसकी आवाज़ चुनें:',
    recordBtn: 'रिकॉर्ड करें (अधिकतम 30 सेकंड)',
    stopRecordingBtn: 'रिकॉर्डिंग रोकें',
    reRecordBtn: 'फिर से रिकॉर्ड करें',
    playBtn: 'चलाएं',
    renameBtn: 'नाम बदलें',
    deleteBtn: 'हटाएं',
    messageFromPrefix: 'संदेश प्रेषक:',
    noRecordingReminder: 'इस व्यक्ति के लिए अभी कोई वॉइस रिकॉर्डिंग नहीं है। अनुस्मारक: आप काफी देर से स्क्रॉल कर रहे हैं—एक छोटा ब्रेक लें।',
    step1Question: 'इस समय आप कैसा महसूस कर रहे हैं?',
    moodBored: 'बोरियत',
    moodStressed: 'तनाव',
    moodLonely: 'अकेलापन',
    moodTired: 'थकान',
    moodHabit: 'बस आदत',
    step2Title: 'इस पल के लिए एक शांत विचार',
    step3Title: 'अब आप आगे क्या करना चाहेंगे?',
    continueBtn: 'जारी रखें',
    take5BreakBtn: '5 मिनट का ब्रेक लें',
    tryActivityBtn: 'कोई गतिविधि आज़माएं',
    coachCardTitle: 'AI एक्टिविटी कोच',
    coachDurationUnit: 'मिनट',
    coachWhyLabel: 'यह क्यों मददगार है:',
    regenerateBtn: 'नया सुझाव पाएं',
    doThisActivityBtn: 'यह गतिविधि शुरू करें',
    dashboardTitle: 'प्रगति डैशबोर्ड',
    timeReclaimedLabel: 'बचाया गया समय',
    breaksCompletedLabel: 'पूरे किए गए ब्रेक',
    dailyGoalStatusLabel: 'दैनिक लक्ष्य स्थिति',
    triggersChartTitle: 'मेरी स्क्रॉलिंग को क्या ट्रिगर करता है',
    weeklySummaryTitle: 'साप्ताहिक सारांश (7 दिन)',
    loadDemoDataBtn: 'डेमो डेटा लोड करें',
    clearAllDataBtn: 'सारा डेटा साफ़ करें',
    familyChecklistTitle: 'Google Family Link चेकलिस्ट',
    familyPactTitle: 'हमारा पारिवारिक समझौता (Family Pact)',
    familyTrustDisclaimer: 'RECLAIM अन्य ऐप्स को ब्लॉक, मॉनिटर या नियंत्रित नहीं करता है।',
  },
  Kannada: {
    appTitle: 'RECLAIM: ನಿಮ್ಮ ಸಮಯವನ್ನು ಮರಳಿ ಪಡೆಯಿರಿ',
    appSubtitle: 'ನಿಮಗಾಗಿ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕಾಗಿ ಉತ್ತಮ ಡಿಜಿಟಲ್ ಅಭ್ಯಾಸಗಳು.',
    personalMode: 'ವೈಯಕ್ತಿಕ ಮೋಡ್ (Personal Mode)',
    personalModeDesc: 'ದೈನಂದಿನ ಸ್ಕ್ರೋಲಿಂಗ್ ಗುರಿಯನ್ನು ಹೊಂದಿಸಿ, ಸಮಯ ದಾಖಲಿಸಿ ಮತ್ತು ಧ್ವನಿ ಸಂದೇಶಗಳನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ.',
    familyShield: 'ಫ್ಯಾಮಿಲಿ ಶೀಲ್ಡ್ (Family Shield)',
    familyShieldDesc: 'ಪೋಷಕರಿಗಾಗಿ Google Family Link ಪಟ್ಟಿ ಮತ್ತು ಕುಟುಂಬದ ಒಪ್ಪಂದ.',
    poweredByGemini: 'Gemini ನಿಂದ ಚಾಲಿತ',
    privacyNote: 'ಡೇಟಾ ಈ ಸಾಧನದಲ್ಲಿಯೇ ಇರುತ್ತದೆ. ನಿಮ್ಮ ಮನಸ್ಥಿತಿ ಮತ್ತು ಗುರಿ ಪಠ್ಯವನ್ನು ಮಾತ್ರ ಸರ್ವರ್ ಮೂಲಕ Gemini ಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.',
    navHome: 'ಸ್ವಾಗತ',
    navPersonal: 'ವೈಯಕ್ತಿಕ',
    navPause: 'ಚಿಂತನೆ',
    navCoach: 'ಕೋಚ್',
    navDashboard: 'ಪ್ರಗತಿ',
    navFamily: 'ಕುಟುಂಬ',
    dailyGoalTitle: 'ದೈನಂದಿನ ಸ್ಕ್ರೋಲಿಂಗ್ ಗುರಿ',
    enteredByYou: 'ನೀವು ನಮೂದಿಸಿದ್ದು',
    sampleData: 'ಮಾದರಿ ಡೇಟಾ',
    noRealTrackingNote: 'ನೀವೇ ನಮೂದಿಸಿದ ಸಮಯ. RECLAIM ನಿಮ್ಮ ಫೋನ್ ಬಳಕೆಯನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಅಳೆಯುವುದಿಲ್ಲ.',
    minutesUsedOfGoal: 'ನಿಮಿಷ ಬಳಸಲಾಗಿದೆ / ಗುರಿ',
    editGoal: 'ಗುರಿ ಬದಲಿಸಿ',
    saveGoal: 'ಉಳಿಸಿ',
    logScrollingTitle: 'ಸ್ಕ್ರೋಲಿಂಗ್ ಸಮಯ ದಾಖಲಿಸಿ',
    customMinutesPlaceholder: 'ನಿಮಿಷಗಳು',
    addMinutesBtn: 'ಸೇರಿಸಿ',
    pauseAndReflectBtn: 'ನಿಲ್ಲಿಸಿ ಮತ್ತು ಯೋಚಿಸಿ',
    aiActivityCoachBtn: 'AI ಚಟುವಟಿಕೆ ಕೋಚ್',
    voiceNudgesTitle: 'ಧ್ವನಿ ಸಂದೇಶಗಳು (Voice Nudges)',
    voicePrivacyNote: 'ಧ್ವನಿ ಸಂದೇಶಗಳು ಈ ಸಾಧನದಲ್ಲಿ ಮಾತ್ರ ಇರುತ್ತವೆ ಮತ್ತು ಎಂದಿಗೂ AI ಗೆ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ.',
    suggestedLineLabel: 'ಓದಲು ಸೂಚಿಸಲಾದ ಸಾಲು:',
    suggestedLineText: '"ನೀವು ತುಂಬಾ ಸಮಯದಿಂದ ಸ್ಕ್ರೋಲ್ ಮಾಡುತ್ತಿದ್ದೀರಿ. ಏಕೆ ಓದಬಾರದು, ಆಟವಾಡಬಾರದು ಅಥವಾ ಉಪಯುಕ್ತವಾದದ್ದನ್ನು ಮಾಡಬಾರದು?"',
    selectPersonLabel: 'ಧ್ವನಿ ಆಯ್ಕೆಮಾಡಿ:',
    recordBtn: 'ರೆಕಾರ್ಡ್ ಮಾಡಿ (30 ಸೆಕೆಂಡ್ ವರೆಗೆ)',
    stopRecordingBtn: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
    reRecordBtn: 'ಮತ್ತೆ ರೆಕಾರ್ಡ್ ಮಾಡಿ',
    playBtn: 'ಪ್ಲೇ ಮಾಡಿ',
    renameBtn: 'ಹೆಸರು ಬದಲಿಸಿ',
    deleteBtn: 'ಅಳಿಸಿ',
    messageFromPrefix: 'ಸಂದೇಶ ಕಳುಹಿಸಿದವರು:',
    noRecordingReminder: 'ಇನ್ನೂ ಯಾವುದೇ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಇಲ್ಲ. ನೆನಪಿನ ಮಾತು: ಸ್ವಲ್ಪ ವಿರಾಮ ತೆಗೆದುಕೊಳ್ಳಿ.',
    step1Question: 'ಈಗ ನಿಮಗೆ ಹೇಗೆ ಅನಿಸುತ್ತಿದೆ?',
    moodBored: 'ಬೇಸರ',
    moodStressed: 'ಒತ್ತಡ',
    moodLonely: 'ಒಂಟಿತನ',
    moodTired: 'ಆಯಾಸ',
    moodHabit: 'ಕೇವಲ ಅಭ್ಯಾಸ',
    step2Title: 'ಈ ಕ್ಷಣಕ್ಕಾಗಿ ಒಂದು ಪ್ರೀತಿಯ ಚಿಂತನೆ',
    step3Title: 'ಮುಂದೆ ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?',
    continueBtn: 'ಮುಂದುವರಿಸಿ',
    take5BreakBtn: '5 ನಿಮಿಷಗಳ ವಿರಾಮ ತೆಗೆದುಕೊಳ್ಳಿ',
    tryActivityBtn: 'ಚಟುವಟಿಕೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ',
    coachCardTitle: 'AI ಚಟುವಟಿಕೆ ಕೋಚ್',
    coachDurationUnit: 'ನಿಮಿಷ',
    coachWhyLabel: 'ಇದು ಏಕೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ:',
    regenerateBtn: 'ಮತ್ತೆ ರಚಿಸಿ',
    doThisActivityBtn: 'ಈ ಚಟುವಟಿಕೆ ಪ್ರಾರಂಭಿಸಿ',
    dashboardTitle: 'ಪ್ರಗತಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    timeReclaimedLabel: 'ಉಳಿಸಿದ ಸಮಯ',
    breaksCompletedLabel: 'ಪೂರ್ಣಗೊಂಡ ವಿರಾಮಗಳು',
    dailyGoalStatusLabel: 'ದೈನಂದಿನ ಗುರಿ ಸ್ಥಿತಿ',
    triggersChartTitle: 'ನನ್ನ ಸ್ಕ್ರೋಲಿಂಗ್‌ಗೆ ಪ್ರೇರಣೆ ಏನು',
    weeklySummaryTitle: 'ವಾರದ ಸಾರಾಂಶ (7 ದಿನಗಳು)',
    loadDemoDataBtn: 'ಡೆಮೊ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ',
    clearAllDataBtn: 'ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಿ',
    familyChecklistTitle: 'Google Family Link ಪರಿಶೀಲನಾಪಟ್ಟಿ',
    familyPactTitle: 'ನಮ್ಮ ಕುಟುಂಬದ ಒಪ್ಪಂದ',
    familyTrustDisclaimer: 'RECLAIM ಇತರ ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ನಿರ್ಬಂಧಿಸುವುದಿಲ್ಲ, ಗಮನಿಸುವುದಿಲ್ಲ ಅಥವಾ ನಿಯಂತ್ರಿಸುವುದಿಲ್ಲ.',
  },
  Telugu: {
    appTitle: 'RECLAIM: మీ సమయాన్ని తిరిగి పొందండి',
    appSubtitle: 'మీకు మరియు మీ కుటుంబానికి ఆరోగ్యకరమైన డిజిటల్ అలవాట్లు.',
    personalMode: 'వ్యక్తిగత మోడ్ (Personal Mode)',
    personalModeDesc: 'రోజువారీ స్క్రోలింగ్ లక్ష్యాన్ని సెట్ చేయండి, సమయాన్ని నమోదు చేయండి మరియు వాయిస్ రిమైండర్‌లను రికార్డ్ చేయండి.',
    familyShield: 'ఫ్యామిలీ షీల్డ్ (Family Shield)',
    familyShieldDesc: 'తల్లిదండ్రుల కోసం Google Family Link చెక్‌లిస్ట్ మరియు కుటుంబ ఒప్పందం.',
    poweredByGemini: 'Gemini ద్వారా ఆధారితం',
    privacyNote: 'డేటా ఈ పరికరంలోనే ఉంటుంది. కేవలం మీ మూడ్ మరియు లక్ష్య వివరాలు మాత్రమే సర్వర్ ద్వారా Geminiకి పంపబడతాయి.',
    navHome: 'స్వాగతం',
    navPersonal: 'వ్యక్తిగత',
    navPause: 'ఆలోచన',
    navCoach: 'కోచ్',
    navDashboard: 'పురోగతి',
    navFamily: 'కుటుంబం',
    dailyGoalTitle: 'రోజువారీ స్క్రోలింగ్ లక్ష్యం',
    enteredByYou: 'మీరు నమోదు చేసినది',
    sampleData: 'నమూనా డేటా',
    noRealTrackingNote: 'స్వయంగా నమోదు చేసిన సమయం. RECLAIM ఫోన్ వాస్తవ వినియోగాన్ని కొలవదు.',
    minutesUsedOfGoal: 'నిమిషాలు ఉపయోగించారు / లక్ష్యం',
    editGoal: 'లక్ష్యం మార్చు',
    saveGoal: 'సేవ్ చేయి',
    logScrollingTitle: 'స్క్రోలింగ్ సమయాన్ని నమోదు చేయండి',
    customMinutesPlaceholder: 'నిమిషాలు',
    addMinutesBtn: 'జోడించు',
    pauseAndReflectBtn: 'ఆగి ఆలోచించండి',
    aiActivityCoachBtn: 'AI యాక్టివిటీ కోచ్',
    voiceNudgesTitle: 'వాయిస్ రిమైండర్లు (Voice Nudges)',
    voicePrivacyNote: 'వాయిస్ సందేశాలు ఈ పరికరంలోనే ఉంటాయి మరియు ఎప్పుడూ అప్‌లోడ్ చేయబడవు లేదా AIకి పంపబడవు.',
    suggestedLineLabel: 'పైకి చదవడానికి సూచించిన వాక్యం:',
    suggestedLineText: '"మీరు చాలా సేపటి నుండి స్క్రోల్ చేస్తున్నారు. కాసేపు చదువుకోవడం, ఆడుకోవడం లేదా ఏదైనా ఉపయోగకరమైన పని చేయవచ్చు కదా?"',
    selectPersonLabel: 'వాయిస్ ఎంచుకోండి:',
    recordBtn: 'రికార్డ్ చేయండి (30 సెకన్ల వరకు)',
    stopRecordingBtn: 'రికార్డింగ్ ఆపండి',
    reRecordBtn: 'మళ్లీ రికార్డ్ చేయండి',
    playBtn: 'ప్లే చేయండి',
    renameBtn: 'పేరు మార్చండి',
    deleteBtn: 'తొలగించు',
    messageFromPrefix: 'సందేశం పంపినవారు:',
    noRecordingReminder: 'ఇంకా వాయిస్ రికార్డింగ్ సేవ్ చేయలేదు. రిమైండర్: కాసేపు ఫోన్ పక్కన పెట్టి విరామం తీసుకోండి.',
    step1Question: 'ఇప్పుడు మీకు ఎలా అనిపిస్తోంది?',
    moodBored: 'విసుగు',
    moodStressed: 'ఒత్తిడి',
    moodLonely: 'ఒంటరితనం',
    moodTired: 'అలసట',
    moodHabit: 'కేవలం అలవాటు',
    step2Title: 'ఈ క్షణం కోసం ఒక మంచి ఆలోచన',
    step3Title: 'తదుపరి మీరు ఏమి చేయాలనుకుంటున్నారు?',
    continueBtn: 'కొనసాగించు',
    take5BreakBtn: '5 నిమిషాల విరామం తీసుకోండి',
    tryActivityBtn: 'ఒక యాక్టివిటీ ప్రయత్నించండి',
    coachCardTitle: 'AI యాక్టివిటీ కోచ్',
    coachDurationUnit: 'నిమిషాలు',
    coachWhyLabel: 'ఇది ఎందుకు సహాయపడుతుంది:',
    regenerateBtn: 'మరో సూచన',
    doThisActivityBtn: 'ఈ యాక్టివిటీ ప్రారంభించండి',
    dashboardTitle: 'పురోగతి డాష్‌బోర్డ్',
    timeReclaimedLabel: 'తిరిగి పొందిన సమయం',
    breaksCompletedLabel: 'పూర్తయిన విరామాలు',
    dailyGoalStatusLabel: 'రోజువారీ లక్ష్య స్థితి',
    triggersChartTitle: 'నా స్క్రోలింగ్‌కు కారణమేమిటి',
    weeklySummaryTitle: 'వారపు సారాంశం (7 రోజులు)',
    loadDemoDataBtn: 'డెమో డేటా లోడ్ చేయండి',
    clearAllDataBtn: 'మొత్తం డేటాను క్లియర్ చేయండి',
    familyChecklistTitle: 'Google Family Link చెక్‌లిస్ట్',
    familyPactTitle: 'మా కుటుంబ ఒప్పందం',
    familyTrustDisclaimer: 'RECLAIM ఇతర యాప్‌లను బ్లాక్ చేయదు, పర్యవేక్షించదు లేదా నియంత్రించదు.',
  },
  Malayalam: {
    appTitle: 'RECLAIM: നിങ്ങളുടെ സമയം വീണ്ടെടുക്കൂ',
    appSubtitle: 'നിങ്ങൾക്കും കുടുംബത്തിനും ആരോഗ്യകരമായ ഡിജിറ്റൽ ശീലങ്ങൾ.',
    personalMode: 'വ്യക്തിഗത മോഡ് (Personal Mode)',
    personalModeDesc: 'ദൈനംദിന സ്ക്രോളിംഗ് ലക്ഷ്യം വെക്കുക, സമയം രേഖപ്പെടുത്തുക, ശബ്ദ സന്ദേശങ്ങൾ റെക്കോർഡ് ചെയ്യുക.',
    familyShield: 'ഫാമിലി ഷീൽഡ് (Family Shield)',
    familyShieldDesc: 'രക്ഷിതാക്കൾക്കുള്ള Google Family Link ചെക്ക്‌ലിസ്റ്റും കുടുംബ ഡിജിറ്റൽ ഉടമ്പടിയും.',
    poweredByGemini: 'Gemini കരുത്തുപകരുന്നത്',
    privacyNote: 'ഡാറ്റ ഈ ഉപകരണത്തിൽ തന്നെ തുടരുന്നു. നിങ്ങളുടെ മാനസികാവസ്ഥയും ലക്ഷ്യവും മാത്രമേ സെർവർ വഴി Gemini-ലേക്ക് അയയ്ക്കൂ.',
    navHome: 'സ്വാഗതം',
    navPersonal: 'വ്യക്തിഗതം',
    navPause: 'ചിന്തിക്കുക',
    navCoach: 'കോച്ച്',
    navDashboard: 'പുരോഗതി',
    navFamily: 'കുടുംബം',
    dailyGoalTitle: 'ഇന്നത്തെ സ്ക്രോളിംഗ് ലക്ഷ്യം',
    enteredByYou: 'നിങ്ങൾ രേഖപ്പെടുത്തിയത്',
    sampleData: 'സാമ്പിൾ ഡാറ്റ',
    noRealTrackingNote: 'സ്വയം രേഖപ്പെടുത്തിയ സമയം. RECLAIM യഥാർത്ഥ ഫോൺ ഉപയോഗം അളക്കുന്നില്ല.',
    minutesUsedOfGoal: 'മിനിറ്റ് ഉപയോഗിച്ചു / ലക്ഷ്യം',
    editGoal: 'ലക്ഷ്യം മാറ്റുക',
    saveGoal: 'സേവ് ചെയ്യുക',
    logScrollingTitle: 'സ്ക്രോളിംഗ് സമയം ചേർക്കുക',
    customMinutesPlaceholder: 'മിനിറ്റ്',
    addMinutesBtn: 'ചേർക്കുക',
    pauseAndReflectBtn: 'നിർത്തുക, ചിന്തിക്കുക',
    aiActivityCoachBtn: 'AI ആക്റ്റിവിറ്റി കോച്ച്',
    voiceNudgesTitle: 'ശബ്ദ സന്ദേശങ്ങൾ (Voice Nudges)',
    voicePrivacyNote: 'ശബ്ദ സന്ദേശങ്ങൾ ഈ ഫോണിൽ മാത്രമായി സൂക്ഷിക്കുന്നു, ഒരിക്കലും AI-ലേക്ക് അയയ്ക്കുന്നില്ല.',
    suggestedLineLabel: 'വായിക്കാൻ നിർദ്ദേശിക്കുന്ന വാചകം:',
    suggestedLineText: '"നിങ്ങൾ ഒരുപാട് നേരമായി ഫോൺ സ്ക്രോൾ ചെയ്യുന്നു. പഠിക്കുകയോ കളിക്കുകയോ പ്രയോജനകരമായ എന്തെങ്കിലും ചെയ്യുകയോ ചെയ്താലോ?"',
    selectPersonLabel: 'ആരുടെ ശബ്ദം:',
    recordBtn: 'റെക്കോർഡ് ചെയ്യുക (30 സെക്കൻഡ്)',
    stopRecordingBtn: 'റെക്കോർഡിംഗ് നിർത്തുക',
    reRecordBtn: 'വീണ്ടും റെക്കോർഡ് ചെയ്യുക',
    playBtn: 'പ്ലേ ചെയ്യുക',
    renameBtn: 'പേര് മാറ്റുക',
    deleteBtn: 'നീക്കം ചെയ്യുക',
    messageFromPrefix: 'സന്ദേശം നൽകുന്നത്:',
    noRecordingReminder: 'ശബ്ദ സന്ദേശം ലഭ്യമല്ല. ഓർമ്മപ്പെടുത്തൽ: കുറച്ചുനേരം ഫോൺ മാറ്റിവെച്ച് വിശ്രമിക്കൂ.',
    step1Question: 'ഇപ്പോൾ നിങ്ങൾക്ക് എന്ത് തോന്നുന്നു?',
    moodBored: 'വിരസത',
    moodStressed: 'സമ്മർദ്ദം',
    moodLonely: 'ഏകാന്തത',
    moodTired: 'ക്ഷീണം',
    moodHabit: 'വെറുമൊരു ശീലം',
    step2Title: 'ഈ നിമിഷത്തേക്കുള്ള സാന്ത്വന ചിന്ത',
    step3Title: 'ഇനി നിങ്ങൾ എന്ത് ചെയ്യാൻ ആഗ്രഹിക്കുന്നു?',
    continueBtn: 'തുടരുക',
    take5BreakBtn: '5 മിനിറ്റ് ഇടവേള എടുക്കുക',
    tryActivityBtn: 'ഒരു പ്രവൃത്തി പരീക്ഷിക്കുക',
    coachCardTitle: 'AI ആക്റ്റിവിറ്റി കോച്ച്',
    coachDurationUnit: 'മിനിറ്റ്',
    coachWhyLabel: 'ഇത് എങ്ങനെ സഹായിക്കുന്നു:',
    regenerateBtn: 'മറ്റൊന്ന് കാണിക്കുക',
    doThisActivityBtn: 'ഇത് ചെയ്യാൻ തുടങ്ങുക',
    dashboardTitle: 'പുരോഗതി ഡാഷ്‌ബോർഡ്',
    timeReclaimedLabel: 'വീണ്ടെടുത്ത സമയം',
    breaksCompletedLabel: 'പൂർത്തിയാക്കിയ ഇടവേളകൾ',
    dailyGoalStatusLabel: 'ദൈനംദിന ലക്ഷ്യ നില',
    triggersChartTitle: 'എന്റെ സ്ക്രോളിംഗിന് കാരണമെന്ത്',
    weeklySummaryTitle: 'പ്രതിവാര സംഗ്രഹം (7 ദിവസങ്ങൾ)',
    loadDemoDataBtn: 'ഡെമോ ഡാറ്റ ലോഡ് ചെയ്യുക',
    clearAllDataBtn: 'എല്ലാ ഡാറ്റയും മായ്ക്കുക',
    familyChecklistTitle: 'Google Family Link ചെക്ക്‌ലിസ്റ്റ്',
    familyPactTitle: 'ഞങ്ങളുടെ കുടുംബ ഉടമ്പടി',
    familyTrustDisclaimer: 'RECLAIM മറ്റ് ആപ്പുകളെ തടയുകയോ നിരീക്ഷിക്കുകയോ നിയന്ത്രിക്കുകയോ ചെയ്യുന്നില്ല.',
  },
};

export interface ActivitySuggestion {
  activity: string;
  duration_minutes: number;
  why: string;
  isFallback?: boolean;
  fallbackMessage?: string;
}

export const CLIENT_FALLBACK_ACTIVITIES: ActivitySuggestion[] = [
  {
    activity: 'Step Outside & Skywatch',
    duration_minutes: 5,
    why: 'Looking toward the far horizon relaxes eye strain and grounds your attention in the natural world.',
  },
  {
    activity: 'Mindful Glass of Cool Water',
    duration_minutes: 3,
    why: 'Drinking water slowly without a screen resets your physical senses and interrupts the scrolling loop.',
  },
  {
    activity: '4-7-8 Calm Breath Reset',
    duration_minutes: 5,
    why: 'Inhaling for 4 seconds, holding for 7, and exhaling for 8 calms an overstimulated nervous system.',
  },
  {
    activity: 'Gentle Neck & Shoulder Release',
    duration_minutes: 5,
    why: 'Rolling your shoulders and stretching your neck relieves tension built up from looking down at a phone.',
  },
  {
    activity: 'Write Three Gratitudes on Paper',
    duration_minutes: 5,
    why: 'Using pen and paper reconnects you to tactile reality and shifts focus toward what feels meaningful.',
  },
  {
    activity: 'Water a Plant or Touch Nature',
    duration_minutes: 5,
    why: 'Caring for living greenery or stepping onto a balcony lowers stress and restores calm.',
  },
  {
    activity: 'Five-Minute Desk or Room Reset',
    duration_minutes: 5,
    why: 'Tidying one small surface gives your brain a clear, tangible sense of completion offline.',
  },
  {
    activity: 'Empty-Handed Short Walk',
    duration_minutes: 10,
    why: 'Walking for ten minutes without holding a device clears mental fog and restores natural curiosity.',
  },
  {
    activity: 'Listen to One Song with Eyes Closed',
    duration_minutes: 4,
    why: 'Resting your eyes while focusing purely on sound gives your visual cortex a restorative break.',
  },
  {
    activity: 'Check In with Someone at Home',
    duration_minutes: 10,
    why: 'A brief face-to-face conversation builds real warmth that endless feeds cannot replace.',
  },
];
