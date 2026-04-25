"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Languages, 
  Calendar, 
  CheckCircle2, 
  Circle,
  Flame,
  Zap,
  Clock,
  LayoutDashboard,
  FileText
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import dersPlaniRaw from "@/data/ders_plani.json";
import { buildTasks, TRACKS, totalUnits, baseIdx, totalGrammarBefore } from "@/data/english_data";

// Type definitions
interface StudyTask {
  type: string;
  text: string;
}

interface StudyDay {
  dayNumber: number;
  date: string;
  tasks: StudyTask[];
}

const dersPlani = dersPlaniRaw as StudyDay[];

const START_DATE = new Date("2026-04-25T00:00:00");

export default function Home() {
  const [currentDayIdx, setCurrentDayIdx] = useState(0);
  const [doneTasks, setDoneTasks] = useLocalStorage<string[]>("done-tasks", []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-select today's day
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - START_DATE.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < dersPlani.length) {
      setCurrentDayIdx(diffDays);
    }
  }, []);

  const currentStudyDay = dersPlani[currentDayIdx];
  const englishTasks = useMemo(() => buildTasks(currentDayIdx, doneTasks), [currentDayIdx, doneTasks]);

  const toggleTask = (taskId: string) => {
    setDoneTasks((prev) => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const getProgress = () => {
    const totalDayTasks = currentStudyDay.tasks.length + englishTasks.length;
    const completedDayTasks = [
      ...currentStudyDay.tasks.map((_, i) => `study-${currentDayIdx}-${i}`),
      ...englishTasks.map(t => t.taskId)
    ].filter(id => doneTasks.includes(id)).length;
    
    return totalDayTasks > 0 ? (completedDayTasks / totalDayTasks) * 100 : 0;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen premium-bg text-white selection:bg-red-500/30">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center red-border-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter leading-none">FINAL</h1>
              <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase">Roadmap 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/full-program">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex border-white/10 hover:bg-white/5 gap-2"
              >
                <FileText className="w-4 h-4" />
                Tam Program
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - START_DATE.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays < dersPlani.length) {
                  setCurrentDayIdx(diffDays);
                }
              }}
              className="hidden sm:flex border-white/10 hover:bg-white/5"
            >
              Bugüne Git
            </Button>
            <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold">STREAK: 7</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCurrentDayIdx(Math.max(0, currentDayIdx - 1))}
                disabled={currentDayIdx === 0}
                className="hover:bg-red-500/10 hover:text-red-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="bg-white/5 px-4 py-1.5 rounded-lg border border-white/10 flex flex-col items-center min-w-[100px]">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">GÜN {currentDayIdx + 1}</span>
                <span className="text-xs font-bold">{currentStudyDay.date}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentDayIdx(Math.min(dersPlani.length - 1, currentDayIdx + 1))}
                disabled={currentDayIdx === dersPlani.length - 1}
                className="hover:bg-red-500/10 hover:text-red-500"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-3">
            <div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                Hoş Geldin, <span className="text-red-500">Umut</span>
              </h2>
              <p className="text-white/40 text-sm">Bugünkü hedeflerine ulaşmak için {currentStudyDay.tasks.length + englishTasks.length} görev seni bekliyor.</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-red-500 tracking-tighter">%{Math.round(getProgress())}</span>
              <p className="text-[10px] text-white/40 font-bold uppercase">Tamamlandı</p>
            </div>
          </div>
          <Progress value={getProgress()} className="h-3 bg-white/5 border border-white/10 overflow-hidden">
             <div className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-500" style={{ width: `${getProgress()}%` }} />
          </Progress>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Ders Çalışma */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <BookOpen className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Ders Çalışma</h3>
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Calculus • Physics • DLD</p>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDayIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {currentStudyDay.tasks.map((task, idx) => {
                    const taskId = `study-${currentDayIdx}-${idx}`;
                    const isCompleted = doneTasks.includes(taskId);
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => toggleTask(taskId)}
                        className={`premium-card p-5 rounded-2xl cursor-pointer group flex items-start gap-4 transition-all duration-300 ${isCompleted ? 'opacity-40 grayscale-[0.5]' : 'hover:scale-[1.01]'}`}
                      >
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-white/20 group-hover:text-red-500 transition-colors" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-green-500' : 'text-red-500'}`}>
                              {task.type}
                            </span>
                          </div>
                          <p className={`text-sm leading-relaxed ${isCompleted ? 'line-through text-white/30' : 'text-white/90'}`}>
                            {task.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: İngilizce Çalışma */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Languages className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">İngilizce Çalışma</h3>
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Oxford • Grammar • 4000 Words</p>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDayIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {englishTasks.map((task) => {
                    const isCompleted = task.completed;
                    const T = task.T;
                    
                    if (!task.unit) return (
                       <div key={task.rawTrack} className="premium-card p-5 rounded-2xl opacity-60 border-blue-500/20 text-center">
                          <p className="text-sm font-bold text-blue-400">✅ {T.label} tamamlandı!</p>
                       </div>
                    );

                    return (
                      <div 
                        key={task.taskId}
                        onClick={() => toggleTask(task.taskId)}
                        className={`premium-card p-5 rounded-2xl cursor-pointer group flex items-start gap-4 transition-all duration-300 ${isCompleted ? 'opacity-40 grayscale-[0.5]' : 'hover:scale-[1.01]'}`}
                      >
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-white/20 group-hover:text-blue-500 transition-colors" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{T.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                              {T.label}
                            </span>
                            {task.bonus && (
                               <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-[8px] h-4 px-1.5 border-none font-bold">BONUS</Badge>
                            )}
                          </div>
                          <p className={`text-sm font-bold mb-1 ${isCompleted ? 'line-through text-white/30' : 'text-white/90'}`}>
                            {task.unit.title}
                          </p>
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className="text-[9px] border-white/10 text-white/40">{task.unit.book}</Badge>
                             <Badge variant="outline" className="text-[9px] border-white/10 text-white/40">{task.unit.cat}</Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Stats Card */}
              <Card className="bg-white/5 border-white/10 mt-8">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-widest text-white/40">Genel İlerleme</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {Object.entries(TRACKS).map(([key, T]) => {
                    const total = totalUnits(key as any);
                    const cur = key === 'grammar'
                      ? Math.min(totalGrammarBefore(currentDayIdx), total)
                      : Math.min(baseIdx(key as any, currentDayIdx), total);
                    const p = (cur / total) * 100;
                    
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-white/60">{T.label}</span>
                          <span>{cur}/{total}</span>
                        </div>
                        <Progress value={p} className="h-1 bg-white/5" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 text-center">
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
          Umut Yalçın • Final Roadmap • 2026
        </p>
      </footer>
    </div>
  );
}
