# Deployment Guide: Diffusion from Scratch

This guide covers how to integrate JupyterLite for interactive Python execution and deploy the site to Vercel.

---

## Part 1: JupyterLite Integration

JupyterLite enables running Jupyter notebooks directly in the browser using WebAssembly (Pyodide kernel).

### Prerequisites

```bash
# Install additional dependencies
npm install jupyterlite-core jupyterlite-pyodide-kernel
```

### Step 1: Create JupyterLite Configuration

Create `jupyter_lite_config.py` in the project root:

```python
# jupyter_lite_config.py
import shutil
from pathlib import Path
from jupyterlite_core.app import JupyterLite

# Core settings
JupyterLite.disable_addin_check = True

# Output directory (Next.js public folder)
lite_output = Path(__file__).parent / "public" / "lite"

# Remove old build
if lite_output.exists():
    shutil.rmtree(lite_output)

# Kernel configuration
KERNEL_SETTINGS = [
    {
        "name": "python3",
        "kernel_pyodide_url": "https://pyscript.net/releases/2024.1.1/core/python-3.11.armv7l-cpu-emscripten-wasm32.wasm",
        "kernel_service_url": "https://pyscript.net/releases/2024.1.1/core/",
    }
]

# App configuration
APP_SETTINGS = {
    "lite_dir": Path(__file__).parent,
    "lite_output_dir": lite_output,
    "no_cache": True,
}
```

### Step 2: Create JupyterLite Contents

Create the following structure in your project:

```
diffusion-from-scratch/
├── public/
│   └── lite/
│       └── content/
│           └── playground.ipynb
├── lite/
│   └── config.json
└── jupyter_lite_config.py
```

### Step 3: Create the Notebook Template

Create `lite/content/playground.ipynb`:

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Code Playground\n",
    "Run PyTorch code directly in your browser!"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": ["import torch\n", "print(f'PyTorch: {torch.__version__}')"]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "name": "python",
   "version": "3.11.0"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
```

### Step 4: Create Lite Configuration

Create `lite/config.json`:

```json
{
  "jupyter.lite.configure.rpms": 0,
  "jupyter.lite.config.outputwidgets": true,
  "jupyter.lite.config.serviceworkers": false
}
```

### Step 5: Build JupyterLite

```bash
# Build JupyterLite
jupyter lite build --output-dir public/lite

# This will create:
# public/lite/
#   ├── build_info.json
#   ├── retro/
#   │   └── notebooks/
#   ├── lab/
#   ├── serviceworker.js
#   └── ...
```

### Step 6: Link Code to JupyterLite

Update the `JupyterLiteRunner` component to pass code to notebooks:

```typescript
// src/components/JupyterLiteRunner.tsx
const openInJupyterLite = () => {
  const notebook = {
    cells: [{
      cell_type: 'code',
      source: code,
      outputs: [],
      execution_count: null
    }],
    metadata: {
      kernelspec: {
        name: 'python3',
        display_name: 'Python 3'
      }
    },
    nbformat: 4,
    nbformat_minor: 5
  };

  const blob = new Blob([JSON.stringify(notebook)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Open JupyterLite with the notebook
  window.open(`/lite/retro/notebooks/?path=code.ipynb`, '_blank');
  
  // For direct loading, use URL parameter:
  // window.open(`/lite/lab?path=code.ipynb`, '_blank');
};
```

### Step 7: Run Development

```bash
# Start Next.js
npm run dev

# JupyterLite files are served from public/lite/
# Access at http://localhost:3000/lite/
```

---

## Part 2: Deploy to Vercel

### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_REPO)

### Option B: CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project directory)
vercel

# For production deployment:
vercel --prod
```

### Option C: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Next.js

### Vercel Configuration

Create `vercel.json` for custom settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/lite/:path*",
      "destination": "/lite/:path*"
    }
  ],
  "headers": [
    {
      "source": "/lite/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Embedder-Policy", 
          "value": "require-corp"
        }
      ]
    }
  ]
}
```

### Important: JupyterLite on Vercel

**Limitations:**
- Vercel serverless functions have execution time limits
- Large static files (like Pyodide WASM) may exceed limits
- Cold starts can be slow

**Solutions:**

1. **Use a Separate JupyterLite Host** (Recommended)

Host JupyterLite on a separate service:
- **Cloudflare Pages** (free, better for static)
- **Netlify** (free tier available)
- **GitHub Pages** (for small files)

2. **Optimize JupyterLite Build**

```bash
# Only include necessary packages
jupyter lite build \
  --lite-dir ./lite \
  --output-dir ./public/lite \
  --ignore-pattern "*.ipynb_checkpoints" \
  --ignore-pattern "**/node_modules" \
  --app jupyterlab
```

3. **Use Pyodide CDN** (No Build Required)

Instead of bundling Pyodide, use CDN:

```typescript
// Load Pyodide dynamically
async function loadPyodideKernel() {
  const pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
  });
  
  // Load PyTorch
  await pyodide.loadPackage(['numpy', 'torch']);
  
  return pyodide;
}
```

### Alternative: Pyodide-Only Setup

For a lighter-weight solution without full JupyterLite:

```typescript
// src/components/PyodideRunner.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export default function PyodideRunner({ code }: { code: string }) {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Pyodide script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    script.onload = async () => {
      const py = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
      });
      setPyodide(py);
    };
    document.head.appendChild(script);
  }, []);

  const runCode = async () => {
    if (!pyodide) return;
    
    setLoading(true);
    setOutput([]);
    setError(null);

    try {
      // Capture stdout
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);
      
      await pyodide.runPythonAsync(code);
      
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      setOutput(stdout.split('\n').filter(Boolean));
    } catch (e: any) {
      setError(e.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="border rounded-lg p-4 my-4">
      <button onClick={runCode} disabled={!pyodide || loading}>
        <Play className="w-4 h-4 mr-2" />
        {loading ? 'Loading...' : 'Run with Pyodide'}
      </button>
      
      {output.map((line, i) => (
        <pre key={i} className="text-green-400">{line}</pre>
      ))}
      
      {error && (
        <pre className="text-red-400">{error}</pre>
      )}
    </div>
  );
}
```

---

## Part 3: Security Considerations

### Next.js Security

1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Environment Variables**
   ```bash
   # Never commit .env files
   # Use Vercel dashboard for env vars
   
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```

3. **CSP Headers** (add to `next.config.js`)
   ```javascript
   const securityHeaders = [
     {
       key: 'Content-Security-Policy',
       value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://cdn.jsdelivr.net https://*.pyodide.org; worker-src 'self' blob:;"
     },
     {
       key: 'X-Frame-Options',
       value: 'DENY'
     },
     {
       key: 'X-Content-Type-Options',
       value: 'nosniff'
     },
     {
       key: 'Referrer-Policy',
       value: 'origin-when-cross-origin'
     }
   ];
   ```

### JupyterLite Security

1. **Isolate Execution**
   - Pyodide runs in browser sandbox
   - No server-side code execution
   - Users can only run provided code

2. **Content Security**
   - Code is executed client-side
   - No data sent to servers
   - Safe for public deployment

3. **External Resources**
   - Validate CDN URLs
   - Use HTTPS only
   - Pin specific versions

---

## Part 4: Troubleshooting

### Common Issues

**1. JupyterLite 404 on Vercel**
```bash
# Ensure files are in public folder
ls public/lite/

# Check vercel.json rewrites
```

**2. Pyodide Loading Slow**
```typescript
// Add loading indicator
useEffect(() => {
  setLoading(true);
  // Load script...
  setLoading(false);
}, []);
```

**3. Next.js Build Fails**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**4. Vercel Build Errors**
```bash
# Check Node version in package.json
"engines": {
  "node": ">=18.0.0"
}

# Add to vercel.json
{
  "installCommand": "npm install"
}
```

---

## Resources

- [JupyterLite Documentation](https://jupyterlite.readthedocs.io/)
- [Pyodide Documentation](https://pyodide.org/)
- [Vercel Deployment](https://vercel.com/docs)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
