pipeline {
    agent any

    environment {
        NEXUS_REGISTRY = '192.168.100.64:8082'
        IMAGE_BACKEND = 'autoshop-backend'
        IMAGE_FRONTEND = 'autoshop-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                sh """
                docker build -t ${NEXUS_REGISTRY}/${IMAGE_BACKEND}:${IMAGE_TAG} ./backend
                docker build -t ${NEXUS_REGISTRY}/${IMAGE_FRONTEND}:${IMAGE_TAG} ./frontend

                docker tag ${NEXUS_REGISTRY}/${IMAGE_BACKEND}:${IMAGE_TAG} ${NEXUS_REGISTRY}/${IMAGE_BACKEND}:latest
                docker tag ${NEXUS_REGISTRY}/${IMAGE_FRONTEND}:${IMAGE_TAG} ${NEXUS_REGISTRY}/${IMAGE_FRONTEND}:latest
                """
            }
        }

        stage('Backend Smoke Test') {
            steps {
                sh """
                docker run --rm ${NEXUS_REGISTRY}/${IMAGE_BACKEND}:${IMAGE_TAG} \
                python -c "import main; print('Backend OK')"
                """
            }
        }

        stage('Push Images to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-docker',
                    usernameVariable: 'NUSER',
                    passwordVariable: 'NPASS'
                )]) {

                    sh """
                    echo \$NPASS | docker login ${NEXUS_REGISTRY} -u \$NUSER --password-stdin

                    docker push ${NEXUS_REGISTRY}/${IMAGE_BACKEND}:${IMAGE_TAG}
                    docker push ${NEXUS_REGISTRY}/${IMAGE_BACKEND}:latest

                    docker push ${NEXUS_REGISTRY}/${IMAGE_FRONTEND}:${IMAGE_TAG}
                    docker push ${NEXUS_REGISTRY}/${IMAGE_FRONTEND}:latest
                    """
                }
            }
        }

        stage('Deploy to 192.168.100.65') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'deploy-ssh-key', keyFileVariable: 'SSH_KEY'),
                    usernamePassword(credentialsId: 'nexus-docker', usernameVariable: 'NUSER', passwordVariable: 'NPASS')
                ]) {

                    sh """
                    ssh -i \$SSH_KEY -o StrictHostKeyChecking=no artorias@192.168.100.65 << EOF

                    echo \$NPASS | docker login ${NEXUS_REGISTRY} -u \$NUSER --password-stdin

                    docker pull ${NEXUS_REGISTRY}/${IMAGE_BACKEND}:latest
                    docker pull ${NEXUS_REGISTRY}/${IMAGE_FRONTEND}:latest

                    cd /home/artorias/Desktop/repos/devops-autoshop

                    docker compose -f docker-compose.prod.yml down || true
                    docker compose -f docker-compose.prod.yml up -d

                    EOF
                    """
                }
            }
        }
    }

    post {
        always {
            sh "docker system prune -f"
        }
    }
}

