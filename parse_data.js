
const fs = require('fs');

const text = fs.readFileSync('derscalisma.txt', 'utf8');

const days = [];
const dayRegex = /\*\*Day (\d+) — ([^*]+)\*\*/g;
let match;

let lastIndex = 0;

while ((match = dayRegex.exec(text)) !== null) {
    if (days.length > 0) {
        days[days.length - 1].content = text.substring(lastIndex, match.index).trim();
    }
    days.push({
        dayNumber: parseInt(match[1]),
        date: match[2].trim(),
        content: ''
    });
    lastIndex = dayRegex.lastIndex;
}

if (days.length > 0) {
    days[days.length - 1].content = text.substring(lastIndex).trim();
}

const parsedDays = days.map(day => {
    const lines = day.content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const tasks = [];
    
    let currentSubject = '';
    
    lines.forEach(line => {
        if (line.includes(':')) {
            const [subject, description] = line.split(':');
            const sub = subject.trim();
            const desc = description.trim();
            
            if (sub === 'Soru' || sub === 'Revision' || sub === 'What you must have mastered today' || sub.startsWith('Day ') || sub.includes('mock')) {
                tasks.push({
                    type: sub,
                    text: desc
                });
            } else {
                tasks.push({
                    type: sub,
                    text: desc
                });
            }
        } else if (line.startsWith('Calculus mock') || line.startsWith('Physics mock') || line.startsWith('DLD mock')) {
             tasks.push({
                type: 'Mock',
                text: line
            });
        }
    });
    
    return {
        ...day,
        tasks
    };
});

fs.writeFileSync('src/data/ders_plani.json', JSON.stringify(parsedDays, null, 2));
console.log('Parsed', parsedDays.length, 'days');
