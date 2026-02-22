pipeline {
    agent any

    environment {
        NEXUS_REGISTRY = "192.168.100.67:8082"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        NEXUS_CREDS    = credentials('nexus-creds')
        DEPLOY_HOST    = "192.168.100.65"
        DEPLOY_USER    = "artorias"
        DEPLOY_DIR     = "/home/artorias/Desktop/repos/devops-autoshop"
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

        stage('Deploy to Inactive Environment') {
            steps {
                sshagent(credentials: ['deploy-ssh-creds']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                            cd ${DEPLOY_DIR}
                            git pull origin main
                            bash scripts/deploy.sh
                        '
                    """
                }
            }
        }
    }

    post {
        failure {
            sshagent(credentials: ['deploy-ssh-creds']) {
                sh """
                    ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                        cd ${DEPLOY_DIR}
                        NGINX_CONF=${DEPLOY_DIR}/nginx/nginx.conf
                        if grep -q "frontend-blue" \$NGINX_CONF; then
                            echo "Current active: blue (deploy failed on green)"
                        else
                            echo "Current active: green (deploy failed on blue)"
                        fi
                        echo "No rollback needed - traffic was not switched."
                    '
                """ + " || true"
            }
        }
        always {
            sh "docker rmi ${NEXUS_REGISTRY}/autoshop-backend:${IMAGE_TAG} || true"
            sh "docker rmi ${NEXUS_REGISTRY}/autoshop-frontend:${IMAGE_TAG} || true"
        }
    }
}
