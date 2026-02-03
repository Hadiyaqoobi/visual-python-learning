// Validation rules for each chapter
// Checks if submitted code contains required patterns

interface ValidationRule {
  patterns: string[];  // Required patterns (all must be present)
  outputPatterns?: string[];  // Expected patterns in API output
  minCodeLength?: number;
  description: string;
}

const chapterValidations: Record<number, ValidationRule> = {
  1: {
    description: "Your First Flight API",
    patterns: ["fastapi", "app", "get"],
    minCodeLength: 50
  },
  2: {
    description: "Flight Lookup & Conversions",
    patterns: ["def", "return"],
    minCodeLength: 100
  },
  3: {
    description: "REAL Flight Tracking",
    patterns: ["requests", "opensky"],
    minCodeLength: 150
  },
  4: {
    description: "Multiple Flight Tracking",
    patterns: ["for", "dict"],
    minCodeLength: 200
  },
  5: {
    description: "Flight History & Watchlists",
    patterns: ["list", "append"],
    minCodeLength: 250
  },
  6: {
    description: "Aircraft Database",
    patterns: ["dict", "aircraft"],
    minCodeLength: 150
  },
  7: {
    description: "Save & Load Data",
    patterns: ["json", "open"],
    minCodeLength: 100
  },
  8: {
    description: "Error Handling",
    patterns: ["try", "except"],
    minCodeLength: 100
  },
  9: {
    description: "Utility Functions",
    patterns: ["def", "return"],
    minCodeLength: 150
  },
  10: {
    description: "OOP: Flight & Aircraft Classes",
    patterns: ["class", "self"],
    minCodeLength: 200
  },
  13: {
    description: "Interactive Map",
    patterns: ["folium", "map"],
    minCodeLength: 150
  },
  18: {
    description: "SQLite Database",
    patterns: ["sqlite", "create"],
    minCodeLength: 200
  },
  19: {
    description: "Pandas Analytics",
    patterns: ["pandas", "dataframe"],
    minCodeLength: 100
  },
  20: {
    description: "Data Visualization",
    patterns: ["matplotlib", "plot"],
    minCodeLength: 100
  },
  24: {
    description: "Deploy to Cloud",
    patterns: ["docker"],
    minCodeLength: 50
  },
  25: {
    description: "ML: Load Flight Data",
    patterns: ["pandas", "csv"],
    minCodeLength: 100
  },
  26: {
    description: "ML: Delay Predictor",
    patterns: ["sklearn", "fit"],
    minCodeLength: 150
  },
  29: {
    description: "ML Pipeline",
    patterns: ["pipeline", "predict"],
    minCodeLength: 150
  },
  31: {
    description: "AI Predictions Live",
    patterns: ["predict", "model"],
    minCodeLength: 100
  }
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateMilestoneSubmission(
  chapterNumber: number,
  code: string | null,
  output: string | null
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  const rules = chapterValidations[chapterNumber];
  
  // If no specific rules for this chapter, require at least code or output
  if (!rules) {
    if (!code && !output) {
      result.isValid = false;
      result.errors.push("Please provide either your code or API output as proof of completion.");
    }
    return result;
  }

  // Must have code for validation
  if (!code || code.trim().length === 0) {
    result.isValid = false;
    result.errors.push("Please paste your code to verify completion.");
    return result;
  }

  const codeLower = code.toLowerCase();

  // Check minimum code length
  if (rules.minCodeLength && code.length < rules.minCodeLength) {
    result.isValid = false;
    result.errors.push(
      `Your code is too short. This chapter requires at least ${rules.minCodeLength} characters. You submitted ${code.length} characters.`
    );
  }

  // Check required patterns
  const missingPatterns: string[] = [];
  for (const pattern of rules.patterns) {
    const patternLower = pattern.toLowerCase();
    if (!codeLower.includes(patternLower)) {
      missingPatterns.push(pattern);
    }
  }

  if (missingPatterns.length > 0) {
    result.isValid = false;
    result.errors.push(
      `Your code is missing required elements: "${missingPatterns.join('", "')}". Make sure you've followed the instructions for this chapter.`
    );
  }

  return result;
}

// Get hints for what's expected in this chapter
export function getChapterRequirements(chapterNumber: number): string[] {
  const rules = chapterValidations[chapterNumber];
  if (!rules) {
    return ["Submit your code or API output as proof of completion."];
  }

  const requirements: string[] = [];
  
  if (rules.patterns.length > 0) {
    requirements.push(`Your code should include: ${rules.patterns.join(", ")}`);
  }
  
  if (rules.minCodeLength) {
    requirements.push(`Minimum code length: ${rules.minCodeLength} characters`);
  }

  return requirements;
}
