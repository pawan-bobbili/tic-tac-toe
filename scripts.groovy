def cloneRepo() {
  echo "========Checking Out Github Repo========"
  sh ("if [ -d \"${GITHUB_REPO}\" ]; then rm -Rf ${GITHUB_REPO}; fi")
  withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDS}", usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_PASSWORD')]) {
    sh("echo \"${GITHUB_PASSWORD}\" | git clone -b ${BRANCH.substring(7)} --single-branch  https://${GITHUB_USERNAME}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git")
  }
  // git branch: "${BRANCH}",
  //     credentialsId: 'pawan-github',
  //     url: "https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git"
}

def buildFrontend() {
  sh("docker build -t pawan7/tic-tac-toe:frontend-1.0 ${WORKSPACE}/${GITHUB_REPO}/frontend")
}

def buildBackend() {
  sh("docker build -t pawan7/tic-tac-toe:backend-1.0 ${WORKSPACE}/${GITHUB_REPO}/backend")
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