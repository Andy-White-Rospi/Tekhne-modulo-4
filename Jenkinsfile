pipeline {
    agent any

    tools {
        nodejs 'node18'  
    }

    triggers {
    //    githubPush()  // dispara el build cuando llega un push (requiere webhook configurado)
    pollSCM('H/2 * * * *')  // revisa cada 2 minutos si hubo cambios
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Publica el reporte HTML de Playwright
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}