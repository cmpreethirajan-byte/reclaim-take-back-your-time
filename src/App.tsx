import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Leaf,
  Shield,
  User,
  Clock,
  PauseCircle,
  Sparkles,
  Mic,
  Square,
  Play,
  RotateCcw,
  Trash2,
  Edit3,
  BarChart3,
  CheckCircle2,
  HeartHandshake,
  Globe,
  Volume2,
  AlertCircle,
  Check,
  Plus,
  RefreshCw,
  Home,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  BUILTIN_TRANSLATIONS,
  CLIENT_FALLBACK_ACTIVITIES,
  SupportedLanguage,
  TranslationSchema,
  ActivitySuggestion,
} from './i18n';
import {
  VoiceRecordingRecord,
  getAllVoiceRecordings,
  saveVoiceRecording,
  deleteVoiceRecording,
  clearAllVoiceRecordings,
} from './voiceDb';

type TabView = 'welcome' | 'personal' | 'reflect' | 'coach' | 'dashboard' | 'family';
type MoodType = 'Bored' | 'Stressed' | 'Lonely' | 'Tired' | 'Just habit';
type SpeakerRole = 'Mom' | 'Dad' | 'Friend' | 'Teacher' | 'Me';

const SPEAKER_ROLES: SpeakerRole[] = ['Mom', 'Dad', 'Friend', 'Teacher', 'Me'];
const MOOD_LIST: MoodType[] = ['Bored', 'Stressed', 'Lonely', 'Tired', 'Just habit'];

interface DailyHistoryItem {
  day: string;
  minutesUsed: number;
  goalMinutes: number;
  reclaimedMinutes: number;
}

interface FamilyPactGoal {
  id: string;
  label: string;
  selected: boolean;
}

interface AppPersistentState {
  language: SupportedLanguage;
  dailyGoalMinutes: number;
  loggedMinutesToday: number;
  reclaimedMinutes: number;
  breaksCompleted: number;
  isSampleData: boolean;
  moodCounts: Record<MoodType, number>;
  weeklyHistory: DailyHistoryItem[];
  activeNudgeSpeaker: SpeakerRole;
  speakerCustomNames: Record<SpeakerRole, string>;
  familyLinkChecklist: Record<string, boolean>;
  familyPactGoals: FamilyPactGoal[];
  familyPactParentName: string;
  familyPactChildName: string;
  familyPactSignedAt: string | null;
}

const DEFAULT_WEEKLY_HISTORY: DailyHistoryItem[] = [
  { day: 'Mon', minutesUsed: 0, goalMinutes: 60, reclaimedMinutes: 0 },
  { day: 'Tue', minutesUsed: 0, goalMinutes: 60, reclaimedMinutes: 0 },
  { day: 'Wed', minutesUsed: 0, goalMinutes: 60, reclaimedMinutes: 0 },
  { day: 'Thu', minutesUsed: 0, goalMinutes: 60, reclaimedMinutes: 0 },
  { day: 'Fri', minutesUsed: 0, goalMinutes: 60, reclaimedMinutes: 0 },
  { day: 'Sat', minutesUsed: 0, goalMinutes: 60, reclaimedMinutes: 0 },
  { day: 'Sun', minutesUsed: 0, goalMinutes: 60, reclaimedMinutes: 0 },
];

const DEFAULT_FAMILY_PACT_GOALS: FamilyPactGoal[] = [
  { id: 'dinner', label: 'No phones at the dinner table or during family meals', selected: true },
  { id: 'schooldays', label: '1-hour recreational scrolling limit on school days', selected: true },
  { id: 'bedtime', label: 'Phones charge outside bedrooms 45 minutes before sleep', selected: true },
  { id: 'homework', label: 'Pause notifications and feeds during study or homework blocks', selected: false },
  { id: 'weekend_walk', label: 'One screen-free family outdoor walk or board game every weekend', selected: true },
  { id: 'ask_first', label: 'Talk together before installing new social or video apps', selected: false },
];

const FAMILY_LINK_STEPS = [
  {
    id: 'step_install',
    title: '1. Link parent and child accounts in Google Family Link',
    detail: 'Install the Google Family Link app on the parent device and connect your child’s Google account to manage settings safely.',
  },
  {
    id: 'step_daily_limit',
    title: '2. Set Daily Screen Time Limits for school days & weekends',
    detail: 'Open Controls → Daily limit to set an age-appropriate daily device cap (for example, 1 hour on school days).',
  },
  {
    id: 'step_bedtime',
    title: '3. Schedule Downtime & Bedtime lock',
    detail: 'Use Controls → Downtime so the phone rests overnight (e.g., 8:30 PM to 7:00 AM), protecting healthy sleep.',
  },
  {
    id: 'step_app_limits',
    title: '4. Configure per-app timers or block high-scroll apps',
    detail: 'Go to Controls → App limits to set specific time caps on short-form video or social feeds, or block apps that are not age-appropriate.',
  },
  {
    id: 'step_content_filters',
    title: '5. Enable Google Play & YouTube age restrictions',
    detail: 'Under Content restrictions → Google Play, require parent approval for new downloads and set age ratings for apps, games, and web browsing.',
  },
];

const INITIAL_STATE: AppPersistentState = {
  language: 'English',
  dailyGoalMinutes: 60,
  loggedMinutesToday: 20,
  reclaimedMinutes: 15,
  breaksCompleted: 2,
  isSampleData: false,
  moodCounts: {
    Bored: 2,
    Stressed: 1,
    Lonely: 0,
    Tired: 1,
    'Just habit': 3,
  },
  weeklyHistory: [
    { day: 'Mon', minutesUsed: 45, goalMinutes: 60, reclaimedMinutes: 15 },
    { day: 'Tue', minutesUsed: 55, goalMinutes: 60, reclaimedMinutes: 10 },
    { day: 'Wed', minutesUsed: 40, goalMinutes: 60, reclaimedMinutes: 20 },
    { day: 'Thu', minutesUsed: 50, goalMinutes: 60, reclaimedMinutes: 10 },
    { day: 'Fri', minutesUsed: 65, goalMinutes: 60, reclaimedMinutes: 5 },
    { day: 'Sat', minutesUsed: 35, goalMinutes: 60, reclaimedMinutes: 25 },
    { day: 'Sun', minutesUsed: 20, goalMinutes: 60, reclaimedMinutes: 15 },
  ],
  activeNudgeSpeaker: 'Mom',
  speakerCustomNames: {
    Mom: 'Mom',
    Dad: 'Dad',
    Friend: 'Friend',
    Teacher: 'Teacher',
    Me: 'Me',
  },
  familyLinkChecklist: {
    step_install: true,
    step_daily_limit: false,
    step_bedtime: false,
    step_app_limits: false,
    step_content_filters: false,
  },
  familyPactGoals: DEFAULT_FAMILY_PACT_GOALS,
  familyPactParentName: '',
  familyPactChildName: '',
  familyPactSignedAt: null,
};

const STORAGE_KEY = 'reclaim_app_state_v2';
const TRANSLATION_CACHE_KEY = 'reclaim_dynamic_i18n_cache_v1';

export default function App() {
  const [state, setState] = useState<AppPersistentState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          moodCounts: { ...INITIAL_STATE.moodCounts, ...(parsed.moodCounts || {}) },
          speakerCustomNames: {
            ...INITIAL_STATE.speakerCustomNames,
            ...(parsed.speakerCustomNames || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Failed to read localStorage:', e);
    }
    return INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<TabView>('welcome');
  const [t, setT] = useState<TranslationSchema>(
    BUILTIN_TRANSLATIONS[state.language] || BUILTIN_TRANSLATIONS.English
  );
  const [isTranslatingUI, setIsTranslatingUI] = useState(false);

  // Personal Mode Goal & Logging UI State
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(state.dailyGoalMinutes));
  const [customMinutesInput, setCustomMinutesInput] = useState('');
  const [availableTimeInput, setAvailableTimeInput] = useState(10);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Pause and Reflect 3-Step State
  const [reflectStep, setReflectStep] = useState<1 | 2 | 3>(1);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [isReflectLoading, setIsReflectLoading] = useState(false);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState<number | null>(null);

  // AI Activity Coach State
  const [coachSuggestion, setCoachSuggestion] = useState<ActivitySuggestion | null>(null);
  const [isCoachLoading, setIsCoachLoading] = useState(false);

  // Voice Nudges State (IndexedDB + MediaRecorder)
  const [recordings, setRecordings] = useState<Record<string, VoiceRecordingRecord>>({});
  const [selectedRecorderRole, setSelectedRecorderRole] = useState<SpeakerRole>('Mom');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [renamingRole, setRenamingRole] = useState<SpeakerRole | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [playingRole, setPlayingRole] = useState<string | null>(null);

  // Family Pact custom item & confirmation state
  const [newPactText, setNewPactText] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
  }, [state]);

  // Show temporary banner helper
  const showNotice = useCallback((msg: string) => {
    setStatusBanner(msg);
    window.setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  // Load voice recordings from IndexedDB on mount
  const refreshVoiceRecordings = useCallback(async () => {
    const list = await getAllVoiceRecordings();
    const map: Record<string, VoiceRecordingRecord> = {};
    for (const item of list) {
      map[item.id] = item;
    }
    setRecordings(map);
  }, []);

  useEffect(() => {
    refreshVoiceRecordings();
  }, [refreshVoiceRecordings]);

  // Handle UI Language changes (Built-in for 6 languages, Gemini server translation for the other 7)
  useEffect(() => {
    const lang = state.language;
    if (BUILTIN_TRANSLATIONS[lang]) {
      setT(BUILTIN_TRANSLATIONS[lang]!);
      setIsTranslatingUI(false);
      return;
    }

    // Check cached dynamic translations first
    try {
      const cachedRaw = localStorage.getItem(TRANSLATION_CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached[lang]) {
          setT({ ...BUILTIN_TRANSLATIONS.English, ...cached[lang] });
          return;
        }
      }
    } catch {
      // ignore cache parse errors
    }

    let cancelled = false;
    setIsTranslatingUI(true);

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texts: BUILTIN_TRANSLATIONS.English,
        targetLang: lang,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data && data.translatedTexts && typeof data.translatedTexts === 'object') {
          const merged = { ...BUILTIN_TRANSLATIONS.English, ...data.translatedTexts };
          setT(merged);
          try {
            const cachedRaw = localStorage.getItem(TRANSLATION_CACHE_KEY);
            const cached = cachedRaw ? JSON.parse(cachedRaw) : {};
            cached[lang] = data.translatedTexts;
            localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cached));
          } catch {
            // ignore storage quota errors
          }
        } else {
          setT(BUILTIN_TRANSLATIONS.English);
        }
      })
      .catch(() => {
        if (!cancelled) setT(BUILTIN_TRANSLATIONS.English);
      })
      .finally(() => {
        if (!cancelled) setIsTranslatingUI(false);
      });

    return () => {
      cancelled = true;
    };
  }, [state.language]);

  // 5-Minute Break Countdown Timer
  useEffect(() => {
    if (breakSecondsLeft === null) return;
    if (breakSecondsLeft <= 0) {
      setBreakSecondsLeft(null);
      setState((prev) => ({
        ...prev,
        breaksCompleted: prev.breaksCompleted + 1,
        reclaimedMinutes: prev.reclaimedMinutes + 5,
        isSampleData: false,
      }));
      showNotice('5-minute break completed! +5 minutes reclaimed.');
      setActiveTab('personal');
      return;
    }
    const timer = window.setTimeout(() => {
      setBreakSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [breakSecondsLeft, showNotice]);

  // Helper to get time of day label
  const getTimeOfDay = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'morning';
    if (hr < 17) return 'afternoon';
    if (hr < 21) return 'evening';
    return 'late night';
  };

  // Update Daily Goal
  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(goalInput, 10);
    if (!isNaN(parsed) && parsed >= 5 && parsed <= 720) {
      setState((prev) => ({
        ...prev,
        dailyGoalMinutes: parsed,
        isSampleData: false,
      }));
      setIsEditingGoal(false);
      showNotice(`Daily scrolling goal updated to ${parsed} minutes.`);
    }
  };

  // Manually Log Scrolling Time
  const handleLogMinutes = (minutesToAdd: number) => {
    if (minutesToAdd <= 0 || isNaN(minutesToAdd)) return;
    setState((prev) => {
      const updatedToday = prev.loggedMinutesToday + minutesToAdd;
      const updatedWeekly = prev.weeklyHistory.map((item, idx) =>
        idx === prev.weeklyHistory.length - 1
          ? { ...item, minutesUsed: updatedToday, goalMinutes: prev.dailyGoalMinutes }
          : item
      );
      return {
        ...prev,
        loggedMinutesToday: updatedToday,
        weeklyHistory: updatedWeekly,
        isSampleData: false,
      };
    });
    setCustomMinutesInput('');
    showNotice(`Logged +${minutesToAdd} mins of scrolling time (Entered by you).`);
  };

  // Start Pause and Reflect Flow
  const startPauseAndReflect = () => {
    setReflectStep(1);
    setSelectedMood(null);
    setReflectionText('');
    setBreakSecondsLeft(null);
    setActiveTab('reflect');
  };

  // Step 1 -> Step 2: Select Mood & Call Server Gemini Reflection
  const handleSelectMood = async (mood: MoodType) => {
    setSelectedMood(mood);
    setReflectStep(2);
    setIsReflectLoading(true);

    // Log mood trigger immediately for dashboard chart
    setState((prev) => ({
      ...prev,
      isSampleData: false,
      moodCounts: {
        ...prev.moodCounts,
        [mood]: (prev.moodCounts[mood] || 0) + 1,
      },
    }));

    try {
      const response = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          timeOfDay: getTimeOfDay(),
          goalMinutes: state.dailyGoalMinutes,
          loggedMinutes: state.loggedMinutesToday,
          language: state.language,
        }),
      });
      const data = await response.json();
      setReflectionText(
        data.reflection ||
          `Pausing when feeling ${mood.toLowerCase()} is already a mindful choice. Take a slow breath and decide what feels restorative right now.`
      );
    } catch {
      setReflectionText(
        `It is completely natural to scroll when feeling ${mood.toLowerCase()}. You have used ${state.loggedMinutesToday} of your ${state.dailyGoalMinutes}-minute goal—pausing right now puts you back in control.`
      );
    } finally {
      setIsReflectLoading(false);
    }
  };

  // Fetch AI Activity Coach suggestion from server
  const fetchCoachSuggestion = useCallback(
    async (currentActivityTitle = '') => {
      setIsCoachLoading(true);
      try {
        const res = await fetch('/api/activity-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalMinutes: state.dailyGoalMinutes,
            loggedMinutes: state.loggedMinutesToday,
            availableMinutes: availableTimeInput,
            language: state.language,
            previousActivity: currentActivityTitle,
          }),
        });
        const data = await res.json();
        if (data && data.activity) {
          setCoachSuggestion(data);
        } else {
          throw new Error('Invalid coach payload');
        }
      } catch {
        const fallbackPool = CLIENT_FALLBACK_ACTIVITIES.filter(
          (a) => a.activity !== currentActivityTitle
        );
        const randomItem =
          fallbackPool[Math.floor(Math.random() * fallbackPool.length)] ||
          CLIENT_FALLBACK_ACTIVITIES[0];
        setCoachSuggestion({
          ...randomItem,
          isFallback: true,
          fallbackMessage:
            'Showing a suggestion from our built-in list of 10 offline activities.',
        });
      } finally {
        setIsCoachLoading(false);
      }
    },
    [state.dailyGoalMinutes, state.loggedMinutesToday, availableTimeInput, state.language]
  );

  const openCoachTab = () => {
    setActiveTab('coach');
    if (!coachSuggestion) {
      fetchCoachSuggestion('');
    }
  };

  const handleCompleteCoachActivity = () => {
    const mins = coachSuggestion?.duration_minutes || 5;
    setState((prev) => ({
      ...prev,
      reclaimedMinutes: prev.reclaimedMinutes + mins,
      breaksCompleted: prev.breaksCompleted + 1,
      isSampleData: false,
    }));
    showNotice(`Wonderful! Reclaimed +${mins} minutes with "${coachSuggestion?.activity}".`);
    setActiveTab('dashboard');
  };

  // Voice Recording via Browser MediaRecorder + IndexedDB
  const startRecording = async (role: SpeakerRole) => {
    setMicError(null);
    setSelectedRecorderRole(role);

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia ||
      typeof window.MediaRecorder === 'undefined'
    ) {
      setMicError(
        'Microphone recording is not supported on this browser. You can still use our built-in text reminders below.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const startedAt = Date.now();
      setRecordingSeconds(0);
      setIsRecording(true);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (recordTimerRef.current) {
          clearInterval(recordTimerRef.current);
          recordTimerRef.current = null;
        }
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());

        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const elapsed = Math.min(30, Math.max(1, Math.round((Date.now() - startedAt) / 1000)));

        const record: VoiceRecordingRecord = {
          id: role,
          role,
          customLabel: state.speakerCustomNames[role] || role,
          blob,
          mimeType,
          durationSeconds: elapsed,
          updatedAt: new Date().toISOString(),
        };

        await saveVoiceRecording(record);
        await refreshVoiceRecordings();
        setState((prev) => ({ ...prev, activeNudgeSpeaker: role }));
        showNotice(
          `Saved ${state.speakerCustomNames[role] || role}'s voice nudge on this device.`
        );
      };

      recorder.start();

      recordTimerRef.current = window.setInterval(() => {
        const secs = Math.floor((Date.now() - startedAt) / 1000);
        setRecordingSeconds(secs);
        if (secs >= 30 && mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 250);
    } catch (err: any) {
      setIsRecording(false);
      if (
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.message?.toLowerCase().includes('permission')
      ) {
        setMicError(
          'Microphone permission was denied. Please allow microphone access in your browser address bar if you want to record a voice nudge, or use the text reminder instead.'
        );
      } else {
        setMicError(
          'Could not access your microphone right now. A friendly text reminder will be shown whenever you pass your goal.'
        );
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const playRecording = (role: SpeakerRole) => {
    const rec = recordings[role];
    if (!rec || !rec.blob) return;

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const url = URL.createObjectURL(rec.blob);
    const audio = new Audio(url);
    audioPlayerRef.current = audio;
    setPlayingRole(role);

    audio.onended = () => {
      setPlayingRole(null);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      setPlayingRole(null);
      URL.revokeObjectURL(url);
    };
    audio.play().catch(() => {
      setPlayingRole(null);
    });
  };

  const handleDeleteVoice = async (role: SpeakerRole) => {
    await deleteVoiceRecording(role);
    await refreshVoiceRecordings();
    showNotice(`Deleted voice recording for ${state.speakerCustomNames[role] || role}.`);
  };

  const handleSaveRenameSpeaker = async (role: SpeakerRole) => {
    const trimmed = renameInput.trim();
    if (!trimmed) {
      setRenamingRole(null);
      return;
    }
    setState((prev) => ({
      ...prev,
      speakerCustomNames: {
        ...prev.speakerCustomNames,
        [role]: trimmed,
      },
    }));
    const existing = recordings[role];
    if (existing) {
      await saveVoiceRecording({ ...existing, customLabel: trimmed });
      await refreshVoiceRecordings();
    }
    setRenamingRole(null);
    setRenameInput('');
  };

  // Load 7-Day Demo Data ("Sample data")
  const handleLoadDemoData = () => {
    setState((prev) => ({
      ...prev,
      dailyGoalMinutes: 60,
      loggedMinutesToday: 45,
      reclaimedMinutes: 115,
      breaksCompleted: 14,
      isSampleData: true,
      moodCounts: {
        Bored: 9,
        Stressed: 6,
        Lonely: 3,
        Tired: 5,
        'Just habit': 12,
      },
      weeklyHistory: [
        { day: 'Mon', minutesUsed: 58, goalMinutes: 60, reclaimedMinutes: 15 },
        { day: 'Tue', minutesUsed: 50, goalMinutes: 60, reclaimedMinutes: 20 },
        { day: 'Wed', minutesUsed: 68, goalMinutes: 60, reclaimedMinutes: 10 },
        { day: 'Thu', minutesUsed: 42, goalMinutes: 60, reclaimedMinutes: 20 },
        { day: 'Fri', minutesUsed: 55, goalMinutes: 60, reclaimedMinutes: 15 },
        { day: 'Sat', minutesUsed: 48, goalMinutes: 60, reclaimedMinutes: 20 },
        { day: 'Sun', minutesUsed: 45, goalMinutes: 60, reclaimedMinutes: 15 },
      ],
    }));
    showNotice('Loaded 7 days of sample usage labelled "Sample data".');
  };

  // Clear All Data
  const handleClearAllData = async () => {
    await clearAllVoiceRecordings();
    await refreshVoiceRecordings();
    setState({
      ...INITIAL_STATE,
      language: state.language,
      loggedMinutesToday: 0,
      reclaimedMinutes: 0,
      breaksCompleted: 0,
      isSampleData: false,
      moodCounts: {
        Bored: 0,
        Stressed: 0,
        Lonely: 0,
        Tired: 0,
        'Just habit': 0,
      },
      weeklyHistory: DEFAULT_WEEKLY_HISTORY,
      familyPactSignedAt: null,
    });
    setConfirmClearOpen(false);
    showNotice('Cleared all usage logs, mood triggers, and voice recordings from this device.');
  };

  // Reusable Voice Nudge Alert Card ("A message from Mom")
  const renderVoiceNudgePromptCard = (contextReason: 'over_goal' | 'pause_reflect') => {
    const activeRole = state.activeNudgeSpeaker;
    const displayName = state.speakerCustomNames[activeRole] || activeRole;
    const activeRec = recordings[activeRole];

    return (
      <div className="bg-[#f4efe4] border border-[#d8ceb8] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1f3f30] text-[#fbf8f2] flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#162c21]">
                {t.messageFromPrefix} {displayName}
              </h3>
              <p className="text-xs text-[#4f5d54]">
                {contextReason === 'over_goal'
                  ? 'Logged scrolling time has passed your daily goal.'
                  : 'Listen to a familiar voice while you pause and reflect.'}
              </p>
            </div>
          </div>

          {/* Choose whose message plays */}
          <div className="flex items-center gap-2">
            <label htmlFor={`nudge-speaker-${contextReason}`} className="text-xs font-medium text-[#4f5d54]">
              {t.selectPersonLabel}
            </label>
            <select
              id={`nudge-speaker-${contextReason}`}
              value={activeRole}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  activeNudgeSpeaker: e.target.value as SpeakerRole,
                }))
              }
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white border border-[#d8ceb8] text-sm font-semibold text-[#162c21]"
            >
              {SPEAKER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {state.speakerCustomNames[role] || role}
                  {recordings[role] ? ' (Recorded)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeRec ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-3.5 border border-[#e4dcce]">
            <div className="text-sm text-[#162c21]">
              <span className="font-semibold">{displayName}’s voice nudge</span>
              <span className="mx-2 text-[#8c968e]">·</span>
              <span className="font-mono-num text-xs text-[#4f5d54]">
                {activeRec.durationSeconds}s on-device audio
              </span>
            </div>
            <button
              type="button"
              onClick={() => playRecording(activeRole)}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#1f3f30] hover:bg-[#162c21] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {playingRole === activeRole ? 'Playing...' : `${t.playBtn} ${displayName}'s Message`}
              </span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4 border border-[#e4dcce] space-y-2">
            <p className="text-sm font-medium text-[#162c21] leading-relaxed">
              {t.suggestedLineText}
            </p>
            <p className="text-xs text-[#4f5d54]">{t.noRecordingReminder}</p>
          </div>
        )}
      </div>
    );
  };

  // Calculations for Progress Bar & Dashboard
  const goalMinutes = Math.max(1, state.dailyGoalMinutes);
  const usedMinutes = state.loggedMinutesToday;
  const usagePercent = Math.min(100, Math.round((usedMinutes / goalMinutes) * 100));
  const isOverGoal = usedMinutes >= goalMinutes;
  const dataOriginLabel = state.isSampleData ? t.sampleData : t.enteredByYou;

  const totalMoodLogs = MOOD_LIST.reduce((acc, m) => acc + (state.moodCounts[m] || 0), 0);
  const maxMoodCount = Math.max(1, ...MOOD_LIST.map((m) => state.moodCounts[m] || 0));
  const weeklyAverageMinutes = Math.round(
    state.weeklyHistory.reduce((acc, d) => acc + d.minutesUsed, 0) /
      Math.max(1, state.weeklyHistory.length)
  );
  const maxWeeklyMinutes = Math.max(
    state.dailyGoalMinutes,
    90,
    ...state.weeklyHistory.map((d) => d.minutesUsed)
  );

  const moodLabelMap: Record<MoodType, string> = {
    Bored: t.moodBored,
    Stressed: t.moodStressed,
    Lonely: t.moodLonely,
    Tired: t.moodTired,
    'Just habit': t.moodHabit,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8f2] text-[#162c21] pb-20 lg:pb-0">
      {/* Top Bar following 3-zone structure */}
      <header className="sticky top-0 z-30 bg-[#162c21] text-[#fbf8f2] border-b border-[#295541]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => setActiveTab('welcome')}
            className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 cursor-pointer focus:outline-none"
          >
            <Leaf className="w-5 h-5 text-[#8fd4b0]" />
            <span className="font-display font-bold text-lg tracking-tight">RECLAIM</span>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#d5e6dc]">
            <button
              type="button"
              onClick={() => setActiveTab('welcome')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'welcome'
                  ? 'text-white underline underline-offset-4'
                  : 'hover:text-white'
              }`}
            >
              {t.navHome}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'personal'
                  ? 'text-white underline underline-offset-4'
                  : 'hover:text-white'
              }`}
            >
              {t.navPersonal}
            </button>
            <button
              type="button"
              onClick={startPauseAndReflect}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'reflect'
                  ? 'text-white underline underline-offset-4'
                  : 'hover:text-white'
              }`}
            >
              {t.navPause}
            </button>
            <button
              type="button"
              onClick={openCoachTab}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'coach'
                  ? 'text-white underline underline-offset-4'
                  : 'hover:text-white'
              }`}
            >
              {t.navCoach}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-white underline underline-offset-4'
                  : 'hover:text-white'
              }`}
            >
              {t.navDashboard}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('family')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'family'
                  ? 'text-white underline underline-offset-4'
                  : 'hover:text-white'
              }`}
            >
              {t.navFamily}
            </button>
          </nav>

          {/* Zone 3: Language Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-4 h-4 text-[#8fd4b0] hidden sm:inline" />
            <select
              aria-label="Select Language"
              value={state.language}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  language: e.target.value as SupportedLanguage,
                }))
              }
              className="min-h-[38px] bg-[#1f3f30] text-[#fbf8f2] border border-[#376f55] rounded-xl px-2.5 py-1 text-xs sm:text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8fd4b0]"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Status / Feedback Toast Banner */}
        {statusBanner && (
          <div
            role="status"
            className="bg-[#1f3f30] text-[#fbf8f2] px-4 py-3 rounded-2xl text-sm font-medium flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8fd4b0] shrink-0" />
              <span>{statusBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-xs underline text-[#d5e6dc] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {isTranslatingUI && (
          <div className="bg-[#f3ede2] border border-[#e4dcce] px-4 py-2.5 rounded-xl text-xs text-[#4f5d54] flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#295541]" />
            <span>Translating interface into {state.language} via Gemini...</span>
          </div>
        )}

        {/* ==================== 1. WELCOME SCREEN ==================== */}
        {activeTab === 'welcome' && (
          <section className="space-y-6">
            <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 sm:p-10 shadow-xs">
              <div className="max-w-2xl space-y-4">
                <div className="text-xs font-medium text-[#295541] tracking-wide">
                  Sustainability & Social Impact · Digital Wellbeing
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#162c21] leading-tight">
                  {t.appTitle}
                </h1>
                <p className="text-base sm:text-lg text-[#4f5d54] leading-relaxed">
                  {t.appSubtitle}
                </p>
              </div>

              {/* Two Core Mode Options: Personal Mode and Family Shield */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                {/* Option 1: Personal Mode */}
                <button
                  type="button"
                  onClick={() => setActiveTab('personal')}
                  className="group text-left bg-[#fbf8f2] hover:bg-[#f3ede2] border-2 border-[#d8ceb8] hover:border-[#295541] rounded-3xl p-6 transition-all flex flex-col justify-between gap-5 min-h-[210px] cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f3f30] text-[#fbf8f2] flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-[#162c21]">{t.personalMode}</h2>
                    <p className="text-sm text-[#4f5d54] leading-relaxed">{t.personalModeDesc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#e4dcce] text-sm font-semibold text-[#1f3f30]">
                    <span>Open {t.personalMode}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>

                {/* Option 2: Family Shield */}
                <button
                  type="button"
                  onClick={() => setActiveTab('family')}
                  className="group text-left bg-[#fbf8f2] hover:bg-[#f3ede2] border-2 border-[#d8ceb8] hover:border-[#295541] rounded-3xl p-6 transition-all flex flex-col justify-between gap-5 min-h-[210px] cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#295541] text-[#fbf8f2] flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-[#162c21]">{t.familyShield}</h2>
                    <p className="text-sm text-[#4f5d54] leading-relaxed">{t.familyShieldDesc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#e4dcce] text-sm font-semibold text-[#1f3f30]">
                    <span>Open {t.familyShield}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Access Bar for Pause & Reflect, AI Coach, and Progress Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={startPauseAndReflect}
                className="min-h-[60px] bg-[#1f3f30] hover:bg-[#162c21] text-white rounded-2xl px-5 py-4 font-semibold text-base flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer"
              >
                <PauseCircle className="w-5 h-5 text-[#8fd4b0]" />
                <span>{t.pauseAndReflectBtn}</span>
              </button>
              <button
                type="button"
                onClick={openCoachTab}
                className="min-h-[60px] bg-white hover:bg-[#f3ede2] text-[#162c21] border border-[#d8ceb8] rounded-2xl px-5 py-4 font-semibold text-base flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#295541]" />
                <span>{t.aiActivityCoachBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="min-h-[60px] bg-white hover:bg-[#f3ede2] text-[#162c21] border border-[#d8ceb8] rounded-2xl px-5 py-4 font-semibold text-base flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer"
              >
                <BarChart3 className="w-5 h-5 text-[#295541]" />
                <span>{t.dashboardTitle}</span>
              </button>
            </div>
          </section>
        )}

        {/* ==================== 2. PERSONAL MODE (& VOICE NUDGES) ==================== */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Goal, Progress Bar, Manual Logging, Pause & Coach Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Show Voice Nudge Card automatically when logged time passes daily goal */}
              {isOverGoal && renderVoiceNudgePromptCard('over_goal')}

              <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#4f5d54] font-medium">
                      {dataOriginLabel} · Local Storage
                    </div>
                    <h2 className="text-2xl font-bold text-[#162c21] mt-0.5">
                      {t.dailyGoalTitle}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setGoalInput(String(state.dailyGoalMinutes));
                      setIsEditingGoal((prev) => !prev);
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#f3ede2] hover:bg-[#e8dfd0] text-[#162c21] text-sm font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{t.editGoal}</span>
                  </button>
                </div>

                {/* Inline Daily Goal Editor */}
                {isEditingGoal && (
                  <form
                    onSubmit={handleSaveGoal}
                    className="bg-[#fbf8f2] border border-[#d8ceb8] rounded-2xl p-4 space-y-3"
                  >
                    <label className="block text-sm font-semibold text-[#162c21]">
                      Set daily scrolling goal (minutes):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[30, 45, 60, 90, 120].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setGoalInput(String(preset))}
                          className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                            goalInput === String(preset)
                              ? 'bg-[#1f3f30] text-white'
                              : 'bg-white border border-[#d8ceb8] text-[#162c21]'
                          }`}
                        >
                          {preset} mins
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={5}
                        max={720}
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        className="min-h-[48px] flex-1 bg-white border border-[#d8ceb8] rounded-xl px-4 text-base font-mono-num"
                      />
                      <button
                        type="submit"
                        className="min-h-[48px] px-6 rounded-xl bg-[#1f3f30] text-white font-semibold text-sm cursor-pointer"
                      >
                        {t.saveGoal}
                      </button>
                    </div>
                  </form>
                )}

                {/* Progress Bar of Time Used vs Goal */}
                <div className="space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div className="text-base font-semibold text-[#162c21]">
                      <span className="font-mono-num text-2xl font-bold">{usedMinutes}</span>{' '}
                      <span className="text-sm text-[#4f5d54]">
                        {t.minutesUsedOfGoal} {goalMinutes} mins
                      </span>
                    </div>
                    <span className="font-mono-num text-sm font-bold text-[#1f3f30]">
                      {usagePercent}%
                    </span>
                  </div>

                  <div
                    role="progressbar"
                    aria-valuenow={usedMinutes}
                    aria-valuemin={0}
                    aria-valuemax={goalMinutes}
                    className="w-full h-4 bg-[#f3ede2] rounded-full overflow-hidden border border-[#e4dcce]"
                  >
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isOverGoal
                          ? 'bg-[#c45a36]'
                          : usagePercent >= 80
                          ? 'bg-[#c5832b]'
                          : 'bg-[#295541]'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>

                  <p className="text-xs text-[#4f5d54]">{t.noRealTrackingNote}</p>
                </div>

                {/* Manual Time Logging Controls */}
                <div className="pt-3 border-t border-[#e4dcce] space-y-3">
                  <h3 className="text-sm font-bold text-[#162c21]">{t.logScrollingTitle}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[5, 10, 15, 30].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => handleLogMinutes(mins)}
                        className="min-h-[48px] rounded-xl bg-[#fbf8f2] hover:bg-[#f3ede2] border border-[#d8ceb8] font-mono-num font-semibold text-sm text-[#162c21] transition-colors cursor-pointer"
                      >
                        +{mins} min
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = parseInt(customMinutesInput, 10);
                      if (!isNaN(val) && val > 0) handleLogMinutes(val);
                    }}
                    className="flex gap-2.5"
                  >
                    <input
                      type="number"
                      min={1}
                      max={360}
                      placeholder={t.customMinutesPlaceholder}
                      value={customMinutesInput}
                      onChange={(e) => setCustomMinutesInput(e.target.value)}
                      className="min-h-[48px] flex-1 bg-[#fbf8f2] border border-[#d8ceb8] rounded-xl px-4 text-sm font-mono-num"
                    />
                    <button
                      type="submit"
                      className="min-h-[48px] px-5 rounded-xl bg-[#295541] hover:bg-[#1f3f30] text-white font-semibold text-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.addMinutesBtn}</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Primary Action Buttons: Pause and Reflect + AI Activity Coach */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={startPauseAndReflect}
                  className="min-h-[56px] rounded-2xl bg-[#1f3f30] hover:bg-[#162c21] text-white font-semibold text-base px-5 py-4 flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
                >
                  <PauseCircle className="w-5 h-5 text-[#8fd4b0]" />
                  <span>{t.pauseAndReflectBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={openCoachTab}
                  className="min-h-[56px] rounded-2xl bg-[#295541] hover:bg-[#1f3f30] text-white font-semibold text-base px-5 py-4 flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-[#f3ede2]" />
                  <span>{t.aiActivityCoachBtn}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Voice Nudges Studio (IndexedDB + MediaRecorder) */}
            <div className="lg:col-span-5 bg-white border border-[#e4dcce] rounded-3xl p-6 space-y-5 shadow-xs">
              <div className="space-y-1">
                <div className="text-xs text-[#295541] font-medium">
                  IndexedDB · On-Device Audio
                </div>
                <h2 className="text-xl font-bold text-[#162c21] flex items-center gap-2">
                  <Mic className="w-5 h-5 text-[#295541]" />
                  <span>{t.voiceNudgesTitle}</span>
                </h2>
                <p className="text-xs text-[#4f5d54] leading-relaxed">{t.voicePrivacyNote}</p>
              </div>

              {/* Suggested Line to Read Aloud */}
              <div className="bg-[#fbf8f2] border border-[#e4dcce] rounded-2xl p-4 space-y-1.5">
                <div className="text-xs font-semibold text-[#4f5d54]">{t.suggestedLineLabel}</div>
                <p className="text-sm font-medium text-[#162c21] italic leading-relaxed">
                  {t.suggestedLineText}
                </p>
              </div>

              {/* Microphone Permission / Unsupported Friendly Notice */}
              {micError && (
                <div className="bg-[#fdf3ec] border border-[#e5b899] rounded-2xl p-3.5 text-xs text-[#7c3715] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{micError}</span>
                </div>
              )}

              {/* Active Recording Controls */}
              <div className="bg-[#f3ede2] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="recorder-role-select" className="text-xs font-semibold text-[#162c21]">
                    {t.selectPersonLabel}
                  </label>
                  <select
                    id="recorder-role-select"
                    disabled={isRecording}
                    value={selectedRecorderRole}
                    onChange={(e) => setSelectedRecorderRole(e.target.value as SpeakerRole)}
                    className="min-h-[40px] bg-white border border-[#d8ceb8] rounded-xl px-3 py-1.5 text-sm font-semibold text-[#162c21]"
                  >
                    {SPEAKER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {state.speakerCustomNames[role] || role}
                      </option>
                    ))}
                  </select>
                </div>

                {!isRecording ? (
                  <button
                    type="button"
                    onClick={() => startRecording(selectedRecorderRole)}
                    className="w-full min-h-[48px] rounded-xl bg-[#1f3f30] hover:bg-[#162c21] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>
                      {recordings[selectedRecorderRole] ? t.reRecordBtn : t.recordBtn} (
                      {state.speakerCustomNames[selectedRecorderRole] || selectedRecorderRole})
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-full min-h-[48px] rounded-xl bg-[#c45a36] hover:bg-[#a64828] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>
                      {t.stopRecordingBtn} ({recordingSeconds}s / 30s)
                    </span>
                  </button>
                )}
              </div>

              {/* List of 5 Speaker Slots (Mom, Dad, Friend, Teacher, Me) */}
              <div className="space-y-2.5">
                {SPEAKER_ROLES.map((role) => {
                  const rec = recordings[role];
                  const customName = state.speakerCustomNames[role] || role;
                  const isRenaming = renamingRole === role;

                  return (
                    <div
                      key={role}
                      className="bg-[#fbf8f2] border border-[#e4dcce] rounded-2xl p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-sm text-[#162c21]">{customName}</span>
                          <span className="mx-1.5 text-[#8c968e]">·</span>
                          <span className="text-xs text-[#4f5d54]">
                            {rec ? `${rec.durationSeconds}s saved` : 'No recording yet'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {rec && (
                            <button
                              type="button"
                              onClick={() => playRecording(role)}
                              title={t.playBtn}
                              className="min-h-[40px] px-3 rounded-xl bg-[#1f3f30] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{playingRole === role ? '...' : t.playBtn}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => startRecording(role)}
                            disabled={isRecording}
                            title={rec ? t.reRecordBtn : t.recordBtn}
                            className="min-h-[40px] px-2.5 rounded-xl bg-white border border-[#d8ceb8] text-[#162c21] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                              {rec ? t.reRecordBtn : 'Record'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRenamingRole(role);
                              setRenameInput(customName);
                            }}
                            title={t.renameBtn}
                            className="min-h-[40px] min-w-[40px] rounded-xl bg-white border border-[#d8ceb8] text-[#162c21] flex items-center justify-center cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {rec && (
                            <button
                              type="button"
                              onClick={() => handleDeleteVoice(role)}
                              title={t.deleteBtn}
                              className="min-h-[40px] min-w-[40px] rounded-xl bg-white border border-[#e5b899] text-[#c45a36] flex items-center justify-center cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {isRenaming && (
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            placeholder="Custom speaker name"
                            className="min-h-[40px] flex-1 bg-white border border-[#d8ceb8] rounded-xl px-3 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRenameSpeaker(role)}
                            className="min-h-[40px] px-3 rounded-xl bg-[#1f3f30] text-white text-xs font-semibold cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setRenamingRole(null)}
                            className="min-h-[40px] px-3 rounded-xl bg-white border border-[#d8ceb8] text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. PAUSE AND REFLECT (3 STEPS) ==================== */}
        {activeTab === 'reflect' && (
          <section className="max-w-2xl mx-auto space-y-6">
            {/* Always show the Voice Nudge card ("A message from Mom") when Pause and Reflect is tapped */}
            {renderVoiceNudgePromptCard('pause_reflect')}

            {/* Step Indicator */}
            <div className="flex items-center justify-between text-xs font-semibold text-[#4f5d54] px-1">
              <span className={reflectStep >= 1 ? 'text-[#162c21] font-bold' : ''}>
                01. Check In
              </span>
              <span>·</span>
              <span className={reflectStep >= 2 ? 'text-[#162c21] font-bold' : ''}>
                02. Gemini Reflection
              </span>
              <span>·</span>
              <span className={reflectStep >= 3 ? 'text-[#162c21] font-bold' : ''}>
                03. Conscious Choice
              </span>
            </div>

            {/* Step 1: How are you feeling right now? */}
            {reflectStep === 1 && (
              <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#295541]">Step 1 of 3</div>
                  <h2 className="text-2xl font-bold text-[#162c21]">{t.step1Question}</h2>
                  <p className="text-sm text-[#4f5d54]">
                    Tap what feels closest right now. Each check-in builds your personal triggers chart.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOOD_LIST.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => handleSelectMood(mood)}
                      className={`min-h-[56px] px-5 py-4 rounded-2xl border-2 border-[#d8ceb8] hover:border-[#1f3f30] bg-[#fbf8f2] hover:bg-[#f3ede2] text-left font-semibold text-base text-[#162c21] flex items-center justify-between transition-all cursor-pointer ${
                        mood === 'Just habit' ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <span>{moodLabelMap[mood]}</span>
                      <span className="text-xs font-mono-num text-[#4f5d54]">
                        Logged {state.moodCounts[mood] || 0}×
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Gemini Short, Kind Reflection */}
            {reflectStep === 2 && (
              <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#295541]">
                    Step 2 of 3 · {selectedMood ? moodLabelMap[selectedMood] : ''}
                  </div>
                  <h2 className="text-2xl font-bold text-[#162c21]">{t.step2Title}</h2>
                </div>

                {isReflectLoading ? (
                  <div className="py-10 flex flex-col items-center justify-center gap-3 text-sm text-[#4f5d54]">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#295541]" />
                    <span>Gemini is crafting a kind reflection for you...</span>
                  </div>
                ) : (
                  <div className="bg-[#fbf8f2] border border-[#d8ceb8] rounded-2xl p-5 sm:p-6">
                    <p className="text-lg text-[#162c21] leading-relaxed font-medium">
                      “{reflectionText}”
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isReflectLoading}
                    onClick={() => setReflectStep(3)}
                    className="min-h-[52px] w-full sm:w-auto px-8 rounded-2xl bg-[#1f3f30] hover:bg-[#162c21] text-white font-semibold text-base cursor-pointer disabled:opacity-50"
                  >
                    Next: Choose Your Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Choose Continue, Take a 5-minute break, or Try an activity */}
            {reflectStep === 3 && (
              <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#295541]">Step 3 of 3</div>
                  <h2 className="text-2xl font-bold text-[#162c21]">{t.step3Title}</h2>
                  <p className="text-sm text-[#4f5d54]">
                    Your reflection is complete. Choose what supports your wellbeing right now:
                  </p>
                </div>

                {breakSecondsLeft !== null ? (
                  <div className="bg-[#f4efe4] border border-[#d8ceb8] rounded-2xl p-6 text-center space-y-4">
                    <div className="text-xs font-semibold text-[#295541] uppercase tracking-wider">
                      5-Minute Restorative Break
                    </div>
                    <div className="font-mono-num text-4xl sm:text-5xl font-bold text-[#162c21]">
                      {String(Math.floor(breakSecondsLeft / 60)).padStart(2, '0')}:
                      {String(breakSecondsLeft % 60).padStart(2, '0')}
                    </div>
                    <p className="text-sm text-[#4f5d54] max-w-md mx-auto">
                      Rest your eyes from the screen, relax your shoulders, and take slow breaths.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBreakSecondsLeft(0)}
                      className="min-h-[48px] px-6 rounded-xl bg-[#1f3f30] text-white font-semibold text-sm cursor-pointer"
                    >
                      Complete Break & Log +5m Reclaimed
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setBreakSecondsLeft(300)}
                      className="min-h-[56px] px-6 py-4 rounded-2xl bg-[#1f3f30] hover:bg-[#162c21] text-white font-semibold text-base flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#8fd4b0]" />
                        <span>{t.take5BreakBtn}</span>
                      </span>
                      <span className="text-xs text-[#d5e6dc]">+5m reclaimed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('coach');
                        fetchCoachSuggestion('');
                      }}
                      className="min-h-[56px] px-6 py-4 rounded-2xl bg-[#295541] hover:bg-[#1f3f30] text-white font-semibold text-base flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-[#f3ede2]" />
                        <span>{t.tryActivityBtn}</span>
                      </span>
                      <span className="text-xs text-[#d5e6dc]">AI Activity Coach →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('personal')}
                      className="min-h-[52px] px-6 py-3.5 rounded-2xl bg-[#fbf8f2] hover:bg-[#f3ede2] border border-[#d8ceb8] text-[#162c21] font-semibold text-base flex items-center justify-center cursor-pointer"
                    >
                      {t.continueBtn}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ==================== 4. AI ACTIVITY COACH ==================== */}
        {activeTab === 'coach' && (
          <section className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-[#295541]">
                    {t.poweredByGemini} · Offline Ideas
                  </div>
                  <h2 className="text-2xl font-bold text-[#162c21] mt-0.5">{t.coachCardTitle}</h2>
                </div>

                {/* Available Time Selector */}
                <div className="flex items-center gap-2">
                  <label htmlFor="coach-avail-mins" className="text-xs font-medium text-[#4f5d54]">
                    Available time:
                  </label>
                  <select
                    id="coach-avail-mins"
                    value={availableTimeInput}
                    onChange={(e) => setAvailableTimeInput(Number(e.target.value))}
                    className="min-h-[40px] bg-[#fbf8f2] border border-[#d8ceb8] rounded-xl px-3 py-1.5 text-sm font-semibold text-[#162c21]"
                  >
                    <option value={5}>5 mins</option>
                    <option value={10}>10 mins</option>
                    <option value={15}>15 mins</option>
                    <option value={20}>20 mins</option>
                  </select>
                </div>
              </div>

              {isCoachLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-sm text-[#4f5d54]">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#295541]" />
                  <span>Asking Gemini for a restorative offline activity...</span>
                </div>
              ) : coachSuggestion ? (
                <div className="space-y-4">
                  <div className="bg-[#fbf8f2] border border-[#d8ceb8] rounded-2xl p-6 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-[#162c21]">
                        {coachSuggestion.activity}
                      </h3>
                      <span className="font-mono-num text-sm font-bold text-[#1f3f30] bg-[#e3ede7] px-3 py-1 rounded-xl">
                        {coachSuggestion.duration_minutes} {t.coachDurationUnit}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#e4dcce]">
                      <div className="text-xs font-semibold text-[#4f5d54] mb-1">
                        {t.coachWhyLabel}
                      </div>
                      <p className="text-base text-[#162c21] leading-relaxed">
                        {coachSuggestion.why}
                      </p>
                    </div>
                  </div>

                  {coachSuggestion.isFallback && (
                    <div className="bg-[#f4efe4] border border-[#d8ceb8] rounded-xl px-4 py-3 text-xs text-[#4f5d54]">
                      {coachSuggestion.fallbackMessage ||
                        'Picked from our built-in collection of 10 restorative activities.'}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCompleteCoachActivity}
                      className="min-h-[52px] rounded-2xl bg-[#1f3f30] hover:bg-[#162c21] text-white font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-5 h-5" />
                      <span>{t.doThisActivityBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fetchCoachSuggestion(coachSuggestion.activity)}
                      className="min-h-[52px] rounded-2xl bg-[#fbf8f2] hover:bg-[#f3ede2] border border-[#d8ceb8] text-[#162c21] font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>{t.regenerateBtn}</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}

        {/* ==================== 5. PROGRESS DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#295541]">
                  Data label: {dataOriginLabel}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#162c21]">
                  {t.dashboardTitle}
                </h2>
              </div>

              {/* Demo Data & Clear All Data Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleLoadDemoData}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#f3ede2] border border-[#d8ceb8] text-sm font-semibold text-[#162c21] cursor-pointer"
                >
                  {t.loadDemoDataBtn}
                </button>
                {!confirmClearOpen ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClearOpen(true)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#fdf3ec] border border-[#e5b899] text-sm font-semibold text-[#c45a36] cursor-pointer"
                  >
                    {t.clearAllDataBtn}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-[#fdf3ec] border border-[#e5b899] px-3 py-1.5 rounded-xl">
                    <span className="text-xs font-semibold text-[#7c3715]">Confirm clear?</span>
                    <button
                      type="button"
                      onClick={handleClearAllData}
                      className="min-h-[34px] px-3 rounded-lg bg-[#c45a36] text-white text-xs font-semibold cursor-pointer"
                    >
                      Yes, Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearOpen(false)}
                      className="min-h-[34px] px-2.5 rounded-lg bg-white text-xs font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3 Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#e4dcce] rounded-3xl p-5 space-y-1 shadow-xs">
                <div className="text-xs text-[#4f5d54]">
                  {t.timeReclaimedLabel} · {dataOriginLabel}
                </div>
                <div className="font-mono-num text-3xl font-bold text-[#1f3f30]">
                  {state.reclaimedMinutes} mins
                </div>
                <p className="text-xs text-[#4f5d54]">
                  From mindful breaks and offline coach activities
                </p>
              </div>

              <div className="bg-white border border-[#e4dcce] rounded-3xl p-5 space-y-1 shadow-xs">
                <div className="text-xs text-[#4f5d54]">
                  {t.breaksCompletedLabel} · {dataOriginLabel}
                </div>
                <div className="font-mono-num text-3xl font-bold text-[#1f3f30]">
                  {state.breaksCompleted}
                </div>
                <p className="text-xs text-[#4f5d54]">Conscious pauses taken instead of scrolling</p>
              </div>

              <div className="bg-white border border-[#e4dcce] rounded-3xl p-5 space-y-1 shadow-xs">
                <div className="text-xs text-[#4f5d54]">
                  {t.dailyGoalStatusLabel} · {dataOriginLabel}
                </div>
                <div className="font-mono-num text-3xl font-bold text-[#162c21]">
                  {usedMinutes} / {goalMinutes}m
                </div>
                <p className="text-xs text-[#4f5d54]">
                  {isOverGoal ? 'Over daily goal—time for a break' : 'Within your daily goal'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Triggers Bar Chart: "What triggers my scrolling" */}
              <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <div className="text-xs font-medium text-[#295541]">{dataOriginLabel}</div>
                    <h3 className="text-xl font-bold text-[#162c21]">{t.triggersChartTitle}</h3>
                  </div>
                  <span className="font-mono-num text-xs text-[#4f5d54]">
                    {totalMoodLogs} check-ins
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {MOOD_LIST.map((mood) => {
                    const count = state.moodCounts[mood] || 0;
                    const widthPct = totalMoodLogs > 0 ? Math.round((count / maxMoodCount) * 100) : 0;
                    return (
                      <div key={mood} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-[#162c21]">
                          <span>{moodLabelMap[mood]}</span>
                          <span className="font-mono-num">{count}</span>
                        </div>
                        <div className="w-full h-3.5 bg-[#f3ede2] rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-[#295541] rounded-lg transition-all duration-300"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Summary Card (7 Days) */}
              <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <div className="text-xs font-medium text-[#295541]">{dataOriginLabel}</div>
                    <h3 className="text-xl font-bold text-[#162c21]">{t.weeklySummaryTitle}</h3>
                  </div>
                  <span className="font-mono-num text-xs text-[#4f5d54]">
                    Avg {weeklyAverageMinutes}m / day
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 pb-1 border-b border-[#e4dcce]">
                  {state.weeklyHistory.map((item) => {
                    const barHeightPct = Math.min(
                      100,
                      Math.round((item.minutesUsed / maxWeeklyMinutes) * 100)
                    );
                    const exceeded = item.minutesUsed > item.goalMinutes;
                    return (
                      <div
                        key={item.day}
                        className="h-full flex flex-col items-center justify-end gap-1.5"
                      >
                        <span className="font-mono-num text-[11px] text-[#4f5d54]">
                          {item.minutesUsed}m
                        </span>
                        <div className="w-full max-w-[32px] flex-1 bg-[#f3ede2] rounded-t-lg flex items-end overflow-hidden">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 ${
                              exceeded ? 'bg-[#c5832b]' : 'bg-[#295541]'
                            }`}
                            style={{ height: `${barHeightPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#162c21]">{item.day}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-[#4f5d54]">
                  Green bars show days within your {state.dailyGoalMinutes}-minute goal. All metrics
                  are labelled <strong>{dataOriginLabel}</strong>.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ==================== 6. FAMILY SHIELD ==================== */}
        {activeTab === 'family' && (
          <section className="space-y-6">
            {/* Clear Trust Disclaimer Banner */}
            <div className="bg-[#f4efe4] border border-[#d8ceb8] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#295541]">
                  Transparent Family Boundaries
                </div>
                <h2 className="text-2xl font-bold text-[#162c21]">{t.familyShield}</h2>
                <p className="text-sm font-semibold text-[#162c21]">{t.familyTrustDisclaimer}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left: Parent-Friendly Google Family Link Checklist */}
              <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#295541]">
                    System-Level Parental Controls Guide
                  </div>
                  <h3 className="text-xl font-bold text-[#162c21]">{t.familyChecklistTitle}</h3>
                  <p className="text-xs text-[#4f5d54]">
                    Since RECLAIM does not block or monitor other apps, use Google Family Link for
                    device-level app access and age-appropriate restrictions:
                  </p>
                </div>

                <div className="space-y-3">
                  {FAMILY_LINK_STEPS.map((step) => {
                    const checked = !!state.familyLinkChecklist[step.id];
                    return (
                      <label
                        key={step.id}
                        className="flex items-start gap-3.5 bg-[#fbf8f2] hover:bg-[#f3ede2] border border-[#e4dcce] rounded-2xl p-4 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              familyLinkChecklist: {
                                ...prev.familyLinkChecklist,
                                [step.id]: e.target.checked,
                              },
                            }))
                          }
                          className="mt-1 w-5 h-5 accent-[#1f3f30] rounded shrink-0 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-[#162c21]">{step.title}</div>
                          <p className="text-xs text-[#4f5d54] leading-relaxed">{step.detail}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Right: Family Pact Screen (Parent & Child Shared Goals) */}
              <div className="bg-white border border-[#e4dcce] rounded-3xl p-6 space-y-5 shadow-xs">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#295541]">
                    Parent & Child Shared Agreement
                  </div>
                  <h3 className="text-xl font-bold text-[#162c21] flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-[#295541]" />
                    <span>{t.familyPactTitle}</span>
                  </h3>
                  <p className="text-xs text-[#4f5d54]">
                    Choose shared digital habits that both parent and child commit to following
                    together.
                  </p>
                </div>

                {/* Shared Goals List */}
                <div className="space-y-2.5">
                  {state.familyPactGoals.map((goal) => (
                    <label
                      key={goal.id}
                      className="flex items-center gap-3.5 bg-[#fbf8f2] hover:bg-[#f3ede2] border border-[#e4dcce] rounded-2xl p-3.5 min-h-[52px] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={goal.selected}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            familyPactGoals: prev.familyPactGoals.map((g) =>
                              g.id === goal.id ? { ...g, selected: e.target.checked } : g
                            ),
                          }))
                        }
                        className="w-5 h-5 accent-[#1f3f30] rounded shrink-0 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-[#162c21]">{goal.label}</span>
                    </label>
                  ))}
                </div>

                {/* Add Custom Shared Goal */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const trimmed = newPactText.trim();
                    if (!trimmed) return;
                    setState((prev) => ({
                      ...prev,
                      familyPactGoals: [
                        ...prev.familyPactGoals,
                        { id: `custom_${Date.now()}`, label: trimmed, selected: true },
                      ],
                    }));
                    setNewPactText('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newPactText}
                    onChange={(e) => setNewPactText(e.target.value)}
                    placeholder="Add your own family goal (e.g., No phones during Sunday breakfast)"
                    className="min-h-[48px] flex-1 bg-[#fbf8f2] border border-[#d8ceb8] rounded-xl px-3.5 text-sm"
                  />
                  <button
                    type="submit"
                    className="min-h-[48px] px-4 rounded-xl bg-[#295541] text-white text-sm font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </form>

                {/* Parent & Child Co-Sign Box */}
                <div className="bg-[#f4efe4] border border-[#d8ceb8] rounded-2xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Parent / Guardian name"
                      value={state.familyPactParentName}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, familyPactParentName: e.target.value }))
                      }
                      className="min-h-[44px] bg-white border border-[#d8ceb8] rounded-xl px-3.5 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Child / Teen name"
                      value={state.familyPactChildName}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, familyPactChildName: e.target.value }))
                      }
                      className="min-h-[44px] bg-white border border-[#d8ceb8] rounded-xl px-3.5 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const timestamp = new Date().toLocaleDateString();
                      setState((prev) => ({ ...prev, familyPactSignedAt: timestamp }));
                      showNotice('Family Pact saved on this device!');
                    }}
                    className="w-full min-h-[48px] rounded-xl bg-[#1f3f30] hover:bg-[#162c21] text-white font-semibold text-sm cursor-pointer"
                  >
                    Save Our Family Pact Together
                  </button>
                  {state.familyPactSignedAt && (
                    <p className="text-xs text-[#295541] font-semibold text-center">
                      Pact active on this device ({state.familyPactParentName || 'Parent'} &{' '}
                      {state.familyPactChildName || 'Child'} · {state.familyPactSignedAt})
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer with "Powered by Gemini" and Privacy Note */}
      <footer className="bg-[#f3ede2] border-t border-[#e4dcce] py-5 px-4 sm:px-6 text-center text-xs text-[#4f5d54] space-y-1.5">
        <div className="font-semibold text-[#162c21]">
          {t.poweredByGemini} · RECLAIM: Take Back Your Time
        </div>
        <p className="max-w-2xl mx-auto leading-relaxed">{t.privacyNote}</p>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e4dcce] grid grid-cols-5 h-16"
      >
        <button
          type="button"
          onClick={() => setActiveTab('welcome')}
          className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'welcome' ? 'text-[#1f3f30] font-bold' : 'text-[#57655d]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">{t.navHome}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'personal' ? 'text-[#1f3f30] font-bold' : 'text-[#57655d]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px]">{t.navPersonal}</span>
        </button>
        <button
          type="button"
          onClick={startPauseAndReflect}
          className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'reflect' ? 'text-[#1f3f30] font-bold' : 'text-[#57655d]'
          }`}
        >
          <PauseCircle className="w-5 h-5" />
          <span className="text-[11px]">{t.navPause}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'dashboard' ? 'text-[#1f3f30] font-bold' : 'text-[#57655d]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[11px]">{t.navDashboard}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('family')}
          className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'family' ? 'text-[#1f3f30] font-bold' : 'text-[#57655d]'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[11px]">{t.navFamily}</span>
        </button>
      </nav>
    </div>
  );
}
