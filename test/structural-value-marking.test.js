const test = require('node:test');
const assert = require('node:assert/strict');

const {
  currentSpec,
  StructuralValueMarkingSkill,
  calibrateStructuralValue
} = require('../src');
const { main, parseInput } = require('../src/cli');

test('current-spec declares required repository roles and protocol blueprints', () => {
  assert.equal(currentSpec.version, 'current-spec@1.0.0');
  assert.deepEqual(currentSpec.repositoryRoles, [
    'structural-value-calibration-layer',
    'protocol-blueprint-repository',
    'runnable-skill-reference-implementation'
  ]);
  assert.ok(currentSpec.protocols.skill);
  assert.ok(currentSpec.protocols.subjectContext);
  assert.ok(currentSpec.protocols.universalDispersalAndDynamicSupersymmetry);
  assert.ok(currentSpec.protocols.informationCollisionLayer);
  assert.ok(currentSpec.protocols.ownershipInterface);
});

test('structural value calibration is deterministic and regression friendly', () => {
  const result = calibrateStructuralValue(
    {
      statement: '信息表达围绕主体目标展开。',
      evidence: ['上下文证据A', '上下文证据B'],
      intents: ['守护权属', '促进对称'],
      constraints: ['不得越权'],
      claims: ['claim-1', 'claim-2'],
      openQuestions: ['question-1']
    },
    {
      subjectId: 'subject-001',
      scene: '协作分析',
      goals: ['提升表达质量', '维持可追溯性'],
      relations: ['author->reviewer'],
      ownership: {
        owner: 'subject-001',
        permissions: ['read', 'quote'],
        trace: ['source:a']
      }
    }
  );

  assert.equal(result.protocolVersion, currentSpec.version);
  assert.equal(result.totalScore, 94);
  assert.deepEqual(result.dimensions, {
    expressionStructure: 25,
    subjectContextAlignment: 25,
    collisionReadiness: 22,
    ownershipIntegrity: 22
  });
  assert.equal(result.markers.ownershipPresent, true);
  assert.equal(result.markers.evidenceCount, 2);
});

test('StructuralValueMarkingSkill wraps calibration for CLI and integrations', () => {
  const skill = new StructuralValueMarkingSkill();
  const result = skill.run({
    expression: {
      statement: '仅有陈述'
    },
    subjectContext: {
      subjectId: 'subject-002',
      scene: '最小输入',
      goals: ['保留主体']
    }
  });

  assert.equal(result.protocolVersion, currentSpec.version);
  assert.equal(result.calibration.skillName, 'StructuralValueMarkingSkill');
  assert.equal(result.calibration.totalScore, 31);
});

test('CLI helpers validate JSON and print skill output', () => {
  assert.deepEqual(parseInput(), {});
  assert.deepEqual(parseInput(null), {});
  assert.throws(() => parseInput('{invalid'), /CLI 输入必须是合法 JSON:/);

  let output = '';
  const originalWrite = process.stdout.write;
  process.stdout.write = (chunk) => {
    output += chunk;
    return true;
  };

  try {
    main([
      '{"expression":{"statement":"信息表达"},"subjectContext":{"subjectId":"subject-003","scene":"cli","goals":["验证"]}}'
    ]);
  } finally {
    process.stdout.write = originalWrite;
  }

  const parsed = JSON.parse(output);
  assert.equal(parsed.calibration.skillName, 'StructuralValueMarkingSkill');
  assert.equal(parsed.protocolVersion, currentSpec.version);
});
