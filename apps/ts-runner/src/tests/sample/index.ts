/* global describe, it */
import { expect } from 'chai'

import { runner } from '../../index'

describe('Sample', function () {
  it('Should return list of tasks', async function () {
    const list = runner.getTaskList()

    expect(list.length).to.equal(2)
  })
})
