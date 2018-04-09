#!/usr/bin/env node

const aperture = require('aperture')()
const logUpdate = require('log-update')
const hhmmss = require('hh-mm-ss')
const unload = require('unload')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const formatTime = ms => {
  const formatted = hhmmss.fromMs(ms)
  return formatted
}
async function run() {
  const options = {
    fps: 30,
  }
  logUpdate('Wating to record')
  await aperture.startRecording(options)
  const startedAt = Date.now()
  logUpdate('Recording, press enter to stop')
  const recordingTime = setInterval(() => logUpdate(`Recording ${formatTime(Date.now() - startedAt)}`), 100)
  const endRecording = async () => {
    clearInterval(recordingTime)
    logUpdate(`Recorded ${formatTime(Date.now() - startedAt)}`)
    logUpdate.done()
    const path = await aperture.stopRecording()
    console.log('Recording saved to', path)
    rl.close()
  }
  const stopListenForTerminate = unload.add(async () => {
    await endRecording()
  })
  rl.on('line', async input => {
    stopListenForTerminate()
    await endRecording()
  })
}

run()
  .then(() => console.log('Done'))
  .catch(error => console.error('Error recording', error))
