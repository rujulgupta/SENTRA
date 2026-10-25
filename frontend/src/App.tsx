import { useEffect, useRef, useState } from "react";

const navItems = [
  ["Dashboard", "grid"],
  ["Assessments", "shield"],
  ["Findings", "alert"],
  ["History & Comparison", "history"],
  ["Reports", "file"],
  ["Import Findings", "upload"],
] as const;

const findings = [
  { id: "SNT-2418", title: "Publicly accessible storage container", target: "assets.sentra-demo.io", severity: "Critical", status: "Needs review", age: "2h ago" },
  { id: "SNT-2413", title: "Outdated TLS protocol supported", target: "api.sentra-demo.io", severity: "High", status: "In progress", age: "Yesterday" },
  { id: "SNT-2399", title: "Missing Content Security Policy", target: "app.sentra-demo.io", severity: "Medium", status: "Open", age: "May 18" },
  { id: "SNT-2387", title: "Verbose server response header", target: "auth.sentra-demo.io", severity: "Low", status: "Accepted risk", age: "May 16" },
];

const explorerFindings = [
  { id: "SNT-2418", title: "Outdated OpenSSH service version", asset: "gateway.sentra-demo.io:22", severity: "High", priority: "High", evidence: "Supported", source: "Nmap", review: "Needs review", date: "May 21, 2025", note: "Version response observed; remediation requires owner verification." },
  { id: "SNT-2413", title: "Content Security Policy header missing", asset: "app.sentra-demo.io", severity: "Medium", priority: "Medium", evidence: "Supported", source: "Nuclei", review: "Open", date: "May 21, 2025", note: "Header absence observed on an illustrative HTTP response." },
  { id: "SNT-2408", title: "Administrative interface may be exposed", asset: "admin.sentra-demo.io", severity: "High", priority: "Critical", evidence: "Needs Verification", source: "Nuclei", review: "Needs review", date: "May 20, 2025", note: "Route signature matched; access controls were not tested." },
  { id: "SNT-2399", title: "Possible public storage misconfiguration", asset: "assets.sentra-demo.io", severity: "Critical", priority: "Critical", evidence: "Incomplete", source: "Import", review: "In progress", date: "May 18, 2025", note: "Imported scanner claim lacks a reproducible evidence attachment." },
  { id: "SNT-2387", title: "TLS 1.0 protocol support detected", asset: "api.sentra-demo.io:443", severity: "High", priority: "High", evidence: "Supported", source: "Nmap", review: "In progress", date: "May 17, 2025", note: "Protocol negotiation was recorded using a safe discovery profile." },
  { id: "SNT-2376", title: "Verbose server response header", asset: "auth.sentra-demo.io", severity: "Low", priority: "Low", evidence: "Supported", source: "Nuclei", review: "Accepted risk", date: "May 16, 2025", note: "The response exposes a server family but no confirmed exploitability." },
  { id: "SNT-2362", title: "Certificate expiry approaching", asset: "portal.sentra-demo.io:443", severity: "Medium", priority: "Medium", evidence: "Supported", source: "Nmap", review: "Open", date: "May 14, 2025", note: "Illustrative certificate metadata indicates expiry within 30 days." },
  { id: "SNT-2349", title: "Potential directory listing enabled", asset: "docs.sentra-demo.io", severity: "Medium", priority: "High", evidence: "Needs Verification", source: "Import", review: "Needs review", date: "May 12, 2025", note: "Imported response excerpt is incomplete and requires manual confirmation." },
];

const assessmentHistory = [
  { id: "A-1042", name: "Customer portal — Q2 review", target: "app.sentra-demo.io", date: "May 21, 2025", findings: 8, critical: 2, high: 2, medium: 2, low: 1, informational: 1, status: "Completed", source: "Nmap + Nuclei", report: true, scope: "Domain · web + service checks", findingIds: ["SNT-2418","SNT-2413","SNT-2408","SNT-2399","SNT-2387","SNT-2376","SNT-2362","SNT-2349"] },
  { id: "A-1018", name: "Customer portal — post-release", target: "app.sentra-demo.io", date: "May 6, 2025", findings: 6, critical: 1, high: 2, medium: 2, low: 1, informational: 0, status: "Completed", source: "Nmap + Nuclei", report: true, scope: "Domain · web + service checks", findingIds: ["SNT-2418","SNT-2413","SNT-2408","SNT-2387","SNT-2376","SNT-2349"] },
  { id: "A-0981", name: "Customer portal — April baseline", target: "app.sentra-demo.io", date: "Apr 15, 2025", findings: 5, critical: 1, high: 2, medium: 1, low: 1, informational: 0, status: "Completed", source: "Nmap + Nuclei", report: true, scope: "Domain · web + service checks", findingIds: ["SNT-2418","SNT-2408","SNT-2387","SNT-2376","SNT-2349"] },
  { id: "A-0956", name: "Public API — quarterly review", target: "api.sentra-demo.io", date: "Mar 28, 2025", findings: 3, critical: 0, high: 1, medium: 2, low: 0, informational: 0, status: "Completed", source: "Nmap", report: true, scope: "Domain · service checks", findingIds: ["SNT-2387","SNT-2362","SNT-2413"] },
  { id: "A-0924", name: "Public API — validation run", target: "api.sentra-demo.io", date: "Mar 12, 2025", findings: 2, critical: 0, high: 1, medium: 1, low: 0, informational: 0, status: "Completed", source: "Nmap", report: false, scope: "Domain · service checks", findingIds: ["SNT-2387","SNT-2362"] },
  { id: "A-0897", name: "Customer portal — limited scope", target: "app.sentra-demo.io", date: "Feb 20, 2025", findings: 3, critical: 0, high: 1, medium: 1, low: 1, informational: 0, status: "Partial", source: "Nuclei", report: false, scope: "Domain · web checks only", findingIds: ["SNT-2413","SNT-2408","SNT-2376"] },
];

const assetInventory = [
  { id: "AST-001", host: "app.sentra-demo.io", ip: "192.0.2.21", services: ["HTTPS · 443"], findings: 9, severity: "High", exposure: "Public-facing", last: "May 21, 2025", evidence: "DNS resolution and HTTPS response are included in the illustrative assessment record.", findingIds: ["SNT-2413","SNT-2399"] },
  { id: "AST-002", host: "gateway.sentra-demo.io", ip: "198.51.100.14", services: ["SSH · 22", "HTTPS · 443"], findings: 8, severity: "High", exposure: "Needs Verification", last: "May 21, 2025", evidence: "Service fingerprints are present, but external reachability was not independently verified.", findingIds: ["SNT-2418","SNT-2387"] },
  { id: "AST-003", host: "api.sentra-demo.io", ip: "192.0.2.44", services: ["HTTPS · 443"], findings: 7, severity: "High", exposure: "Public-facing", last: "May 20, 2025", evidence: "The authorized target returned an illustrative HTTPS service response.", findingIds: ["SNT-2387","SNT-2362"] },
  { id: "AST-004", host: "assets.sentra-demo.io", ip: "192.0.2.73", services: ["HTTP · 80", "HTTPS · 443"], findings: 6, severity: "Critical", exposure: "Unknown", last: "May 18, 2025", evidence: "Imported evidence does not establish whether the service is internet-accessible.", findingIds: ["SNT-2399"] },
  { id: "AST-005", host: "admin.sentra-demo.io", ip: "198.51.100.38", services: ["HTTPS · 443"], findings: 5, severity: "Critical", exposure: "Needs Verification", last: "May 20, 2025", evidence: "An administrative route signature was observed; access controls were not tested.", findingIds: ["SNT-2408"] },
];

type RemediationStatus = "Open" | "In Progress" | "Awaiting Verification" | "Fixed" | "Accepted Risk";
type RemediationRecord = {
  findingId: string;
  status: RemediationStatus;
  assignee: string;
  targetDate: string;
  notes: string;
  verified: boolean;
};

const initialRemediationRecords: RemediationRecord[] = [
  { findingId: "SNT-2418", status: "In Progress", assignee: "Marcus Chen", targetDate: "2025-05-30", notes: "Confirm package source and supported vendor release before scheduling the update.", verified: false },
  { findingId: "SNT-2413", status: "Open", assignee: "Elena Marlow", targetDate: "2025-06-04", notes: "", verified: false },
  { findingId: "SNT-2408", status: "Awaiting Verification", assignee: "Priya Nair", targetDate: "2025-05-27", notes: "Access control was added; independent verification is still required.", verified: false },
  { findingId: "SNT-2399", status: "Open", assignee: "Unassigned", targetDate: "", notes: "Imported evidence is incomplete.", verified: false },
  { findingId: "SNT-2387", status: "Fixed", assignee: "Marcus Chen", targetDate: "2025-05-20", notes: "Illustrative corrective evidence reviewed in the prototype.", verified: true },
  { findingId: "SNT-2376", status: "Accepted Risk", assignee: "Elena Marlow", targetDate: "2025-08-16", notes: "Illustrative risk acceptance with quarterly review.", verified: false },
  { findingId: "SNT-2362", status: "In Progress", assignee: "Priya Nair", targetDate: "2025-05-28", notes: "", verified: false },
  { findingId: "SNT-2349", status: "Awaiting Verification", assignee: "Unassigned", targetDate: "", notes: "Confirm directory behavior with the asset owner.", verified: false },
];

const learningTopics = [
  { id: "open-ports", title: "Open Ports & Exposed Services", category: "Network exposure", icon: "search", summary: "Understand what listening ports reveal and when exposure becomes meaningful risk.", importance: "An open port is not automatically a vulnerability. Risk depends on the service, its configuration, network reachability and whether access is expected.", example: "Port 22 may be appropriate for a managed administration network but require investigation when exposed broadly to the internet.", connection: "SENTRA preserves the detected host, port, service fingerprint and source evidence so reviewers can distinguish expected exposure from an actionable finding.", docs: ["Nmap service detection reference", "CISA exposure reduction guidance"] },
  { id: "cves", title: "CVEs & Known Vulnerabilities", category: "Vulnerability context", icon: "alert", summary: "Learn what CVE identifiers mean—and what they do not prove about your system.", importance: "A CVE links to a publicly documented weakness. A version match may suggest relevance, but backported fixes and configuration differences can change practical exposure.", example: "A scanner may associate an OpenSSH banner with a CVE even when the operating system vendor has backported the relevant patch.", connection: "SENTRA separates the scanner’s original CVE claim from available evidence and explicitly lists what remains unverified.", docs: ["CVE Program overview", "NVD vulnerability records"] },
  { id: "severity-risk", title: "Severity vs. Practical Risk", category: "Prioritization", icon: "trend", summary: "Separate a scanner’s technical severity from the priority appropriate for your environment.", importance: "Severity describes potential technical impact. Practical risk also considers exposure, evidence strength, asset importance and existing controls.", example: "A high-severity issue on an isolated training host may be lower priority than a supported medium-severity issue on a public identity service.", connection: "SENTRA preserves original severity while showing a separate suggested priority with visible reasoning factors.", docs: ["CVSS specification", "NIST risk assessment guidance"] },
  { id: "uncertainty", title: "Evidence & Uncertainty", category: "Evidence review", icon: "file", summary: "Evaluate what scanner evidence supports, what is missing and what still needs verification.", importance: "Automated observations vary in strength. Clear uncertainty prevents a plausible signature from being treated as proof of exploitability.", example: "A response header can support the presence of a server family while remaining insufficient to confirm an exact vulnerable patch level.", connection: "Evidence states—Supported, Incomplete and Needs Verification—make uncertainty visible without presenting AI confidence as correctness.", docs: ["NIST vulnerability validation guidance", "SENTRA evidence states"] },
  { id: "false-positives", title: "Recognizing False Positives", category: "Human review", icon: "check", summary: "Identify observations that match a rule but do not represent the claimed condition.", importance: "False positives consume remediation effort and weaken trust. They should be documented with evidence rather than dismissed without explanation.", example: "A custom login route may match an administrative-panel template while still being protected by network and identity controls.", connection: "Reviewers can mark a finding false positive, attach rationale and preserve the decision in verification history.", docs: ["OWASP testing methodology", "SENTRA human review workflow"] },
  { id: "misconfigurations", title: "Security Misconfigurations", category: "Configuration", icon: "settings", summary: "Understand unsafe defaults, missing controls and configuration drift.", importance: "Many findings arise from how software is deployed rather than defects in the software itself. Context determines whether a configuration is intentional.", example: "Directory listing may expose files when enabled on a public path, but be harmless inside a purpose-built local lab.", connection: "SENTRA connects configuration observations to the affected asset, evidence, authorized scope and reviewer notes.", docs: ["OWASP Security Misconfiguration", "CIS Benchmarks overview"] },
  { id: "remediation", title: "Planning Remediation", category: "Resolution", icon: "history", summary: "Turn evidence into safe, verifiable corrective action.", importance: "Good remediation addresses the cause, respects operational constraints and includes a way to verify the result.", example: "Updating a service should include confirming the installed package, testing compatibility and repeating an authorized evidence check.", connection: "SENTRA suggestions are organized into inspect, change, verify and limitations steps that require owner approval.", docs: ["NIST patch management planning", "CISA remediation guidance"] },
  { id: "authorized-testing", title: "Authorized Security Testing", category: "Safety", icon: "shield", summary: "Define permission, scope and safe testing boundaries before assessment.", importance: "Security testing without explicit authorization can cause harm and create legal or operational risk. Scope must be precise and documented.", example: "Permission for app.example.com does not automatically authorize related subdomains, hosting infrastructure or third-party services.", connection: "SENTRA requires authorization confirmation, enforces exact target scope and does not automatically expand assessments.", docs: ["CISA vulnerability disclosure guidance", "NIST rules of engagement guidance"] },
];

const pageCopy: Record<string, [string, string]> = {
  Assessments: ["Assessments", "Create and manage evidence-based reviews across your digital estate."],
  Findings: ["Finding registry", "Prioritize, assign and document the issues that matter."],
  "History & Comparison": ["History & comparison", "Understand how security posture changes between assessments."],
  Reports: ["Reports", "Prepare clear, review-ready summaries for stakeholders."],
  "Import Findings": ["Import findings", "Bring scanner output into one consistent review workflow."],
  "Learning Center": ["Learning center", "Practical guidance for understanding and resolving common findings."],
  Settings: ["Workspace settings", "Manage organization details, integrations and review preferences."],
};

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>,
    alert: <><path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5m4-2v6l4 2"/></>,
    file: <><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/></>,
    upload: <><path d="M12 3v13m-5-8 5-5 5 5"/><path d="M5 15v5h14v-5"/></>,
    book: <><path d="M4 4h6a2 2 0 0 1 2 2v15a3 3 0 0 0-3-3H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v15a3 3 0 0 1 3-3h5z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    trend: <path d="m3 17 6-6 4 4 8-9m-5 0h5v5"/>,
    external: <path d="M14 3h7v7m0-7-9 9M19 13v7H4V5h7"/>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ children, variant = "primary", onClick, disabled = false }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; onClick?: () => void; disabled?: boolean }) {
  return <button className={`button ${variant}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Badge({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`badge ${tone.toLowerCase().replaceAll(" ", "-")}`}><i />{children}</span>;
}

function Sidebar({ active, setActive, open, close, workspace, workspaces, selectWorkspace, addWorkspace }: { active: string; setActive: (s: string) => void; open: boolean; close: () => void; workspace: string; workspaces: string[]; selectWorkspace: (name: string) => void; addWorkspace: (name: string) => void }) {
  const [workspaceMenu, setWorkspaceMenu] = useState(false);
  const [workspaceDialog, setWorkspaceDialog] = useState<"switch" | "create" | null>(null);
  const [newWorkspace, setNewWorkspace] = useState("");
  const [workspaceError, setWorkspaceError] = useState("");
  const [workspaceNotice, setWorkspaceNotice] = useState("");
  const workspaceRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const outside = (event: MouseEvent) => { if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) setWorkspaceMenu(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") {setWorkspaceMenu(false);setWorkspaceDialog(null);} };
    document.addEventListener("mousedown",outside); document.addEventListener("keydown",escape);
    return () => {document.removeEventListener("mousedown",outside);document.removeEventListener("keydown",escape);};
  },[]);
  const notifyWorkspace = (message: string) => { setWorkspaceNotice(message); setTimeout(() => setWorkspaceNotice(""),2600); };
  const createWorkspace = (event: React.FormEvent) => { event.preventDefault(); const value = newWorkspace.trim(); if (value.length < 3) return setWorkspaceError("Enter a workspace name with at least 3 characters."); if (workspaces.some((item) => item.toLowerCase() === value.toLowerCase())) return setWorkspaceError("A demo workspace with this name already exists."); addWorkspace(value); notifyWorkspace(`${value} created and selected.`); setNewWorkspace(""); setWorkspaceError(""); setWorkspaceDialog(null); setWorkspaceMenu(false); };
  return <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="brand"><div className="mark"><span/><span/><span/></div><div><strong>SENTRA</strong><small>Security clarity for safer systems</small></div><button className="mobile-close" onClick={close} aria-label="Close navigation"><Icon name="close"/></button></div>
    <nav aria-label="Primary navigation"><p className="nav-label">Security workspace</p>{navItems.map(([label, icon]) => <button key={label} className={`nav-item ${active === label || (["New Assessment", "Scan Progress"].includes(active) && label === "Assessments") || (["Finding Details","Remediation"].includes(active) && label === "Findings") || (["Asset Inventory","Asset Details"].includes(active) && label === "Dashboard") ? "active" : ""}`} onClick={() => {setActive(label);close();}}><Icon name={icon}/><span>{label}</span>{label === "Findings" && <em>12</em>}</button>)}</nav>
    <div className="sidebar-secondary"><button className={`nav-item ${active === "Settings" || active === "Workspace Settings" ? "active" : ""}`} onClick={() => {setActive("Settings");close();}}><Icon name="settings"/><span>Settings</span></button></div>
    <div className="workspace-switcher" ref={workspaceRef}>
      {workspaceMenu && <div className="workspace-menu" role="menu"><div><span className="workspace-menu-icon">{workspace.slice(0,2).toUpperCase()}</span><p><strong>{workspace}</strong><small>Current workspace</small></p><Icon name="check" size={14}/></div><i/><button role="menuitem" onClick={() => {setWorkspaceMenu(false);setActive("Workspace Settings");}}><Icon name="settings" size={15}/><span>Workspace Settings</span></button><button role="menuitem" onClick={() => {setWorkspaceMenu(false);setWorkspaceDialog("switch");}}><Icon name="history" size={15}/><span>Switch Workspace</span></button><button role="menuitem" onClick={() => {setWorkspaceMenu(false);setWorkspaceDialog("create");}}><Icon name="plus" size={15}/><span>Create Workspace</span></button><small>Demo workspace controls</small></div>}
      <button className="sidebar-foot" onClick={() => setWorkspaceMenu(!workspaceMenu)} aria-expanded={workspaceMenu} aria-haspopup="menu"><div className="workspace-icon">{workspace.slice(0,2).toUpperCase()}</div><div><strong>{workspace}</strong><span>Prototype workspace</span></div><span className={`workspace-chevron ${workspaceMenu ? "open" : ""}`}>⌄</span></button>
    </div>
    {workspaceDialog && <div className="modal-backdrop" onMouseDown={() => setWorkspaceDialog(null)}><section className="modal workspace-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true"><div className="modal-head"><div><p className="eyebrow">Prototype workspaces</p><h2>{workspaceDialog === "switch" ? "Switch workspace" : "Create workspace"}</h2></div><button className="icon-button" onClick={() => setWorkspaceDialog(null)} aria-label="Close"><Icon name="close"/></button></div>{workspaceDialog === "switch" ? <><p className="modal-description">Choose an illustrative workspace. No organization permissions are changed.</p><div className="workspace-options">{workspaces.map((item) => <button key={item} className={workspace === item ? "selected" : ""} onClick={() => {selectWorkspace(item);notifyWorkspace(`Switched to ${item}.`);setWorkspaceDialog(null);}}><span>{item.slice(0,2).toUpperCase()}</span><p><strong>{item}</strong><small>{item === workspace ? "Current workspace" : "Demo workspace"}</small></p>{item === workspace && <Icon name="check" size={15}/>}</button>)}</div></> : <form onSubmit={createWorkspace} noValidate><p className="modal-description">Add a workspace to this browser session for prototype navigation.</p><label className={`field ${workspaceError ? "field-error" : ""}`}>Workspace name<input autoFocus value={newWorkspace} onChange={(e) => {setNewWorkspace(e.target.value);setWorkspaceError("");}} placeholder="e.g. Security Research Lab"/><small>{workspaceError || "Use a recognizable organization or project name."}</small></label><div className="modal-actions"><Button variant="secondary" onClick={() => setWorkspaceDialog(null)}>Cancel</Button><button className="button primary" type="submit">Create Workspace</button></div></form>}</section></div>}
    {workspaceNotice && <div className="workspace-toast"><Icon name="check" size={14}/><span>{workspaceNotice}<small>Prototype workspace state only.</small></span></div>}
  </aside>;
}

function Header({ onMenu, active, navigate, logout, workspace }: { onMenu: () => void; active: string; navigate: (page: string) => void; logout: (screen?: AuthScreen) => void; workspace: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [dialog, setDialog] = useState<"profile" | "password" | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profileName, setProfileName] = useState("Elena Marlow");
  const [profileEmail, setProfileEmail] = useState("elena@arcadian.example");
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); setNotifications(false); setDialog(null); } };
    document.addEventListener("mousedown",close); document.addEventListener("keydown",escape);
    return () => { document.removeEventListener("mousedown",close); document.removeEventListener("keydown",escape); };
  },[]);
  useEffect(() => {
    if (menuOpen) requestAnimationFrame(() => menuRef.current?.querySelector<HTMLButtonElement>(".profile-menu > button")?.focus());
  },[menuOpen]);
  const searchResults = explorerFindings.filter((item) => `${item.title} ${item.asset} ${item.id}`.toLowerCase().includes(query.toLowerCase())).slice(0,4);
  const choose = (action: string) => {
    setMenuOpen(false);
    if (action === "settings") navigate("Settings");
    if (action === "logout") logout("signin");
    if (action === "forgot") logout("forgot");
    if (action === "profile" || action === "password") setDialog(action);
  };
  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    if (profileName.trim().length < 2) return setProfileError("Enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileEmail)) return setProfileError("Enter a valid email address.");
    setProfileError(""); setProfileSaved(true); setTimeout(() => setProfileSaved(false),2500);
  };
  const savePassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentPassword) return setPasswordError("Enter your current password.");
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) return setPasswordError("Use 8+ characters with an uppercase letter and number.");
    if (newPassword !== confirmNewPassword) return setPasswordError("New passwords do not match.");
    setPasswordError(""); setPasswordSaved(true); setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
  };
  return <header className="topbar">
    <button className="menu-button" onClick={onMenu} aria-label="Open navigation"><Icon name="menu" /></button>
    <div className="page-context"><span>{workspace}</span><strong>{active === "Dashboard" ? "Security Dashboard" : active}</strong></div>
    <div className="header-search"><label className="global-search"><Icon name="search" size={17}/><input aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search findings and assets…"/><kbd>⌘ K</kbd></label>{query && <div className="search-popover"><span>Search results</span>{searchResults.length ? searchResults.map((result) => <button key={result.id} onClick={() => {setQuery("");navigate("Findings");}}><Icon name="alert" size={14}/><div><strong>{result.title}</strong><small>{result.asset} · {result.id}</small></div><Badge tone={result.severity}>{result.severity}</Badge></button>) : <p>No sample findings match “{query}”.</p>}</div>}</div>
    <div className="top-actions">
      <div className="notification-wrap"><button className="icon-button" aria-label="Notifications" onClick={() => setNotifications(!notifications)}><Icon name="bell" /><span className="notification-dot" /></button>{notifications && <div className="notification-panel"><div><strong>Notifications</strong><button onClick={() => setNotifications(false)}><Icon name="close" size={14}/></button></div><button onClick={() => {setNotifications(false);navigate("Findings");}}><span className="notice-dot critical"/><p><strong>2 critical findings need review</strong><small>Customer portal assessment · 8 min ago</small></p></button><button onClick={() => {setNotifications(false);navigate("Reports");}}><span className="notice-dot"/><p><strong>Assessment report is ready</strong><small>Generated today at 11:28 AM</small></p></button><footer>Illustrative prototype notifications</footer></div>}</div>
      <div className="divider" />
      <div className="profile-wrap" ref={menuRef}><button ref={profileButtonRef} className="profile" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-haspopup="menu"><span>EM</span><div><strong>{profileName}</strong><small>Security lead</small></div><span className="chevron" aria-hidden="true">⌄</span></button>{menuOpen && <div className="profile-menu" role="menu"><div className="profile-menu-head"><span>EM</span><p><strong>{profileName}</strong><small>{profileEmail}</small></p></div>{[["My Profile","grid","profile"],["Account Settings","settings","settings"],["Change Password","shield","password"],["Forgot Password","history","forgot"]].map(([label,icon,action]) => <button role="menuitem" key={label} onClick={() => choose(action)}><Icon name={icon} size={15}/>{label}</button>)}<i/><button role="menuitem" className="logout-action" onClick={() => choose("logout")}><Icon name="close" size={15}/>Log Out</button><small>Prototype account controls</small></div>}</div>
    </div>
    {dialog && <div className="modal-backdrop" onMouseDown={() => setDialog(null)}><section className="modal account-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="account-dialog-title"><div className="modal-head"><div><p className="eyebrow">Prototype account</p><h2 id="account-dialog-title">{dialog === "profile" ? "My Profile" : "Change Password"}</h2></div><button className="icon-button" onClick={() => setDialog(null)} aria-label="Close dialog"><Icon name="close"/></button></div>{dialog === "profile" && <form onSubmit={saveProfile} noValidate><div className="modal-profile"><span>EM</span><div><strong>{profileName}</strong><small>Security lead · Arcadian Systems</small></div></div><label className={`field ${profileError.includes("name") ? "field-error" : ""}`}>Full name<input value={profileName} onChange={(e) => {setProfileName(e.target.value);setProfileError("");}}/></label><label className={`field ${profileError.includes("email") ? "field-error" : ""}`}>Email address<input type="email" value={profileEmail} onChange={(e) => {setProfileEmail(e.target.value);setProfileError("");}}/></label>{profileError && <p className="validation-message"><Icon name="alert" size={13}/>{profileError}</p>}{profileSaved && <div className="settings-result success"><Icon name="check"/><span><strong>Profile updated</strong>Changes are retained for this prototype session.</span></div>}<div className="modal-actions"><Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button><button className="button primary" type="submit">Save Profile</button></div></form>}{dialog === "password" && <form onSubmit={savePassword} noValidate><label className="field">Current password<input type="password" value={currentPassword} onChange={(e) => {setCurrentPassword(e.target.value);setPasswordError("");}} placeholder="Enter current password"/></label><label className="field">New password<input type="password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value);setPasswordError("");}} placeholder="At least 8 characters"/></label><label className="field">Confirm new password<input type="password" value={confirmNewPassword} onChange={(e) => {setConfirmNewPassword(e.target.value);setPasswordError("");}} placeholder="Repeat new password"/></label><p className="password-guidance">Use at least 8 characters with an uppercase letter and number.</p>{passwordError && <p className="validation-message"><Icon name="alert" size={13}/>{passwordError}</p>}{passwordSaved && <div className="settings-result success"><Icon name="check"/><span><strong>Password updated in prototype</strong>No password was stored or changed on a server.</span></div>}<div className="modal-actions"><Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button><button className="button primary" type="submit">Update Password</button></div></form>}</section></div>}
  </header>;
}

function AssessmentModal({ close, created }: { close: () => void; created: () => void }) {
  return <div className="modal-backdrop" onMouseDown={close}>
    <section className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-head"><div><p className="eyebrow">New assessment</p><h2 id="modal-title">Define the review scope</h2></div><button className="icon-button" onClick={close}><Icon name="close" /></button></div>
      <p className="modal-copy">Create a workspace for imported evidence and human review. No scan will be performed.</p>
      <label className="field">Assessment name<input defaultValue="Customer portal review — Q2" /></label>
      <label className="field">Primary target<input defaultValue="app.sentra-demo.io" /></label>
      <div className="field-row"><label className="field">Framework<select defaultValue="owasp"><option value="owasp">OWASP ASVS 4.0</option><option value="nist">NIST CSF 2.0</option></select></label><label className="field">Review owner<select><option>Elena Marlow</option><option>Marcus Chen</option></select></label></div>
      <div className="note"><Icon name="shield" /><span><strong>Evidence-first by design</strong>This creates a review shell. Add scanner exports or documented observations after creation.</span></div>
      <div className="modal-actions"><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={created}>Create assessment</Button></div>
    </section>
  </div>;
}

function Dashboard({ start, navigate, openFinding, openAsset, remediationRecords, openRemediation }: { start: () => void; navigate: (page: string) => void; openFinding: (finding: typeof explorerFindings[number]) => void; openAsset: (asset: typeof assetInventory[number]) => void; remediationRecords: RemediationRecord[]; openRemediation: (findingId: string) => void }) {
  const attention = explorerFindings.slice(0,4);
  const remediationCounts = (["Open","In Progress","Awaiting Verification","Fixed","Accepted Risk"] as RemediationStatus[]).map((status) => [status,remediationRecords.filter((record) => record.status === status).length] as const);
  const eligibleRemediation = remediationRecords.filter((record) => record.status !== "Accepted Risk");
  const verifiedFixed = eligibleRemediation.filter((record) => record.status === "Fixed" && record.verified).length;
  const remediationRate = eligibleRemediation.length ? Math.round(verifiedFixed / eligibleRemediation.length * 100) : null;
  return <div className="overview-dashboard security-operations-dashboard">
    <section className="overview-heading"><div><p className="eyebrow">Tuesday, May 21 · Illustrative workspace</p><h1>Security Dashboard</h1><p>Understand your exposure and focus on what needs attention.</p></div><Button onClick={start}><Icon name="plus" size={16}/>New Assessment</Button></section>
    <div className="security-overview-row">
      <section className="panel security-severity-panel"><div className="overview-section-head"><div><h2>Security Findings by Severity</h2><p>Original scanner ratings across open example findings</p></div><button onClick={() => navigate("Findings")}>Explore findings <Icon name="arrow" size={13}/></button></div><div className="severity-bars">{[["Critical",6,38],["High",12,75],["Medium",16,100],["Low",9,56],["Informational",5,31]].map(([label,count,width]) => <div key={label}><span><i className={String(label).toLowerCase()}/>{label}</span><div><b className={String(label).toLowerCase()} style={{width:`${width}%`}}/></div><strong>{count}</strong></div>)}</div><p className="chart-caption"><Icon name="shield" size={13}/>48 illustrative findings · Severity remains separate from SENTRA suggested priority.</p></section>
      <section className="panel sentra-insights"><div className="insight-label"><Icon name="shield" size={15}/><span>SENTRA Insights</span><Badge tone="Needs Verification">Illustrative</Badge></div><h2>Verify the exposed administrative interface first.</h2><p>The available evidence suggests the interface may be reachable, but further verification is required to determine actual exposure and access controls.</p><dl><div><dt>Priority recommendation</dt><dd><Badge tone="Critical">Critical</Badge></dd></div><div><dt>Evidence limitation</dt><dd>Route signature only</dd></div><div><dt>Affected asset</dt><dd className="mono">admin.sentra-demo.io</dd></div></dl><Button onClick={() => openFinding(explorerFindings[2])}>Review Finding <Icon name="arrow" size={13}/></Button></section>
    </div>
    <section className="panel dashboard-findings-table"><div className="overview-section-head"><div><h2>Findings Requiring Attention</h2><p>Evidence-aware examples awaiting analyst review</p></div><button onClick={() => navigate("Findings")}>View all findings <Icon name="arrow" size={13}/></button></div><div className="table-wrap"><table><thead><tr><th>Finding title</th><th>Affected host or asset</th><th>Port / service</th><th>Original severity</th><th>Suggested priority</th><th>Evidence status</th><th/></tr></thead><tbody>{attention.map((item,index) => <tr key={item.id} className="clickable-row" tabIndex={0} onClick={() => openFinding(item)} onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") openFinding(item);}}><td><strong>{item.title}</strong><span>{item.id} · Example finding</span></td><td className="mono">{item.asset.split(":")[0]}</td><td>{item.asset.includes(":") ? item.asset.split(":")[1] : index === 1 ? "HTTPS" : "Web service"}</td><td><Badge tone={item.severity}>{item.severity}</Badge></td><td><Badge tone={item.priority}>{item.priority}</Badge></td><td><span className={`evidence-badge ${item.evidence.toLowerCase().replace(" ","-")}`}>{item.evidence}</span></td><td><button className="review-table-action" onClick={(e) => {e.stopPropagation();openFinding(item);}}>Review <Icon name="arrow" size={13}/></button></td></tr>)}</tbody></table></div></section>
    <section className="panel dashboard-assets"><div className="overview-section-head"><div><h2>Asset Exposure Overview</h2><p>Understand your hosts, exposed services, and associated security findings.</p></div><button onClick={() => navigate("Asset Inventory")}>View All Assets <Icon name="arrow" size={13}/></button></div><div className="asset-summary">{[["Total Assets",assetInventory.length],["Assets with Open Findings",assetInventory.filter((item) => item.findings > 0).length],["Exposed Services",assetInventory.reduce((total,item) => total + item.services.length,0)],["Assets Requiring Review",assetInventory.filter((item) => item.exposure === "Needs Verification" || item.exposure === "Unknown").length]].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="table-wrap"><table><thead><tr><th>Asset / Hostname</th><th>IP Address</th><th>Detected Services</th><th>Open Findings</th><th>Highest Severity</th><th>Exposure Status</th><th>Last Assessed</th><th/></tr></thead><tbody>{assetInventory.map((asset) => <tr key={asset.id} className="clickable-row" tabIndex={0} onClick={() => openAsset(asset)} onKeyDown={(e) => {if(e.key === "Enter" || e.key === " ") openAsset(asset);}}><td><strong>{asset.host}</strong><span>{asset.id} · Illustrative asset</span></td><td className="mono">{asset.ip}</td><td>{asset.services.length > 1 ? `${asset.services.length} detected services` : asset.services[0]}</td><td><strong className="asset-finding-count">{asset.findings}</strong></td><td><Badge tone={asset.severity}>{asset.severity}</Badge></td><td><span className={`exposure-badge ${asset.exposure.toLowerCase().replaceAll(" ","-")}`}><i/>{asset.exposure}</span></td><td>{asset.last}</td><td><button className="row-action" aria-label={`Open ${asset.host}`}><Icon name="arrow" size={14}/></button></td></tr>)}</tbody></table></div></section>
    <section className="panel dashboard-remediation"><div className="overview-section-head"><div><h2>Remediation Progress</h2><p>Track findings from discovery through verification and resolution.</p></div><button onClick={() => navigate("Remediation")}>View All Remediation <Icon name="arrow" size={13}/></button></div><div className="remediation-overview"><div className="remediation-statuses">{remediationCounts.map(([status,count]) => <div key={status}><span className={`remediation-dot ${status.toLowerCase().replaceAll(" ","-")}`}/><p><small>{status}</small><strong>{count}</strong></p></div>)}</div><div className="remediation-rate"><div><span>Verified remediation rate</span><strong>{remediationRate === null ? "No remediation data yet" : `${remediationRate}%`}</strong></div><div className="remediation-rate-bar"><i style={{width: `${remediationRate || 0}%`}}/></div><small>Verified Fixed ÷ eligible findings. Accepted risk is excluded; reopened findings return to the denominator.</small></div></div><div className="table-wrap remediation-dashboard-table"><table><thead><tr><th>Finding Title</th><th>Affected Asset</th><th>Original Severity</th><th>Suggested Priority</th><th>Remediation Status</th><th>Assigned To</th><th>Target Date</th><th/></tr></thead><tbody>{remediationRecords.slice(0,4).map((record) => {const finding = explorerFindings.find((item) => item.id === record.findingId)!; return <tr key={record.findingId} className="clickable-row" tabIndex={0} onClick={() => openRemediation(record.findingId)} onKeyDown={(e) => {if(e.key === "Enter") openRemediation(record.findingId);}}><td><strong>{finding.title}</strong><span>{finding.id} · Illustrative workflow</span></td><td className="mono">{finding.asset}</td><td><Badge tone={finding.severity}>{finding.severity}</Badge></td><td><Badge tone={finding.priority}>{finding.priority}</Badge></td><td><span className={`remediation-badge ${record.status.toLowerCase().replaceAll(" ","-")}`}><i/>{record.status}</span></td><td>{record.assignee}</td><td>{record.targetDate || "Not set"}</td><td><button className="review-table-action">Manage <Icon name="arrow" size={13}/></button></td></tr>;})}</tbody></table></div><p className="remediation-prototype-note"><Icon name="alert" size={13}/>All remediation states are illustrative prototype records. “Fixed” is shown only where the demo record includes reviewer verification.</p></section>
    <div className="dashboard-lower-grid">
      <section className="panel recent-assessments"><div className="overview-section-head"><div><h2>Recent Assessments</h2><p>Latest authorized assessment activity</p></div><button onClick={() => navigate("Assessments")}>View all assessments <Icon name="arrow" size={13}/></button></div><div className="table-wrap"><table><thead><tr><th>Assessment name</th><th>Target</th><th>Date</th><th>Scan status</th><th>Findings</th></tr></thead><tbody>{assessmentHistory.slice(0,4).map((item) => <tr key={item.id} className="clickable-row" tabIndex={0} onClick={() => navigate("History & Comparison")} onKeyDown={(e) => {if(e.key === "Enter") navigate("History & Comparison");}}><td><strong>{item.name}</strong><span>{item.id}</span></td><td className="mono">{item.target}</td><td>{item.date}</td><td><Badge tone={item.status}>{item.status}</Badge></td><td><strong className="assessment-count">{item.findings}</strong></td></tr>)}</tbody></table></div></section>
      <section className="panel compact-activity"><div className="overview-section-head"><div><h2>Assessment Activity</h2><p>Recent workspace events</p></div></div><div className="overview-activity">{[["check","Assessment completed","Customer portal — Q2 review","10:47 AM"],["alert","Finding reviewed","Outdated OpenSSH service version","10:24 AM"],["file","Report generated","Customer portal security report","Yesterday"],["upload","Findings imported","External scanner results · 42 rows","May 20"]].map(([icon,title,copy,time]) => <div key={title}><span><Icon name={icon} size={14}/></span><p><strong>{title}</strong><small>{copy}</small></p><time>{time}</time></div>)}</div><p className="sample-activity-note"><Icon name="alert" size={13}/>Sample activity only. No real scans have been performed.</p></section>
    </div>
  </div>;
}

function NewAssessment({ cancel, complete }: { cancel: () => void; complete: () => void }) {
  const [targetType, setTargetType] = useState("Domain");
  const [target, setTarget] = useState("");
  const [name, setName] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [nmap, setNmap] = useState(true);
  const [nuclei, setNuclei] = useState(false);
  const [step, setStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const targetValid = targetType === "Domain"
    ? /^(?=.{3,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(target)
    : targetType === "IP Address"
      ? /^(\d{1,3}\.){3}\d{1,3}$/.test(target) && target.split(".").every((part) => Number(part) <= 255)
      : /^(localhost|127\.0\.0\.1|[a-zA-Z0-9-]+\.local)$/.test(target);
  const review = () => {
    setTouched(true);
    if (targetValid && authorized) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const formatHint = targetType === "Domain" ? "Example: app.example.com" : targetType === "IP Address" ? "Example: 192.0.2.24" : "Example: localhost or training-lab.local";

  if (step === 2) {
    return <><section className="confirmation-page">
      <div className="confirmation-mark"><Icon name="shield" size={28}/></div>
      <p className="eyebrow">Final confirmation</p>
      <h1>Ready to start this assessment?</h1>
      <p>Review the authorization and exact scope one last time. This prototype will not perform a real scan.</p>
      <div className="final-scope"><span>Authorized target</span><strong>{target}</strong><small>{targetType} · Exact target only · No scope expansion</small></div>
      <label className="confirm-line"><Icon name="check" size={16}/><span>I confirmed ownership or explicit permission for this target.</span></label>
      <div className="confirmation-actions"><Button variant="secondary" onClick={() => setStep(1)}>Back to review</Button><Button onClick={() => setConfirmOpen(true)}><Icon name="shield" size={16}/>Start Assessment</Button></div>
      <p className="prototype-note"><Icon name="alert" size={14}/> Prototype interaction only. No scanner, network request or security analysis will run.</p>
    </section>{confirmOpen && <div className="modal-backdrop" onMouseDown={() => setConfirmOpen(false)}><section className="modal scan-confirm-modal" onMouseDown={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-labelledby="scan-confirm-title"><div className="modal-head"><div><p className="eyebrow">Final authorization check</p><h2 id="scan-confirm-title">Start this assessment?</h2></div><button className="icon-button" onClick={() => setConfirmOpen(false)}><Icon name="close"/></button></div><p>Confirm the exact authorized target before continuing. SENTRA will not expand this scope.</p><div className="confirm-scope-row"><span>Authorized target</span><strong className="mono">{target}</strong><small>{targetType} · Exact target only</small></div><div className="modal-safety"><Icon name="shield"/><span><strong>Prototype-only behavior</strong>No real scanner or network request will run.</span></div><div className="modal-actions"><Button variant="secondary" onClick={() => setConfirmOpen(false)}>Go Back</Button><Button onClick={complete}>Confirm & Start</Button></div></section></div>}</>;
  }

  return <>
    <section className="page-heading assessment-heading">
      <div><p className="eyebrow">Assessments / New</p><h1>New Security Assessment</h1><p>Configure an authorized assessment of your system.</p></div>
      <div className="step-indicator"><span className="done">1</span><i/><span className={step === 1 ? "done" : ""}>2</span><small>{step === 0 ? "Configure" : "Review"}</small></div>
    </section>
    <div className="assessment-layout">
      <div className="assessment-form">
        <section className="panel form-section">
          <div className="section-number">1</div>
          <div className="section-content"><div className="section-title"><h2>Target details</h2><p>Tell SENTRA which single system is in scope.</p></div>
            <fieldset className="choice-field"><legend>Target type</legend><div className="segmented">{["Domain","IP Address","Local Lab"].map(type => <button key={type} type="button" className={targetType === type ? "active" : ""} onClick={() => { setTargetType(type); setTarget(""); setTouched(false); }}>{type}</button>)}</div></fieldset>
            <label className={`field ${touched && !targetValid ? "field-error" : ""}`}>Target address<input value={target} onChange={(e) => setTarget(e.target.value.trim())} placeholder={formatHint.replace("Example: ","")} aria-invalid={touched && !targetValid}/><small>{touched && !target ? "Enter a target address to continue." : touched && !targetValid ? `Enter a valid ${targetType.toLowerCase()} target.` : formatHint}</small></label>
            <label className="field">Assessment name <em>Optional</em><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Customer portal — Q2 review"/></label>
            <div className="format-help"><Icon name="book" size={16}/><span><strong>Supported formats</strong>Use one domain, IPv4 address, or local training host. URLs, paths, CIDR ranges and wildcard targets are intentionally excluded.</span></div>
          </div>
        </section>
        <section className="panel form-section">
          <div className="section-number">2</div>
          <div className="section-content"><div className="section-title"><h2>Authorization and scope</h2><p>Confirm permission and understand the assessment boundary.</p></div>
            <label className={`authorization-check ${touched && !authorized ? "has-error" : ""}`}><input type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)}/><span><strong>I confirm that I own this system or have explicit permission to assess it.</strong><small>This confirmation is required before any assessment can start.</small></span></label>
            {touched && !authorized && <p className="validation-message"><Icon name="alert" size={14}/>Authorization confirmation is required.</p>}
            <div className="scope-preview"><div><span>Exact target scope</span><strong>{target || "Target not entered"}</strong></div><Badge tone={targetValid ? "stable" : "Open"}>{targetValid ? "Valid format" : "Pending"}</Badge><p>SENTRA will assess only this exact target and will not automatically discover or expand to related domains, subdomains, IP ranges or services.</p></div>
          </div>
        </section>
        <section className="panel form-section">
          <div className="section-number">3</div>
          <div className="section-content"><div className="section-title"><h2>Scan configuration</h2><p>Choose from safe, predefined assessment capabilities.</p></div>
            <button type="button" className="toggle-row" onClick={() => setNmap(!nmap)} aria-pressed={nmap}><span className="tool-icon"><Icon name="search"/></span><span><strong>Nmap service and port discovery</strong><small>Identifies exposed TCP services using a conservative, predefined discovery profile.</small></span><i className={nmap ? "on" : ""}><b/></i></button>
            <button type="button" className="toggle-row" onClick={() => setNuclei(!nuclei)} aria-pressed={nuclei}><span className="tool-icon"><Icon name="shield"/></span><span><strong>Nuclei non-intrusive vulnerability checks</strong><small>Uses a curated set of low-impact templates that avoid exploitation and destructive behavior.</small></span><i className={nuclei ? "on" : ""}><b/></i></button>
            <div className="safe-settings"><Icon name="settings" size={16}/><span><strong>Advanced settings are safety-limited</strong>Timing and check profiles are predefined. Arbitrary commands and unrestricted scanner arguments are not available.</span></div>
          </div>
        </section>
      </div>
      <aside className="panel review-card">
        <p className="eyebrow">4 · Review</p><h2>Assessment summary</h2><p>Confirm these details before continuing.</p>
        <dl><div><dt>Assessment</dt><dd>{name || "Untitled assessment"}</dd></div><div><dt>Target type</dt><dd>{targetType}</dd></div><div><dt>Exact scope</dt><dd className="mono">{target || "Not provided"}</dd></div><div><dt>Enabled tools</dt><dd>{[nmap && "Nmap discovery", nuclei && "Nuclei safe checks"].filter(Boolean).join(", ") || "None"}</dd></div><div><dt>Scope expansion</dt><dd>Disabled</dd></div><div><dt>Authorization</dt><dd className={authorized ? "confirmed" : "unconfirmed"}>{authorized ? "Confirmed" : "Not confirmed"}</dd></div></dl>
        {step === 1 && <div className="review-ready"><Icon name="check"/><span><strong>Ready for final confirmation</strong>Your target and authorization details are complete.</span></div>}
        <div className="review-actions">{step === 0 ? <><Button variant="secondary" onClick={cancel}>Cancel</Button><Button onClick={review}>Review Assessment <Icon name="arrow" size={15}/></Button></> : <><Button variant="secondary" onClick={() => setStep(0)}>Edit details</Button><Button onClick={() => setStep(2)}>Final confirmation <Icon name="arrow" size={15}/></Button></>}</div>
        <p className="prototype-note"><Icon name="shield" size={13}/> UI prototype only. No real scan will be executed.</p>
      </aside>
    </div>
  </>;
}

function ScanProgress({ navigate }: { navigate: (page: string) => void }) {
  const [scenario, setScenario] = useState("Running");
  const [cancelOpen, setCancelOpen] = useState(false);
  const steps = ["Scope validation", "Service discovery", "Vulnerability checks", "Finding normalization", "Assessment summary"];
  const stateData: Record<string, { stage: number; progress: number; label: string; title: string; detail: string; tone: string; findings: number; logs: string[][] }> = {
    Running: { stage: 3, progress: 62, label: "Running", title: "Checking for known vulnerabilities", detail: "Reviewing discovered services with safe, non-intrusive templates.", tone: "running", findings: 18, logs: [["10:42:18", "Vulnerability checks started"], ["10:41:54", "18 service observations normalized"], ["10:40:32", "Service discovery completed"], ["10:38:07", "Authorized scope validated"]] },
    Completed: { stage: 5, progress: 100, label: "Completed", title: "Assessment summary is ready", detail: "Illustrative observations have been normalized and prepared for human review.", tone: "completed", findings: 24, logs: [["10:47:26", "Assessment summary prepared"], ["10:46:51", "24 findings normalized"], ["10:45:03", "Vulnerability checks completed"], ["10:38:07", "Authorized scope validated"]] },
    "Unreachable target": { stage: 2, progress: 24, label: "Failed", title: "Target could not be reached", detail: "The configured target did not respond within the safe connection window. Verify availability and authorization before retrying.", tone: "failed", findings: 0, logs: [["10:40:11", "Assessment stopped — target unreachable"], ["10:39:41", "Second connection attempt unsuccessful"], ["10:38:22", "Service discovery started"], ["10:38:07", "Authorized scope validated"]] },
    "Scanner timeout": { stage: 3, progress: 51, label: "Failed", title: "Scanner reached its time limit", detail: "The predefined safety timeout was reached before checks completed. Partial observations were not marked as a successful assessment.", tone: "failed", findings: 12, logs: [["10:52:18", "Assessment stopped — safety timeout reached"], ["10:47:06", "12 observations processed"], ["10:42:18", "Vulnerability checks started"], ["10:38:07", "Authorized scope validated"]] },
    "Failed scan": { stage: 3, progress: 43, label: "Failed", title: "Assessment could not be completed", detail: "A scanner integration error interrupted processing. No successful summary was generated.", tone: "failed", findings: 8, logs: [["10:44:02", "Assessment failed — scanner integration error"], ["10:43:41", "Finding normalization interrupted"], ["10:42:18", "Vulnerability checks started"], ["10:38:07", "Authorized scope validated"]] },
    Cancelled: { stage: 2, progress: 31, label: "Cancelled", title: "Assessment was cancelled", detail: "Processing stopped at the user’s request. No assessment summary was generated.", tone: "cancelled", findings: 4, logs: [["10:41:29", "Assessment cancelled by Elena Marlow"], ["10:40:32", "4 observations processed"], ["10:38:22", "Service discovery started"], ["10:38:07", "Authorized scope validated"]] },
  };
  const data = stateData[scenario];
  const hasResults = data.findings > 0 && !["Unreachable target"].includes(scenario);
  const cancel = () => { setCancelOpen(false); setScenario("Cancelled"); };
  return <>
    <section className="page-heading progress-heading">
      <div><p className="eyebrow">Illustrative assessment · SNT-A-1042</p><h1>Assessment in Progress</h1><p>Customer portal — Q2 review · <span className="mono">app.sentra-demo.io</span> · Started May 21, 2025 at 10:38 AM</p></div>
      <label className="preview-select">Preview state<select value={scenario} onChange={(e) => setScenario(e.target.value)}>{Object.keys(stateData).map(state => <option key={state}>{state}</option>)}</select></label>
    </section>
    <section className="panel progress-stepper" aria-label="Assessment progress">
      {steps.map((step,index) => {
        const number = index + 1;
        const complete = number < data.stage || data.label === "Completed";
        const current = number === data.stage && data.label !== "Completed";
        return <div className={`progress-step ${complete ? "complete" : ""} ${current ? `current ${data.tone}` : ""}`} key={step}><span>{complete ? <Icon name="check" size={13}/> : number}</span><strong>{step}</strong>{index < steps.length - 1 && <i/>}</div>;
      })}
    </section>
    <div className="progress-layout">
      <div className="progress-main">
        <section className={`panel status-panel ${data.tone}`}>
          <div className="status-top"><div><Badge tone={data.tone}>{data.label}</Badge><p className="eyebrow">Current stage</p><h2>{data.title}</h2><p>{data.detail}</p></div><div className="progress-value"><strong>{data.progress}%</strong><span>complete</span></div></div>
          <div className="status-progress"><i style={{width: `${data.progress}%`}}/></div>
          <div className="status-metrics"><div><span>Started</span><strong>10:38 AM</strong></div><div><span>Elapsed</span><strong>{data.label === "Running" ? "8m 42s" : "14m 11s"}</strong></div><div><span>Findings processed</span><strong>{data.findings}</strong></div><div><span>Assessment status</span><strong>{data.label}</strong></div></div>
        </section>
        <section className="panel log-panel">
          <div className="panel-head"><div><h2>Activity log</h2><p>Readable events from this illustrative assessment</p></div><span className="log-count">{data.logs.length} events</span></div>
          <div className="activity-log">{data.logs.map(([time,message],index) => <div key={`${time}-${message}`} className={index === 0 ? data.tone : ""}><time>{time}</time><i/><span>{message}</span></div>)}</div>
          <p className="log-note"><Icon name="alert" size={13}/>This is representative prototype data—not live scanner output.</p>
        </section>
        {data.label === "Failed" && <section className="failure-guidance"><Icon name="alert"/><div><strong>{scenario}</strong><p>{data.detail}</p><button onClick={() => navigate("New Assessment")}>Review assessment configuration <Icon name="arrow" size={13}/></button></div></section>}
      </div>
      <aside className="panel scan-details">
        <p className="eyebrow">Configured scope</p><h2>Assessment details</h2>
        <dl><div><dt>Assessment</dt><dd>Customer portal — Q2 review</dd></div><div><dt>Target</dt><dd className="mono">app.sentra-demo.io</dd></div><div><dt>Target type</dt><dd>Domain</dd></div><div><dt>Scope</dt><dd>Exact target only</dd></div><div><dt>Scope expansion</dt><dd>Disabled</dd></div></dl>
        <div className="selected-tools"><span>Selected tools</span><div><Icon name="search" size={15}/><p><strong>Nmap discovery</strong><small>Safe predefined profile</small></p><Badge tone="stable">Enabled</Badge></div><div><Icon name="shield" size={15}/><p><strong>Nuclei checks</strong><small>Non-intrusive templates</small></p><Badge tone="stable">Enabled</Badge></div></div>
        <div className="progress-actions">{hasResults && <Button onClick={() => navigate("Findings")}>View Findings <Icon name="arrow" size={14}/></Button>}{data.label === "Running" && <Button variant="secondary" onClick={() => setCancelOpen(true)}>Cancel Assessment</Button>}<Button variant="ghost" onClick={() => navigate("Dashboard")}>Return to Dashboard</Button></div>
        <p className="prototype-note"><Icon name="shield" size={13}/>Illustrative progress only. No real scan is running.</p>
      </aside>
    </div>
    {cancelOpen && <div className="modal-backdrop" onMouseDown={() => setCancelOpen(false)}><section className="modal cancel-modal" onMouseDown={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-labelledby="cancel-title"><div className="modal-head"><div><p className="eyebrow">Confirm cancellation</p><h2 id="cancel-title">Cancel this assessment?</h2></div><button className="icon-button" onClick={() => setCancelOpen(false)}><Icon name="close"/></button></div><p>Processing will stop and an assessment summary will not be generated. Any partial observations remain clearly marked as incomplete.</p><div className="modal-actions"><Button variant="secondary" onClick={() => setCancelOpen(false)}>Keep Running</Button><button className="danger-button" onClick={cancel}>Cancel Assessment</button></div></section></div>}
  </>;
}

function FindingsExplorer({ openFinding, remediationRecords, findingsData, startImport }: { openFinding: (finding: typeof explorerFindings[number]) => void; remediationRecords: RemediationRecord[]; findingsData: typeof explorerFindings; startImport: () => void }) {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [priority, setPriority] = useState("All");
  const [source, setSource] = useState("All");
  const [review, setReview] = useState("All");
  const [sort, setSort] = useState<"date" | "title" | "severity">("date");
  const [page, setPage] = useState(1);
  const severityOrder: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const filtered = findingsData.filter((finding) => {
    const query = search.toLowerCase();
    return (!query || `${finding.title} ${finding.id} ${finding.asset}`.toLowerCase().includes(query))
      && (severity === "All" || finding.severity === severity)
      && (priority === "All" || finding.priority === priority)
      && (source === "All" || finding.source === source)
      && (review === "All" || finding.review === review);
  }).sort((a,b) => sort === "title" ? a.title.localeCompare(b.title) : sort === "severity" ? severityOrder[b.severity] - severityOrder[a.severity] : new Date(b.date).getTime() - new Date(a.date).getTime());
  const perPage = 5;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);
  const hasFilters = Boolean(search || severity !== "All" || priority !== "All" || source !== "All" || review !== "All");
  const clear = () => { setSearch(""); setSeverity("All"); setPriority("All"); setSource("All"); setReview("All"); setPage(1); };
  const update = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLSelectElement>) => { setter(event.target.value); setPage(1); };
  const remediationFor = (findingId: string) => remediationRecords.find((record) => record.findingId === findingId);
  return <>
    <section className="page-heading findings-heading">
      <div><p className="eyebrow">Illustrative findings registry</p><h1>Security Findings</h1><p>Review, understand and prioritize detected security issues.</p></div>
      <Button variant="secondary" onClick={startImport}><Icon name="upload" size={16}/>Import Findings</Button>
    </section>
    <section className="summary-strip">
      {[["Total Findings",findingsData.length,"alert"],["Critical",findingsData.filter((item) => item.severity === "Critical").length,"alert"],["High",findingsData.filter((item) => item.severity === "High").length,"trend"],["Needs Verification",findingsData.filter((item) => item.evidence === "Needs Verification" || item.evidence === "Incomplete").length,"search"]].map(([label,value,icon]) => <div key={label}><span className={String(label).toLowerCase().replace(" ","-")}><Icon name={String(icon)} size={16}/></span><p><small>{label}</small><strong>{value}</strong></p></div>)}
      <p className="summary-note">Includes locally imported prototype records</p>
    </section>
    <section className="panel explorer-panel">
      <div className="filter-bar">
        <label className="finding-search"><Icon name="search" size={16}/><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search title, CVE or affected asset"/></label>
        <label><span>Severity</span><select value={severity} onChange={update(setSeverity)}><option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label>
        <label><span>Suggested priority</span><select value={priority} onChange={update(setPriority)}><option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label>
        <label><span>Source tool</span><select value={source} onChange={update(setSource)}><option>All</option><option>Nmap</option><option>Nuclei</option><option>Import</option></select></label>
        <label><span>Review status</span><select value={review} onChange={update(setReview)}><option>All</option><option>Needs review</option><option>Open</option><option>In progress</option><option>Accepted risk</option></select></label>
        <button className="clear-filters" onClick={clear} disabled={!hasFilters}>Clear filters</button>
      </div>
      <div className="results-toolbar"><p><strong>{filtered.length}</strong> example findings</p><label>Sort by<select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option value="date">Last detected</option><option value="severity">Severity</option><option value="title">Finding title</option></select></label></div>
      <div className="table-wrap findings-explorer-table">
        <table><thead><tr><th>Finding title</th><th>Affected asset</th><th>Original severity</th><th>Suggested priority</th><th>Evidence status</th><th>Source tool</th><th>Review status</th><th>Remediation</th><th>Last detected</th><th/></tr></thead>
          <tbody>{visible.map((finding) => {const remediation = remediationFor(finding.id); return <tr key={finding.id} className="clickable-row" onClick={() => openFinding(finding)}><td><strong>{finding.title}</strong><span>{finding.id} · Example finding</span></td><td className="mono">{finding.asset}</td><td><Badge tone={finding.severity}>{finding.severity}</Badge></td><td><Badge tone={finding.priority}>{finding.priority}</Badge></td><td><span className={`evidence-badge ${finding.evidence.toLowerCase().replace(" ","-")}`}>{finding.evidence}</span></td><td><span className="source-label">{finding.source}</span></td><td><Badge tone={finding.review}>{finding.review}</Badge></td><td>{remediation ? <span className={`remediation-badge ${remediation.status.toLowerCase().replaceAll(" ","-")}`}><i/>{remediation.status}</span> : <span className="not-available">Not tracked</span>}</td><td>{finding.date}</td><td><button className="row-action" aria-label={`Open ${finding.title}`}><Icon name="arrow" size={15}/></button></td></tr>;})}</tbody>
        </table>
        {!visible.length && <div className="explorer-empty"><span><Icon name="search" size={22}/></span><h2>No findings match these filters</h2><p>Try removing one or more filters, or search for a different title, identifier or asset.</p><Button variant="secondary" onClick={clear}>Clear all filters</Button></div>}
      </div>
      <div className="pagination"><p>Showing {filtered.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage,filtered.length)} of {filtered.length}</p><div><button disabled={page === 1} onClick={() => setPage(page - 1)}><span className="back-arrow"><Icon name="arrow" size={14}/></span>Previous</button>{Array.from({length: pages},(_,i) => <button key={i} className={page === i + 1 ? "active" : ""} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button disabled={page === pages} onClick={() => setPage(page + 1)}>Next<Icon name="arrow" size={14}/></button></div></div>
    </section>
    <p className="disclaimer"><Icon name="alert" size={14}/> Findings shown are realistic examples for this prototype and are not confirmed vulnerabilities. Evidence and impact require human verification.</p>
  </>;
}

function FindingDetails({ finding, back }: { finding: typeof explorerFindings[number]; back: () => void }) {
  const [rawOpen, setRawOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [decision, setDecision] = useState(finding.review);
  const [reviewedAt, setReviewedAt] = useState("");
  const [reviewAction, setReviewAction] = useState<"False Positive" | "Accepted Risk" | "Fixed" | null>(null);
  const [reviewError, setReviewError] = useState("");
  const [verificationChecked, setVerificationChecked] = useState(false);
  const evidenceSupported = finding.evidence === "Supported";
  const decide = (value: string) => {
    setDecision(value);
    setReviewedAt("May 21, 2025 at 11:06 AM · Elena Marlow");
  };
  const submitReview = () => {
    if ((reviewAction === "False Positive" || reviewAction === "Accepted Risk") && notes.trim().length < 10) {
      setReviewError("Add at least 10 characters of reviewer rationale.");
      return;
    }
    if (reviewAction === "Fixed" && !verificationChecked) {
      setReviewError("Confirm that verification evidence has been reviewed.");
      return;
    }
    if (reviewAction) decide(reviewAction);
    setReviewAction(null);
    setReviewError("");
    setVerificationChecked(false);
  };
  return <>
    <button className="back-link" onClick={back}><span className="back-arrow"><Icon name="arrow" size={14}/></span>Back to findings</button>
    <section className="detail-hero">
      <div><p className="eyebrow">{finding.id} · Illustrative finding</p><h1>{finding.title}</h1><p><Icon name="shield" size={14}/>Affected asset <strong className="mono">{finding.asset}</strong></p></div>
      <div className="header-status"><span>Review status</span><Badge tone={decision}>{decision}</Badge></div>
      <dl className="finding-header-meta">
        <div><dt>Original severity</dt><dd><Badge tone={finding.severity}>{finding.severity}</Badge></dd></div>
        <div><dt>SENTRA suggested priority</dt><dd><Badge tone={finding.priority}>{finding.priority}</Badge></dd></div>
        <div><dt>Source tool</dt><dd>{finding.source}</dd></div>
        <div><dt>First detected</dt><dd>April 29, 2025</dd></div>
        <div><dt>Last detected</dt><dd>{finding.date}</dd></div>
      </dl>
    </section>
    <div className="core-detail-layout">
      <div className="analysis-column">
        <section className="panel evidence-panel">
          <div className="section-kicker"><span>01</span><div><p className="eyebrow">Source of record</p><h2>Original Scanner Evidence</h2></div><Badge tone={finding.evidence}>{finding.evidence}</Badge></div>
          <div className="evidence-grid">
            <dl><div><dt>Scanner / template</dt><dd>{finding.source === "Nmap" ? "Nmap 7.95 · service/version detection" : finding.source === "Nuclei" ? "Nuclei · http/exposures/admin-panel" : "Imported scanner record · external-1042"}</dd></div><div><dt>Affected host</dt><dd className="mono">{finding.asset.split(":")[0]}</dd></div><div><dt>Port / protocol</dt><dd>{finding.asset.includes(":") ? `${finding.asset.split(":")[1]} / TCP` : "443 / HTTPS"}</dd></div><div><dt>Detected service</dt><dd>{finding.title.includes("OpenSSH") ? "OpenSSH 8.2p1" : "HTTPS web service"}</dd></div></dl>
            <div className="response-evidence"><span>Relevant response detail</span><code>{finding.title.includes("OpenSSH") ? "SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5" : "HTTP/1.1 200 OK\nserver: nginx\ncontent-type: text/html"}</code></div>
          </div>
          <div className="scanner-description"><strong>Original scanner description</strong><p>{finding.note} This text is preserved as imported and has not been rewritten by SENTRA.</p></div>
          <button className="raw-toggle" onClick={() => setRawOpen(!rawOpen)} aria-expanded={rawOpen}><Icon name="file" size={15}/><span>Raw scanner output</span><small>{rawOpen ? "Hide" : "Show"}</small><span className={rawOpen ? "rotate" : ""}><Icon name="arrow" size={14}/></span></button>
          {rawOpen && <pre className="raw-output">{`# Illustrative scanner output — no real scan performed
host: ${finding.asset.split(":")[0]}
port: ${finding.asset.includes(":") ? finding.asset.split(":")[1] : "443"}
state: open
service: ${finding.title.includes("OpenSSH") ? "ssh" : "https"}
observation_id: ${finding.id}
evidence_capture: example-only`}</pre>}
        </section>

        <section className="panel analysis-section">
          <div className="section-kicker"><span>02</span><div><p className="eyebrow">AI-generated guidance</p><h2>Plain-English Explanation</h2></div></div>
          <div className="guidance-warning"><Icon name="alert" size={15}/><span>Suggested interpretation requiring human review. It is not proof that the finding is correct or exploitable.</span></div>
          <div className="explanation-grid"><div><strong>What does this mean?</strong><p>The observed service appears to match a version or configuration that may no longer meet the organization’s current security baseline.</p></div><div><strong>Why might it matter?</strong><p>Older or exposed services can increase attack surface, particularly when reachable from networks with untrusted users.</p></div><div><strong>What is the possible impact?</strong><p>An attacker could potentially use known weaknesses or exposed functionality. Actual impact depends on configuration, reachability and compensating controls.</p></div></div>
        </section>

        <section className="panel analysis-section">
          <div className="section-kicker"><span>03</span><div><p className="eyebrow">Uncertainty made visible</p><h2>Evidence Assessment</h2></div><span className={`assessment-label ${evidenceSupported ? "supported" : "verify"}`}><Icon name={evidenceSupported ? "check" : "alert"} size={13}/>{evidenceSupported ? "Supported by Available Evidence" : "Needs Verification"}</span></div>
          <div className="assessment-columns"><div className="assessment-list supporting"><h3><Icon name="check" size={15}/>Supporting evidence</h3><ul><li>A service response was recorded from the exact authorized target.</li><li>The observed signature matches the scanner’s detection rule.</li><li>Host, port and timestamp are present in the source record.</li></ul></div><div className="assessment-list missing"><h3><Icon name="alert" size={15}/>Missing or inconclusive</h3><ul><li>Patch backports and vendor-specific fixes were not verified.</li><li>Exploitability and authentication controls were not tested.</li><li>External network exposure remains unverified.</li></ul></div></div>
          <p className="unverified-note"><strong>What remains unverified:</strong> Whether the detected condition is reachable by an attacker and whether compensating controls reduce practical impact.</p>
        </section>

        <section className="panel analysis-section remediation-section">
          <div className="section-kicker"><span>05</span><div><p className="eyebrow">Suggested plan</p><h2>Remediation Checklist</h2></div></div>
          <ol className="remediation-list"><li><span>1</span><div><strong>Inspect the deployed service</strong><p>Confirm the package version, vendor patch level, listening interface and approved owner.</p></div></li><li><span>2</span><div><strong>Change or investigate</strong><p>Apply the supported vendor update or restrict access using the organization’s standard network controls.</p></div></li><li><span>3</span><div><strong>Verify the result</strong><p>Repeat an authorized service check and compare the new evidence with this observation.</p></div></li><li><span>4</span><div><strong>Record limitations</strong><p>Coordinate maintenance windows, preserve required compatibility and document any compensating controls.</p></div></li></ol>
        </section>

        <section className="panel analysis-section history-section">
          <div className="section-kicker"><span>07</span><div><p className="eyebrow">Observation timeline</p><h2>Verification History</h2></div></div>
          <div className="verification-timeline"><div className="observed"><i/><time>April 29, 2025</time><span><strong>First observed</strong><small>Scanner signature recorded on the authorized target.</small></span></div><div className="observed"><i/><time>May 12, 2025</time><span><strong>Detected again</strong><small>Subsequent observation matched the original evidence.</small></span></div><div className="current"><i/><time>May 21, 2025</time><span><strong>Awaiting human verification</strong><small>Not yet marked fixed or verified resolved.</small></span></div><div className="future"><i/><time>Next assessment</time><span><strong>Resolution not yet verified</strong><small>“No longer detected” will remain distinct from “verified resolved.”</small></span></div></div>
        </section>
      </div>

      <aside className="review-column">
        <section className="panel priority-card">
          <div className="section-kicker"><span>04</span><div><p className="eyebrow">Suggested</p><h2>Priority Reasoning</h2></div></div>
          <div className="priority-result"><span>SENTRA priority</span><Badge tone={finding.priority}>{finding.priority}</Badge></div>
          <p>Suggested from the available context—not a replacement for reviewer judgment.</p>
          <div className="reason-factors"><div><span>Scanner severity</span><strong>{finding.severity}</strong><i><b className="level-3"/></i></div><div><span>Potential exposure</span><strong>Elevated</strong><i><b className="level-3"/></i></div><div><span>Evidence strength</span><strong>{evidenceSupported ? "Supported" : "Limited"}</strong><i><b className={evidenceSupported ? "level-3" : "level-2"}/></i></div><div><span>Potential impact</span><strong>Material</strong><i><b className="level-3"/></i></div></div>
          <div className="severity-preserved"><Icon name="shield" size={15}/><span><strong>Original severity preserved</strong>The scanner’s {finding.severity.toLowerCase()} rating remains unchanged.</span></div>
        </section>

        <section className="panel review-panel">
          <div className="section-kicker"><span>06</span><div><p className="eyebrow">Human decision</p><h2>Review Finding</h2></div></div>
          <label className="review-notes">Reviewer notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add evidence, context or decision rationale..."/></label>
          <div className="decision-actions"><button className="confirm" onClick={() => decide("Confirmed")}><Icon name="check" size={14}/>Confirm Finding</button><button onClick={() => setReviewAction("False Positive")}><Icon name="close" size={14}/>Mark False Positive</button><button onClick={() => setReviewAction("Accepted Risk")}><Icon name="shield" size={14}/>Accept Risk</button><button onClick={() => setReviewAction("Fixed")}><Icon name="check" size={14}/>Mark Fixed</button></div>
          {reviewedAt ? <div className="decision-record"><Icon name="check" size={15}/><span><strong>{decision}</strong>{reviewedAt}{notes && <small>Note saved with decision</small>}</span></div> : <p className="review-pending"><Icon name="history" size={14}/>No review decision has been recorded.</p>}
        </section>
        <div className="ai-disclaimer"><Icon name="book" size={15}/><p><strong>AI guidance is advisory</strong>All explanations, priority reasoning and remediation steps are illustrative suggestions requiring qualified human review.</p></div>
      </aside>
    </div>
    {reviewAction && <div className="modal-backdrop" onMouseDown={() => setReviewAction(null)}><section className="modal review-decision-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="review-decision-title"><div className="modal-head"><div><p className="eyebrow">Human review decision</p><h2 id="review-decision-title">{reviewAction === "False Positive" ? "Mark as false positive?" : reviewAction === "Accepted Risk" ? "Accept this risk?" : "Mark this finding fixed?"}</h2></div><button className="icon-button" onClick={() => setReviewAction(null)}><Icon name="close"/></button></div><p>{reviewAction === "False Positive" ? "Document why the scanner evidence does not represent the claimed condition. The original observation will remain in history." : reviewAction === "Accepted Risk" ? "Record why the organization is accepting this risk, including relevant controls or review dates." : "Only mark fixed after reviewing corrective evidence. A finding being absent from output is not sufficient by itself."}</p>
      {reviewAction !== "Fixed" ? <label className={`review-notes modal-review-notes ${reviewError ? "field-error" : ""}`}>Reviewer rationale <textarea value={notes} onChange={(e) => {setNotes(e.target.value);setReviewError("");}} placeholder={reviewAction === "Accepted Risk" ? "Document business rationale, controls and review date…" : "Explain why this detection is not applicable…"}/><small>{reviewError || "Required · Saved with reviewer identity and timestamp"}</small></label> :
      <><div className="verification-guidance"><Icon name="check"/><div><strong>Verification guidance</strong><ul><li>Review evidence showing the configuration or version changed.</li><li>Confirm the authorized target was checked again.</li><li>Distinguish verified resolution from “no longer detected.”</li></ul></div></div><label className={`authorization-check fixed-check ${reviewError ? "has-error" : ""}`}><input type="checkbox" checked={verificationChecked} onChange={(e) => {setVerificationChecked(e.target.checked);setReviewError("");}}/><span><strong>I reviewed evidence supporting this resolution.</strong><small>The decision will be timestamped and attributed to Elena Marlow.</small></span></label>{reviewError && <p className="validation-message"><Icon name="alert" size={13}/>{reviewError}</p>}</>}
      <div className="modal-actions"><Button variant="secondary" onClick={() => {setReviewAction(null);setReviewError("");}}>Cancel</Button><Button onClick={submitReview}>{reviewAction === "False Positive" ? "Mark False Positive" : reviewAction === "Accepted Risk" ? "Accept Risk" : "Mark Fixed"}</Button></div></section></div>}
  </>;
}

function HistoryComparison({ assessments, findingsData, navigate }: { assessments: typeof assessmentHistory; findingsData: typeof explorerFindings; navigate: (page: string) => void }) {
  const [search, setSearch] = useState(""); const [statusFilter,setStatusFilter]=useState("All"); const [sourceFilter,setSourceFilter]=useState("All"); const [dateFilter,setDateFilter]=useState("All time"); const [sort,setSort]=useState<"date"|"findings">("date"); const [page,setPage]=useState(1); const [selected,setSelected]=useState<string[]>([]); const [compare,setCompare]=useState(false); const [validation,setValidation]=useState(""); const [detail,setDetail]=useState<typeof assessmentHistory[number] | null>(null); const [exportOpen,setExportOpen]=useState(false); const [exportScope,setExportScope]=useState<"all"|"filtered">("filtered"); const [exportFormat,setExportFormat]=useState<"csv"|"json">("csv"); const [exportFrom,setExportFrom]=useState(""); const [exportTo,setExportTo]=useState(""); const [exportError,setExportError]=useState(""); const [exported,setExported]=useState(false);
  const now=new Date("2025-05-21"); const visible=assessments.filter((item) => {const age=(now.getTime()-new Date(item.date).getTime())/86400000; return (!search || `${item.name} ${item.target} ${item.id}`.toLowerCase().includes(search.toLowerCase())) && (statusFilter === "All" || item.status === statusFilter) && (sourceFilter === "All" || item.source === sourceFilter) && (dateFilter === "All time" || age <= Number(dateFilter));}).sort((a,b) => sort === "date" ? new Date(b.date).getTime()-new Date(a.date).getTime() : b.findings-a.findings);
  const perPage=5, pages=Math.max(1,Math.ceil(visible.length/perPage)), paged=visible.slice((page-1)*perPage,page*perPage); const chosen=selected.map((id) => assessments.find((item) => item.id===id)!).filter(Boolean); const compatible=chosen.length===2 && chosen[0].target===chosen[1].target;
  const toggle=(item:typeof assessmentHistory[number]) => {setValidation("");setCompare(false); if(selected.includes(item.id)) return setSelected(selected.filter((id)=>id!==item.id)); if(selected.length>=2) return setValidation("Select no more than two assessments."); setSelected([...selected,item.id]);};
  const compareRows=(() => {if(!compatible) return []; const [previous,current]=[...chosen].sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()); const prev=new Set(previous.findingIds), curr=new Set(current.findingIds); const ids=new Set([...previous.findingIds,...current.findingIds]); return [...ids].map((id) => {const finding=findingsData.find((item)=>item.id===id); const inPrev=prev.has(id),inCurr=curr.has(id); let change="Unchanged",note="Stable identifier and affected asset matched in both records."; if(!inPrev&&inCurr){change="New";note="First present in the newer assessment.";} else if(inPrev&&!inCurr){if(current.status === "Completed" && previous.scope===current.scope){change="Resolved";note="No longer detected; manual verification is still required.";}else{change="Needs Verification";note="Absent from an incomplete or incompatible scan scope.";}} return {id,title:finding?.title||id,asset:finding?.asset||"Unavailable",previous:inPrev?(finding?.severity||"Detected"):"Not detected",current:inCurr?(finding?.severity||"Detected"):"Not detected",change,note};});})();
  const runCompare=()=>{if(selected.length!==2) return setValidation("Select exactly two saved assessments before comparing."); if(!compatible) return setValidation("Comparisons require two assessments for the same authorized target."); setValidation("");setCompare(true);};
  const exportHistory=()=>{let rows=exportScope==="all"?assessments:visible; if(exportFrom) rows=rows.filter((item)=>new Date(item.date)>=new Date(exportFrom)); if(exportTo) rows=rows.filter((item)=>new Date(item.date)<=new Date(`${exportTo}T23:59:59`)); if(!rows.length) return setExportError("No assessment records match the selected export options."); const data=rows.map(({id,name,target,date,status,source,findings,critical,high,medium,low,informational,scope})=>({id,name,target,date,status,source,scope,totalFindings:findings,severity:{critical,high,medium,low,informational}})); let content,mime,fileName; if(exportFormat==="json"){content=JSON.stringify({exportedAt:new Date().toISOString(),storage:"local prototype",assessments:data},null,2);mime="application/json";fileName="sentra-assessment-history.json";}else{const headers=["Assessment ID","Name","Target","Date","Status","Source","Scope","Total Findings","Critical","High","Medium","Low","Informational"]; const escape=(value:unknown)=>`"${String(value??"").replaceAll('"','""')}"`; const lines=data.map((item)=>[item.id,item.name,item.target,item.date,item.status,item.source,item.scope,item.totalFindings,item.severity.critical,item.severity.high,item.severity.medium,item.severity.low,item.severity.informational].map(escape).join(","));content=[headers.map(escape).join(","),...lines].join("\r\n");mime="text/csv;charset=utf-8";fileName="sentra-assessment-history.csv";} const url=URL.createObjectURL(new Blob([content],{type:mime}));const anchor=document.createElement("a");anchor.href=url;anchor.download=fileName;document.body.appendChild(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);setExportOpen(false);setExported(true);setTimeout(()=>setExported(false),2800);};
  const previous=compatible?[...chosen].sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime())[0]:null,current=compatible?[...chosen].sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime())[1]:null;
  return <><section className="page-heading history-heading"><div><p className="eyebrow">Saved local and illustrative records</p><h1>Assessment History</h1><p>Track how security findings change over time.</p></div><Button variant="secondary" onClick={()=>setExportOpen(true)}><Icon name="upload" size={15}/>Export History</Button></section><section className="panel history-table-panel"><div className="functional-history-filters"><label className="finding-search"><Icon name="search" size={15}/><input value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} placeholder="Search assessment name or target"/></label><label><span>Date</span><select value={dateFilter} onChange={(e)=>setDateFilter(e.target.value)}><option>All time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label><label><span>Status</span><select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}><option>All</option>{[...new Set(assessments.map((item)=>item.status))].map((item)=><option key={item}>{item}</option>)}</select></label><label><span>Source</span><select value={sourceFilter} onChange={(e)=>setSourceFilter(e.target.value)}><option>All</option>{[...new Set(assessments.map((item)=>item.source))].map((item)=><option key={item}>{item}</option>)}</select></label><label><span>Sort</span><select value={sort} onChange={(e)=>setSort(e.target.value as typeof sort)}><option value="date">Newest date</option><option value="findings">Findings count</option></select></label></div><div className="history-selection-bar"><p><strong>{selected.length}/2 selected</strong><span>Choose two assessments for the same target.</span></p>{validation&&<span className="selection-error"><Icon name="alert" size={13}/>{validation}</span>}<Button onClick={runCompare} disabled={selected.length!==2}>Compare Assessments</Button></div><div className="table-wrap functional-history-table"><table><thead><tr><th>Compare</th><th>Assessment</th><th>Target</th><th>Date</th><th>Source</th><th>Total</th><th>Critical</th><th>High</th><th>Medium</th><th>Low</th><th>Info</th><th>Status</th><th>Actions</th></tr></thead><tbody>{paged.map((item)=><tr key={item.id} className={selected.includes(item.id)?"selected-row":""}><td><label className="table-check"><input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggle(item)}/><span/></label></td><td><strong>{item.name}</strong><span>{item.id}{item.id.startsWith("IMP-")?" · Local import":" · Illustrative"}</span></td><td className="mono">{item.target}</td><td>{item.date}</td><td>{item.source}</td><td><strong className="count-value">{item.findings}</strong></td><td>{item.critical}</td><td>{item.high}</td><td>{item.medium}</td><td>{item.low}</td><td>{item.informational}</td><td><Badge tone={item.status}>{item.status}</Badge></td><td><button className="report-link" onClick={()=>setDetail(item)}>View Details <Icon name="arrow" size={13}/></button></td></tr>)}</tbody></table>{!paged.length&&<div className="explorer-empty"><span><Icon name="history" size={22}/></span><h2>No assessment records found</h2><p>Adjust the filters, import findings, or create an assessment.</p><div className="empty-actions"><Button variant="secondary" onClick={()=>navigate("Import Findings")}>Import Findings</Button><Button onClick={()=>navigate("New Assessment")}>New Assessment</Button></div></div>}</div><div className="pagination"><p>Showing {visible.length?(page-1)*perPage+1:0}–{Math.min(page*perPage,visible.length)} of {visible.length}</p><div><button disabled={page===1} onClick={()=>setPage(page-1)}>Previous</button>{Array.from({length:pages},(_,i)=><button className={page===i+1?"active":""} key={i} onClick={()=>setPage(i+1)}>{i+1}</button>)}<button disabled={page===pages} onClick={()=>setPage(page+1)}>Next</button></div></div></section>
  {compare&&previous&&current&&<section className="functional-comparison"><div className="comparison-heading"><div><p className="eyebrow">Comparison results</p><h2>{previous.name} <span>to</span> {current.name}</h2><p>{previous.target} · {previous.date}–{current.date}</p></div><Button variant="secondary" onClick={()=>setCompare(false)}>Close comparison</Button></div><div className="comparison-sides"><article className="panel"><span>Assessment A</span><h3>{previous.name}</h3><p>{previous.date} · {previous.source}</p><strong>{previous.findings}<small>total findings</small></strong><div>{[["Critical",previous.critical],["High",previous.high],["Medium",previous.medium],["Low",previous.low],["Info",previous.informational]].map(([label,count])=><span key={label}><i className={String(label).toLowerCase()}/>{label} <b>{count}</b></span>)}</div></article><article className="panel"><span>Assessment B</span><h3>{current.name}</h3><p>{current.date} · {current.source}</p><strong>{current.findings}<small>total findings</small></strong><div>{[["Critical",current.critical],["High",current.high],["Medium",current.medium],["Low",current.low],["Info",current.informational]].map(([label,count])=><span key={label}><i className={String(label).toLowerCase()}/>{label} <b>{count}</b></span>)}</div></article></div><div className="comparison-counts">{["New","Unchanged","Resolved","Changed","Needs Verification"].map((change)=><div key={change}><span>{change}</span><strong>{compareRows.filter((row)=>row.change===change).length}</strong></div>)}</div><section className="panel comparison-table-panel"><div className="comparison-caution"><Icon name="alert" size={14}/><span><strong>Scanner absence is not verified remediation.</strong>Resolved means no longer detected in a compatible completed scan. Human verification is still required; incomplete coverage is marked Needs Verification.</span></div><div className="table-wrap comparison-table"><table><thead><tr><th>Finding</th><th>Asset</th><th>Previous</th><th>Current</th><th>Change</th><th>Evidence / notes</th></tr></thead><tbody>{compareRows.map((row)=><tr key={row.id}><td><strong>{row.title}</strong><span>{row.id}</span></td><td className="mono">{row.asset}</td><td>{row.previous}</td><td>{row.current}</td><td><span className={`change-badge ${row.change.toLowerCase().replaceAll(" ","-")}`}>{row.change}</span></td><td>{row.note}</td></tr>)}</tbody></table></div></section></section>}
  {detail&&<div className="modal-backdrop" onMouseDown={()=>setDetail(null)}><section className="modal history-detail-modal" onMouseDown={(e)=>e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">{detail.id}</p><h2>{detail.name}</h2></div><button className="icon-button" onClick={()=>setDetail(null)}><Icon name="close"/></button></div><dl className="profile-data"><div><dt>Target</dt><dd>{detail.target}</dd></div><div><dt>Date</dt><dd>{detail.date}</dd></div><div><dt>Source</dt><dd>{detail.source}</dd></div><div><dt>Scope</dt><dd>{detail.scope}</dd></div><div><dt>Findings</dt><dd>{detail.findings}</dd></div><div><dt>Status</dt><dd>{detail.status}</dd></div></dl><div className="modal-actions"><Button variant="secondary" onClick={()=>setDetail(null)}>Close</Button><Button onClick={()=>navigate("Findings")}>View Findings</Button></div></section></div>}
  {exportOpen&&<div className="modal-backdrop" onMouseDown={()=>setExportOpen(false)}><section className="modal export-history-modal" onMouseDown={(e)=>e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">Generate real local file</p><h2>Export Assessment History</h2></div><button className="icon-button" onClick={()=>setExportOpen(false)}><Icon name="close"/></button></div><fieldset className="export-options"><legend>Records</legend><label><input type="radio" checked={exportScope==="filtered"} onChange={()=>setExportScope("filtered")}/>Currently filtered records ({visible.length})</label><label><input type="radio" checked={exportScope==="all"} onChange={()=>setExportScope("all")}/>All saved records ({assessments.length})</label></fieldset><div className="field-row"><label className="field">From date<input type="date" value={exportFrom} onChange={(e)=>setExportFrom(e.target.value)}/></label><label className="field">To date<input type="date" value={exportTo} onChange={(e)=>setExportTo(e.target.value)}/></label></div><label className="field">Format<select value={exportFormat} onChange={(e)=>setExportFormat(e.target.value as typeof exportFormat)}><option value="csv">CSV</option><option value="json">JSON</option></select></label><div className="export-columns"><strong>Included data</strong><span>IDs, names, targets, dates, source, status, scope and severity counts</span></div>{exportError&&<p className="validation-message"><Icon name="alert" size={13}/>{exportError}</p>}<div className="modal-actions"><Button variant="secondary" onClick={()=>setExportOpen(false)}>Cancel</Button><Button onClick={exportHistory}>Export {exportFormat.toUpperCase()}</Button></div></section></div>}{exported&&<div className="toast"><span><Icon name="check" size={15}/></span><div><strong>History export downloaded</strong><small>The file contains currently saved local prototype records.</small></div><button onClick={()=>setExported(false)}><Icon name="close" size={14}/></button></div>}<p className="disclaimer"><Icon name="shield" size={13}/>Imported records persist in local storage for this browser only. Illustrative assessments are not presented as real scans.</p></>;
}

function ReportsPage() {
  const sectionOptions = ["Executive summary", "Scope and methodology", "Findings by priority", "Original scanner evidence", "AI explanations and remediation", "Human review status", "Scan comparison", "Limitations and verification notes"];
  const [assessment, setAssessment] = useState("A-1042");
  const [sections, setSections] = useState(sectionOptions);
  const [generation, setGeneration] = useState<"idle" | "success" | "failed" | "missing">("idle");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exported, setExported] = useState(false);
  const toggleSection = (section: string) => setSections(sections.includes(section) ? sections.filter((item) => item !== section) : [...sections, section]);
  const generate = () => {
    if (!assessment || !sections.length) setGeneration("missing");
    else setGeneration("success");
  };
  const reports = [
    ["Customer portal — Q2 security report", "app.sentra-demo.io", "May 21, 2025", "Full assessment", "24", "Ready"],
    ["Customer portal release comparison", "app.sentra-demo.io", "May 6, 2025", "Comparison", "27", "Ready"],
    ["Public API quarterly review", "api.sentra-demo.io", "Mar 28, 2025", "Executive", "18", "Generating"],
    ["Limited-scope validation report", "app.sentra-demo.io", "Feb 20, 2025", "Full assessment", "12", "Failed"],
  ];
  return <>
    <section className="page-heading reports-heading"><div><p className="eyebrow">Illustrative report workspace</p><h1>Security Reports</h1><p>Generate and manage assessment reports.</p></div><Button onClick={() => document.querySelector(".report-builder")?.scrollIntoView({behavior:"smooth"})}><Icon name="plus" size={16}/>Generate Report</Button></section>
    <section className="panel report-history">
      <div className="panel-head"><div><h2>Report History</h2><p>Generated outputs and recent report activity</p></div><label className="compact-search"><Icon name="search" size={14}/><input placeholder="Search reports"/></label></div>
      <div className="table-wrap"><table><thead><tr><th>Report name</th><th>Target</th><th>Assessment date</th><th>Report type</th><th>Findings</th><th>Generation status</th><th>Actions</th></tr></thead><tbody>{reports.map(([name,target,date,type,count,status]) => <tr key={name}><td><strong>{name}</strong><span>Illustrative PDF report</span></td><td className="mono">{target}</td><td>{date}</td><td>{type}</td><td><strong className="count-value">{count}</strong></td><td><span className={`report-status ${status.toLowerCase()}`}><i/>{status}</span></td><td><div className="report-actions">{status === "Ready" ? <><button onClick={() => setPreviewOpen(true)}><Icon name="file" size={14}/>Preview</button><button onClick={() => {setExported(true); setTimeout(() => setExported(false),2800);}}><Icon name="upload" size={14}/>Export</button></> : status === "Failed" ? <button onClick={() => setGeneration("failed")}><Icon name="history" size={14}/>Review failure</button> : <span>Preparing…</span>}</div></td></tr>)}</tbody></table></div>
    </section>

    <section className="report-builder">
      <div className="panel report-config">
        <div className="section-kicker"><span>01</span><div><p className="eyebrow">Configuration</p><h2>Build a Report</h2></div></div>
        <label className="field report-assessment">Saved assessment<select value={assessment} onChange={(e) => { setAssessment(e.target.value); setGeneration("idle"); }}><option value="">Select an assessment…</option><option value="A-1042">Customer portal — Q2 review · May 21</option><option value="A-1018">Customer portal — post-release · May 6</option><option value="A-0956">Public API — quarterly review · Mar 28</option></select><small>Only completed assessments with saved evidence are available.</small></label>
        <fieldset className="report-sections"><legend>Include report sections</legend>{sectionOptions.map((section) => <label key={section}><input type="checkbox" checked={sections.includes(section)} onChange={() => toggleSection(section)}/><span><Icon name="check" size={12}/></span>{section}</label>)}</fieldset>
        {generation === "success" && <div className="generation-message success"><Icon name="check"/><span><strong>Report generated successfully</strong>The illustrative preview has been updated and is ready to review.</span></div>}
        {generation === "failed" && <div className="generation-message failed"><Icon name="alert"/><span><strong>Report generation failed</strong>An example formatting error prevented generation. Source assessment data remains unchanged.</span></div>}
        {generation === "missing" && <div className="generation-message warning"><Icon name="alert"/><span><strong>Missing assessment data</strong>Select a saved assessment and include at least one report section.</span></div>}
        <div className="config-actions"><Button variant="secondary" onClick={() => {setAssessment("");setGeneration("idle");}}>Clear</Button><Button onClick={generate}><Icon name="file" size={15}/>Generate Report</Button></div>
        <p className="prototype-note"><Icon name="shield" size={13}/>Prototype only. No PDF file will be generated.</p>
      </div>

      <div className="preview-workspace">
        <div className="preview-toolbar"><div><p className="eyebrow">02 · Report preview</p><span>Printable layout · Letter</span></div><div><Button variant="secondary" onClick={() => setPreviewOpen(true)}><Icon name="search" size={14}/>Preview PDF</Button><Button onClick={() => {setExported(true); setTimeout(() => setExported(false),2800);}}><Icon name="upload" size={14}/>Export PDF</Button></div></div>
        <ReportDocument compact/>
      </div>
    </section>
    <p className="disclaimer"><Icon name="alert" size={14}/> Reports and assessment data shown are illustrative. Export and PDF generation actions are non-functional prototype interactions.</p>
    {previewOpen && <div className="report-preview-modal"><div className="preview-modal-bar"><strong>PDF Preview</strong><span>Customer portal — Q2 security report</span><button onClick={() => setPreviewOpen(false)}><Icon name="close"/></button></div><div className="preview-scroll"><ReportDocument/></div></div>}
    {exported && <div className="toast"><span><Icon name="file" size={15}/></span><div><strong>Export preview only</strong><small>No PDF file was generated.</small></div><button onClick={() => setExported(false)}><Icon name="close" size={15}/></button></div>}
  </>;
}

function ReportDocument({ compact = false }: { compact?: boolean }) {
  return <article className={`report-paper ${compact ? "compact" : ""}`}>
    <header className="report-cover"><div className="report-brand"><div className="report-mark"><i/><i/><i/></div><strong>SENTRA</strong></div><span>Security assessment report</span><h2>Customer Portal<br/>Q2 Security Review</h2><p>Prepared for Arcadian Systems</p><dl><div><dt>Authorized target</dt><dd>app.sentra-demo.io</dd></div><div><dt>Assessment date</dt><dd>May 21, 2025</dd></div><div><dt>Generated</dt><dd>May 21, 2025 · 11:28 AM</dd></div></dl></header>
    <section className="report-body"><div className="report-title"><span>01</span><h3>Assessment Summary</h3></div><p>This illustrative report organizes scanner observations, evidence-aware explanations and human review status for the authorized target. It does not represent a real security assessment.</p><div className="report-score"><div><small>Security score</small><strong>76<span>/100</span></strong></div><div><small>Total findings</small><strong>24</strong></div><div><small>Needs review</small><strong>5</strong></div></div>
      <div className="report-title"><span>02</span><h3>Severity Summary</h3></div><div className="report-severity">{[["Critical","2"],["High","6"],["Medium","9"],["Low","5"],["Informational","2"]].map(([label,value]) => <div key={label}><i className={label.toLowerCase()}/><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className="report-title"><span>03</span><h3>Prioritized Findings</h3></div><table className="print-findings"><thead><tr><th>Finding</th><th>Priority</th><th>Evidence</th><th>Status</th></tr></thead><tbody><tr><td>Administrative interface may be exposed</td><td>Critical</td><td>Needs verification</td><td>Needs review</td></tr><tr><td>Outdated OpenSSH service version</td><td>High</td><td>Supported</td><td>In progress</td></tr><tr><td>Content Security Policy missing</td><td>Medium</td><td>Supported</td><td>Open</td></tr></tbody></table>
      <div className="report-title"><span>04</span><h3>Evidence & Recommendations</h3></div><div className="report-callout"><strong>Evidence-aware guidance</strong><p>Prioritize the exposed administrative route for manual verification. Confirm service ownership and access controls before changing production configuration. AI-generated recommendations require qualified human review.</p></div>
      <div className="report-title"><span>05</span><h3>Scope & Limitations</h3></div><p>Scope was limited to the exact authorized domain using predefined service discovery and non-intrusive check profiles. No exploitation, credential testing or automatic scope expansion was performed. A finding no longer appearing in output is not considered verified resolved without human validation.</p>
    </section><footer><span>SENTRA · Illustrative report</span><span>Confidential · Page 1</span></footer>
  </article>;
}

function ImportFindings({ viewFindings, existingFindings, importRecords }: { viewFindings: () => void; existingFindings: typeof explorerFindings; importRecords: (findings: typeof explorerFindings, fileName: string, format: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validRows, setValidRows] = useState<Array<{ finding: typeof explorerFindings[number]; duplicate: boolean; row: number }>>([]);
  const [invalidRows, setInvalidRows] = useState<Array<{ row: number; reason: string }>>([]);
  const [success, setSuccess] = useState<{ imported: number; skipped: number; rejected: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const parseCsv = (text: string) => {
    const rows: string[][] = []; let row: string[] = [], cell = "", quoted = false;
    for (let i=0;i<text.length;i++) { const c=text[i], next=text[i+1]; if (c === '"' && quoted && next === '"') {cell+='"';i++;} else if (c === '"') quoted=!quoted; else if (c === ',' && !quoted) {row.push(cell);cell="";} else if ((c === '\n' || c === '\r') && !quoted) {if (c === '\r' && next === '\n') i++; row.push(cell); if (row.some((v) => v.trim())) rows.push(row); row=[];cell="";} else cell+=c; }
    row.push(cell); if (row.some((v) => v.trim())) rows.push(row); return rows;
  };
  const pick = (record: Record<string,unknown>, names: string[]) => { for (const name of names) { const key=Object.keys(record).find((item) => item.toLowerCase().replace(/[ _-]/g,"") === name.replace(/[ _-]/g,"").toLowerCase()); if (key && record[key] != null) return String(record[key]).trim(); } return ""; };
  const duplicateKey = (finding: typeof explorerFindings[number]) => finding.id.startsWith("IMP-") ? `attributes:${finding.title.toLowerCase()}|${finding.asset.toLowerCase()}|${finding.source.toLowerCase()}` : `identifier:${finding.id.toLowerCase()}`;
  const validateRecords = (records: unknown[]) => {
    const valid: Array<{ finding: typeof explorerFindings[number]; duplicate: boolean; row: number }> = [], invalid: Array<{row:number;reason:string}> = []; const seen = new Set(existingFindings.map(duplicateKey));
    records.forEach((raw,index) => { const row=index+1; if (!raw || typeof raw !== "object" || Array.isArray(raw)) return invalid.push({row,reason:"Record must be an object or CSV row."}); const record=raw as Record<string,unknown>; const title=pick(record,["title","finding_title","finding","name"]); const severityRaw=pick(record,["severity","risk_level","risk","level"]).toLowerCase(); const asset=pick(record,["asset","affected_asset","host","hostname","target"]); const allowed: Record<string,string>={critical:"Critical",high:"High",medium:"Medium",low:"Low",informational:"Informational",info:"Informational"}; const reasons=[]; if (!title) reasons.push("missing finding title"); if (!asset) reasons.push("missing affected asset"); if (!allowed[severityRaw]) reasons.push(`invalid severity${severityRaw ? ` “${severityRaw}”` : ""}`); if (reasons.length) return invalid.push({row,reason:reasons.join(", ")}); const source=pick(record,["source","source_tool","scanner","tool"]) || "Imported file"; const evidence=pick(record,["evidence","proof","response","description"]); const identifier=pick(record,["id","identifier","finding_id","cve","cve_id"]); const port=pick(record,["port","service_port"]); const service=pick(record,["service","protocol"]); const normalizedAsset=port && !asset.includes(":") ? `${asset}:${port}` : asset; const generated=`IMP-${Date.now()}-${row}`; const finding={id:identifier || generated,title,asset:normalizedAsset,severity:allowed[severityRaw],priority:allowed[severityRaw],evidence:evidence ? "Supported" : "Incomplete",source,review:"Needs review",date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),note:evidence || `Imported ${service ? `${service} ` : ""}finding requires evidence review.`}; const key=duplicateKey(finding); const duplicate=seen.has(key); seen.add(key); valid.push({finding,duplicate,row}); }); setValidRows(valid); setInvalidRows(invalid);
  };
  const processFile = async (nextFile?: File) => { if (!nextFile) return; setFile(nextFile);setError("");setSuccess(null);setValidRows([]);setInvalidRows([]); const ext=nextFile.name.split(".").pop()?.toLowerCase(); if (!ext || !["json","csv"].includes(ext)) return setError("Unsupported format. Choose a JSON or CSV file."); if (!nextFile.size) return setError("The selected file is empty."); if (nextFile.size > 10*1024*1024) return setError("The selected file exceeds the 10 MB prototype limit."); setLoading(true); try { const text=await nextFile.text(); let records: unknown[]; if (ext === "json") { let parsed: unknown; try {parsed=JSON.parse(text);} catch {throw new Error("Malformed JSON. Check commas, quotes and brackets.");} records=Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" && Array.isArray((parsed as {findings?:unknown[]}).findings) ? (parsed as {findings:unknown[]}).findings : []; if (!records.length) throw new Error("JSON must contain a non-empty array or a findings array."); } else { const rows=parseCsv(text); if (rows.length < 2) throw new Error("CSV must include a header row and at least one data row."); const headers=rows[0].map((h) => h.trim()); if (headers.some((h) => !h)) throw new Error("CSV contains an empty column header."); records=rows.slice(1).map((values) => Object.fromEntries(headers.map((header,i) => [header,values[i] ?? ""]))); } validateRecords(records); } catch (caught) {setError(caught instanceof Error ? caught.message : "The file could not be read.");} finally {setLoading(false);} };
  const confirmImport = () => { if (!file) return; const accepted=validRows.filter((row) => !row.duplicate).map((row) => row.finding); if (!accepted.length) return setError("No new valid findings are available to import."); importRecords(accepted,file.name,file.name.endsWith(".csv") ? "CSV" : "JSON"); setSuccess({imported:accepted.length,skipped:validRows.filter((row) => row.duplicate).length,rejected:invalidRows.length}); };
  const reset = () => {setFile(null);setError("");setValidRows([]);setInvalidRows([]);setSuccess(null);if(inputRef.current) inputRef.current.value="";};
  if (success) return <section className="import-success"><div className="success-icon"><Icon name="check" size={27}/></div><p className="eyebrow">Local prototype import complete</p><h1>{success.imported} findings imported</h1><p>Records were normalized and saved to this browser using local storage. No server or production assessment was changed.</p><div className="success-stats"><div><strong>{success.imported}</strong><span>Imported</span></div><div><strong>{success.skipped}</strong><span>Duplicates skipped</span></div><div><strong>{success.rejected}</strong><span>Rejected rows</span></div></div><div className="success-actions"><Button variant="secondary" onClick={reset}>Import another file</Button><Button onClick={viewFindings}>View imported findings <Icon name="arrow" size={14}/></Button></div></section>;
  return <><section className="page-heading import-heading"><div><p className="eyebrow">Local findings ingestion</p><h1>Import Scanner Results</h1><p>Validate JSON or CSV findings before adding them to SENTRA.</p></div>{file && <Button variant="secondary" onClick={reset}>Cancel Import</Button>}</section><section className={`upload-zone ${dragging ? "dragging" : ""} ${error ? "has-error" : ""}`} onDragOver={(e) => {e.preventDefault();setDragging(true);}} onDragLeave={() => setDragging(false)} onDrop={(e) => {e.preventDefault();setDragging(false);processFile(e.dataTransfer.files[0]);}}><input ref={inputRef} type="file" accept=".json,.csv,application/json,text/csv" onChange={(e) => processFile(e.target.files?.[0])}/>{loading ? <div className="upload-loading"><span/><h2>Reading and validating file</h2><p>Checking content, required fields and potential duplicates…</p></div> : file ? <div className="uploaded-file"><span><Icon name="file" size={22}/></span><div><h2>{file.name}</h2><p>{(file.size/1024).toFixed(1)} KB · {file.name.split(".").pop()?.toUpperCase()}</p></div>{!error && <Badge tone="Supported">Preview ready</Badge>}<button onClick={reset}><Icon name="close" size={17}/></button></div> : <div className="upload-empty"><span><Icon name="upload" size={24}/></span><h2>Drop scanner findings here</h2><p>Expected fields: title, severity and affected asset. Source, evidence, identifier, port and service are optional.</p><Button onClick={() => inputRef.current?.click()}>Choose File</Button><small>JSON or CSV · Maximum 10 MB · Files are processed locally in this browser</small></div>}</section>{error && <div className="import-error-banner"><Icon name="alert"/><div><strong>Import validation failed</strong><p>{error}</p></div></div>}{file && !loading && (validRows.length > 0 || invalidRows.length > 0) && <><section className="import-review-strip"><div><span>Valid records</span><strong>{validRows.filter((row) => !row.duplicate).length}</strong></div><div><span>Invalid records</span><strong>{invalidRows.length}</strong></div><div><span>Potential duplicates</span><strong>{validRows.filter((row) => row.duplicate).length}</strong></div><p>Duplicates are skipped using identifier plus normalized title, asset and source.</p></section><section className="panel real-import-preview"><div className="panel-head"><div><h2>Import Preview</h2><p>Review valid, duplicate and rejected rows before saving</p></div></div><div className="table-wrap"><table><thead><tr><th>Row</th><th>Finding title</th><th>Severity</th><th>Affected asset</th><th>Source tool</th><th>Evidence</th><th>Validation</th></tr></thead><tbody>{validRows.map(({finding,duplicate,row}) => <tr key={`${row}-${finding.id}`}><td>{row}</td><td><strong>{finding.title}</strong><span>{finding.id}</span></td><td><Badge tone={finding.severity}>{finding.severity}</Badge></td><td className="mono">{finding.asset}</td><td>{finding.source}</td><td>{finding.evidence}</td><td><span className={`row-status ${duplicate ? "duplicate" : "valid"}`}><i/>{duplicate ? "Duplicate · skipped" : "Valid"}</span></td></tr>)}{invalidRows.map((invalid) => <tr className="invalid" key={`invalid-${invalid.row}`}><td>{invalid.row}</td><td colSpan={5}><strong>Invalid record</strong><span>{invalid.reason}</span></td><td><span className="row-status invalid"><i/>Rejected</span></td></tr>)}</tbody></table></div><div className="real-import-actions"><Button variant="secondary" onClick={reset}>Cancel</Button><Button onClick={confirmImport} disabled={!validRows.some((row) => !row.duplicate)}>Import {validRows.filter((row) => !row.duplicate).length} Valid Findings</Button></div></section></>}<p className="disclaimer"><Icon name="shield" size={13}/>Imported records are stored locally for this frontend prototype. They are not persisted to a backend or presented as confirmed vulnerabilities.</p></>;
}

function SettingsPage({ workspace }: { workspace: string }) {
  const tabs = [["General","grid"],["Security","shield"],["AI Integrations","alert"],["Scanner Integrations","search"],["Report Preferences","file"],["Help Center","book"]] as const;
  const [tab, setTab] = useState("General");
  const [connection, setConnection] = useState<"idle" | "testing" | "success" | "failed">("idle");
  const [credential, setCredential] = useState(true);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportSections, setReportSections] = useState(["Executive summary","Findings by priority","AI explanations and remediation","Human review status","Limitations and verification notes"]);
  const [notifications, setNotifications] = useState(["Critical findings","Assessment completed","Review assigned"]);
  const testConnection = () => {
    setConnection("testing");
    setTimeout(() => setConnection(credential ? "success" : "failed"), 850);
  };
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2600); };
  const toggleList = (value: string, list: string[], setter: (items: string[]) => void) => setter(list.includes(value) ? list.filter((item) => item !== value) : [...list,value]);
  return <>
    <section className="page-heading settings-heading"><div><p className="eyebrow">{workspace}</p><h1>Settings & Integrations</h1><p>Manage workspace policies, providers and personal preferences.</p></div>{tab !== "Help Center" && <Button onClick={save}>Save Changes</Button>}</section>
    <div className="settings-layout">
      <aside className="settings-subnav"><p>Settings</p>{tabs.map(([label,icon]) => <button key={label} className={tab === label ? "active" : ""} onClick={() => setTab(label)}><Icon name={icon} size={16}/><span>{label}</span><Icon name="arrow" size={13}/></button>)}</aside>
      <div className="settings-content">
        {tab === "General" && <section className="panel settings-panel"><div className="settings-panel-head"><div><p className="eyebrow">Workspace configuration</p><h2>General</h2><p>Manage the identity and display preferences for this prototype workspace.</p></div></div><div className="settings-form-grid"><label className="field">Workspace name<input value={workspace} readOnly/></label><label className="field">Default assessment timezone<select><option>UTC−05:00 · Eastern Time</option><option>UTC</option><option>UTC+01:00 · Central European Time</option></select></label><label className="field full-field">Workspace purpose<textarea defaultValue="Security assessment review, evidence validation and remediation planning."/></label></div><div className="data-disclosure"><Icon name="shield"/><div><strong>Prototype workspace data</strong><p>Workspace selection and settings are simulated in the browser. No organization, membership or server-side permission record is created.</p></div></div></section>}
        {tab === "AI Integrations" && <section className="panel settings-panel">
          <div className="settings-panel-head"><div><p className="eyebrow">Integration</p><h2>AI Provider</h2><p>Configure the provider used for evidence-aware explanations and remediation suggestions.</p></div><span className={`connection-pill ${connection === "success" ? "connected" : credential ? "connected" : "disconnected"}`}><i/>{connection === "success" ? "Connection verified" : credential ? "Configured" : "Not configured"}</span></div>
          <div className="settings-form-grid"><label className="field">Selected provider<select defaultValue="openai"><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option><option value="azure">Azure OpenAI</option></select></label><label className="field">Model name<select defaultValue="gpt-4.1-mini"><option>gpt-4.1-mini</option><option>gpt-4.1</option></select></label></div>
          <div className="credential-row"><div><span>API credential</span><strong>{credential ? "•••• •••• •••• 7K2F" : "No credential configured"}</strong><small>{credential ? "Added May 8, 2025 · Workspace secret" : "Add a credential to test the provider connection."}</small></div><div>{credential ? <><Button variant="secondary">Replace</Button><button className="destructive-link" onClick={() => setRemoveOpen(true)}>Remove</button></> : <Button>Add credential</Button>}</div></div>
          <div className="data-disclosure"><Icon name="shield"/><div><strong>Data shared with the selected provider</strong><p>When a reviewer requests an explanation, SENTRA may send the finding title, affected technology, scanner description, captured evidence and approved asset context. Credentials, unrelated findings and raw customer data are excluded by default.</p><ul><li>Finding evidence is sent only for an explicit analysis action.</li><li>Provider responses are treated as suggestions requiring human review.</li><li>Workspace authorization and retention policies still apply.</li></ul></div></div>
          <div className="connection-test"><div><span>API connection status</span><strong>{connection === "testing" ? "Testing connection…" : connection === "success" ? "Connected successfully" : connection === "failed" ? "Connection failed" : credential ? "Ready to test" : "Credential required"}</strong>{connection === "success" && <small>Verified May 21, 2025 at 11:42 AM · 428 ms</small>}{connection === "failed" && <small>Authentication was not available. No finding data was sent.</small>}</div><Button variant="secondary" onClick={testConnection}>{connection === "testing" ? "Testing…" : "Test Connection"}</Button></div>
          {connection === "success" && <div className="settings-result success"><Icon name="check"/><span><strong>Connection test passed</strong>The provider responded successfully. No finding content was included in the test.</span></div>}
          {connection === "failed" && <div className="settings-result failed"><Icon name="alert"/><span><strong>Connection test failed</strong>Add or replace the workspace credential, then try again.</span></div>}
        </section>}

        {tab === "Scanner Integrations" && <section className="panel settings-panel">
          <div className="settings-panel-head"><div><p className="eyebrow">Local tooling</p><h2>Scanner Integrations</h2><p>Review tool availability and the approved safe configurations used by SENTRA.</p></div></div>
          <div className="integration-cards"><div><span className="integration-icon"><Icon name="search"/></span><div><h3>Nmap</h3><p>Service and port discovery</p></div><Badge tone="Supported">Available</Badge><dl><div><dt>Version</dt><dd>7.95</dd></div><div><dt>Last checked</dt><dd>Today, 10:15 AM</dd></div><div><dt>Configuration</dt><dd>Safe discovery profile</dd></div></dl></div><div><span className="integration-icon"><Icon name="shield"/></span><div><h3>Nuclei</h3><p>Non-intrusive checks</p></div><Badge tone="Supported">Available</Badge><dl><div><dt>Version</dt><dd>3.2.7</dd></div><div><dt>Templates</dt><dd>Approved set · May 2025</dd></div><div><dt>Configuration</dt><dd>Low-impact profile</dd></div></dl></div></div>
          <div className="approved-config"><Icon name="check"/><div><strong>Approved scanning configuration</strong><p>SENTRA uses predefined service discovery, conservative timing, capped concurrency and curated non-destructive templates. Arbitrary shell commands and unrestricted scanner arguments are unavailable.</p></div></div>
        </section>}

        {tab === "Security" && <section className="panel settings-panel">
          <div className="settings-panel-head"><div><p className="eyebrow">Workspace policy</p><h2>Scanning Safety</h2><p>These safeguards apply to every assessment and cannot be bypassed from the interface.</p></div><Badge tone="Supported">Enforced</Badge></div>
          <div className="policy-list">{[
            ["Authorization requirements","Every assessment requires explicit confirmation of ownership or written permission.","Required"],
            ["Scope enforcement","Scans remain limited to the exact configured target; automatic expansion is disabled.","Enforced"],
            ["Non-intrusive check policy","Only approved low-impact discovery and vulnerability checks are available.","Enabled"],
            ["Rate limits and timeouts","Conservative concurrency, request pacing and hard safety timeouts are applied.","Capped"],
            ["Human review policy","AI explanations and suggested priorities cannot confirm or close a finding.","Required"],
          ].map(([title,copy,status],index) => <div key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{copy}</p></div><Badge tone="Supported">{status}</Badge></div>)}</div>
          <div className="policy-notice"><Icon name="alert"/><p><strong>Safety settings are organization-controlled.</strong>Contact a workspace administrator to request policy changes. Loosening protections requires documented review and is not available in this prototype.</p></div>
        </section>}

        {tab === "Report Preferences" && <section className="panel settings-panel">
          <div className="settings-panel-head"><div><p className="eyebrow">Defaults</p><h2>Report Preferences</h2><p>Choose default content and formatting for newly generated reports.</p></div></div>
          <fieldset className="preference-checks"><legend>Default report sections</legend>{["Executive summary","Scope and methodology","Findings by priority","Original scanner evidence","AI explanations and remediation","Human review status","Scan comparison","Limitations and verification notes"].map((item) => <label key={item}><input type="checkbox" checked={reportSections.includes(item)} onChange={() => toggleList(item,reportSections,setReportSections)}/><span><Icon name="check" size={12}/></span><p><strong>{item}</strong><small>{item === "AI explanations and remediation" ? "Clearly labeled as AI-generated guidance requiring review" : "Include when source assessment data is available"}</small></p></label>)}</fieldset>
          <div className="settings-form-grid preference-fields"><label className="field">Report naming preference<select><option>Assessment name — Report date</option><option>Target — Assessment date</option><option>Custom name at generation</option></select></label><label className="field">Date and timestamp display<select><option>May 21, 2025 · 11:42 AM</option><option>2025-05-21 · 11:42</option><option>21 May 2025 · 11:42</option></select></label></div>
        </section>}

        {tab === "Profile" && <section className="panel settings-panel">
          <div className="settings-panel-head"><div><p className="eyebrow">Personal settings</p><h2>User Preferences</h2><p>Manage your profile, notifications and interface appearance.</p></div></div>
          <div className="profile-settings"><div className="profile-avatar">EM</div><div><strong>Profile information</strong><span>Used for review decisions and report audit history.</span></div><Button variant="secondary">Change photo</Button></div>
          <div className="settings-form-grid"><label className="field">Full name<input defaultValue="Elena Marlow"/></label><label className="field">Role<input defaultValue="Security lead"/></label><label className="field full-field">Email address<input defaultValue="elena@arcadian.example" type="email"/></label></div>
          <fieldset className="notification-settings"><legend>Notification preferences</legend>{["Critical findings","Assessment completed","Review assigned","Weekly security digest"].map((item) => <label key={item}><span><strong>{item}</strong><small>{item === "Critical findings" ? "Notify when illustrative critical findings require review" : "Receive workspace updates by email"}</small></span><button type="button" className={notifications.includes(item) ? "on" : ""} onClick={() => toggleList(item,notifications,setNotifications)} aria-pressed={notifications.includes(item)}><i/></button></label>)}</fieldset>
          <fieldset className="theme-settings"><legend>Theme preference</legend><label className="selected"><span className="theme-preview warm"><i/><i/><i/></span><p><strong>Warm light</strong><small>Ivory, white and forest green</small></p><Icon name="check" size={15}/></label><label><span className="theme-preview system"><i/><i/><i/></span><p><strong>Use system setting</strong><small>Match your device preference</small></p></label></fieldset>
        </section>}
        {tab === "Help Center" && <section className="panel settings-panel help-center-panel"><div className="settings-panel-head"><div><p className="eyebrow">Documentation and support</p><h2>Help Center</h2><p>Practical guidance for assessments, evidence review and safe use of SENTRA.</p></div></div><label className="help-search"><Icon name="search" size={15}/><input placeholder="Search help topics…"/></label><div className="help-links"><button><span><Icon name="shield"/></span><div><strong>Start an authorized assessment</strong><small>Define exact scope, confirm permission and choose safe checks.</small></div><Icon name="arrow" size={14}/></button><button><span><Icon name="file"/></span><div><strong>Understand scanner evidence</strong><small>Separate source observations, uncertainty and reviewer conclusions.</small></div><Icon name="arrow" size={14}/></button><button><span><Icon name="alert"/></span><div><strong>Review and prioritize findings</strong><small>Compare original severity with SENTRA suggested priority.</small></div><Icon name="arrow" size={14}/></button><button><span><Icon name="history"/></span><div><strong>Verify remediation</strong><small>Distinguish no longer detected from verified resolved.</small></div><Icon name="arrow" size={14}/></button></div><div className="help-faq"><h3>Common questions</h3>{[["Does SENTRA automatically exploit vulnerabilities?","No. SENTRA organizes evidence and supports non-intrusive, authorized assessment workflows."],["Is a scanner finding automatically confirmed?","No. Evidence strength, missing context and human review remain visible."],["Does “no longer detected” mean fixed?","Not by itself. Verified resolution requires corrective evidence and reviewer validation."]].map(([q,a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div><p className="prototype-note"><Icon name="book" size={13}/>Documentation links and support content are illustrative in this frontend prototype.</p></section>}
      </div>
    </div>
    <p className="disclaimer"><Icon name="shield" size={14}/> Settings and connection results are illustrative. Credentials are never displayed in plain text or tested in this frontend prototype.</p>
    {saved && <div className="toast"><span><Icon name="check" size={15}/></span><div><strong>Preferences saved</strong><small>Prototype state updated.</small></div><button onClick={() => setSaved(false)}><Icon name="close" size={15}/></button></div>}
    {removeOpen && <div className="modal-backdrop" onMouseDown={() => setRemoveOpen(false)}><section className="modal cancel-modal" onMouseDown={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-labelledby="remove-title"><div className="modal-head"><div><p className="eyebrow">Destructive change</p><h2 id="remove-title">Remove AI provider credential?</h2></div><button className="icon-button" onClick={() => setRemoveOpen(false)}><Icon name="close"/></button></div><p>AI explanations and remediation suggestions will be unavailable until a new workspace credential is added. Existing findings and review decisions will not be deleted.</p><div className="modal-actions"><Button variant="secondary" onClick={() => setRemoveOpen(false)}>Keep Credential</Button><button className="danger-button" onClick={() => {setCredential(false);setConnection("idle");setRemoveOpen(false);}}>Remove Credential</button></div></section></div>}
  </>;
}

function LearningCenter() {
  const [view, setView] = useState<"topics" | "glossary">("topics");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState<typeof learningTopics[number] | null>(null);
  const filtered = learningTopics.filter((item) => `${item.title} ${item.category} ${item.summary}`.toLowerCase().includes(search.toLowerCase()));
  const glossary = [
    ["Affected asset","The system, service or resource associated with an observation."],
    ["CVE","A standardized identifier for a publicly disclosed security vulnerability."],
    ["Evidence","Recorded information supporting or weakening a scanner’s claim."],
    ["False positive","A detection that matches a rule but does not represent the claimed condition."],
    ["Finding","A security-relevant observation requiring context and human review."],
    ["No longer detected","Absent from later scanner output; not proof that remediation was verified."],
    ["Original severity","The severity assigned by the source scanner, preserved unchanged."],
    ["Scope","The exact systems and checks authorized for an assessment."],
    ["Suggested priority","SENTRA’s advisory ordering based on evidence and environmental context."],
    ["Verified resolved","A reviewer-validated state supported by corrective evidence."],
  ].filter(([term,definition]) => `${term} ${definition}`.toLowerCase().includes(search.toLowerCase()));
  if (topic) return <LearningTopic topic={topic} back={() => setTopic(null)} open={(next) => setTopic(next)}/>;
  return <>
    <section className="learning-hero">
      <div><p className="eyebrow">SENTRA knowledge base</p><h1>Security Learning Center</h1><p>Understand your findings and learn what to do next.</p></div>
      <label className="learning-search"><Icon name="search" size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search topics, concepts or terms…"/><kbd>⌘ K</kbd></label>
    </section>
    <div className="learning-toolbar"><div className="learning-tabs"><button className={view === "topics" ? "active" : ""} onClick={() => setView("topics")}><Icon name="book" size={15}/>Topics</button><button className={view === "glossary" ? "active" : ""} onClick={() => setView("glossary")}><Icon name="file" size={15}/>Glossary</button></div><p>{view === "topics" ? `${filtered.length} learning topics` : `${glossary.length} glossary terms`} · Illustrative guidance</p></div>
    {view === "topics" ? <section className="topic-grid">{filtered.map((item) => <button className="topic-card" key={item.id} onClick={() => setTopic(item)}><span className="topic-icon"><Icon name={item.icon}/></span><div><small>{item.category}</small><h2>{item.title}</h2><p>{item.summary}</p></div><span className="topic-arrow"><Icon name="arrow" size={15}/></span></button>)}</section> :
    <section className="panel glossary-panel"><div className="glossary-head"><div><p className="eyebrow">Reference</p><h2>Security Glossary</h2><p>Concise definitions used throughout SENTRA.</p></div><div className="letter-index">{"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => <span key={letter} className={glossary.some(([term]) => term.startsWith(letter)) ? "available" : ""}>{letter}</span>)}</div></div><dl className="glossary-list">{glossary.map(([term,definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></section>}
    {((view === "topics" && !filtered.length) || (view === "glossary" && !glossary.length)) && <section className="panel learning-empty"><span><Icon name="search" size={22}/></span><h2>No learning content found</h2><p>Try a broader term such as evidence, risk, ports or remediation.</p><Button variant="secondary" onClick={() => setSearch("")}>Clear search</Button></section>}
    <div className="learning-safety"><Icon name="shield"/><div><strong>Learn safely</strong><p>Educational guidance does not grant authorization to test a system. Only assess targets you own or have explicit permission to evaluate.</p></div></div>
  </>;
}

function LearningTopic({ topic, back, open }: { topic: typeof learningTopics[number]; back: () => void; open: (topic: typeof learningTopics[number]) => void }) {
  const related = learningTopics.filter((item) => item.id !== topic.id).slice(topic.id.length % 4, topic.id.length % 4 + 3);
  return <>
    <button className="back-link" onClick={back}><span className="back-arrow"><Icon name="arrow" size={14}/></span>Back to Learning Center</button>
    <section className="topic-detail-hero"><span className="topic-icon large"><Icon name={topic.icon} size={24}/></span><div><p className="eyebrow">{topic.category} · Illustrative guidance</p><h1>{topic.title}</h1><p>{topic.summary}</p></div></section>
    <div className="topic-detail-layout"><article className="panel topic-article">
      <section><div className="article-number">01</div><div><h2>Simple explanation</h2><p>{topic.summary} The important distinction is between what a tool observed and what a qualified reviewer can conclude from that observation.</p></div></section>
      <section><div className="article-number">02</div><div><h2>Why it matters</h2><p>{topic.importance}</p></div></section>
      <section><div className="article-number">03</div><div><h2>Practical example</h2><div className="practical-example"><Icon name="file" size={16}/><p>{topic.example}</p></div></div></section>
      <section><div className="article-number">04</div><div><h2>How this connects to SENTRA findings</h2><p>{topic.connection}</p><div className="finding-connection"><span><Icon name="alert" size={15}/></span><div><strong>Evidence before conclusions</strong><small>Review original scanner details, missing evidence and authorization context before confirming a finding.</small></div><button>View example finding <Icon name="arrow" size={13}/></button></div></div></section>
    </article>
    <aside className="topic-aside"><section className="panel documentation-card"><p className="eyebrow">Further reading</p><h2>Relevant Documentation</h2>{topic.docs.map((doc) => <button key={doc}><span><Icon name="external" size={14}/></span><div><strong>{doc}</strong><small>External reference</small></div><Icon name="arrow" size={13}/></button>)}<p>Links are illustrative in this frontend prototype.</p></section><section className="panel related-card"><p className="eyebrow">Continue learning</p><h2>Related Topics</h2>{related.map((item) => <button key={item.id} onClick={() => open(item)}><span>{item.category}</span><strong>{item.title}</strong><Icon name="arrow" size={13}/></button>)}</section></aside></div>
    <div className="ai-disclaimer learning-disclaimer"><Icon name="book" size={15}/><p><strong>Educational content requires context</strong>This illustrative guidance supports human understanding and should not replace vendor documentation, qualified advice or authorized testing procedures.</p></div>
  </>;
}

function AssetInventoryPage({ openAsset }: { openAsset: (asset: typeof assetInventory[number]) => void }) {
  const [search, setSearch] = useState("");
  const [exposure, setExposure] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [sort, setSort] = useState<"name" | "findings">("name");
  const severityOrder: Record<string,number> = { Critical:4, High:3, Medium:2, Low:1 };
  const visible = assetInventory.filter((asset) => (!search || `${asset.host} ${asset.ip}`.toLowerCase().includes(search.toLowerCase())) && (exposure === "All" || asset.exposure === exposure) && (severity === "All" || asset.severity === severity)).sort((a,b) => sort === "name" ? a.host.localeCompare(b.host) : b.findings - a.findings || severityOrder[b.severity] - severityOrder[a.severity]);
  const clear = () => {setSearch("");setExposure("All");setSeverity("All");};
  return <>
    <section className="page-heading asset-page-heading"><div><p className="eyebrow">Illustrative asset inventory</p><h1>Asset Inventory</h1><p>Review assessed hosts, detected services and associated findings.</p></div><Button variant="secondary"><Icon name="upload" size={15}/>Export inventory</Button></section>
    <section className="panel asset-inventory-panel"><div className="asset-filter-bar"><label className="finding-search"><Icon name="search" size={15}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hostname or IP address"/></label><label><span>Exposure status</span><select value={exposure} onChange={(e) => setExposure(e.target.value)}><option>All</option><option>Public-facing</option><option>Internal</option><option>Needs Verification</option><option>Unknown</option></select></label><label><span>Highest severity</span><select value={severity} onChange={(e) => setSeverity(e.target.value)}><option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label><label><span>Sort by</span><select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option value="name">Asset name</option><option value="findings">Open findings</option></select></label><button className="clear-filters" disabled={!search && exposure === "All" && severity === "All"} onClick={clear}>Clear filters</button></div><div className="asset-results"><strong>{visible.length}</strong> illustrative assets</div><div className="table-wrap full-asset-table"><table><thead><tr><th>Asset / Hostname</th><th>IP Address</th><th>Detected Services</th><th>Open Findings</th><th>Highest Severity</th><th>Exposure Status</th><th>Last Assessed</th><th/></tr></thead><tbody>{visible.map((asset) => <tr key={asset.id} className="clickable-row" tabIndex={0} onClick={() => openAsset(asset)} onKeyDown={(e) => {if(e.key === "Enter" || e.key === " ") openAsset(asset);}}><td><strong>{asset.host}</strong><span>{asset.id} · Demo data</span></td><td className="mono">{asset.ip}</td><td><div className="service-tags">{asset.services.map((service) => <span key={service}>{service}</span>)}</div></td><td><strong className="asset-finding-count">{asset.findings}</strong></td><td><Badge tone={asset.severity}>{asset.severity}</Badge></td><td><span className={`exposure-badge ${asset.exposure.toLowerCase().replaceAll(" ","-")}`}><i/>{asset.exposure}</span></td><td>{asset.last}</td><td><button className="row-action"><Icon name="arrow" size={14}/></button></td></tr>)}</tbody></table>{!visible.length && <div className="explorer-empty"><span><Icon name="search" size={22}/></span><h2>No assets match these filters</h2><p>Try another hostname, IP address, exposure state or severity.</p><Button variant="secondary" onClick={clear}>Clear all filters</Button></div>}</div></section>
    <p className="disclaimer"><Icon name="alert" size={13}/>Asset records, service detection and exposure classifications are illustrative. No Nmap or Nuclei scan was performed.</p>
  </>;
}

function AssetDetailsPage({ asset, back, openFinding }: { asset: typeof assetInventory[number]; back: () => void; openFinding: (finding: typeof explorerFindings[number]) => void }) {
  const related = explorerFindings.filter((finding) => asset.findingIds.includes(finding.id));
  return <>
    <button className="back-link" onClick={back}><span className="back-arrow"><Icon name="arrow" size={14}/></span>Back to Asset Inventory</button>
    <section className="asset-detail-hero"><div><p className="eyebrow">{asset.id} · Illustrative asset</p><h1>{asset.host}</h1><p><span className="mono">{asset.ip}</span><span className={`exposure-badge ${asset.exposure.toLowerCase().replaceAll(" ","-")}`}><i/>{asset.exposure}</span></p></div><div><span>Highest severity</span><Badge tone={asset.severity}>{asset.severity}</Badge></div></section>
    <div className="asset-detail-grid"><div className="asset-detail-main"><section className="panel asset-services"><div className="panel-head"><div><h2>Detected Services</h2><p>Service observations from illustrative assessment evidence</p></div></div><div>{asset.services.map((service,index) => {const [name,port] = service.split(" · "); return <article key={service}><span><Icon name={name === "SSH" ? "settings" : "shield"} size={16}/></span><div><strong>{name}</strong><small>TCP port {port} · Service observation</small></div><Badge tone="Open">Detected</Badge></article>;})}</div><p className="asset-caveat"><Icon name="alert" size={13}/>A detected service does not establish that it is vulnerable or publicly reachable.</p></section><section className="panel asset-related-findings"><div className="panel-head"><div><h2>Related Findings</h2><p>Example findings associated with this asset</p></div></div>{related.length ? related.map((finding) => <button key={finding.id} onClick={() => openFinding(finding)}><span className={`severity-line ${finding.severity.toLowerCase()}`}/><div><strong>{finding.title}</strong><small>{finding.id} · {finding.evidence}</small></div><Badge tone={finding.severity}>{finding.severity}</Badge><Icon name="arrow" size={14}/></button>) : <div className="compact-empty"><Icon name="check"/><strong>No linked example findings</strong><span>No illustrative findings are associated with this asset.</span></div>}</section></div>
      <aside className="asset-detail-aside"><section className="panel"><p className="eyebrow">Evidence context</p><h2>Exposure Evidence</h2><p>{asset.evidence}</p><dl><div><dt>Classification</dt><dd>{asset.exposure}</dd></div><div><dt>Last assessed</dt><dd>{asset.last}</dd></div><div><dt>Open findings</dt><dd>{asset.findings}</dd></div></dl></section><section className="panel"><p className="eyebrow">Assessment history</p><h2>Recent Observations</h2><div className="asset-history"><div><i/><span><strong>{asset.last}</strong><small>Services and findings observed</small></span></div><div><i/><span><strong>May 6, 2025</strong><small>Asset included in authorized scope</small></span></div><div><i/><span><strong>Apr 15, 2025</strong><small>First illustrative observation</small></span></div></div></section></aside>
    </div><p className="disclaimer"><Icon name="shield" size={13}/>This page uses illustrative asset and evidence data. Exposure and findings require authorized human verification.</p>
  </>;
}

function RemediationPage({ records, updateRecord, initialFindingId }: { records: RemediationRecord[]; updateRecord: (record: RemediationRecord) => void; initialFindingId: string | null }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(initialFindingId);
  const [saved, setSaved] = useState(false);
  const filtered = records.filter((record) => {
    const finding = explorerFindings.find((item) => item.id === record.findingId)!;
    return (!search || `${finding.title} ${finding.asset}`.toLowerCase().includes(search.toLowerCase())) && (status === "All" || record.status === status) && (severity === "All" || finding.severity === severity);
  });
  const selected = records.find((record) => record.findingId === selectedId);
  const clear = () => {setSearch("");setStatus("All");setSeverity("All");};
  return <>
    <section className="page-heading remediation-heading"><div><p className="eyebrow">Illustrative remediation workflow</p><h1>Remediation</h1><p>Track findings from discovery through verification and resolution.</p></div><Button variant="secondary"><Icon name="file" size={15}/>Export remediation log</Button></section>
    <section className="panel remediation-page-panel"><div className="remediation-filter-bar"><label className="finding-search"><Icon name="search" size={15}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search finding title or asset"/></label><label><span>Remediation status</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Open</option><option>In Progress</option><option>Awaiting Verification</option><option>Fixed</option><option>Accepted Risk</option></select></label><label><span>Original severity</span><select value={severity} onChange={(e) => setSeverity(e.target.value)}><option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label><button className="clear-filters" onClick={clear} disabled={!search && status === "All" && severity === "All"}>Clear filters</button></div><div className="asset-results"><strong>{filtered.length}</strong> remediation records · prototype data</div><div className="table-wrap full-remediation-table"><table><thead><tr><th>Finding Title</th><th>Affected Asset</th><th>Original Severity</th><th>Suggested Priority</th><th>Remediation Status</th><th>Assigned To</th><th>Target Date</th><th/></tr></thead><tbody>{filtered.map((record) => {const finding = explorerFindings.find((item) => item.id === record.findingId)!; return <tr key={record.findingId} className="clickable-row" tabIndex={0} onClick={() => setSelectedId(record.findingId)} onKeyDown={(e) => {if(e.key === "Enter") setSelectedId(record.findingId);}}><td><strong>{finding.title}</strong><span>{finding.id} · Example finding</span></td><td className="mono">{finding.asset}</td><td><Badge tone={finding.severity}>{finding.severity}</Badge></td><td><Badge tone={finding.priority}>{finding.priority}</Badge></td><td><span className={`remediation-badge ${record.status.toLowerCase().replaceAll(" ","-")}`}><i/>{record.status}</span></td><td>{record.assignee}</td><td>{record.targetDate || "Not set"}</td><td><button className="row-action"><Icon name="arrow" size={14}/></button></td></tr>;})}</tbody></table>{!filtered.length && <div className="explorer-empty"><span><Icon name="search" size={22}/></span><h2>No remediation records match</h2><p>Try another finding, status or severity.</p><Button variant="secondary" onClick={clear}>Clear all filters</Button></div>}</div></section>
    <div className="remediation-method"><Icon name="shield" size={15}/><p><strong>Verification is a separate step.</strong>Addressed findings should move to Awaiting Verification until a reviewer confirms corrective evidence. Accepted-risk and duplicate records are excluded from the verified remediation rate.</p></div>
    {selected && <RemediationEditor key={selected.findingId} record={selected} finding={explorerFindings.find((item) => item.id === selected.findingId)!} close={() => setSelectedId(null)} save={(record) => {updateRecord(record);setSelectedId(null);setSaved(true);setTimeout(() => setSaved(false),2800);}}/>}
    {saved && <div className="toast"><span><Icon name="check" size={15}/></span><div><strong>Remediation updated</strong><small>Prototype status, assignee and notes were saved for this session.</small></div><button onClick={() => setSaved(false)}><Icon name="close" size={14}/></button></div>}
  </>;
}

function RemediationEditor({ record, finding, close, save }: { record: RemediationRecord; finding: typeof explorerFindings[number]; close: () => void; save: (record: RemediationRecord) => void }) {
  const [draftStatus, setDraftStatus] = useState<RemediationStatus>(record.status);
  const [assignee, setAssignee] = useState(record.assignee);
  const [targetDate, setTargetDate] = useState(record.targetDate);
  const [notes, setNotes] = useState(record.notes);
  const [verified, setVerified] = useState(record.verified);
  const [error, setError] = useState("");
  const incomplete = finding.evidence !== "Supported";
  const guidance = finding.title.includes("OpenSSH") ? ["Confirm the installed package and vendor patch level.","Plan a supported update with the system owner.","Repeat an authorized service check after deployment."] : finding.title.includes("Content Security") ? ["Review the application’s content sources and required exceptions.","Configure a restrictive Content-Security-Policy header.","Test application behavior and verify the response header."] : finding.title.includes("Administrative") ? ["Confirm whether the route is reachable from untrusted networks.","Review authentication, authorization and network controls.","Restrict exposure and independently verify access."] : ["Confirm the source evidence and affected configuration.","Apply the approved configuration change or compensating control.","Capture corrective evidence and request verification."];
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (draftStatus === "Fixed" && !verified) return setError("Verified corrective evidence is required before marking this finding Fixed. Use Awaiting Verification if confirmation is pending.");
    if (draftStatus === "Accepted Risk" && notes.trim().length < 10) return setError("Document the risk acceptance rationale in reviewer notes.");
    save({...record,status:draftStatus,assignee,targetDate,notes,verified:draftStatus === "Fixed" ? verified : false});
  };
  return <div className="remediation-drawer-backdrop" onMouseDown={close}><aside className="remediation-drawer" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="remediation-editor-title"><div className="remediation-drawer-head"><div><p className="eyebrow">{finding.id} · Illustrative remediation</p><h2 id="remediation-editor-title">{finding.title}</h2><p className="mono">{finding.asset}</p></div><button className="icon-button" onClick={close} aria-label="Close"><Icon name="close"/></button></div><div className="remediation-drawer-body"><section><h3>Plain-language description</h3><p>{finding.note}</p></section><section><h3>Supporting scanner evidence</h3><div className="editor-evidence"><Icon name="file" size={15}/><p><strong>{finding.source} observation · {finding.evidence}</strong>{finding.asset} was included in the illustrative source record. This does not prove exploitability.</p></div>{incomplete && <div className="verification-warning"><Icon name="alert" size={15}/><p><strong>Verification required first</strong>The evidence is {finding.evidence.toLowerCase()}. Confirm the condition before treating remediation guidance as definitive.</p></div>}</section><section><h3>Why this matters</h3><p>Unresolved exposure may increase practical risk depending on reachability, asset importance and compensating controls. Review the evidence before changing production systems.</p></section><section><h3>Suggested remediation steps</h3><ol>{guidance.map((step) => <li key={step}>{step}</li>)}</ol></section><form onSubmit={submit}><div className="editor-form-grid"><label className="field">Remediation status<select value={draftStatus} onChange={(e) => {setDraftStatus(e.target.value as RemediationStatus);setError("");}}><option>Open</option><option>In Progress</option><option>Awaiting Verification</option><option>Fixed</option><option>Accepted Risk</option></select></label><label className="field">Assigned to <select value={assignee} onChange={(e) => setAssignee(e.target.value)}><option>Unassigned</option><option>Elena Marlow</option><option>Marcus Chen</option><option>Priya Nair</option></select></label><label className="field full-field">Target date <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}/></label></div><label className="review-notes">Reviewer notes<textarea value={notes} onChange={(e) => {setNotes(e.target.value);setError("");}} placeholder="Add remediation context, evidence or decision rationale…"/></label>{draftStatus === "Fixed" && <label className={`authorization-check editor-verification ${error ? "has-error" : ""}`}><input type="checkbox" checked={verified} onChange={(e) => {setVerified(e.target.checked);setError("");}}/><span><strong>I reviewed corrective evidence and verified the resolution.</strong><small>If verification is pending, choose Awaiting Verification instead.</small></span></label>}{record.status === "Fixed" && draftStatus !== "Fixed" && <div className="reopen-notice"><Icon name="history" size={14}/><span><strong>Reopening this finding</strong>The verified-fixed state will be removed because the issue was detected again or requires additional work.</span></div>}{error && <p className="validation-message"><Icon name="alert" size={13}/>{error}</p>}<div className="remediation-save"><Button variant="secondary" onClick={close}>Cancel</Button><button className="button primary" type="submit">Save Changes</button></div></form></div><footer>Prototype-only workflow · No backend records are changed</footer></aside></div>;
}

function GenericPage({ name, start }: { name: string; start: () => void }) {
  const [title, copy] = pageCopy[name];
  return <>
    <section className="page-heading"><div><p className="eyebrow">Arcadian Systems</p><h1>{title}</h1><p>{copy}</p></div><Button onClick={name === "Assessments" ? start : undefined}>{name === "Assessments" ? <><Icon name="plus" size={17}/>New assessment</> : <>Create new <Icon name="plus" size={17}/></>}</Button></section>
    <section className="generic-grid">
      <article className="panel feature-panel"><span className="feature-icon"><Icon name={navItems.find(n => n[0] === name)?.[1] || "shield"} size={23}/></span><p className="eyebrow">Workspace overview</p><h2>{name === "Learning Center" ? "Build confidence through clear guidance" : `Everything in ${title.toLowerCase()}, organized.`}</h2><p>{copy} SENTRA keeps source evidence, analyst context and decisions together for a transparent audit trail.</p><Button variant="secondary">Explore workspace <Icon name="arrow" size={14}/></Button></article>
      <article className="panel recent-panel"><div className="panel-head"><div><h2>Recent activity</h2><p>Updated across your workspace</p></div></div>{findings.slice(0,3).map((f,i) => <button className="activity-row" key={f.id}><span className={`activity-mark s${i}`}/><span><strong>{f.title}</strong><small>{i === 0 ? "Elena requested review" : i === 1 ? "Status changed to in progress" : "Evidence note added"} · {f.age}</small></span><Icon name="arrow" size={15}/></button>)}</article>
    </section>
    <section className="panel empty-state"><span className="empty-icon"><Icon name="file" size={25}/></span><h2>Your {title.toLowerCase()} workspace is ready</h2><p>Use the action above to add content. Data shown in this prototype is illustrative and does not represent an actual security assessment.</p><Button variant="secondary">Read the guide <Icon name="external" size={14}/></Button></section>
  </>;
}

type AuthScreen = "signin" | "create" | "forgot" | "reset" | "confirm";

function PasswordField({ label, name, value, onChange, error, placeholder = "Enter your password" }: { label: string; name: string; value: string; onChange: (value: string) => void; error?: string; placeholder?: string }) {
  const [visible, setVisible] = useState(false);
  return <label className={`auth-field ${error ? "has-error" : ""}`}><span>{label}</span><div><input name={name} type={visible ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={name === "password" ? "current-password" : "new-password"}/><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? "Hide" : "Show"}</button></div>{error && <small><Icon name="alert" size={12}/>{error}</small>}</label>;
}

function AuthExperience({ signIn, initialScreen = "signin" }: { signIn: () => void; initialScreen?: AuthScreen }) {
  const [screen, setScreen] = useState<AuthScreen>(initialScreen);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("elena@arcadian.example");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [message, setMessage] = useState("");
  const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validPassword = (value: string) => value.length >= 8 && /[A-Z]/.test(value) && /\d/.test(value);
  const go = (next: AuthScreen) => { setScreen(next); setErrors({}); setMessage(""); setPassword(""); setConfirmPassword(""); };
  const finishLoading = (callback: () => void) => { setLoading(true); setTimeout(() => {setLoading(false);callback();},700); };
  const submitSignIn = (event: React.FormEvent) => { event.preventDefault(); const next: Record<string,string> = {}; if (!email) next.email = "Enter your email address."; else if (!validEmail(email)) next.email = "Enter a valid email address."; if (!password) next.password = "Enter your password."; setErrors(next); if (!Object.keys(next).length) finishLoading(signIn); };
  const submitCreate = (event: React.FormEvent) => { event.preventDefault(); const next: Record<string,string> = {}; if (name.trim().length < 2) next.name = "Enter your full name."; if (!email) next.email = "Enter your work or student email."; else if (!validEmail(email)) next.email = "Enter a valid email address."; if (!validPassword(password)) next.password = "Use 8+ characters with an uppercase letter and number."; if (confirmPassword !== password) next.confirm = "Passwords do not match."; if (!agreed) next.agreed = "Accept the terms and privacy notice to continue."; setErrors(next); if (!Object.keys(next).length) finishLoading(() => go("confirm")); };
  const submitForgot = (event: React.FormEvent) => { event.preventDefault(); const next: Record<string,string> = {}; if (!email || !validEmail(email)) next.email = "Enter a valid email address."; setErrors(next); if (!Object.keys(next).length) finishLoading(() => setMessage("sent")); };
  const submitReset = (event: React.FormEvent) => { event.preventDefault(); const next: Record<string,string> = {}; if (!validPassword(password)) next.password = "Use 8+ characters with an uppercase letter and number."; if (confirmPassword !== password) next.confirm = "Passwords do not match."; setErrors(next); if (!Object.keys(next).length) finishLoading(() => setMessage("updated")); };
  const title = screen === "signin" ? "Welcome back." : screen === "create" ? "Join a clearer security workflow." : screen === "forgot" ? "Recover access calmly." : screen === "reset" ? "Choose a stronger password." : "One final step.";
  return <div className="auth-page">
    <aside className="auth-story"><div className="auth-brand"><span className="auth-shield"><Icon name="shield" size={22}/></span><div><strong>SENTRA</strong><small>Security clarity for safer systems</small></div></div><div className="auth-story-copy"><p className="eyebrow">Evidence-driven security assessment</p><h1>{title}</h1><p>Understand your security findings. Focus on what matters.</p></div><div className="auth-evidence"><div><span>Evidence</span><i/><small>Preserve original scanner context</small></div><div><span>Interpretation</span><i/><small>Make uncertainty visible</small></div><div><span>Human review</span><i/><small>Keep decisions accountable</small></div></div><p className="auth-safety"><Icon name="shield" size={13}/>Only assess systems you own or are authorized to test.</p></aside>
    <main className="auth-main"><section className="auth-card">
      {screen === "signin" && <><div className="auth-heading"><p className="eyebrow">Arcadian Systems workspace</p><h2>Sign in to SENTRA</h2><p>Use the illustrative account details below to enter the prototype.</p></div><form onSubmit={submitSignIn} noValidate><label className={`auth-field ${errors.email ? "has-error" : ""}`}><span>Email address</span><input type="email" value={email} onChange={(e) => {setEmail(e.target.value);setErrors({...errors,email:""});}} placeholder="name@organization.com" autoComplete="email"/>{errors.email && <small><Icon name="alert" size={12}/>{errors.email}</small>}</label><PasswordField label="Password" name="password" value={password} onChange={(value) => {setPassword(value);setErrors({...errors,password:""});}} error={errors.password}/><div className="auth-options"><label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}/><span/>Remember me on this device</label><button type="button" onClick={() => go("forgot")}>Forgot password?</button></div><button className="auth-submit" disabled={loading}>{loading ? <><span className="button-spinner"/>Signing in…</> : "Sign In"}</button></form><div className="auth-divider"><span>New to SENTRA?</span></div><button className="auth-secondary" onClick={() => go("create")}>Create an account</button></>}
      {screen === "create" && <><div className="auth-heading"><p className="eyebrow">Start with a prototype account</p><h2>Create your account</h2><p>Set up an illustrative profile for the SENTRA workspace.</p></div><form onSubmit={submitCreate} noValidate><label className={`auth-field ${errors.name ? "has-error" : ""}`}><span>Full name</span><input value={name} onChange={(e) => {setName(e.target.value);setErrors({...errors,name:""});}} placeholder="Your full name"/>{errors.name && <small><Icon name="alert" size={12}/>{errors.name}</small>}</label><label className={`auth-field ${errors.email ? "has-error" : ""}`}><span>Work or student email</span><input type="email" value={email} onChange={(e) => {setEmail(e.target.value);setErrors({...errors,email:""});}} placeholder="name@organization.com"/>{errors.email && <small><Icon name="alert" size={12}/>{errors.email}</small>}</label><PasswordField label="Password" name="new-password" value={password} onChange={(value) => {setPassword(value);setErrors({...errors,password:""});}} error={errors.password} placeholder="Create a password"/><div className="password-requirements"><span className={password.length >= 8 ? "met" : ""}>8+ characters</span><span className={/[A-Z]/.test(password) ? "met" : ""}>Uppercase letter</span><span className={/\d/.test(password) ? "met" : ""}>Number</span></div><PasswordField label="Confirm password" name="confirm-password" value={confirmPassword} onChange={(value) => {setConfirmPassword(value);setErrors({...errors,confirm:""});}} error={errors.confirm} placeholder="Repeat your password"/><label className={`agreement ${errors.agreed ? "has-error" : ""}`}><input type="checkbox" checked={agreed} onChange={(e) => {setAgreed(e.target.checked);setErrors({...errors,agreed:""});}}/><span/>I agree to the illustrative Terms of Use and Privacy Notice.</label>{errors.agreed && <p className="agreement-error"><Icon name="alert" size={12}/>{errors.agreed}</p>}<button className="auth-submit" disabled={loading}>{loading ? <><span className="button-spinner"/>Creating account…</> : "Create Account"}</button></form><button className="auth-text-link" onClick={() => go("signin")}>Already have an account? <strong>Sign in</strong></button></>}
      {screen === "forgot" && (message === "sent" ? <AuthSuccess icon="file" title="Check your email" copy="If an account is associated with that address, reset instructions would be sent. This message does not confirm whether an account exists." action="Open reset prototype" onAction={() => go("reset")} secondary="Return to Sign In" onSecondary={() => go("signin")}/> : <><div className="auth-heading"><p className="eyebrow">Account recovery</p><h2>Forgot your password?</h2><p>Enter the email address associated with your account.</p></div><form onSubmit={submitForgot} noValidate><label className={`auth-field ${errors.email ? "has-error" : ""}`}><span>Email address</span><input type="email" value={email} onChange={(e) => {setEmail(e.target.value);setErrors({});}} placeholder="name@organization.com"/>{errors.email && <small><Icon name="alert" size={12}/>{errors.email}</small>}</label><button className="auth-submit" disabled={loading}>{loading ? <><span className="button-spinner"/>Preparing instructions…</> : "Send Reset Instructions"}</button></form><button className="auth-text-link" onClick={() => go("signin")}><span className="back-arrow"><Icon name="arrow" size={13}/></span>Back to Sign In</button></>)}
      {screen === "reset" && (message === "updated" ? <AuthSuccess icon="check" title="Password updated" copy="Your password was updated in this frontend simulation. No production credential or server record was changed." action="Return to Sign In" onAction={() => go("signin")}/> : <><div className="auth-heading"><p className="eyebrow">Reset password</p><h2>Create a new password</h2><p>Choose a password that meets all requirements below.</p></div><form onSubmit={submitReset} noValidate><PasswordField label="New password" name="new-password" value={password} onChange={(value) => {setPassword(value);setErrors({...errors,password:""});}} error={errors.password}/><div className="password-requirements"><span className={password.length >= 8 ? "met" : ""}>8+ characters</span><span className={/[A-Z]/.test(password) ? "met" : ""}>Uppercase letter</span><span className={/\d/.test(password) ? "met" : ""}>Number</span></div><PasswordField label="Confirm new password" name="confirm-password" value={confirmPassword} onChange={(value) => {setConfirmPassword(value);setErrors({...errors,confirm:""});}} error={errors.confirm}/><button className="auth-submit" disabled={loading}>{loading ? <><span className="button-spinner"/>Updating password…</> : "Update Password"}</button></form><button className="auth-text-link" onClick={() => go("signin")}>Cancel and return to Sign In</button></>)}
      {screen === "confirm" && <AuthSuccess icon="file" title="Check your inbox" copy="A confirmation link would be sent to your email address. Open it to complete account setup. No email is sent in this frontend prototype." action={message === "resent" ? "Confirmation resent" : "Resend confirmation"} onAction={() => setMessage("resent")} secondary="Return to Sign In" onSecondary={() => go("signin")}/>} 
      <p className="auth-prototype"><Icon name="alert" size={12}/>Authentication is simulated. SENTRA does not store these passwords or send emails.</p>
    </section></main>
  </div>;
}

function AuthSuccess({ icon, title, copy, action, onAction, secondary, onSecondary }: { icon: string; title: string; copy: string; action: string; onAction: () => void; secondary?: string; onSecondary?: () => void }) {
  return <div className="auth-success"><span><Icon name={icon} size={24}/></span><p className="eyebrow">Request complete</p><h2>{title}</h2><p>{copy}</p><button className="auth-submit" onClick={onAction}>{action}</button>{secondary && <button className="auth-text-link" onClick={onSecondary}>{secondary}</button>}</div>;
}

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [authScreen, setAuthScreen] = useState<AuthScreen>("signin");
  const [workspace, setWorkspace] = useState("Arcadian Systems");
  const [workspaces, setWorkspaces] = useState(["Arcadian Systems","Northstar Labs","Student Security Lab"]);
  const [findingsData, setFindingsData] = useState<typeof explorerFindings>(() => { try { const saved=localStorage.getItem("sentra-local-findings"); return saved ? JSON.parse(saved) : explorerFindings; } catch { return explorerFindings; } });
  const [assessmentsData, setAssessmentsData] = useState<typeof assessmentHistory>(() => { try { const saved=localStorage.getItem("sentra-local-assessments"); if (!saved) return assessmentHistory; return JSON.parse(saved).map((item: Record<string,unknown>) => ({medium:0,low:0,informational:0,source:"Legacy local record",findingIds:[],...item})); } catch { return assessmentHistory; } });
  const [selectedFinding, setSelectedFinding] = useState(findingsData[0] || explorerFindings[0]);
  const [selectedAsset, setSelectedAsset] = useState(assetInventory[0]);
  const [remediationRecords, setRemediationRecords] = useState(initialRemediationRecords);
  const [selectedRemediationId, setSelectedRemediationId] = useState<string | null>(null);
  const complete = () => { setActive("Scan Progress"); setToast(true); setTimeout(() => setToast(false), 3200); };
  useEffect(() => { localStorage.setItem("sentra-local-findings",JSON.stringify(findingsData)); },[findingsData]);
  useEffect(() => { localStorage.setItem("sentra-local-assessments",JSON.stringify(assessmentsData)); },[assessmentsData]);
  const importRecords = (imported: typeof explorerFindings, fileName: string, format: string) => {
    setFindingsData((current) => [...imported,...current]);
    const count = (severity: string) => imported.filter((item) => item.severity === severity).length;
    const targets=[...new Set(imported.map((item)=>item.asset.split(":")[0]))];
    const batchId=`IMP-${Date.now()}`;
    setAssessmentsData((current) => [{id:batchId,name:`Imported findings — ${fileName}`,target:targets.length===1?targets[0]:`${targets.length} imported assets`,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),findings:imported.length,critical:count("Critical"),high:count("High"),medium:count("Medium"),low:count("Low"),informational:count("Informational"),status:"Imported",source:`Imported ${format}`,report:false,scope:"Imported scanner findings · local prototype",findingIds:imported.map((item)=>item.id)},...current]);
  };
  if (!loggedIn) return <AuthExperience initialScreen={authScreen} signIn={() => {setLoggedIn(true);setAuthScreen("signin");setActive("Dashboard");}}/>;
  return <div className="app-shell">
    <Sidebar active={active} setActive={setActive} open={menu} close={() => setMenu(false)} workspace={workspace} workspaces={workspaces} selectWorkspace={setWorkspace} addWorkspace={(name) => {setWorkspaces([...workspaces,name]);setWorkspace(name);}} />
    {menu && <button className="scrim" onClick={() => setMenu(false)} aria-label="Close navigation" />}
    <div className="main-shell"><Header onMenu={() => setMenu(true)} active={active} navigate={setActive} workspace={workspace} logout={(screen = "signin") => {setAuthScreen(screen);setLoggedIn(false);}}/><main>{active === "Dashboard" ? <Dashboard start={() => setActive("New Assessment")} navigate={setActive} openFinding={(finding) => {setSelectedFinding(finding);setActive("Finding Details");}} openAsset={(asset) => {setSelectedAsset(asset);setActive("Asset Details");}} remediationRecords={remediationRecords} openRemediation={(findingId) => {setSelectedRemediationId(findingId);setActive("Remediation");}}/> : active === "Asset Inventory" ? <AssetInventoryPage openAsset={(asset) => {setSelectedAsset(asset);setActive("Asset Details");}}/> : active === "Asset Details" ? <AssetDetailsPage asset={selectedAsset} back={() => setActive("Asset Inventory")} openFinding={(finding) => {setSelectedFinding(finding);setActive("Finding Details");}}/> : active === "Remediation" ? <RemediationPage records={remediationRecords} initialFindingId={selectedRemediationId} updateRecord={(updated) => setRemediationRecords(remediationRecords.map((record) => record.findingId === updated.findingId ? updated : record))}/> : active === "New Assessment" ? <NewAssessment cancel={() => setActive("Assessments")} complete={complete}/> : active === "Scan Progress" ? <ScanProgress navigate={setActive}/> : active === "Findings" ? <FindingsExplorer findingsData={findingsData} remediationRecords={remediationRecords} startImport={() => setActive("Import Findings")} openFinding={(finding) => { setSelectedFinding(finding); setActive("Finding Details"); }}/> : active === "Finding Details" ? <FindingDetails finding={selectedFinding} back={() => setActive("Findings")}/> : active === "History & Comparison" ? <HistoryComparison assessments={assessmentsData} findingsData={findingsData} navigate={setActive}/> : active === "Reports" ? <ReportsPage/> : active === "Import Findings" ? <ImportFindings existingFindings={findingsData} importRecords={importRecords} viewFindings={() => setActive("Findings")}/> : active === "Settings" || active === "Workspace Settings" ? <SettingsPage key={active} workspace={workspace}/> : <GenericPage name={active} start={() => setActive("New Assessment")} />}</main></div>
    {toast && <div className="toast"><span><Icon name="check" size={15}/></span><div><strong>Progress prototype opened</strong><small>No real scan has been started.</small></div><button onClick={() => setToast(false)}><Icon name="close" size={15}/></button></div>}
  </div>;
}
