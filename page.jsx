import * as React from "react";
import { DocsPage } from "@/components/docs/docs-page";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

const toc = [
  { id: "watchman", text: "WATCHMAN JS", level: 2 },
  { id: "supported", text: "Supported Platforms", level: 2 },
  { id: "why-use", text: "Why Use WATCHMAN JS?", level: 2 },
  { id: "installation", text: "Installation", level: 2 },
  { id: "usage-guide", text: "Usage Guide", level: 2 },
  { id: "manual-auth", text: "Manual Authentication", level: 3 },
  { id: "verify-token", text: "Verify Token", level: 3 },
  { id: "google-auth", text: "Google Authentication", level: 3 },
  { id: "github-auth", text: "GitHub Authentication", level: 3 },
  { id: "linkedin-auth", text: "LinkedIn Authentication", level: 3 },
  { id: "how-it-works", text: "How It Works", level: 2 },
  { id: "use-cases", text: "Use Cases", level: 2 },
  { id: "contributing", text: "Contributing", level: 2 },
  { id: "support", text: "Support", level: 2 },
  { id: "google", text: "Google", level: 2 },
  { id: "github", text: "GitHub", level: 2 },
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
      <h2 id="watchman">🚀 WATCHMAN JS</h2>
      <p>
        <strong>One place to handle OAuth for all platforms.</strong>
      </p>
      <p>
        WATCHMAN JS is a lightweight authentication library that simplifies OAuth
        integration across multiple platforms. Instead of handling different OAuth
        flows separately, you get a unified and easy‑to‑use interface.
      </p>

      <h2 id="supported">🌐 Supported Platforms</h2>
      <ul className="list-disc ml-5">
        <li>Google</li>
        <li>LinkedIn</li>
        <li>GitHub</li>
      </ul>

      <h2 id="why-use">✨ Why Use WATCHMAN JS?</h2>
      <ul className="list-disc ml-5">
        <li>⚡ Simple plug‑and‑play setup</li>
        <li>🧩 Clean and minimal API</li>
        <li>📦 One‑command installation</li>
        <li>👶 Beginner‑friendly</li>
        <li>🔄 Unified OAuth handling across platforms</li>
      </ul>

      <h2 id="installation">📦 Installation</h2>
      <CodeBlock
        filename="npm"
        language="bash"
        code={`npm install @kartikgangil/watchman_js`}
      />

      <h2 id="usage-guide">⚙️ Usage Guide</h2>

      <h3 id="manual-auth">Manual Authentication</h3>
      <CodeBlock
        filename="controllers/auth.controller.js"
        language="js"
        code={`// controllers/auth.controller.js

const {
  hashPassword,
  comparePassword,
} = require('@kartikgangil/watchman_js');

const { GenToken } = require('@kartikgangil/watchman_js');

// Dummy database
const users = [];

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const userExists = users.find(
      (user) => user.email === email
    );

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // create user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    // generate token
    const token = await GenToken(
      {
        id: newUser.id,
        email: newUser.email,
      },
      {
        expiresIn: '7d',
      }
        "secret"
    );

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Signup failed',
      error: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = users.find(
      (user) => user.email === email
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // compare password
    const isMatch = await comparePassword(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // generate token
    const token = await GenToken(
      {
        id: user.id,
        email: user.email,
      },
      {
        expiresIn: '7d',
      }
        "secret"
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    return