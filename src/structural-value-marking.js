const currentSpec = require('../current-spec/index.json');

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function scoreByPresence(items, maxScore, expectedCount) {
  const boundedCount = Math.min(items.length, expectedCount);
  return Math.round((boundedCount / expectedCount) * maxScore);
}

function calibrateStructuralValue(expression = {}, subjectContext = {}) {
  const statement = typeof expression.statement === 'string' ? expression.statement.trim() : '';
  const evidence = normalizeList(expression.evidence);
  const intents = normalizeList(expression.intents);
  const constraints = normalizeList(expression.constraints);
  const claims = normalizeList(expression.claims);
  const openQuestions = normalizeList(expression.openQuestions);
  const relations = normalizeList(subjectContext.relations);
  const goals = normalizeList(subjectContext.goals);
  const ownership = subjectContext.ownership || {};
  const permissions = normalizeList(ownership.permissions);
  const trace = normalizeList(ownership.trace);

  const dimensions = {
    expressionStructure: Math.min(
      25,
      (statement ? 10 : 0) +
        scoreByPresence(evidence, 8, 2) +
        scoreByPresence(intents, 5, 2) +
        scoreByPresence(constraints, 2, 1)
    ),
    subjectContextAlignment: Math.min(
      25,
      (subjectContext.subjectId ? 10 : 0) +
        (subjectContext.scene ? 8 : 0) +
        scoreByPresence(goals, 5, 2) +
        scoreByPresence(relations, 2, 1)
    ),
    collisionReadiness: Math.min(
      25,
      scoreByPresence(claims, 10, 2) +
        scoreByPresence(evidence, 8, 2) +
        scoreByPresence(openQuestions, 7, 2)
    ),
    ownershipIntegrity: Math.min(
      25,
      (ownership.owner ? 10 : 0) +
        scoreByPresence(permissions, 8, 2) +
        scoreByPresence(trace, 7, 2)
    )
  };

  const totalScore = Object.values(dimensions).reduce((sum, value) => sum + value, 0);

  return {
    protocolVersion: currentSpec.version,
    skillName: 'StructuralValueMarkingSkill',
    totalScore,
    dimensions,
    markers: {
      statementPresent: Boolean(statement),
      evidenceCount: evidence.length,
      intentCount: intents.length,
      goalCount: goals.length,
      claimCount: claims.length,
      openQuestionCount: openQuestions.length,
      ownershipPresent: Boolean(ownership.owner)
    }
  };
}

class StructuralValueMarkingSkill {
  constructor(options = {}) {
    this.name = 'StructuralValueMarkingSkill';
    this.version = options.version || '1.0.0';
    this.protocolVersion = currentSpec.version;
  }

  run({ expression, subjectContext } = {}) {
    return {
      protocolVersion: this.protocolVersion,
      calibration: calibrateStructuralValue(expression, subjectContext)
    };
  }
}

module.exports = {
  StructuralValueMarkingSkill,
  calibrateStructuralValue
};
