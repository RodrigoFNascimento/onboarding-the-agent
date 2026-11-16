# Onboarding the Agent: AI in your repo, treated like a teammate

An AI agent is a contributor that starts every session as the new hire: it reads the code,
runs the build and the tests, and opens a pull request, but it doesn't know any of your
team's conventions. This talk is a kickstart guide to onboarding it the way you'd onboard a
person: write it down in the repository. **Instructions** hold what's always true,
**scoped instructions** hold rules for some files, **skills** hold step-by-step procedures
loaded when a task needs them, and **custom agents** hold different jobs, like a reviewer.
The examples use GitHub Copilot's `.github/` files, but the ideas apply to any agent. And
the agent's work still goes through a pull request and a human review, like anyone else's.

**Read the article:** [English](https://rodrigofnascimento.github.io/onboarding-the-agent/en/) · [Português (BR)](https://rodrigofnascimento.github.io/onboarding-the-agent/pt-br/)<br>
**Slides (pt-BR):** [rodrigofnascimento.github.io/onboarding-the-agent/slides](https://rodrigofnascimento.github.io/onboarding-the-agent/slides/)

## Examples

| Example | What it shows | Run |
|---|---|---|
| [01-first-pr](examples/01-first-pr) | The pull request an agent opens with no instructions: it builds and its test passes, but it breaks three conventions nobody wrote down. | `dotnet test examples/01-first-pr/tests/FirstPr.Tests` |
| [02-orders-api](examples/02-orders-api) | A small .NET Minimal API, the sample repository, with the files that onboard an agent to it: instructions, scoped instructions for tests, an `add-endpoint` skill and a read-only reviewer agent, all in `.github/`. | `dotnet test examples/02-orders-api/OrdersApi.slnx` |
| [03-agents-md](examples/03-agents-md) | The same instructions in the open AGENTS.md format, kept apart so a repository never has the same rules in two files. | (no code) |

`02-orders-api` is self-contained: treat it as the root of its own repository, or copy its
`.github/` folder as a starting point for yours. To try the API, run
`dotnet run --project examples/02-orders-api/src/OrdersApi`.

Run everything:

```bash
dotnet test examples/Examples.slnx
```

Requires the [.NET SDK](https://dotnet.microsoft.com/download) 10 or later.

## Repository layout

```
examples/   working .NET code shown in the talk, with tests
slides/     Slidev deck (pt-BR). From the repo root: `npm install`, then `npm run slides`
article/    the article (EN + pt-BR). From the repo root: `npm run article`
```

## References
- GitHub, [Copilot customization cheat sheet](https://docs.github.com/en/copilot/reference/customization-cheat-sheet): where instructions, scoped instructions, skills and custom agents go
- GitHub, [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration): the `.agent.md` frontmatter, tools and invocation settings
- VS Code, [Subagents](https://code.visualstudio.com/docs/copilot/agents/subagents): when Copilot hands part of a task to a custom agent on its own
- Microsoft Learn, [Custom agents in Visual Studio](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-specialized-agents)
- [Agent Skills specification](https://agentskills.io/specification): the open `SKILL.md` format
- [AGENTS.md](https://agents.md/): the open format for guiding coding agents
- [Written for Strangers](https://github.com/RodrigoFNascimento/written-for-strangers): the previous talk, on why every contributor, human or agent, needs context written down

## License

- **Code** (`examples/`, build scripts): [MIT](LICENSE).
- **Article and slides** (`article/`, `slides/`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  You can share and adapt them if you credit the author.

---

Made by [Rodrigo Nascimento](https://github.com/RodrigoFNascimento).
