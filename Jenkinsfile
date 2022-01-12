def gv
pipeline{
    agent any
    parameters {
      booleanParam(name: 'BUILD_BACKEND', defaultValue: true, description: 'Building Backend')
      booleanParam(name: 'BUILD_FRONTEND', defaultValue: true, description: 'Building Frontend')
      booleanParam(name: 'DEPLOY', defaultValue: true, description: 'Deploy Application')
    }
    environment {
        GITHUB_CREDS = 'pawan-github'
        GITHUB_REPO = "Tic-Tac-Toe__NodeJs-ReactJs-Socket.io-"
    }
    stages{
        stage("Loading Script"){
          steps{
            script {
              gv = load 'scripts.groovy'
            }
          }
        }
        stage("Cloning Repo"){
            steps{
                script{
                  gv.cloneRepo()
                }
            }
            post{
                success{
                    echo "======== Cloned Repoed successfully ========"
                }
                failure{
                    echo "======== Cloning Repos failed ========"
                }
            }
        }
        stage("Dockerzing & Publishing Frontend"){
          steps {
            script {
              if (params.BUILD_FRONTEND) {
                gv.buildFrontend()
              }
            }
          }
          post{
            success{
                echo "======== Dockerized & Published Frontend successfully ========"
            }
            failure{
                echo "======== Dockerzing & Publishing Frontend failed ========"
            }
          }
        }
        stage("Dockerizing & Publishing Backend"){
          steps {
            script {
              if (params.BUILD_BACKEND) { 
                gv.buildBackend()
              }
            }
          }
          post{
            success{
                echo "======== Dockerized & Published Backend successfully ========"
            }
            failure{
                echo "======== Dockerzing & Publishing Backend failed ========"
            }
          }
        }
        stage("Deploying Apllication"){
          steps {
            script {
              if (params.DEPLOY) {
                gv.deployApp()
              }
            }
          }
          post{
            success{
                echo "======== Deployed Application successfully ========"
            }
            failure{
                echo "======== Deploying Application failed ========"
            }
          }
        }
    }
    post{
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}