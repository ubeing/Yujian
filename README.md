# Yunjian
**遇见（Yujian）** 是本仓库所服务的信息价值基础设施体系代号。它以社会主体为中心、以上下文为基座、以 LLM-native Skill 驱动的信息对称为行为机制，让信息与信息、主体与主体、上下文与上下文在权属守护下自然相遇、碰撞、激发、深化和升级。

当前仓库承担三重角色：

1. **结构价值标定层**：通过 `src/structural-value-marking.js` 提供可回归的结构价值标定实现。
2. **协议蓝图仓库**：通过 `current-spec/` 定义 Skill 协议、SubjectContext 协议、全集散与动态超对称协议、信息碰撞层协议及权属接口。
3. **第一个可运行 Skill 参考实现**：通过 `src/cli.js` 提供 `StructuralValueMarkingSkill` 的 CLI 路径。

## Quick Start

```bash
npm test
node src/cli.js '{"expression":{"statement":"信息表达","evidence":["证据A"]},"subjectContext":{"subjectId":"s-1","scene":"demo","goals":["校准"],"ownership":{"owner":"s-1","permissions":["read"],"trace":["source:demo"]}}}'
```
