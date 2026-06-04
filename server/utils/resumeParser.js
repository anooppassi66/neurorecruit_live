'use strict';

// ─── Patterns ────────────────────────────────────────────────────────────────

const RE = {
  email:     /[\w.+%-]+@[\w-]+\.[a-zA-Z]{2,}/,
  phone:     /(\+?\d[\d\s\-.()]{6,}\d)/,
  linkedin:  /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w%-]+\/?/i,
  github:    /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+\/?/i,
  url:       /https?:\/\/[^\s,)>"']+/gi,
  dateRange: /(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?\.?)\s+\d{2,4}|\d{1,2}\/\d{2,4}|\d{4})\s*[-–—to]+\s*(?:present|current|now|(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?\.?)\s+\d{2,4}|\d{1,2}\/\d{2,4}|\d{4})/gi,
  yearRange: /\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now)/gi,
  dob:       /(?:date\s*of\s*birth|d\.?o\.?b\.?|born)[:\s]+([^\n,]+)/i,
  gpa:       /(?:gpa|cgpa|grade)[:\s]+(\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?)/i,
  degree:    /\b(bachelor(?:'s)?|master(?:'s)?|ph\.?d\.?|doctorate|diploma|associate|b\.?sc\.?|m\.?sc\.?|b\.?e(?:ng)?\.?|m\.?e(?:ng)?\.?|b\.?a\.?|m\.?a\.?|m\.?b\.?a\.?|m\.?tech\.?|b\.?tech\.?|hnd|hnc)\b/i,
  coursework: /relevant\s+course\s*work|courses?\s*:|coursework\s*:/i,
  bullet:    /^[•–—\-\*>]\s*/,
};

// Known section header keywords
const SECTION_MAP = {
  summary:     /^(?:professional\s+)?(?:summary|objective|profile|about\s+me|career\s+(?:summary|objective)|personal\s+statement|overview)\s*:?$/i,
  experience:  /^(?:work\s+)?(?:experience|employment|career|history|positions?\s+held|professional\s+experience|work\s+history|internships?)\s*:?$/i,
  education:   /^(?:education(?:al)?(?:\s+background)?|academic(?:\s+(?:background|qualifications?))?|qualifications?)\s*:?$/i,
  skills:      /^(?:skills?|technical\s+skills?|core\s+(?:skills?|competenc(?:y|ies))|competenc(?:y|ies)|expertise|technologies|tools?\s+&?\s+technologies?|programming\s+languages?)\s*:?$/i,
  projects:    /^(?:(?:key|personal|side|open[-\s]source)?\s*projects?|portfolio|github\s+projects?)\s*:?$/i,
  languages:   /^(?:languages?(?:\s+skills?)?|spoken\s+languages?|language\s+proficiency)\s*:?$/i,
  certifications: /^(?:certifications?|licen[sc]es?|credentials?|professional\s+development|courses?\s+&\s+certifications?)\s*:?$/i,
  references:  /^references?\s*(?:available\s+upon\s+request)?\s*:?$/i,
};

const DESIGN_TOOLS = new Set([
  'figma','sketch','adobe xd','adobe illustrator','adobe photoshop','illustrator',
  'photoshop','indesign','affinity designer','affinity photo','invision','zeplin',
  'principle','framer','protopie','canva','marvel','balsamiq','axure','miro','whimsical',
]);

const SOFT_SKILLS = new Set([
  'leadership','communication','teamwork','collaboration','problem solving','critical thinking',
  'time management','adaptability','creativity','presentation','negotiation','mentoring',
  'coaching','empathy','conflict resolution','decision making','multitasking','organisation',
  'organization','attention to detail','project management','stakeholder management',
  'customer service','interpersonal','analytical','research','planning','strategic thinking',
  'self-motivated','motivated','initiative','flexible','flexibility','agile','scrum',
  'kanban','detail-oriented',
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function firstMatch(text, re) {
  const m = text.match(re);
  return m ? m[0].trim() : null;
}

function cleanBullet(line) {
  return line.replace(RE.bullet, '').trim();
}

function isContactLine(line) {
  return RE.email.test(line) || RE.phone.test(line) ||
    /linkedin|github/i.test(line) || /^https?:\/\//i.test(line) ||
    /^[\w.+%-]+@/.test(line);
}

function isSectionHeader(line, trimmed) {
  // Must be short
  if (trimmed.length > 60) return null;
  // Check map
  for (const [key, re] of Object.entries(SECTION_MAP)) {
    if (re.test(trimmed)) return key;
  }
  // ALL CAPS short line that isn't a date
  if (/^[A-Z\s&/]+$/.test(trimmed) && trimmed.length > 3 && !/^\d/.test(trimmed)) {
    const lower = trimmed.toLowerCase().trim();
    for (const [key, re] of Object.entries(SECTION_MAP)) {
      if (re.test(lower)) return key;
    }
  }
  return null;
}

// ─── Section splitter ─────────────────────────────────────────────────────────

function splitSections(lines) {
  const sections = { _header: [] };
  let current = '_header';

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const sectionKey = isSectionHeader(raw, trimmed);
    if (sectionKey) {
      if (!sections[sectionKey]) sections[sectionKey] = [];
      current = sectionKey;
    } else {
      if (!sections[current]) sections[current] = [];
      sections[current].push(trimmed);
    }
  }
  return sections;
}

// ─── Field extractors ─────────────────────────────────────────────────────────

function extractEmail(text) {
  return firstMatch(text, RE.email);
}

function extractPhone(text) {
  const m = text.match(RE.phone);
  if (!m) return null;
  // Filter out things that look like years or zip codes
  const raw = m[0].replace(/\s+/g, ' ').trim();
  return raw.replace(/\D+$/, '').trim();
}

function extractLinkedIn(text) {
  const m = text.match(RE.linkedin);
  return m ? m[0].replace(/\/$/, '') : null;
}

function extractGitHub(text) {
  const m = text.match(RE.github);
  return m ? m[0].replace(/\/$/, '') : null;
}

function extractPortfolio(text, githubUrl) {
  // Find URLs that aren't linkedin or github
  const urls = [];
  let m;
  const urlRe = new RegExp(RE.url.source, 'gi');
  while ((m = urlRe.exec(text)) !== null) {
    const url = m[0];
    if (!/linkedin\.com|github\.com/i.test(url)) {
      urls.push(url.replace(/[.,;)'"]+$/, ''));
    }
  }
  return urls[0] || null;
}

function extractName(headerLines, email, phone) {
  for (const line of headerLines.slice(0, 6)) {
    if (!line) continue;
    if (isContactLine(line)) continue;
    // Should have at least 2 words starting with capitals
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length < 2 || words.length > 6) continue;
    if (words.every(w => /^[A-ZÀÁÂÄÃÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÖÕØÙÚÛÜÝ]/.test(w) || /^(van|de|der|del|al|el|bin|binti)$/i.test(w))) {
      return words.join(' ');
    }
  }
  // Fallback: first non-contact, non-empty short line
  for (const line of headerLines.slice(0, 4)) {
    if (!line || isContactLine(line)) continue;
    if (line.length < 50 && /[A-Za-z]/.test(line)) return line;
  }
  return null;
}

function extractHeadline(headerLines, fullName) {
  let pastName = !fullName;
  for (const line of headerLines.slice(0, 8)) {
    if (!pastName) {
      if (fullName && line.includes(fullName.split(' ')[0])) { pastName = true; continue; }
      continue;
    }
    if (isContactLine(line)) continue;
    if (line.length < 5 || line.length > 100) continue;
    // Skip lines that look like addresses or locations only
    if (/^\d/.test(line)) continue;
    return line;
  }
  return null;
}

function extractLocation(text, headerLines) {
  // Pattern: City, ST or City, Country
  const locRe = /\b([A-Z][a-zA-Z\s]+),\s+([A-Z]{2}|[A-Z][a-zA-Z\s]{2,})\b/;
  for (const line of headerLines.slice(0, 10)) {
    if (isContactLine(line)) continue;
    const m = line.match(locRe);
    if (m && !/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(m[1])) {
      return m[0];
    }
  }
  // Fallback: search globally
  const m = text.match(locRe);
  return m ? m[0] : null;
}

function extractDOB(text) {
  const m = text.match(RE.dob);
  if (!m) return null;
  const raw = m[1].trim();
  // Try to parse as a date
  const d = new Date(raw);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return raw;
}

// ─── Section parsers ──────────────────────────────────────────────────────────

function parseSummary(lines) {
  if (!lines || lines.length === 0) return null;
  return lines.map(cleanBullet).join(' ').trim() || null;
}

function classifySkill(skill) {
  const lower = skill.toLowerCase().trim();
  if (DESIGN_TOOLS.has(lower) || [...DESIGN_TOOLS].some(d => lower.includes(d))) return 'design';
  if (SOFT_SKILLS.has(lower) || [...SOFT_SKILLS].some(s => lower.includes(s))) return 'soft';
  return 'technical';
}

function parseSkills(lines) {
  const designTools = [], technicalSkills = [], softSkills = [];
  if (!lines || lines.length === 0) return { designTools, technicalSkills, softSkills };

  const raw = lines.join('\n');

  // Split on commas, bullets, pipes, semicolons, newlines
  const items = raw
    .split(/[,•|\n;\/•–—]+/)
    .map(s => s.replace(RE.bullet, '').replace(/[^\w\s.+#@()\-]/g, '').trim())
    .filter(s => s.length > 1 && s.length < 50);

  for (const item of items) {
    // Skip if it looks like a category label
    if (/^(technical|design|soft|hard|other|programming|languages?|frameworks?|tools?|platforms?|databases?)$/i.test(item)) continue;
    const cat = classifySkill(item);
    if (cat === 'design') designTools.push(item);
    else if (cat === 'soft') softSkills.push(item);
    else technicalSkills.push(item);
  }

  return { designTools, technicalSkills, softSkills };
}

function parseLanguages(lines) {
  if (!lines || lines.length === 0) return [];
  const proficiencyRe = /\b(native|fluent|professional|conversational|basic|elementary|beginner|intermediate|advanced|mother\s+tongue|bilingual|limited|full\s+professional|working)\b/i;
  const results = [];

  for (const line of lines) {
    const clean = cleanBullet(line);
    if (!clean) continue;

    // "English - Native" or "English (Native)" or "English: Fluent"
    const m = clean.match(/^([A-Za-z\s]+?)\s*[-–:(]\s*(.+)$/);
    if (m) {
      const lang = m[1].trim();
      const prof = m[2].replace(/[()]/g, '').trim();
      if (lang.length < 30) {
        results.push({ language: lang, proficiency: prof });
        continue;
      }
    }

    // "Native English" or "Fluent in Spanish"
    const m2 = clean.match(new RegExp(`${proficiencyRe.source}\\s+(?:in\\s+)?([A-Za-z]+)`, 'i'));
    if (m2) {
      results.push({ language: m2[2] || m2[3], proficiency: m2[1] });
      continue;
    }

    // Plain language name
    if (clean.match(/^[A-Z][a-z]+$/) && clean.length < 25) {
      results.push({ language: clean, proficiency: '' });
    }
  }

  return results;
}

function extractDateRange(line) {
  let m = line.match(new RegExp(RE.dateRange.source, 'i'));
  if (m) return m[0];
  m = line.match(new RegExp(RE.yearRange.source, 'i'));
  return m ? m[0] : null;
}

function parseExperience(lines) {
  if (!lines || lines.length === 0) return [];

  const entries = [];
  let current = null;
  let desc = [];

  const flush = () => {
    if (!current) return;
    current.summary = desc.map(cleanBullet).join(' ').trim();
    if (current.role || current.company) entries.push(current);
    current = null;
    desc = [];
  };

  for (const line of lines) {
    const dateRange = extractDateRange(line);
    const lineWithoutDate = dateRange ? line.replace(dateRange, '').replace(/[|\-–—,]+$/, '').trim() : line.trim();
    const isBullet = RE.bullet.test(line);
    const isShortHeader = !isBullet && lineWithoutDate.length > 0 && lineWithoutDate.length < 80;

    if (dateRange) {
      // Line contains a date range — treat as entry boundary or part of existing entry
      if (current) {
        if (!current.duration) {
          current.duration = dateRange;
          // remainder of line may be title or company
          if (lineWithoutDate && !current.role) current.role = lineWithoutDate;
        } else {
          flush();
          current = { role: lineWithoutDate || '', company: '', location: '', duration: dateRange, summary: '' };
        }
      } else {
        current = { role: lineWithoutDate || '', company: '', location: '', duration: dateRange, summary: '' };
      }
    } else if (isBullet) {
      if (!current && entries.length > 0) {
        // Bullet after a flushed entry — append to last
        entries[entries.length - 1].summary += ' ' + cleanBullet(line);
      } else {
        desc.push(line);
      }
    } else if (current && isShortHeader && !isContactLine(line)) {
      // Non-bullet, non-date short line inside an entry: likely title or company
      if (!current.role) {
        current.role = line.trim();
      } else if (!current.company) {
        // Might be company or location
        const locPattern = /^[A-Z][a-zA-Z\s]+,\s+[A-Z]/;
        if (locPattern.test(line) && !current.location) {
          current.location = line.trim();
        } else {
          current.company = line.trim();
        }
      } else {
        desc.push(line);
      }
    } else if (current) {
      desc.push(line);
    } else if (isShortHeader && !isContactLine(line)) {
      // Start of an entry without a date yet
      flush();
      current = { role: line.trim(), company: '', location: '', duration: '', summary: '' };
    }
  }
  flush();

  return entries;
}

function parseEducation(lines) {
  if (!lines || lines.length === 0) return [];

  const entries = [];
  let current = null;

  const flush = () => {
    if (current && (current.degree || current.institution)) entries.push(current);
    current = null;
  };

  for (const line of lines) {
    const hasDegree = RE.degree.test(line);
    const dateRange = extractDateRange(line);
    const hasGPA = RE.gpa.test(line);
    const isBullet = RE.bullet.test(line);
    const isCoursework = RE.coursework.test(line);
    const clean = cleanBullet(line);

    if (hasDegree) {
      flush();
      current = {
        degree: clean,
        institution: '',
        duration: dateRange || '',
        gpa: '',
        coursework: '',
      };
      if (dateRange) current.degree = current.degree.replace(dateRange, '').trim();
    } else if (current) {
      if (dateRange && !current.duration) {
        current.duration = dateRange;
      } else if (hasGPA) {
        const m = line.match(RE.gpa);
        if (m) current.gpa = m[1];
      } else if (isCoursework) {
        current.coursework = clean.replace(RE.coursework, '').trim();
      } else if (!isBullet && clean.length > 2 && !current.institution && !dateRange) {
        current.institution = clean;
      } else if (isBullet && isCoursework) {
        current.coursework += (current.coursework ? ', ' : '') + clean;
      }
    } else if (dateRange || clean.match(/^[A-Z]/)) {
      flush();
      current = {
        degree: '',
        institution: clean,
        duration: dateRange || '',
        gpa: '',
        coursework: '',
      };
    }
  }
  flush();

  return entries;
}

function parseProjects(lines) {
  if (!lines || lines.length === 0) return [];

  const entries = [];
  let current = null;
  let desc = [];

  const flush = () => {
    if (!current) return;
    current.description = desc.map(cleanBullet).join(' ').trim();
    if (current.title) entries.push(current);
    current = null;
    desc = [];
  };

  for (const line of lines) {
    const isBullet = RE.bullet.test(line);
    const clean = line.trim();
    const isGithub = RE.github.test(clean);
    const isUrl = /^https?:\/\//i.test(clean);

    // Extract tags from "(React, Node.js)" patterns
    const tagMatch = clean.match(/\(([^)]{3,})\)/);
    const tags = tagMatch
      ? tagMatch[1].split(/[,|\/]/).map(t => t.trim()).filter(t => t.length > 1 && t.length < 25)
      : [];

    if (isGithub) {
      const url = firstMatch(clean, /https?:\/\/[^\s,)]+/) || `https://${clean}`;
      if (current) current.githubLink = url.replace(/\/$/, '');
      continue;
    }

    if (isUrl) {
      if (current) current.liveLink = clean.replace(/[.,;)]+$/, '');
      continue;
    }

    if (isBullet) {
      if (current) {
        if (tags.length) current.tags.push(...tags);
        desc.push(clean);
      }
      continue;
    }

    // Non-bullet, non-URL — likely a project title (short) or description line
    if (clean.length > 0 && clean.length < 80 && /^[A-Z]/.test(clean) && !extractDateRange(clean)) {
      // Could be a new project title
      if (!current || desc.length > 0 || current.description) {
        flush();
        current = { title: clean, description: '', tags: [...tags], githubLink: null, liveLink: null };
      } else {
        // Still in preamble — append to title or treat as first desc line
        desc.push(clean);
      }
    } else if (current) {
      if (tags.length) current.tags.push(...tags);
      desc.push(clean);
    }
  }
  flush();

  return entries;
}

// ─── Main export ──────────────────────────────────────────────────────────────

function parseResume(text) {
  const lines = text.split('\n');
  const sections = splitSections(lines);
  const fullText = text;

  const email    = extractEmail(fullText);
  const phone    = extractPhone(fullText);
  const linkedin = extractLinkedIn(fullText);
  const github   = extractGitHub(fullText);
  const portfolio = extractPortfolio(fullText, github);

  const headerLines = (sections._header || []);
  const fullName   = extractName(headerLines, email, phone);
  const headline   = extractHeadline(headerLines, fullName);
  const location   = extractLocation(fullText, headerLines);
  const dateOfBirth = extractDOB(fullText);

  const professionalSummary = parseSummary(sections.summary);
  const { designTools, technicalSkills, softSkills } = parseSkills(sections.skills);
  const languages  = parseLanguages(sections.languages);
  const experience = parseExperience(sections.experience);
  const education  = parseEducation(sections.education);
  const projects   = parseProjects(sections.projects);

  return {
    fullName,
    headline,
    location,
    phone,
    email,
    dateOfBirth,
    linkedin,
    portfolio,
    professionalSummary,
    languages,
    designTools,
    technicalSkills,
    softSkills,
    experience,
    education,
    projects,
  };
}

module.exports = { parseResume };
