```javascript
// import * as React from "react";
import { DocsPage } from "@/components/docs/docs-page";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

const toc = [
  { id: "google", text: "Google", level: 2 },
  { id: "github", text: "GitHub", level: 2  },
  { id: "linkedin", text: "LinkedIn", level: 2 },
];

export default function ProvidersPage() {
  return (
    <DocsPage
      pathname="/docs/providers"
      title="Providers"
      description="Setup steps and code examples for every built-in OAuth provider: Google, GitHub, and LinkedIn."
      toc={toc}
    >
      <h2 id="google">Google</h2>
      <ol className="ml-5 list-decimal space-y-2 text-[15px] text-foreground/90">
        <li>
          Open the{" "}
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noreferrer"
          >
            Google Cloud Console
          </a>{" "}
          and create an OAuth 2.0 Client ID (Web application).
        </li>
        <li>
          Add{" "}
          <code>http://localhost:8000/api/auth/google/callback</code> as an
          authorized redirect URI for local development.
        </li>
        <li>
          Copy the <strong>Client ID</strong> and <strong>Client Secret</strong>{" "}
          into your <code>.env</code> as <code>GOOGLE_CLIENT_ID</code> and{" "}
          <code>GOOGLE_CLIENT_SECRET</code>.
        </li>
      </ol>
      <CodeBlock
        filename="routes/auth.js"
        language="js"
        code={`import { GoogleLogin, GoogleCallback } from "@kartikgangil/watchman_js";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackUrl = "http://localhost:8000/api/auth/google/callback";

// Initiate login — redirect user to Google
app.get("/google", (req, res) => {
  const uri = GoogleLogin(clientId, callbackUrl);
  return res.redirect(uri);
});

// Handle callback — exchange code for user data
app.get("/api/auth/google/callback", async (req, res) => {
  const data = await GoogleCallback(
    req.query.code,
    clientId,
    clientSecret,
    callbackUrl
  );
  return res.json(data);
});`}
      />

      <h2 id="github">GitHub</h2>
      <ol className="ml-5 list-decimal space-y-2 text-[15px] text-foreground/90">
        <li>
          Go to GitHub Settings → Developer settings → OAuth Apps and click{" "}
          <strong>New OAuth App</strong>.
        </li>
        <li>
          Set the <strong>Authorization callback URL</strong> to{" "}
          <code>http://localhost:8000/api/auth/github/callback</code>.
        </li>
        <li>
          Copy the <strong>Client ID</strong> and generate a{" "}
          <strong>Client Secret</strong>, then set them as{" "}
          <code>GITHUB_CLIENT_ID</code> and <code>GITHUB_CLIENT_SECRET</code>.
        </li>
      </ol>
      <CodeBlock
        filename="routes/auth.js"
        language="js"
        code={`import { GithubLogin, GithubCallback } from "@kartikgangil/watchman_js";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackUrl = "http://localhost:8000/api/auth/github/callback";

// Initiate login — redirect user to GitHub
app.get("/github", async (req, res) => {
  const uri = await GithubLogin(callbackUrl, clientId);
  return res.redirect(uri);
});

// Handle callback — exchange code for user data
app.get("/api/auth/github/callback", async (req, res) => {
  const data = await GithubCallback(
    req.query.code,
    clientId,
    clientSecret
  );
  return res.json(data);
});`}
      />

      <Callout type="note">
        Note the argument order for <code>GithubLogin</code>:{" "}
        <strong>callbackUrl first, then clientId</strong>. This differs from
        the Google provider where clientId comes first.
      </Callout>

      <h2 id="linkedin">LinkedIn</h2>
      <ol className="ml-5 list-decimal space-y-2 text-[15px] text-foreground/90">
        <li>
          Create an app on the{" "}
          <a
            href="https://developer.linkedin.com/apps"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn Developer Portal
          </a>
          .
        </li>
        <li>
          Under <strong>Auth</strong>, add{" "}
          <code>http://localhost:8000/api/auth/linkedin/callback</code> as an
          authorized redirect URL.
        </li>
        <li>
          Set <code>LINKEDIN_CLIENT_ID</code> and{" "}
          <code>LINKEDIN_CLIENT_SECRET</code> in your <code>.env</code>.
        </li>
      </ol>
      <CodeBlock
        filename="routes/auth.js"
        language="js"
        code={`import { LinkedInLogin, LinkedInCallback } from "@kartikgangil/watchman_js";

const clientId = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const callbackUrl = "http://localhost:8000/api/auth/linkedin/callback";

// Initiate login — redirect user to LinkedIn
app.get("/linkedin", (req, res) => {
  const uri = LinkedInLogin(clientId, callbackUrl);
  return res.redirect(uri);
});

// Handle callback — exchange code for user data
app.get("/api/auth/linkedin/callback", async (req, res) => {
  const data = await LinkedInCallback(
    req.query.code,
    clientId,
    clientSecret,
    callbackUrl
  );
  return res.json(data);
});`}
      />
    </DocsPage>
  );
}
```