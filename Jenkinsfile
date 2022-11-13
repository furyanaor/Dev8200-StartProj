
pipeline {
  agent any
  // options {
  //     // This is required if you want to clean before build
  //     ////skipDefaultCheckout(true)
  // }

  stages {
    // stage('PreCheckout') {
    //   steps {
    //     echo "Welcome ${env.JOB_NAME}... Cleaning Jenkins WorkSpace before build"
    //     // Clean before build
    //     cleanWs()
    //     // We need to explicitly checkout from SCM here
    //     //checkout scm
    //   }
    // }

    stage('Checkout') {
      steps {
        script {
          echo "git clone to Jenkins Virtual-Server"
           // The below will clone your repo and will be checked out to master branch by default.
           // git credentialsId: 'furyanaor', url: 'https://github.com/furyanaor/Dev8200-StartProj.git'
           sh "if sudo docker images | grep dev8200; then sudo docker image rm -f furyanaor/dev8200-startproj_web:latest; fi"
           ////sh "git clone https://github.com/furyanaor/Dev8200-StartProj.git"
           // Do a ls -lart to view all the files are cloned. It will be clonned. This is just for you to be sure about it.
           ////sh "ls -lart ./*"
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
        //echo 'Building Graphana monitor'
        stage('Build') {
          steps {
            echo 'Building repo on Jenkins Virtual-Server, tag & push to DockerHub'

            //login Jenkins user to docker hub for the first time:
            //sh 'docker login -u "username" -p "passworld" docker.io'
            
            sh 'mkdir -p ~/prometheus-grafana/{grafana,prometheus}'
            sh 'echo ls ~/prometheus-grafana/'

            sh 'if sudo docker ps | grep dev8200; then docker-compose -f /var/lib/jenkins/workspace/Dev8200-StarterProj-Pip/docker-compose.yml down; fi'
            sh 'docker-compose -f /var/lib/jenkins/workspace/Dev8200-StarterProj-Pip/docker-compose.yml up --build -d'
            sh 'docker tag dev8200-startproj_web furyanaor/dev8200-startproj_web'
            sh 'docker push furyanaor/dev8200-startproj_web'
          }
        }
      }
    }

    stage('DeployAppOnTesting') {
      steps {
        echo "Deploying the application on Testing Virtual-Server"

        // what the hell is the next line?!
        sh "sudo nohup python3 app.py > log.txt 2>&1 &"

        // docker-compuse down on Testion Virtual-Server
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml down'"
        
        // clon docker-compose&testing file from github (its just clone all the repo)
        //sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'if sudo ls -lart ~/testingfile; then sudo ls -lart ~/testingfile; fi'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'sudo rm -rf ~/testingfile'"
        //sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'sudo ls -lart ~/'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'sudo git clone https://github.com/furyanaor/Dev8200-StartProj.git ~/testingfile'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'sudo ls -lart ~/testingfile'"

        // Clear old docker images
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'ls -la /home'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'if sudo docker ps | grep dev8200-startproj_web.name.latest; then sudo docker stop dev8200-startproj_web.name.latest; fi'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'if sudo docker images | grep dev8200; then sudo docker image rm -f furyanaor/dev8200-startproj_web:latest; fi'"
        // sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'sudo docker run --rm -d -p 7007:80 --name dev8200-startproj_web.name.latest furyanaor/dev8200-startproj_web:latest'"
      
        // docker-compose up on Production Virtual Server
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml up --build -d'"
      }
    }

    stage ("wait_prior_starting_smoke_testing") {
      steps {
        echo 'Waiting 4 secounds for deployment to complete prior starting smoke testing'
        sleep 4 // seconds
      }
    }
    
    stage('TestingWeb') {
      steps {  
        echo "Testing the Testing Virtual-Server"
        
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-44-204-91-41.compute-1.amazonaws.com 'sudo bash ~/testingfile/DC4Servers/testmydocker.sh'"
        //input(id: "Deploy Gate", message: "Deploy ${params.project_name}?", ok: 'Deploy')
      }
    }

    stage('DeployAppOnProduction') {
      steps {
        echo "Deploying the application on Production Virtual-Server"
        // What the hell is the next line?!
        sh "sudo nohup python3 app.py > log.txt 2>&1 &"

        // docker-compuse down on Testion Virtual-Server
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml down'"

        // clon docker-compose&testing file from github (its just clone all the repo)
        //sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'if sudo ls -lart ~/testingfile; then sudo ls -lart ~/testingfile; fi'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'sudo rm -rf ~/testingfile'"
        //sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'sudo ls -lart ~/'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'sudo git clone https://github.com/furyanaor/Dev8200-StartProj.git ~/testingfile'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'sudo ls -lart ~/testingfile'"

        // Clear old docker images
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'ls -la /home'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'if sudo docker ps | grep dev8200-startproj_web.name.latest; then sudo docker stop dev8200-startproj_web.name.latest; fi'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'if sudo docker images | grep dev8200; then sudo docker image rm -f furyanaor/dev8200-startproj_web:latest; fi'"
        //sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'sudo docker run --rm -d -p 80:80 --name dev8200-startproj_web.name.latest furyanaor/dev8200-startproj_web:latest'"

        // docker-compose up on Production Virtual Server
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml down'"
        sh "sudo ssh -i /home/ec2-user/.ssh/id_dsa ec2-user@ec2-54-234-222-213.compute-1.amazonaws.com 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml up --build -d'"
      }
    }
  }

  // post {
  //     // Clean after build
  //       always {

  //         cleanWs(cleanWhenNotBuilt: false,
  //           deleteDirs: true,
  //           disableDeferredWipeout: true,
  //           notFailBuild: true,
            
  //           patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
  //           [pattern: '.propsfile', type: 'EXCLUDE']])
            
  //           echo 'The pipeline completed'
  //           junit allowEmptyResults: true, testResults:'**/test_reports/*.xml'
  //       }

  //       success {                   
  //           echo "Flask Application Up and running!!"
  //       }

  //       failure {
  //           echo 'Build stage failed'
  //           error('Stopping early…')
  //       }
  //   }
}
