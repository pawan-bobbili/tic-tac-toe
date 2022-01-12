def cloneRepo() {
  echo "========Cloning Github Repo========"
  sh ("if [ -d \"${GITHUB_REPO}\" ]; then rm -Rf ${GITHUB_REPO}; fi")
  git branch: 'master',
      credentialsId: 'github-password',
      url: "https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git"
}

def buildFrontend() {
  sh("docker build -t pawan7/tic-tac-toe:frontend-1.0 ${WORKSPACE}/frontend")
}

def buildBackend() {
  sh("docker build -t pawan7/tic-tac-toe:backend-1.0 ${WORKSPACE}/backend")
}

def publishImages() {
  withCredentials([usernamePassword(credentialsId: 'pawan-docker', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
    sh("echo ${DOCKER_PASSWORD} | docker login --username ${DOCKER_USERNAME} --password-stdin")
    sh("docker push pawan7/tic-tac-toe:backend-1.0")
    sh("docker push pawan7/tic-tac-toe:frontend-1.0")
  }
}

def deployApp() {
  echo "========= Deploying Application ============="
}

return this