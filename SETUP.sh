#!/bin/bash
# =============================================
# Script de push GitHub — À exécuter 1 seule fois
# =============================================
# 1. Remplace TON_USERNAME par ton pseudo GitHub
# 2. Remplace TON_TOKEN par ton token GitHub (Settings > Developer > Personal Access Tokens)
# 3. Lance ce script : bash SETUP.sh

GITHUB_USERNAME="TON_USERNAME"
REPO_NAME="visa-checklist-besancon"

git init
git add .
git commit -m "🎓 Initial commit — Checklist visa étudiant Besançon M2"
git branch -M main
git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git
git push -u origin main

echo ""
echo "✅ Pushed! Repo disponible sur : https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
echo "Pour activer GitHub Pages :"
echo "  → Settings > Pages > Source: Deploy from branch > main > / (root) > Save"
echo "  → URL: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}"
