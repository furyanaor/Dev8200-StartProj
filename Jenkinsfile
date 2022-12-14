pipeline {
  agent any
  stages {
    stage ('Build') {
      steps {
            echo 'Building repo on Jenkins Virtual-Server, tag & push to DockerHub'
            
            // Docker-compose down if is already up on Jenkins Virtual-Server
            sh 'if sudo docker ps | grep dev8200; then docker-compose -f /var/lib/jenkins/workspace/Dev8200-StarterProj-Pip/docker-compose.yml down; fi'
            // Compose up, tag & push to DockerHub
            sh 'docker-compose -f /var/lib/jenkins/workspace/Dev8200-StarterProj-Pip/docker-compose.yml up --build -d'
            sh 'docker tag dev8200-starterproj-pip_web furyanaor/dev8200-startproj_web'
            sh 'docker push furyanaor/dev8200-startproj_web'
      }
    }

    stage('Deploy-A') {
      steps {
        echo "Deploying the application on Testing Virtual-Server"
        
        // Docker-compuse down on Testion Virtual-Server
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@52.90.177.233 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml down'"
        // Clon docker-compose&testing file from GitHub (its just clone all the repo)
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@52.90.177.233 'sudo rm -rf ~/testingfile'"
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@52.90.177.233 'sudo git clone https://github.com/furyanaor/Dev8200-StartProj.git ~/testingfile'"
        // Clear old docker images and stop continer if running
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@52.90.177.233 'if sudo docker ps | grep dev8200-startproj_web.name.latest; then sudo docker stop dev8200-startproj_web.name.latest; fi'"
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@52.90.177.233 'if sudo docker images | grep dev8200; then sudo docker image rm -f furyanaor/dev8200-startproj_web:latest; fi'"
        // Docker-compose up on Production Virtual Server
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@52.90.177.233 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml up --build -d'"
      }
    }

    stage('Test') {
      steps {  
        echo "curl the Testing Virtual-Server"
        sleep 2 // Seconds
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@52.90.177.233 'sudo bash ~/testingfile/DC4Servers/testmydocker.sh'"
      }
    }

    stage('Deploy-B') {
      steps {
        echo "Deploying the application on Production's Virtual-Servers (AWS & Digital Ocean)"
        
        // Docker-compuse down on Production Virtual-Server
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@3.94.80.176 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml down'"
        // Clon docker-compose file from GitHub (its just clone all the repo)
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@3.94.80.176 'sudo rm -rf ~/testingfile'"
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@3.94.80.176 'sudo git clone https://github.com/furyanaor/Dev8200-StartProj.git ~/testingfile'"
        // Clear old docker images and stop continer if running
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@3.94.80.176 'if sudo docker ps | grep dev8200-startproj_web.name.latest; then sudo docker stop dev8200-startproj_web.name.latest; fi'"
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@3.94.80.176 'if sudo docker images | grep dev8200; then sudo docker image rm -f furyanaor/dev8200-startproj_web:latest; fi'"
        // Docker-compose up on Production Virtual Server
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem ec2-user@3.94.80.176 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml up --build -d'"
        
        // *Same on DigitalOcean Machine:
        // Docker-compuse down on Production Virtual-Server
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem root@157.230.180.96 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml down'"
        // Clon docker-compose file from github (its just clone all the repo)
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem root@157.230.180.96 'sudo rm -rf ~/testingfile'"
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem root@157.230.180.96 'sudo git clone https://github.com/furyanaor/Dev8200-StartProj.git ~/testingfile'"
        // Clear old docker images and stop continer if running
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem root@157.230.180.96 'if sudo docker ps | grep dev8200-startproj_web.name.latest; then sudo docker stop dev8200-startproj_web.name.latest; fi'"
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem root@157.230.180.96 'if sudo docker images | grep dev8200; then sudo docker image rm -f furyanaor/dev8200-startproj_web:latest; fi'"
        // Docker-compose up on Production Virtual Server
        sh "sudo ssh -i /home/ec2-user/.ssh/DEV8200.pem root@157.230.180.96 'docker-compose -f ~/testingfile/DC4Servers/docker-compose.yml up --build -d'"
      }
    }
  }
}
