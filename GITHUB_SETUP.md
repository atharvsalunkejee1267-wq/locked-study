# GitHub Publishing & Hosting Guide

Your project is now ready to publish! Follow these steps to push to GitHub and enable hosting.

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Enter repository name: `locked-study` (or any name you prefer)
3. Description: "An interactive browser-based escape room puzzle game"
4. Choose **Public** (required for GitHub Pages to work)
5. Do NOT initialize with README (we already have one)
6. Click **Create repository**

## Step 2: Push Your Code to GitHub

Copy and paste these commands in your terminal (in the project directory):

```bash
cd "d:\dti project\files (1)"
git remote add origin https://github.com/YOUR_USERNAME/locked-study.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Scroll down to **Pages** section in the left sidebar
4. Under "Build and deployment":
   - Source: Select **Deploy from a branch**
   - Branch: Select **main** and **/(root)**
5. Click **Save**

Wait 1-2 minutes for the site to build and deploy.

## Step 4: Access Your Game

Your game will be hosted at:
```
https://YOUR_USERNAME.github.io/locked-study/
```

## Making Updates

After making changes locally:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically rebuild within 1-2 minutes.

## Troubleshooting

**If GitHub Pages doesn't work:**
- Make sure the repository is **Public**
- Check that `index.html` is in the root directory
- Wait a few minutes for the build to complete
- Check the **Actions** tab on GitHub for build logs

**If images don't load:**
- They should load automatically from the repository
- If not, check that all image files are committed: `git add -A && git commit -m "Add images"`
