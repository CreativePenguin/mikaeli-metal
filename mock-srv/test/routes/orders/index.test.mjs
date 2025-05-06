import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper.js'

test('orders route', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/orders'
  })
  console.log('hello from tap');
  assert.deepStrictEqual(JSON.parse(res.payload), { orders: true })
});