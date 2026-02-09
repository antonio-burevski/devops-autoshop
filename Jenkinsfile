pipeline {
    agent any

    environment {
        NEXUS_REGISTRY = "192.168.100.67:8082"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        NEXUS_CREDS    = credentials('nexus-creds')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                sh "docker build -t ${NEXUS_REGISTRY}/autoshop-backend:${IMAGE_TAG} -t ${NEXUS_REGISTRY}/autoshop-backend:latest ./backend"
            }
        }

        stage('Build Frontend') {
            steps {
                sh "docker build -t ${NEXUS_REGISTRY}/autoshop-frontend:${IMAGE_TAG} -t ${NEXUS_REGISTRY}/autoshop-frontend:latest ./frontend"
            }
        }

        stage('Push to Nexus') {
            steps {
                sh "echo ${NEXUS_CREDS_PSW} | docker login ${NEXUS_REGISTRY} -u ${NEXUS_CREDS_USR} --password-stdin"
                sh "docker push ${NEXUS_REGISTRY}/autoshop-backend:${IMAGE_TAG}"
                sh "docker push ${NEXUS_REGISTRY}/autoshop-backend:latest"
                sh "docker push ${NEXUS_REGISTRY}/autoshop-frontend:${IMAGE_TAG}"
                sh "docker push ${NEXUS_REGISTRY}/autoshop-frontend:latest"
                sh "docker logout ${NEXUS_REGISTRY}"
            }
        }
    }

    post {
        always {
            sh "docker rmi ${NEXUS_REGISTRY}/autoshop-backend:${IMAGE_TAG} || true"
            sh "docker rmi ${NEXUS_REGISTRY}/autoshop-frontend:${IMAGE_TAG} || true"
        }
    }
}
