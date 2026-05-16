# Claude Design: Integration Briefing for Agentic Product Workflows

**Date:** May 2026
**Status:** Research preview, shipped April 17, 2026[^anthropic]
**Audience:** Teams running Claude Chat / Claude Code / Codex / agentic build loops who want to add Claude Design without breaking the parts of the workflow that already work
**TL;DR:** Claude Design is the design-exploration surface that sits between *thinking about* a product and *shipping* it. Its highest-leverage use is producing on-brand, structurally sound prototypes that hand off to Claude Code (or, with reduced fidelity, Codex) with intent preserved. Most teams that fail with it skip the design-system setup, treat it like a chatbot, or try to design and build in the same conversation.[^designsystems] This briefing distills what the launch-window community has learned into an integration plan.

---

## 1. Executive Summary

Claude Design is a browser-based tool at `claude.ai/design` powered by Claude Opus 4.7, available to Pro / Max / Team / Enterprise subscribers as a research preview.[^anthropic] The interface is a chat panel on the left, a live canvas on the right. You describe what you want, Claude generates it, and you refine it through a mix of chat, inline comments on specific elements, direct text edits, and auto-generated sliders ("Tweaks") for spacing, color, and layout.[^anthropic][^designsystems]

The strategic position to internalize:

- **Claude Chat** is for thinking and research
- **Cowork** is for delegating ongoing work
- **Claude Code / Codex** is for shipping production
- **Claude Design** is the surface you didn't have before — the place where visual ideas become tangible enough to evaluate, before engineering time is committed

The integration problem this document addresses is not "how do we use Claude Design," but "how do we slot Claude Design into a stack that already has a working idea-to-production loop without disrupting the loop." The short answer: insert it between the problem-framing phase (Chat) and the implementation phase (Code/Codex), then connect it to both ends explicitly.

---

## 2. Where Claude Design Fits in the Stack

A useful mental model from the launch reviews: each Claude product corresponds to a different mode of working.

| Surface | Mode | Use it for |
|---|---|---|
| Claude Chat | Conversation | Problem framing, research, decisions |
| Cowork | Delegation | Ongoing work you'd hand to a coworker |
| Claude Design | Visual exploration | Wireframes, prototypes, decks, marketing visuals |
| Claude Code | Engineering | Shipping production code |
| Codex / external CLIs | Engineering | Same as Code, parallel agent |

The critical rule that the experienced users repeatedly call out: **never design and code in the same conversation.** Claude Design is for visual exploration; Claude Code (or Codex) is for production. Mixing them is the single most common reason teams burn hours without shipping.[^designsystems]

This translates into a default workflow shape:

```
Idea → Frame in Chat → Visualize in Design → Validate → Hand off to Code/Codex → Ship
                                ↑
                       (iterate within Design,
                        not across surfaces)
```

The handoff arrow from Design to Code is the part that's genuinely new. More on it in §8.

---

## 3. Strategic Positioning vs. Other Tools

Claude Design does not replace what we already have. It carves out a specific slot.

- **vs. Figma:** Faster from blank canvas to working prototype. Slower for teams already deep into Figma workflows with shared libraries, branching, and dev mode. No real-time multiplayer.[^claudia][^muzli] **Use Claude Design before the Figma file exists; use Figma when the design system is the source of truth.**
- **vs. Canva:** More capable on interactive prototypes and code-backed assets. Canva is still better for high-volume marketing collateral and brand-kit-enforced templates at scale.[^claudia] The two integrate; the natural workflow is ideate in Claude Design, push to Canva when you need editing inside the broader Canva creative system.[^anthropic]
- **vs. v0 / Lovable / Bolt / Replit Agent:** These optimize for "I need a deployed app today." Claude Design optimizes for "I need to figure out what this thing should look and feel like before we commit engineering time." If you're going to throw away a prototype to learn from it, Claude Design's iteration loop on visual details is better. If you want to ship the prototype, the vibecoding tools have shorter paths.[^claudia]
- **vs. Codex (for design tasks):** Codex can generate UI code, but it lacks the canvas, the Tweaks panel, the design-system context layer, and the dedicated visual iteration affordances. For "explore three directions and pick one," Claude Design is meaningfully better. For "implement this approved direction," Codex remains a strong option (see §8 on handoff).

The frame that has held up across reviewers: **Claude Design for speed and intent, Figma for systems and source-of-truth, vibecoders for deploy-it-today, Codex/Code for production.**[^muzli][^claudia]

---

## 4. The Design System Is the Whole Game

This is the most consistent finding across every serious review, and it should drive our adoption plan.[^muzli][^dop][^designsystems][^claudia]

Without a design system loaded, Claude Design defaults to what the community calls "AI slop": Inter or Roboto, white-to-purple gradients, evenly-spaced cards, generic Stripe-meets-Linear SaaS aesthetic.[^muzli] **A serious first session should be dedicated to setting up the design system, not making something cool.** Expect to spend a meaningful chunk of your weekly quota here.

### Setup checklist

1. Go to organization settings → design systems → onboarding flow[^designsystems]
2. Attach as many real signals as possible:[^dop][^designsystems]
   - GitHub repo URL (for monorepos, point at `/packages/ui` or your frontend-specific subdirectory, not the root)[^muzli][^dop]
   - Local code folder, if no public repo
   - Figma file (.fig) — parsed locally in the browser, never uploaded[^dop]
   - Live website URL (web capture)
   - PPTX deck, brand PDF, color palette image
3. Write a one-paragraph brand description with feel words ("calm, confident, deliberately quiet" beats "professional")[^tdp]
4. Let Claude generate the UI kit: colors, typography, components, layout conventions, spacing tokens[^claudia][^designerup]
5. Review every section. Flag what's wrong.
6. Run test prompts ("design a settings page," "design a marketing landing page") to surface stylistic issues[^claudia]
7. Iterate the system based on test output before publishing[^claudia]

### Pre-processing tip

If our brand assets are scattered, run them through Cowork first with a prompt like *"Produce a full design system document covering fonts, colors, graphical styles, component patterns, voice, and layout conventions, with anything missing flagged."* Feed the resulting clean DESIGN.md into Claude Design's onboarding instead of raw assets. Coherent input produces coherent output.[^muzli]

### Ownership question

This system needs an owner. It will drift if no one is responsible for refreshing it as the product evolves. Recommendation: whoever owns design tokens / Storybook today inherits this responsibility, with quarterly review cadence.

---

## 5. Prompting: Density Beats Brevity

This is the most counterintuitive insight, because it inverts the standard Claude Chat advice.

In Claude Chat, the heuristic is "start vague, refine through conversation." **In Claude Design, vague prompts produce slop and dense prompts produce usable first drafts roughly two-thirds of the time.**[^muzli] Front-load everything.

### The four-part brief

Every production prompt should include:[^claudia]

1. **Goal** — what is this for, who needs it, what happens after they see it
2. **Audience** — who specifically, with what context they're arriving from
3. **Content** — what information must be surfaced, in what priority order
4. **Layout & feel** — visual register, tone, structural hints

### Example contrast

**Bad:** "Make me a pitch deck."

**Good:** "Design a 10-slide investor pitch deck for a pre-seed B2B fintech selling fraud detection to SMB lenders. Audience is sector-focused VCs at the early-stage stage. Tone: confident but not aggressive. Visual feel: editorial, restrained, type-led, no stock photos, no purple gradients. Use a serif display face with a geometric sans for body. Include problem, solution, market, traction, team, ask."[^muzli]

### The anti-slop preamble

This paragraph (or a project-specific version of it) should live in our DESIGN.md and be referenced in non-trivial prompts:[^muzli]

> "Avoid generic AI-generated aesthetics: overused fonts (Inter, Roboto, Arial, system fonts), clichéd color schemes (especially purple gradients on white or dark backgrounds), predictable layouts, cookie-cutter components. Make distinctive, context-specific choices. Pick one decisive font and use it confidently. Commit to a cohesive aesthetic with dominant colors and sharp accents rather than timid evenly-distributed palettes."

### Two prompting tactics that work

- **Specify alternatives, not negatives.** "Don't use cream backgrounds" pushes the model to a different default. "Use pale silver-gray tones deepening into blue-gray, with 4px corner radius and a square angular sans-serif" actually produces what you want.[^muzli]
- **Reference cultural aesthetics, not other websites.** "Solarpunk," "Swiss editorial," "Japanese minimalism," "early-2000s zine" gives the model a richer reference space than "make it look like Linear" (which mostly produces a worse copy of Linear).[^muzli]

### Answer the clarifying questions

Claude asks PRD-style questions before generating. Many users skip them; this is a leading indicator of bad output.[^thrillax][^tdp] The questions surface blind spots in our own brief — answering them properly is part of the design work, not friction to bypass.

---

## 6. Iteration: Three Tools, Use the Right One

The most expensive mistake in Claude Design is re-prompting through chat when a cheaper tool would have worked. Three distinct iteration mechanisms exist:

### Tweaks panel (sliders) — free, no tokens

Auto-generated sliders for typography scale, color temperature, spacing density, section ordering. **These do not round-trip through the model**, so they don't consume chat tokens. Reorder hero sections, swap variant cards, tighten density — all free.[^muzli]

**Rule:** If you can move a slider to fix it, never type it.[^muzli]

### Inline element comments — cheap, surgical

Click an element, leave a comment. One MacStories reviewer (John Voorhees) noted that "comment-on-element covered 95% of what I needed" after adapting to it.[^muzli] The pattern:

- "This button text should be white."
- "Add 8px padding here."
- "Change this card to a horizontal layout."
- "Move this above the headline."

Known bug: comments occasionally vanish before Claude reads them. **Workaround:** if a comment doesn't get picked up after a beat, copy the text and paste it into chat. Always works.[^muzli]

### Chat — expensive, for structural changes

Reserved for changes that require explanation or affect the whole canvas:

- "Add a testimonial section between features and pricing"
- "Make this feel editorial instead of corporate"
- "Save what we have and try a completely different approach"[^muzli]
- "Scrap this and try the elegant version, knowing what you know now"[^muzli]

The last two are real commands that work — they preserve current state and explore in parallel, rather than re-rolling everything.[^muzli]

### Variation generation: the killer command

Instead of refining in a straight line, ask for variations explicitly:[^muzli]

> "Show me three versions of this dashboard: one editorial and type-led, one dense and data-forward, one playful with strong color blocks."

Claude keeps each version accessible. You mix pieces from different variants. You learn what you actually want by comparing options, which is exponentially faster than guess-and-iterate. The same applies inside a single design: "Give me 3+ atomic variations of the hero section" is a pattern documented in Claude Design's own system prompt.[^muzli]

**The product is built to explore, not converge. Use it that way on the first pass.**

---

## 7. Workflows by Use Case

### 7.1 Wireframes (early concept exploration)

Best fit. Use the Prototype tab with the Wireframe toggle.[^computingforgeeks]

**Recommended pattern:**

1. Frame the problem in Chat first. Write down the user, the surrounding context, the primary action, the success criterion.
2. In Claude Design, prompt for 3–5 wireframe variants in sketch style with a hint of color.[^tdp]
3. Answer clarifying questions properly.
4. Compare variants. Pick the one with the right structural bones.
5. Use Tweaks and inline comments to refine the chosen variant.
6. Decide whether to stay wireframe or escalate to hi-fi.

### 7.2 High-fidelity prototypes (validating a chosen direction)

Useful but imperfect. Even with codebase connection, hi-fi output isn't 1:1 with our component library — spacing drifts, components don't always match.[^tdp]

**Recommended pattern:**

1. Only go hi-fi on a structurally validated direction. Do not skip wireframe exploration.
2. Generate, then immediately note what's off versus the production component library.
3. Use comments/Tweaks to correct, but accept that perfection isn't the goal here.
4. As soon as it's good enough to test or hand off, leave Claude Design. Pixel-pushing past that point burns quota.[^tdp]

### 7.3 Pitch decks and slide content

Strong fit.[^anthropic][^yang] Workflow:

1. Paste full brand concept doc + research outline into the chat[^mindstudio]
2. Frame the deck explicitly: "I want you to help me generate slide content and visual direction for each section. We'll work through slides one at a time."[^mindstudio]
3. Tell Claude the slide sequence upfront[^mindstudio]
4. After all slides exist, ask Claude to read back the full narrative and flag tonal inconsistencies or logical gaps[^mindstudio]
5. Bonus: ask Claude Design to extract delivery-ready speaker notes from the finished deck[^muzli]

Export to PPTX has had spotty font substitution in community testing; HTML export is most reliable.[^muzli]

### 7.4 Marketing landing pages

Strong fit, especially with the design system loaded.[^anthropic] **Always rewrite the copy yourself before publishing** — Claude's placeholder copy is serviceable but ships AI-slop signals if used verbatim. This is the unanimous marketing-team consensus.[^muzli]

### 7.5 Internal tools and admin consoles

Underrated use case.[^kersai] Particularly good for "we need to visualize this workflow before we commit a sprint to it" — give Claude the API shape, ask for an admin console mockup, validate the IA with the team, then hand off to Code/Codex.

---

## 8. The Handoff to Claude Code (and Codex)

This is the actual unlock and the part that justifies adoption.[^muzli][^designsystems]

### Claude Code handoff

The "Hand off to Claude Code" button doesn't just dump HTML. It packages the design with intent, component choices, and architectural decisions preserved as context. Claude Code builds on top of the design rather than reinterpreting it.[^muzli][^anthropic]

**Production workflow:**[^muzli]
1. Recreate or design a page in Claude Design
2. A/B test copy and layout in the Tweaks panel
3. Hand off the winning variant to Claude Code with a prompt like *"Implement this as a Next.js page matching the design tokens, using our existing component library at `/packages/ui`"*[^designsystems]
4. Spend a few minutes with the result running locally
5. Push to GitHub, deploy

### Codex (or other agentic CLI) handoff

The handoff bundle is fundamentally HTML + design tokens + a context document.[^anthropic] Codex can consume this, but with reduced fidelity:

- **You lose:** the intent preservation that comes from Claude Code being the same model family
- **You keep:** the rendered HTML, CSS variables / design tokens, component structure, and the design's own SKILL.md / context file
- **Recommended adaptation:** export the bundle, then prompt Codex with the design's context document as the spec, the HTML as the reference, and our existing codebase conventions as the implementation target. Treat it as "translate this spec into our stack" rather than "implement this design."

> ⚠️ **Audit note:** This section extrapolates from how the Claude Code handoff is documented to work; there is no published Anthropic guidance specific to Codex consumption of the bundle. The four-week pilot should validate or correct this approach.

### Who reviews the handoff

Recommendation: the engineer who'd normally implement the feature should review the handoff in Code/Codex before merge. The handoff bundle is a draft, not a spec. Same review bar as any other generated code.

---

## 9. Cost and Quota Management

The economics matter enough that they should shape how we run sessions.

- **Separate meter from regular Claude chat.** Burning Design allowance doesn't affect chat allowance and vice versa.[^muzli][^awesome]
- **Per-user, not pooled.** Teams cannot share allowance; admins can't redistribute leftover budget.[^muzli][^awesome]
- **Weekly reset, no daily cap.**[^muzli]
- **Promotional credit gets consumed first.** Launch credits expire mid-July 2026. Spend these on experiments; save the recurring weekly allowance for production work.[^muzli][^awesome]
- **Vision tokens cost ~3x text.** Every screenshot, .fig file, or web capture inflates the bill.[^awesome]
- **Real-world burn rate:** community reports of two heavy sessions consuming 58% of a weekly Pro limit (Josua Golden, reported via X).[^muzli][^agarwal] Plan accordingly.

### Cost-efficient session practices

- Set up the design system once and reuse it (highest ROI work you'll do)[^muzli]
- Use Tweaks for visual adjustments — these don't cost chat tokens[^muzli]
- Use inline comments rather than re-prompting in chat[^muzli]
- Edit your previous message instead of stacking new ones (replaces the exchange instead of appending)[^muzli]
- Speak prompts via dictation when possible — voice prompts are naturally denser than typed ones, meaning fewer back-and-forth corrections[^muzli]
- Switch to a lighter model for tweaks where Opus isn't necessary[^designerup]
- Treat each session as a planned production run, not an open sandbox[^muzli][^karoz]

---

## 10. Common Pitfalls

The launch-window failure modes, ranked by frequency:[^designsystems][^muzli]

1. **Skipping the design system step.** Generic output, every time. Non-negotiable.[^designsystems][^muzli][^claudia]
2. **Designing and coding in the same conversation.** Burns hours, produces neither good design nor good code.[^designsystems]
3. **Vague initial prompts.** Density-over-brevity is the rule. "Make me a thing" is the failure pattern.[^muzli][^vijaya]
4. **Re-prompting in chat to fix things that Tweaks or comments could fix.** Quota burn for no quality gain.[^muzli]
5. **Skipping Claude's clarifying questions.** The questions are how it discovers gaps in your brief.[^thrillax]
6. **Shipping AI-written copy verbatim.** Always rewrite. Always.[^muzli]
7. **Trying to push a mediocre design into a good one.** Use "scrap this and try the elegant version" instead.[^muzli]
8. **Compact view triggers save errors on certain layouts.** Switch to full view if a save fails.[^muzli]
9. **Linking enormous codebases for design system extraction.** Point at the UI package, not the monorepo root.[^muzli][^dop]

---

## 11. Known Limits (When to Use Something Else)

- **No native image generation.** Renders SVG and HTML drawings — great for icons, diagrams, brand illustrations; terrible for photographic realism. Community workaround: generate the layout with placeholder SVGs, then swap in real Unsplash imagery via prompt.[^muzli]
- **Video is weak.** The feature exists but is nowhere near Veo or Runway. Don't use for assets that matter.[^muzli][^yang]
- **No real-time multiplayer.** Workspace-level sharing exists; co-editing in the same canvas does not.[^muzli][^karoz] If our workflow requires two designers in a file together, stay in Figma.
- **No public API yet.** Anthropic has flagged this for "the coming weeks."[^anthropic][^muzli] Once shipped, our automation story changes substantially.
- **Hi-fi components are not pixel-perfect against production libraries.** Expect drift; correct in Code, not in Design.[^tdp]
- **Production governance.** For anything landing in a mature 50-screen system with strict component rules, the source of truth still lives in Figma.[^anima][^muzli] Claude Design is the starting point, not the final file.
- **Pricing volatility.** The weekly allowance has drawn enough complaints that pricing changes are plausible.[^muzli]


---

## 12. Open Questions to Resolve

Before broader rollout, the team should have answers to:

- **Design system ownership.** Who maintains it as the product evolves? What's the review cadence?
- **Quota allocation policy.** Per-user weekly allowances aren't poolable. How do we handle people who need more capacity?
- **Source-of-truth resolution.** When the design system in Claude Design and our Figma library disagree, which wins? What's the sync mechanism?
- **Code handoff conventions.** Who reviews? What's the prompt template for handoff? Does it go through PR review like other generated code (it should)?
- **Codex vs. Claude Code split.** For teams already on Codex, when is it worth switching to Claude Code for the handoff step specifically? Worth a structured comparison after the pilot.
- **Customer-facing exposure.** Will any of this output ship to customers as-is? If yes, what's the editorial review step?

---

## 14. Summary: The Mental Model in One Page

- **Claude Design is the visual-exploration surface between idea and implementation.** Treat it as a peer to Chat, Cowork, and Code — not a replacement for any of them.
- **The design system is the whole game.** Set it up first, maintain it as an asset, treat the first session as foundation-building.
- **Dense briefs, not vague ones.** Four-part structure: goal, audience, content, layout/feel.
- **Three iteration tools, ranked cheapest-to-most-expensive:** Tweaks (free) → inline comments (cheap) → chat (expensive). Use the cheapest tool that can do the job.
- **Variations on the first pass, refinement on the chosen direction.** "Show me three versions" beats "make it better."
- **Don't design and code in the same conversation.** Hand off to Code/Codex explicitly.
- **Rewrite the copy. Always.**
- **The handoff bundle is the strategic value.** Optimize the workflow around getting good prototypes to good implementation.

---

*This briefing draws on launch-window community sources from April–May 2026. Full reference list below; numbered footnotes are linked inline throughout.*

---

## References

[^anthropic]: Anthropic. "Introducing Claude Design by Anthropic Labs." Anthropic News, April 17, 2026. <https://www.anthropic.com/news/claude-design-anthropic-labs>

[^muzli]: Muzli. "Claude Design, One Week In: Hacks, Best Practices & Tips From Real-World Use." Muzli Blog, April 27, 2026. <https://muz.li/blog/claude-design-one-week-in-hacks-best-practices-tips-from-real-world-use/> — Primary source for Tweaks-vs-chat distinction, anti-slop prompt, "show me three variations" command, quota burn rates, Voorhees 95% quote, "save what we have" / "scrap this" commands, copy-rewriting consensus, compact view bug, monorepo /packages/ui tip.

[^designsystems]: Chatterjee, Abhi. "From Prompt to Production: A Designer's Step-by-Step Workflow with Claude Design + Claude Code." Design Systems Collective, April 2026. <https://www.designsystemscollective.com/from-prompt-to-production-a-designers-step-by-step-workflow-with-claude-design-claude-code-a7705daad026> — Primary source for "three mistakes beginners make," design/code separation rule, Next.js handoff workflow.

[^claudia]: Claudia + AI. "Claude Design: Starter Guide and Examples." Substack, April 2026. <https://claudiaplusai.substack.com/p/claude-design-starter-guide-and-examples> — Primary source for four-part brief structure, test-prompt methodology for design system validation, positioning framework (Design / Canva / Figma / vibecoders).

[^dop]: Department of Product. "Claude Design is here. Everything you need to know to get up to speed quickly." Substack, April 2026. <https://departmentofproduct.substack.com/p/claude-design-is-here-everything> — Primary source for asset attachment options, Figma local parsing, monorepo subfolder guidance.

[^designerup]: DesignerUp. "How to Use Claude Design for UX/UI." DesignerUp Blog, April 22, 2026. <https://designerup.co/blog/how-to-use-claude-design-for-ux-ui/> — Primary source for design system generation step-by-step, lighter-model tweak tip.

[^tdp]: Alter, Dianne. "Claude Design workflow: where it fits in your product cycle (and where it doesn't)." TDP / Design Project, April 30, 2026. <https://designproject.io/blog/claude-design-workflow/> — Primary source for Cal.com case study, brand-feel description pattern, hi-fi fidelity limits, PRD-style clarifying questions.

[^mindstudio]: MindStudio. "Claude Design for Pitch Decks: How to Go from Brand Concept to Investor-Ready Slides." MindStudio Blog, May 2026. <https://www.mindstudio.ai/blog/claude-design-pitch-deck-creation-workflow> — Primary source for pitch deck framing prompt, slide sequencing pattern, narrative read-back technique.

[^yang]: Yang, Peter. "Claude Design: Everything You Can Build in 16 Minutes (5 Real Use Cases)." Creator Economy, April 18, 2026. <https://creatoreconomy.so/p/claude-design-everything-you-can-build> — Primary source for live demo of video, deck, landing page, mobile app, and design system workflows; video export limitations.

[^anima]: Anima. "Claude Design Review: Features, Pros, Cons, and Best Alternatives." Anima Blog, May 2026. <https://www.animaapp.com/blog/ai-design-en/claude-design-review-features-pros-cons-and-best-alternatives/> — Primary source for production-governance limit framing.

[^awesome]: Goyal, Rohit. "awesome-claude-design." GitHub repository, April–May 2026. <https://github.com/rohitg00/awesome-claude-design> — Aggregator for quota mechanics (per-user, weekly, promotional credit), vision token pricing, community gist links.

[^thrillax]: Thrillax. "How to Use New Claude Design the Best Way (10 Prompts)." Thrillax, April 2026. <https://www.thrillax.com/claude-design-10-prompts/> — Primary source for clarifying-questions-as-design-work principle, canvas-over-typing iteration tip.

[^agarwal]: Agarwal, Garima. "Claude Design: The Complete Setup & Workflow Guide (2026)." Medium, April 2026. <https://medium.com/@garimaagarwal1200/claude-design-the-complete-setup-workflow-guide-2026-5de41e62fd4c> — Source for Opus 4.7 weekly-quota burn figure (58% per two sessions).

[^computingforgeeks]: ComputingForGeeks. "Claude Design Tutorial: Decks & Wireframes." April 2026. <https://computingforgeeks.com/claude-design-tutorial-prototypes-decks-wireframes/> — Source for Prototype tab Wireframe / High-fidelity toggle documentation.

[^karoz]: Zieminski, Karo. "Claude Design Review: 48-Hour Builder's Test + Hero Prompts." Product with Attitude, April 2026. <https://karozieminski.substack.com/p/claude-design-review-prompts-figma> — Source for credit-discipline framing, session-planning advice, real-time collaboration gap.

[^vijaya]: Vijayakrishna Dev. "Designing with Precision: Advanced Prompt Strategies for Claude Design." Medium, April 2026. <https://medium.com/@vijayakrishna.rofficial/designing-with-precision-advanced-prompt-strategies-for-claude-design-b6b7387c8e80> — Source for structured-prompt-as-design-specification framing, common-mistakes list including overly generic prompts.

[^kersai]: Kersai. "Claude Design: Complete 2026 Guide for Teams & Businesses." April 2026. <https://kersai.com/claude-design-complete-guide-workflows-business-2026/> — Source for internal-tools / admin-console use case framing.

---

## Audit notes

- All claims about Claude Design specifically (features, pricing, limits, behaviors) are dated April–May 2026 and may have changed; the product is in research preview and Anthropic has flagged API access, pricing tweaks, and export fidelity improvements as in-flight.
- Section 8 (Codex handoff) is extrapolation rather than documented practice. The four-week pilot in §12 should validate the proposed adaptation.
- Section 13 (open questions) is intentionally team-specific and uncited; these are decisions to make, not facts to verify.
- All source attributions reflect content available at the listed URLs as of mid-May 2026. Several sources are individual writers' Substacks or Medium posts; treat tactical specifics from them as community wisdom rather than vendor commitments.