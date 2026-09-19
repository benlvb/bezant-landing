#!/bin/sh
# Vercel "Ignored Build Step" (vercel.json -> ignoreCommand).
# Exit 0 = skip this deployment, exit 1 = build it.
#
# Compares the commit being deployed with the last commit this branch
# deployed successfully (VERCEL_GIT_PREVIOUS_SHA), not with HEAD^: a push
# that ends in a README-only commit must still ship the site commits before
# it. Skips only when git positively reports that nothing outside README.md,
# .github/ and scripts/ changed since then. Anything it cannot establish
# (first deploy of a branch, a redeploy of the same commit, a previous commit
# outside Vercel's depth-10 clone, any git error) builds.

base="${VERCEL_GIT_PREVIOUS_SHA:-}"
head=$(git rev-parse HEAD 2>/dev/null) || { echo "vercel-ignore: cannot read HEAD, building"; exit 1; }

if [ -z "$base" ]; then
  echo "vercel-ignore: no previous deployment on this branch, building"
  exit 1
fi
prev=$(git rev-parse --verify --quiet "$base^{commit}") || {
  echo "vercel-ignore: previous deployment $base is not in the clone, building"
  exit 1
}
if [ "$prev" = "$head" ]; then
  echo "vercel-ignore: $head is already the last deployment (a redeploy or deploy hook), building"
  exit 1
fi

git diff --quiet "$prev" HEAD -- . ':(exclude)README.md' ':(exclude).github' ':(exclude)scripts'
rc=$?
if [ "$rc" -eq 0 ]; then
  echo "vercel-ignore: only README.md, .github/ or scripts/ changed since $prev, skipping"
  exit 0
fi
if [ "$rc" -eq 1 ]; then
  echo "vercel-ignore: the site changed since $prev, building"
else
  echo "vercel-ignore: git diff failed (exit $rc), building"
fi
exit 1
