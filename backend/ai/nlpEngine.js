/**
 * AI/NLP Engine for Grievance Portal
 * Handles: Department categorization, Priority detection, Duplicate detection, Suggestions
 */
const stringSimilarity = require('string-similarity');

// Department keyword mappings
const departmentKeywords = {
  'Sanitation Department': [
    'garbage', 'trash', 'waste', 'dump', 'rubbish', 'litter', 'dirty', 'filth',
    'sewage', 'drain', 'clog', 'smell', 'stink', 'sanitation', 'cleaning',
    'dustbin', 'bin', 'refuse', 'compost', 'recycling', 'sweeping', 'hygiene'
  ],
  'Water Department': [
    'water', 'leakage', 'leak', 'pipe', 'burst', 'supply', 'tap', 'flood',
    'waterlogging', 'drainage', 'plumbing', 'contaminated', 'dirty water',
    'no water', 'low pressure', 'water shortage', 'pipeline', 'sewage water',
    'borewell', 'tank', 'overflow'
  ],
  'Electrical Department': [
    'electricity', 'electric', 'light', 'street light', 'power', 'outage',
    'blackout', 'transformer', 'wire', 'cable', 'pole', 'voltage', 'meter',
    'bulb', 'lamp', 'current', 'short circuit', 'spark', 'electrical',
    'streetlight', 'led', 'illumination'
  ],
  'Public Works Department': [
    'road', 'pothole', 'bridge', 'footpath', 'pavement', 'crack', 'damage',
    'construction', 'repair', 'maintenance', 'highway', 'lane', 'asphalt',
    'concrete', 'divider', 'flyover', 'underpass', 'speed breaker', 'marking',
    'sidewalk', 'curb', 'gutter'
  ],
  'Traffic & Transport Department': [
    'traffic', 'signal', 'parking', 'bus', 'transport', 'congestion', 'accident',
    'zebra crossing', 'sign board', 'speed limit', 'violation', 'jam',
    'public transport', 'auto', 'taxi', 'metro', 'railway crossing'
  ],
  'Health Department': [
    'hospital', 'health', 'clinic', 'doctor', 'medicine', 'disease', 'epidemic',
    'mosquito', 'dengue', 'malaria', 'vaccination', 'ambulance', 'medical',
    'pest', 'rat', 'cockroach', 'fumigation', 'fogging', 'infection'
  ],
  'Parks & Recreation Department': [
    'park', 'garden', 'tree', 'playground', 'bench', 'green', 'lawn',
    'recreation', 'sports', 'stadium', 'gym', 'community center', 'landscape',
    'pruning', 'plantation', 'deforestation'
  ],
  'Housing & Urban Development': [
    'building', 'illegal construction', 'encroachment', 'demolition', 'permit',
    'zoning', 'property', 'land', 'unauthorized', 'housing', 'apartment',
    'colony', 'layout', 'planning', 'urban'
  ]
};

// Priority keywords
const highPriorityKeywords = [
  'urgent', 'emergency', 'dangerous', 'hazard', 'life threatening', 'critical',
  'severe', 'accident', 'collapse', 'fire', 'flood', 'electrocution',
  'death', 'injury', 'dying', 'toxic', 'poisonous', 'explosion', 'immediately',
  'asap', 'serious', 'fatal', 'risk', 'unsafe'
];

const lowPriorityKeywords = [
  'minor', 'small', 'suggestion', 'improvement', 'cosmetic', 'beautification',
  'long term', 'eventually', 'when possible', 'not urgent', 'low priority'
];

// AI Suggestions for departments
const departmentSuggestions = {
  'Sanitation Department': 'While we process your complaint, please ensure garbage is kept in covered bins to prevent health hazards.',
  'Water Department': 'As a temporary measure, please turn off the main valve if there\'s a leak. Avoid using contaminated water.',
  'Electrical Department': 'Please stay away from any exposed wires or damaged electrical equipment. Use flashlights instead of candles.',
  'Public Works Department': 'Please be cautious around the damaged area. Use alternate routes if possible.',
  'Traffic & Transport Department': 'Please follow traffic rules and use alternative routes to avoid congested areas.',
  'Health Department': 'Please maintain hygiene and consult a nearby health center if you notice any symptoms.',
  'Parks & Recreation Department': 'Please avoid the affected area until maintenance is complete.',
  'Housing & Urban Development': 'Please document any unauthorized construction with photos and keep a safe distance.',
  'General Department': 'Your complaint has been noted. Our team will review and route it appropriately.'
};

/**
 * Detect department from complaint text using keyword matching
 */
function detectDepartment(text) {
  const lowerText = text.toLowerCase();
  let bestMatch = { department: 'General Department', score: 0 };

  for (const [department, keywords] of Object.entries(departmentKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        // Weight by keyword specificity (longer keywords are more specific)
        score += 1 + (keyword.length / 10);
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { department, score };
    }
  }

  return bestMatch.department;
}

/**
 * Detect priority level from complaint text
 */
function detectPriority(text) {
  const lowerText = text.toLowerCase();

  // Check for high priority
  for (const keyword of highPriorityKeywords) {
    if (lowerText.includes(keyword)) {
      return 'red';
    }
  }

  // Check for low priority / resolved
  for (const keyword of lowPriorityKeywords) {
    if (lowerText.includes(keyword)) {
      return 'green';
    }
  }

  // Default medium priority
  return 'yellow';
}

/**
 * Check for duplicate complaints using string similarity
 */
async function checkDuplicate(complaintText, Complaint) {
  try {
    const existingComplaints = await Complaint.find({
      status: { $ne: 'Resolved' }
    }).select('complaint_text _id').lean();

    if (existingComplaints.length === 0) return null;

    const existingTexts = existingComplaints.map(c => c.complaint_text);
    const matches = stringSimilarity.findBestMatch(complaintText, existingTexts);

    if (matches.bestMatch.rating > 0.6) {
      const matchIndex = matches.bestMatchIndex;
      return existingComplaints[matchIndex]._id;
    }

    return null;
  } catch (error) {
    console.error('Duplicate check error:', error);
    return null;
  }
}

/**
 * Get AI suggestion for a department
 */
function getSuggestion(department) {
  return departmentSuggestions[department] || departmentSuggestions['General Department'];
}

/**
 * Simple language detection (mock)
 */
function detectLanguage(text) {
  // Simple heuristic - check for non-ASCII characters
  const hindiPattern = /[\u0900-\u097F]/;
  const tamilPattern = /[\u0B80-\u0BFF]/;
  const teluguPattern = /[\u0C00-\u0C7F]/;

  if (hindiPattern.test(text)) return 'Hindi';
  if (tamilPattern.test(text)) return 'Tamil';
  if (teluguPattern.test(text)) return 'Telugu';
  return 'English';
}

/**
 * Mock translation to English (for prototype/demo)
 */
function translateToEnglish(text, detectedLanguage) {
  if (!text) return '';
  if (!detectedLanguage || detectedLanguage === 'English') return text;
  return `[Auto-translated from ${detectedLanguage}] ${text}`;
}

/**
 * Process a complaint through the AI pipeline
 */
async function processComplaint(complaintText, Complaint) {
  const department = detectDepartment(complaintText);
  const priority = detectPriority(complaintText);
  const duplicateId = await checkDuplicate(complaintText, Complaint);
  const suggestion = getSuggestion(department);
  const language = detectLanguage(complaintText);
  const translatedText = translateToEnglish(complaintText, language);

  return {
    department,
    priority_level: priority,
    is_duplicate: !!duplicateId,
    duplicate_of: duplicateId,
    ai_suggestion: suggestion,
    detected_language: language,
    translated_text: translatedText
  };
}

/**
 * Generate department performance insights
 */
async function generateInsights(Complaint) {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const highPriority = await Complaint.countDocuments({ priority_level: 'red' });

    const byDepartment = await Complaint.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } } } },
      { $sort: { count: -1 } }
    ]);

    const recentTrend = await Complaint.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    return {
      total: totalComplaints,
      resolved,
      pending,
      inProgress,
      highPriority,
      resolutionRate: totalComplaints > 0 ? ((resolved / totalComplaints) * 100).toFixed(1) : 0,
      byDepartment,
      recentTrend: recentTrend.reverse()
    };
  } catch (error) {
    console.error('Insights generation error:', error);
    return null;
  }
}

module.exports = {
  detectDepartment,
  detectPriority,
  checkDuplicate,
  getSuggestion,
  detectLanguage,
  translateToEnglish,
  processComplaint,
  generateInsights
};
