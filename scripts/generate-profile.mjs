#!/usr/bin/env node
/**
 * GABSXK / Original, dependency-free GitHub profile SVG generator.
 * `node scripts/generate-profile.mjs --initial` creates zero-assumption placeholders.
 * `GITHUB_TOKEN=... node scripts/generate-profile.mjs` fetches public data from GitHub.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const ASSETS = resolve(ROOT, 'assets');
const USERNAME = process.env.PROFILE_USERNAME || 'Gabsxk';
const TOKEN = process.env.GITHUB_TOKEN;
const INITIAL = process.argv.includes('--initial');
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[char]));
const svgWrap = (width, height, body, title, description) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="svgTitle svgDesc">\n<title id="svgTitle">${esc(title)}</title>\n<desc id="svgDesc">${esc(description)}</desc>\n${body}\n</svg>\n`;

const themes = {
  dark: {
    base: '#080E1D', base2: '#101B31', card: '#14243A', line: '#29415A',
    text: '#F2F8FF', muted: '#8FA8BE', accent: '#64F0CC', second: '#B49BFF',
    graph: ['#182D43','#225C62','#298E85','#3BC0A5','#64F0CC'],
  },
  light: {
    base: '#F6F8FC', base2: '#E9F1F8', card: '#FFFFFF', line: '#CFDBE5',
    text: '#17273B', muted: '#5B7184', accent: '#007F78', second: '#6652C8',
    graph: ['#E2EAF1','#B9E4DA','#77CABA','#30A88F','#007F78'],
  },
};

const defs = (p, id) => `
<defs>
  <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${p.base}" />
    <stop offset="100%" stop-color="${p.base2}" />
  </linearGradient>
  <linearGradient id="accent-${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${p.accent}"/>
    <stop offset="100%" stop-color="${p.second}"/>
  </linearGradient>
  <radialGradient id="halo-${id}">
    <stop offset="0%" stop-color="${p.second}" stop-opacity="0.28"/>
    <stop offset="100%" stop-color="${p.second}" stop-opacity="0"/>
  </radialGradient>
  <pattern id="grid-${id}" width="32" height="32" patternUnits="userSpaceOnUse">
    <path d="M32 0H0V32" fill="none" stroke="${p.line}" stroke-width="1" opacity="0.35"/>
  </pattern>
</defs>`;

const text = (value, x, y, size, color, opts = '') =>
  `<text x="${x}" y="${y}" font-family="'DejaVu Sans',Arial,sans-serif" font-size="${size}" fill="${color}" ${opts}>${esc(value)}</text>`;

function renderHero(mode) {
  const p = themes[mode], id = `hero-${mode}`;
  const circuit = Array.from({ length: 13 }, (_, i) => {
    const y = 36 + i * 28;
    return `<path d="M760 ${y} H${820 + (i % 4) * 40}" stroke="${p.line}" stroke-width="1" opacity="0.55"/>`;
  }).join('\n');
  return svgWrap(1200, 390, `
${defs(p, id)}
<rect width="1200" height="390" rx="24" fill="url(#bg-${id})"/>
<rect width="1200" height="390" rx="24" fill="url(#grid-${id})" opacity="0.58"/>
<circle cx="980" cy="190" r="290" fill="url(#halo-${id})"/>
<path d="M0 358 H1200" stroke="${p.line}" opacity="0.7"/>
<path d="M44 36 H164" stroke="${p.accent}" stroke-width="4" stroke-linecap="round"/>
<circle cx="181" cy="36" r="4" fill="${p.accent}"><animate attributeName="opacity" values="0.25;1;0.25" dur="2.8s" repeatCount="indefinite"/></circle>
${text('GABSXK  /  PROFILE 001',44,70,15,p.muted,'font-weight="700" letter-spacing="2"')}
${text('GABSXK',41,195,116,p.text,'font-weight="800" letter-spacing="-4"')}
<rect x="45" y="221" width="71" height="4" rx="2" fill="url(#accent-${id})"/>
${text('ENGINEER',44,274,32,p.text,'font-weight="700" letter-spacing="4"')}
${text('×',256,274,29,p.accent,'font-weight="600"')}
${text('DEVELOPER',293,274,32,p.text,'font-weight="700" letter-spacing="3"')}
${text('FROM COMPLEX SYSTEMS TO USEFUL SOFTWARE',46,332,16,p.muted,'font-weight="600" letter-spacing="2"')}
${circuit}
<circle cx="987" cy="191" r="134" fill="none" stroke="${p.line}" stroke-width="2"/>
<circle cx="987" cy="191" r="104" fill="none" stroke="${p.second}" stroke-width="1.5" stroke-dasharray="4 10" opacity="0.7"/>
<circle cx="987" cy="191" r="81" fill="${p.card}" stroke="${p.line}" stroke-width="2"/>
<path d="M950 155 H1018 L1002 171 H972 V213 H1019 V196 H997 L1011 182 H1035 V229 H950 Z" fill="url(#accent-${id})" opacity="0.93"/>
<g>
  <circle cx="987" cy="191" r="134" fill="none" stroke="${p.accent}" stroke-width="4" stroke-dasharray="31 810" stroke-linecap="round">
    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 987 191" to="360 987 191" dur="24s" repeatCount="indefinite"/>
  </circle>
  <circle cx="987" cy="191" r="116" fill="none" stroke="${p.second}" stroke-width="3" stroke-dasharray="20 720" stroke-linecap="round">
    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="360 987 191" to="0 987 191" dur="19s" repeatCount="indefinite"/>
  </circle>
</g>
${text('DESIGN · SYSTEMS · DATA',880,353,12,p.muted,'font-weight="700" letter-spacing="1.5"')}
<rect width="1198" height="388" x="1" y="1" rx="23" fill="none" stroke="${p.line}" stroke-width="2"/>
`, `Gabsxk — Engineer and Developer`, 'An original animated technology-themed banner about engineering and software.');
}

function renderStats(mode, s = null) {
  const p = themes[mode], id = `stats-${mode}`;
  const vals = [
    ['PUBLIC REPOSITORIES', s?.publicRepos],
    ['STARS RECEIVED', s?.stars],
    ['CONTRIBUTIONS / YEAR', s?.contributions],
    ['FOLLOWERS', s?.followers],
  ];
  const cards = vals.map(([label, value], idx) => {
    const x = 43 + idx * 282;
    const display = Number.isFinite(value) ? value.toLocaleString('en-US') : '—';
    return `<rect x="${x}" y="104" width="266" height="127" rx="14" fill="${p.card}" stroke="${p.line}"/>
<path d="M${x+18} 125 h36" stroke="${idx % 2 ? p.second : p.accent}" stroke-width="4" stroke-linecap="round"/>
${text(display,x+18,192,49,p.text,'font-weight="800"')}
${text(label,x+18,217,12,p.muted,'font-weight="700" letter-spacing="1.1"')}`;
  }).join('\n');
  return svgWrap(1200, 270, `
${defs(p,id)}
<rect x="0.5" y="0.5" width="1199" height="269" rx="23" fill="url(#bg-${id})" stroke="${p.line}"/>
${text('05  /  THE GITHUB SIGNAL',43,48,20,p.text,'font-weight="700" letter-spacing="1"')}
<circle cx="1117" cy="41" r="5" fill="${p.accent}"><animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/></circle>
${text('DAILY SNAPSHOT',944,47,12,p.muted,'font-weight="700" letter-spacing="1"')}
<path d="M43 75 H1157" stroke="${p.line}"/>
${cards}
${text(s ? 'SOURCE: GITHUB PUBLIC API  /  RENDERED LOCALLY' : 'AWAITING FIRST GITHUB ACTIONS SYNC',44,254,11,p.muted,'font-weight="600" letter-spacing="1"')}
`, 'GitHub profile statistics', 'Four numerical metrics generated from public GitHub API data, refreshed daily.');
}

function renderActivity(mode, cal = null) {
  const p = themes[mode], id = `activity-${mode}`;
  const weeks = (cal?.weeks ?? []).slice(-54);
  const days = weeks.flatMap(w => w.contributionDays ?? []);
  const count = cal?.totalContributions;
  const active = days.filter(d => d.contributionCount > 0).length;
  const maxCount = days.reduce((max, d) => Math.max(max, Number(d.contributionCount) || 0), 0);
  const colored = weeks.length ? weeks.map((w,i) => (w.contributionDays || []).map(d => {
    const n = Math.max(0, Number(d.contributionCount) || 0);
    // Fixed, honest legend: no activity / 1 / 2-3 / 4-6 / 7+ contributions.
    const level = n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4;
    const weekday = Number(d.weekday);
    const x = 300 + i*15.6, y = 107 + weekday*17;
    return `<rect x="${x.toFixed(1)}" y="${y}" width="12" height="12" rx="3" fill="${p.graph[level]}"><title>${esc(d.date || 'Date unknown')}: ${n} contribution${n === 1 ? '' : 's'}</title></rect>`;
  }).join('')).join('') : '';
  const months = weeks.length ? weeks.map((w,i) => {
    const days = w.contributionDays || [];
    const day = days[0]?.date || w.firstDay;
    if (!day) return '';
    const dt = new Date(`${day}T12:00:00Z`);
    const previousDay = i ? (weeks[i-1].contributionDays?.[0]?.date || weeks[i-1].firstDay) : null;
    const previousDt = previousDay ? new Date(`${previousDay}T12:00:00Z`) : null;
    if (i !== 0 && previousDt && previousDt.getUTCMonth() === dt.getUTCMonth()) return '';
    return text(dt.toLocaleString('en-US',{month:'short',timeZone:'UTC'}).toUpperCase(),300+i*15.6,95,10,p.muted,'font-weight="700"');
  }).join('') : '';
  const squares = weeks.length ? colored : `<rect x="294" y="103" width="835" height="124" rx="10" fill="${p.card}" stroke="${p.line}" stroke-dasharray="6 8"/>
${text('Contribution grid appears after the first sync',360,170,19,p.muted,'font-weight="600"')}`;
  const legend = [0,1,2,3,4].map((i)=>`<rect x="${1019 + i*24}" y="252" width="14" height="14" rx="3" fill="${p.graph[i]}"/>`).join('');
  const start = days.length ? days[0].date : null;
  const end = days.length ? days[days.length-1].date : null;
  return svgWrap(1200,305, `
${defs(p,id)}
<rect x="0.5" y="0.5" width="1199" height="304" rx="23" fill="url(#bg-${id})" stroke="${p.line}"/>
${text('THE CONTRIBUTION TRAIL',44,48,20,p.text,'font-weight="700" letter-spacing="1"')}
${text(start && end ? `${start}  →  ${end}` : 'ROLLING 12 MONTHS',846,48,12,p.muted,'font-weight="700"')}
<path d="M44 71 H1156" stroke="${p.line}"/>
${text(Number.isFinite(count) ? count.toLocaleString('en-US') : '—',46,165,62,p.text,'font-weight="800"')}
${text('CONTRIBUTIONS',47,193,13,p.muted,'font-weight="700" letter-spacing="1.2"')}
${text(weeks.length ? String(active) : '—',47,249,28,p.accent,'font-weight="800"')}
${text('ACTIVE DAYS',100,249,12,p.muted,'font-weight="700" letter-spacing="1"')}
${months}
${squares}
${text('LESS',945,263,11,p.muted,'font-weight="700"')}
${legend}
${text('MORE',1138,263,11,p.muted,'font-weight="700"')}
<path d="M44 282 H1156" stroke="${p.line}"/>
${text(weeks.length ? 'GITHUB CONTRIBUTION CALENDAR  /  PUBLIC VISIBILITY' : 'WAITING FOR FIRST SYNC  /  GITHUB ACTIONS',45,297,10,p.muted,'font-weight="700" letter-spacing="0.8"')}
`, 'GitHub contribution calendar', `Original contribution heatmap from GitHub; ${weeks.length ? `${count} contributions and ${active} active days` : 'waiting for first sync'}.`);
}

async function ghFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'gabsxk-profile-svg-generator',
      'Authorization': `Bearer ${TOKEN}`,
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${url} — ${(await response.text()).slice(0, 300)}`);
  }
  return response.json();
}

async function getStats() {
  const login = encodeURIComponent(USERNAME);
  const profile = await ghFetch(`https://api.github.com/users/${login}`);
  const repoCount = Number(profile.public_repos);
  let stars = 0;
  const pages = Math.ceil(repoCount / 100);
  for (let i = 1; i <= pages; i++) {
    const repos = await ghFetch(`https://api.github.com/users/${login}/repos?type=owner&per_page=100&page=${i}`);
    if (!Array.isArray(repos)) throw new Error('Unexpected repositories API response');
    stars += repos.reduce((total, repo) => total + (Number(repo.stargazers_count) || 0), 0);
  }

  const now = new Date();
  const from = new Date(now);
  from.setUTCFullYear(now.getUTCFullYear() - 1);
  const query = `query($login:String!,$from:DateTime!,$to:DateTime!) {
    user(login:$login) {
      contributionsCollection(from:$from, to:$to) {
        contributionCalendar {
          totalContributions
          weeks { firstDay contributionDays { date weekday contributionCount } }
        }
      }
    }
  }`;
  const graph = await ghFetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ query, variables: { login: USERNAME, from: from.toISOString(), to: now.toISOString() } }),
  });
  if (graph.errors?.length) throw new Error(`GitHub GraphQL error: ${JSON.stringify(graph.errors)}`);
  const calendar = graph.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar || !Array.isArray(calendar.weeks)) throw new Error('GitHub GraphQL did not return a contribution calendar');
  return {
    stats: {
      publicRepos: repoCount,
      stars,
      contributions: calendar.totalContributions,
      followers: Number(profile.followers),
    },
    calendar,
  };
}

await mkdir(ASSETS,{recursive:true});
const data = INITIAL ? {stats:null,calendar:null} : await (async () => {
  if (!TOKEN) throw new Error('Missing GITHUB_TOKEN; use --initial for offline placeholder generation');
  return getStats();
})();
for (const mode of ['dark','light']) {
  await Promise.all([
    writeFile(resolve(ASSETS,`hero-${mode}.svg`),renderHero(mode),'utf8'),
    writeFile(resolve(ASSETS,`stats-${mode}.svg`),renderStats(mode,data.stats),'utf8'),
    writeFile(resolve(ASSETS,`activity-${mode}.svg`),renderActivity(mode,data.calendar),'utf8'),
  ]);
}
console.log(`Generated 6 SVGs for @${USERNAME}${INITIAL ? ' (initial placeholders)' : ' (GitHub public data)'}.`);
