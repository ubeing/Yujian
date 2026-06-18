#!/usr/bin/env node

const { StructuralValueMarkingSkill } = require('./structural-value-marking');

function parseInput(raw) {
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`CLI 输入必须是合法 JSON: ${error.message}`);
  }
}

function main(argv = process.argv.slice(2)) {
  const [rawInput] = argv;
  const payload = parseInput(rawInput);
  const skill = new StructuralValueMarkingSkill();
  const result = skill.run(payload);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  main,
  parseInput
};
