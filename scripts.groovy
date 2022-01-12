def cloneRepo() {
  echo "========Cloning Github Repo========"
  sh ("if [ -d \"${GITHUB_REPO}\" ]; then rm -Rf ${GITHUB_REPO}; fi")
  git branch: 'master',
      credentialsId: 'github-password',
      url: "https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git"
}

return this