
pipeline {
  agent any
  options {
      // This is required if you want to clean before build
      skipDefaultCheckout(true)
  }

  stages {
    stage('PreCheckout') {
      steps {
        // Clean before build
        cleanWs()
        // We need to explicitly checkout from SCM here
        //checkout scm
        echo "Building ${env.JOB_NAME}..."
      }
    }

    stage('Checkout') {
      steps {
        script {
           // The below will clone your repo and will be checked out to master branch by default.
           // git credentialsId: 'furyanaor', url: 'https://github.com/furyanaor/Dev8200-StartProj.git'
           sh "git clone https://github.com/furyanaor/Dev8200-StartProj.git"

           // Do a ls -lart to view all the files are cloned. It will be clonned. This is just for you to be sure about it.
           sh "ls -lart ./*"
           // List all branches in your repo. 
           // sh "git branch -a"
           // Checkout to a specific branch in your repo.
           // sh "git checkout main"
        }
      }
    }
  
    stage('TestingCode') {
      steps {
        echo "Testing the application code"

        //sh 'python3 Dev8200-StartProj/test_app.py'
        //input(id: "Deploy Gate", message: "Deploy ${params.project_name}?", ok: 'Deploy')
      }
    }

    stage('Build') {
      parallel {
        stage('Build') {
          steps {
            sh 'echo "building the repo"'

            sh 'docker-compose -f /var/lib/jenkins/workspace/Dev8200-StarterProj-Pip/Dev8200-StartProj/docker-compose.yml down'
            sh 'docker-compose -f /var/lib/jenkins/workspace/Dev8200-StarterProj-Pip/Dev8200-StartProj/docker-compose.yml up --build -d'
            sh 'docker tag dev8200-startproj_web furyanaor/dev8200-startproj_web'
            sh 'docker push furyanaor/dev8200-startproj_web'
          }
        }
      }
    }

    stage('DeployAppOnTesting') {
      steps {
        echo "deploying the application on Testing Virtual-Server"

        sh "sudo nohup python3 app.py > log.txt 2>&1 &"

        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'ls -la /home'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'if sudo docker ps | grep dev8200-startproj_web.name.latest; then sudo docker stop dev8200-startproj_web.name.latest; fi'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'sudo docker image rm -f furyanaor/dev8200-startproj_web:latest'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'sudo docker run --rm -d -p 7007:80 --name dev8200-startproj_web.name.latest furyanaor/dev8200-startproj_web:latest'"
      }
    }
  
    stage('TestingWeb') {
      steps {  
        echo "Testing the webserver"

        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'sudo git clone https://github.com/furyanaor/Dev8200-StartProj/blob/9193473dd2e4a7333524257a5aea26d7296774f7/testmydocker.sh ~/'"
        //sh 'python3 Dev8200-StartProj/test_app.py'
        //input(id: "Deploy Gate", message: "Deploy ${params.project_name}?", ok: 'Deploy')
      }
    }

    post {
      // Clean after build
        always {

          cleanWs(cleanWhenNotBuilt: false,
            deleteDirs: true,
            disableDeferredWipeout: true,
            notFailBuild: true,
            
            patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
            [pattern: '.propsfile', type: 'EXCLUDE']])
            
            echo 'The pipeline completed'
            junit allowEmptyResults: true, testResults:'**/test_reports/*.xml'
        }

        success {                   
            echo "Flask Application Up and running!!"
        }

        failure {
            echo 'Build stage failed'
            error('Stopping early…')
        }
    }
  }
}
