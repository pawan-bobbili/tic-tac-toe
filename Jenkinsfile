def gv
pipeline{
    agent any
    environment {
        GITHUB_USERNAME = "pawan-bobbili"
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
                always{
                    echo "========always========"
                }
                success{
                    echo "========A executed successfully========"
                }
                failure{
                    echo "========A execution failed========"
                }
            }
        }
    }
    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}