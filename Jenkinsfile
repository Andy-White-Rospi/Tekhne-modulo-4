pipeline {
    agent any

    environment {
        CI = 'true'
    }

    tools {
        nodejs 'node18'
    }

    triggers {
        //githubPush()
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright tests') {
            steps {
                //bat 'npx playwright test //CORREO TODOS LOS TESTS
                bat 'npx playwright test --project=web-chromium --project=api'
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])

            allure includeProperties: false,
                   jdk: '',
                   resultPolicy: 'LEAVE_AS_IS',
                   results: [[path: 'allure-results']]

            archiveArtifacts artifacts: 'playwright-report/**, allure-results/**', allowEmptyArchive: true
        }
    }
}