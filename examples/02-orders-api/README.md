# Orders API

The sample repository for the talk: a small .NET 10 Minimal API, plus the files that
onboard an AI agent to it. Treat this folder as the root of its own repo.

| File | What it is |
|------|------------|
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | Instructions: always loaded, what's always true here |
| [`.github/instructions/tests.instructions.md`](.github/instructions/tests.instructions.md) | Scoped instructions: only for files under `tests/` |
| [`.github/skills/add-endpoint/SKILL.md`](.github/skills/add-endpoint/SKILL.md) | Skill: loaded when a task matches its description |
| [`.github/agents/reviewer.agent.md`](.github/agents/reviewer.agent.md) | Custom agent: a reviewer that never edits code |

Run the tests with `dotnet test`.
