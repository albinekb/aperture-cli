#!/usr/bin/env node
const aperture = require('aperture')()
const logUpdate = require('log-update')
const hhmmss = require('hh-mm-ss')
const unload = require('unload')

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
  logUpdate('Recording')
  const recordingTime = setInterval(() => logUpdate(`Recording ${formatTime(Date.now() - startedAt)}`), 100)
  unload.add(async () => {
    clearInterval(recordingTime)
    logUpdate.done()
    const path = await aperture.stopRecording()
    console.log('Recording saved to', path)
  })
}

run()
  .then(() => console.log('Done'))
  .catch(error => console.error('Error recording', error))
