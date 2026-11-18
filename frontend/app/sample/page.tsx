import Link from "next/link";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#inspect", label: "What you can inspect" },
  { href: "#privacy", label: "Privacy" },
];

const STACK = [
  { name: "Ollama", items: ["nomic-embed-text", "qwen3"] },
  { name: "ChromaDB", items: ["chunks collection", "cosine index"] },
  { name: "SQLite", items: ["documents", "chunks", "chats"] },
  { name: "FastAPI", items: ["/documents", "/chat", "/retrieval"] },
];

const INGEST = ["Upload", "Extract", "Clean", "Chunk", "Embed", "Store"];
const QUERY = ["Question", "Embed", "Search", "Prompt", "Generate", "Answer"];
const MODEL_STEPS = new Set(["Embed", "Generate"]);

const PASSAGES = [
  {
    score: 0.82,
    source: "contract.pdf, page 4",
    before: "Either party may end this agreement by giving ",
    mark: "30 days written notice",
    after: " to the other party.",
  },
  {
    score: 0.74,
    source: "contract.pdf, page 4",
    before: "Notice must be delivered to the address listed in Schedule A.",
    mark: "",
    after: "",
  },
  {
    score: 0.58,
    source: "contract.pdf, page 9",
    before: "Payment is due within 14 days of each invoice.",
    mark: "",
    after: "",
  },
];

const SCORES = [
  ["Chunk 12", 0.82],
  ["Chunk 13", 0.74],
  ["Chunk 41", 0.58],
  ["Chunk 7", 0.47],
  ["Chunk 30", 0.41],
] as const;

const PROMPT_TEXT = `You answer questions using ONLY the context provided by the user.
If the context does not contain the answer, say you could not find it.`;

function SampleCaption() {
  return (
    <figcaption className="border-t border-line px-5 py-3 text-sm text-muted">
      Sample values. Your own documents produce the real thing.
    </figcaption>
  );
}

function TracePanel() {
  return (
    <figure className="rounded-md border border-line bg-pane">
      <div className="border-b border-line px-5 py-4">
        <p className="text-sm text-muted">Question</p>
        <p className="mt-1 font-medium">How much notice does either side need to give?</p>
      </div>
      <ol className="divide-y divide-line">
        {PASSAGES.map((p) => (
          <li key={p.before} className="grid grid-cols-[4.5rem_1fr] gap-4 px-5 py-4">
            <div>
              <p className="font-mono text-sm">{p.score.toFixed(2)}</p>
              <div className="mt-1 h-1.5 rounded-full bg-line">
                <div className="h-full rounded-full bg-lens" style={{ width: `${p.score * 100}%` }} />
              </div>
            </div>
            <div>
              <p className="font-mono text-[13px] leading-relaxed">
                {p.before}
                {p.mark && <mark className="marker">{p.mark}</mark>}
                {p.after}
              </p>
              <p className="mt-1 text-xs text-muted">{p.source}</p>
            </div>
          </li>
        ))}
      </ol>
      <SampleCaption />
    </figure>
  );
}

function ChunkVisual() {
  const rows = [
    ["Chunk 12, page 4, 764 characters", "Either party may end this agreement by giving 30 days written notice to the other party."],
    ["Chunk 13, page 4, 702 characters", "Notice must be delivered to the address listed in Schedule A. Delivery by email is not valid notice."],
    ["Chunk 31, page 9, 18 characters", "Page 9 Confidential"],
  ];
  return (
    <figure className="rounded-md border border-line bg-pane">
      <ul className="divide-y divide-line">
        {rows.map(([meta, text]) => (
          <li key={meta} className="px-5 py-4">
            <p className="text-sm text-muted">{meta}</p>
            <p className="mt-1 font-mono text-[13px] leading-relaxed">{text}</p>
          </li>
        ))}
      </ul>
      <SampleCaption />
    </figure>
  );
}

function SimilarityVisual() {
  return (
    <figure className="rounded-md border border-line bg-pane">
      <ul className="space-y-3 px-5 py-5">
        {SCORES.map(([label, score]) => (
          <li key={label} className="grid grid-cols-[5rem_1fr_3rem] items-center gap-3 text-sm">
            <span>{label}</span>
            <div className="h-2 rounded-full bg-line">
              <div className="h-full rounded-full bg-lens" style={{ width: `${score * 100}%` }} />
            </div>
            <span className="text-right font-mono">{score.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <SampleCaption />
    </figure>
  );
}

function PromptVisual() {
  return (
    <figure className="rounded-md border border-line bg-pane">
      <pre className="whitespace-pre-wrap px-5 py-5 font-mono text-[13px] leading-relaxed">
        {PROMPT_TEXT}
        {"\n\nContext:\n"}
        <span className="bg-marker/60">
          {"[1] (contract.pdf, page 4)\nEither party may end this agreement by giving 30 days written notice to the other party."}
        </span>
        {"\n\nQuestion: How much notice does either side need to give?"}
      </pre>
      <SampleCaption />
    </figure>
  );
}

const FEATURES = [
  {
    title: "See every chunk",
    body: "Your document is cut into pieces before anything is searched. Browse each piece with its page, length and estimated tokens, and search the text to spot cuts in the wrong place or leftover page furniture.",
    visual: <ChunkVisual />,
  },
  {
    title: "Know why a passage was chosen",
    body: "Every question retrieves a ranked list of chunks with cosine similarity scores. A weak top score is an early warning that the answer may be thin.",
    visual: <SimilarityVisual />,
  },
  {
    title: "Read the exact prompt",
    body: "The system prompt, the retrieved context and your question, as one piece of text, exactly as the model received it. Highlighted lines are what retrieval supplied.",
    visual: <PromptVisual />,
  },
];

const PRIVACY = [
  ["Local models", "Embeddings and answers come from models running in Ollama on your computer."],
  ["No data collection", "No accounts, no analytics scripts, no calls to outside services."],
  ["Delete means delete", "Removing a document deletes its file, its chunks and its vectors."],
];

function Pipeline({ title, caption, steps }: { title: string; caption: string; steps: string[] }) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-muted">{caption}</p>
      <ol className="mt-5 flex flex-wrap gap-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center">
            <span
              className={`rounded-full border px-3 py-1 text-sm font-medium ${MODEL_STEPS.has(step) ? "border-lens text-lens" : "border-ink"
                }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && <span aria-hidden className="mx-2 h-px w-4 bg-ink" />}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <span className="font-display text-lg font-semibold">RAG Inspector</span>
        <nav aria-label="Page sections" className="hidden items-center gap-6 text-sm md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="hover:underline underline-offset-4">
              {item.label}
            </a>
          ))}
          <a
            href="https://github.com/chiscookeke11/Raggy"
            className="hover:underline underline-offset-4"
          >
            GitHub
          </a>
        </nav>
        <Link
          href="/dashboard"
          className="rounded-full border border-ink px-4 py-1.5 text-sm font-medium hover:bg-ink hover:text-mist"
        >
          Open the dashboard
        </Link>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Don’t just trust the answer. Inspect how it was generated.
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg text-muted">
              RAG Inspector answers questions from your documents on your own machine, and shows every step: the
              chunks it found, how closely each one matched, and the exact prompt the model read.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-ink px-6 py-3 font-medium text-mist transition-colors hover:bg-lens"
              >
                Open the dashboard
              </Link>
              <a href="#how" className="font-medium underline underline-offset-4">
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-muted">No account, no API key. Your documents never leave this computer.</p>
          </div>
          <TracePanel />
        </section>

        {/* Stack and pipelines */}
        <section id="how" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-display text-3xl font-semibold">Built from parts you can run yourself</h2>
            <p className="mt-3 max-w-[60ch] text-muted">
              No hosted service sits behind it. Four local pieces do all of the work, and you can open any of them.
            </p>

            <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {STACK.map((group) => (
                <li key={group.name} className="border-t border-ink pt-3">
                  <p className="font-display text-lg font-semibold">{group.name}</p>
                  <ul className="mt-1 space-y-0.5 font-mono text-[13px] text-muted">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              <Pipeline title="First, the document" caption="Runs once for each file you upload." steps={INGEST} />
              <Pipeline title="Then, the question" caption="Runs every time you ask." steps={QUERY} />
            </div>
            <p className="mt-6 text-sm text-muted">Blue steps run a local model.</p>
          </div>
        </section>

        {/* Feature rows */}
        <section id="inspect" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-display text-3xl font-semibold">Follow an answer back to its source</h2>
            <p className="mt-3 max-w-[60ch] text-muted">
              Most document chat tools show an answer and nothing else. Here each stage is open to inspection.
            </p>
            <div className="mt-10">
              {FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className="grid items-center gap-10 border-t border-line py-12 lg:grid-cols-2"
                >
                  <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                    <h3 className="font-display text-2xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 max-w-[48ch] text-muted">{feature.body}</p>
                  </div>
                  <div>{feature.visual}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-display text-3xl font-semibold">Your documents stay on your machine</h2>
            <p className="mt-3 max-w-[60ch] text-muted">
              Nothing is collected because nothing is sent anywhere. That is a design rule, not a setting.
            </p>
            <dl className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-3">
              {PRIVACY.map(([term, detail]) => (
                <div key={term} className="border-t border-line pt-3">
                  <dt className="font-medium">{term}</dt>
                  <dd className="mt-1 text-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="max-w-[24ch] font-display text-4xl font-semibold leading-tight">
              Upload a document and watch it work
            </h2>
            <p className="mt-3 max-w-[52ch] text-muted">
              Drop in a PDF, text or Markdown file. You will see it processed step by step, then ask it anything.
            </p>
            <Link
              href="/dashboard"
              className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-medium text-mist transition-colors hover:bg-lens"
            >
              Open the dashboard
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted">
          <span>RAG Inspector, a portfolio project by Chinedu Okeke</span>
          <span className="flex gap-5">
            <Link href="/dashboard" className="underline underline-offset-4">
              Dashboard
            </Link>
            <a className="underline underline-offset-4" href="https://github.com/chiscookeke11/Raggy">
              Source on GitHub
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}