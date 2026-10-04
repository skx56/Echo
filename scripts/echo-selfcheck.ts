import { EchoSession } from '../lib/echo/session'

async function main() {
  const session = new EchoSession()
  await session.runBench()
  const snap = session.getSnapshot()
  let failed = 0
  for (const row of snap.bench ?? []) {
    console.log(row.pass ? 'PASS' : 'FAIL', row.title)
    if (!row.pass) {
      failed += 1
      for (const check of row.checks) {
        console.log('   ', check.pass ? 'ok' : 'NO', check.name, '—', check.detail)
      }
    }
  }
  console.log('ttfa', snap.benchTtfa)
  console.log('barge', snap.benchBargeMs)
  for (const turn of snap.turns) {
    console.log('---', turn.cancelled ? 'CANCEL' : 'ok', turn.user)
    console.log(turn.agent)
    console.log(turn.tools.map((tool) => `${tool.name} ${tool.args}`).join(' | '))
  }
  if (failed) process.exit(1)
}

main()
