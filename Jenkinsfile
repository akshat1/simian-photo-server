#!groovy

node('node') {
  currentBuild.result = 'SUCCESS'
  try {
    stage 'Checkout'
      echo '::: Checkout :::'
      checkout scm

    stage 'Setup'
      echo '::: Setup :::'
      sh 'node -v'
      sh 'npm -v'
      sh 'npm prune'
      sh 'npm install'

    stage 'Build'
      echo '::: Build :::'
      sh 'npm run clean-build'

    stage 'Test'
      env.NODE_ENV = 'test'
      print 'Environment will be : ${env.NODE_ENV}'

      echo '::: Lint :::'
      sh 'npm lint'
      echo '::: Test :::'
      sh 'npm test'

    stage 'Cleanup'
      echo 'prune and cleanup'
      sh 'npm prune'
      sh 'rm node_modules -rf'
  } catch(err) {
    currentBuild.result = 'FAILURE'
    throw err
  }
}
