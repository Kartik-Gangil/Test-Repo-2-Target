# 🚀 WATCHMAN JS

**One place to handle OAuth for all platforms.**

WATCHMAN JS is a lightweight authentication library that simplifies OAuth integration across multiple platforms. Instead of handling different OAuth flows separately, you get a unified and easy-to-use interface.

---
<!-- ad space -->
<!-- ad space -->

## 🌐 Supported Platforms

- Google  
- LinkedIn  
- GitHub  

---

## ✨ Why Use WATCHMAN JS?

- ⚡ Simple plug-and-play setup  
- 🧩 Clean and minimal API  
- 📦 One-command installation  
- 👶 Beginner-friendly  
- 🔄 Unified OAuth handling across platforms  

---

## 📦 Installation

```bash
npm install @kartikgangil/watchman_js
```

## ⚙️ Usage Guide

### Manual Authentication

``` javascript
// controllers/auth.controller.js

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

    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });

  }
};

module.exports = {
  signup,
  login,
};
```

#### Verify Token

``` javascript
const { VerifyToken } = require('@kartikgangil/watchman_js');

// Middleware using VerifyToken
const authMiddleware = async (req, res, next) => {
  try {

    // Get token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token not provided',
      });
    }

    // Extract token from:
    // Bearer TOKEN
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    // Verify token
    const decoded = await VerifyToken(token , secret);

    // Save decoded user data in request
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: error.message,
    });

  }
};
```

### 🔐 GitHub Authentication

#### Import Package
##### CommonJS
``` javascript
const { GithubLogin, GithubCallback } = require("@kartikgangil/watchman_js");
```
##### ES Modules
``` javascript
import { GithubLogin, GithubCallback } from "@kartikgangil/watchman_js";
```
##### Initiate Login
``` javascript
app.get("/github", async (req, res) => {
  const uri = await GithubLogin(
    "http://localhost:8000/api/auth/github/callback",
    clientId
  );

  return res.redirect(uri);
});
```
#### Handle Callback
``` javascript
app.get("/api/auth/github/callback", async (req, res) => {
  const data = await GithubCallback(
    req.query.code,
    clientId,
    clientSecret
  );

  console.log(data);
  return res.json(data);
});
```
### 🔐 Google Authentication
``` javascript
// import package
const { GoogleLogin, GoogleCallback } = require("@kartikgangil/watchman_js");

// initate login uisng google O'auth
app.get("/google", (req, res) => {
  const uri = GoogleLogin(
    googleClientId,
    "http://localhost:8000/api/auth/google/callback"
  );

  return res.redirect(uri);
});

// handle Callback
app.get("/api/auth/google/callback", async (req, res) => {
  const data = await GoogleCallback(
    req.query.code,
    googleClientId,
    googleClientSecret,
    "http://localhost:8000/api/auth/google/callback"
  );

  console.log(data);
  return res.json(data);
});
```
### 🔐 LinkedIn Authentication
``` javascript
// import package
const { LinkedInLogin, LinkedInCallback } = require("@kartikgangil/watchman_js");

// initate login with Linked In 
app.get("/linkedin", (req, res) => {
  const uri = LinkedInLogin(
    linkedinClientId,
    "http://localhost:8000/api/auth/linkedin/callback"
  );

  return res.redirect(uri);
});

// handle callback
app.get("/api/auth/linkedin/callback", async (req, res) => {
  const data = await LinkedInCallback(
    req.query.code,
    linkedinClientId,
    linkedinClientSecret,
    "http://localhost:8000/api/auth/linkedin/callback"
  );

  console.log(data);
  return res.json(data);
});
```

### 🧠 How It Works
1. User hits your login route
2. WATCHMAN JS generates the OAuth URL
3. User is redirected to the provider (Google, GitHub, LinkedIn)
4. Provider redirects back with a code
5. You exchange the code using the callback function
6. Get user data instantly

### 🛠️ Use Cases
- SaaS applications with multiple login options
- Developer tools & dashboards
- Rapid MVP development
- Projects needing quick authentication setup
### 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request
### ⭐ Support

If this project helps you:

- Star ⭐ the repo
- Share it with others
- Report issues or suggest features