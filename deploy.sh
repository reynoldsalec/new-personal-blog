#!/usr/bin/env sh

# abort on errors
set -e

# Install dependencies
npm install

# build
npm run build

# navigate into the build output directory
cd src/.vuepress/dist

# if you are deploying to a custom domain
echo 'www.alecreynolds.com' > CNAME

git init
git checkout -b main
git config --global user.email "1153738+reynoldsalec@users.noreply.github.com"
git config --global user.name "Alec Reynolds"
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
git push -f git@github.com:reynoldsalec/reynoldsalec.github.io.git main

cd -
