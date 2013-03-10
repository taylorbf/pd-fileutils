var assert = require('assert')
  , Patch = require('../lib/Patch')

describe('Patch', function() {

  describe('#getNode', function() {

    it('should return the right object if existing', function() {
      var patch = new Patch({
        nodes: [ {id: 78, attr1: 90}, {id: 56, attr1: 88}, {id: 2, attr1: 5} ]
      })
      assert.deepEqual(patch.getNode(56), {id: 56, attr1: 88})
      assert.deepEqual(patch.getNode(2), {id: 2, attr1: 5})
    })

    it('should return null if object unknown', function() {
      var patch = new Patch({
        nodes: [ {id: 78, attr1: 90}, {id: 56, attr1: 88}, {id: 2, attr1: 5} ],
      })
      assert.equal(patch.getNode(57), null)
    })

  })

  describe('#guessPortlets', function() {
    
    it('should guess the portlets right', function() {
      var patch = new Patch({
        nodes: [ {id: 78, attr1: 90}, {id: 56, attr1: 88}, {id: 2, attr1: 5}, {id: 32, attr1: 9} ],
        connections: [
          {source: {id: 78, port: 2}, sink: {id: 56, port: 1}},
          {source: {id: 78, port: 1}, sink: {id: 2, port: 0}}
        ]
      })
      patch.guessPortlets()
      assert.deepEqual(patch.nodes, [
        {id: 78, attr1: 90, inlets: 0, outlets: 3},
        {id: 56, attr1: 88, inlets: 2, outlets: 0},
        {id: 2, attr1: 5, inlets: 1, outlets: 0},
        {id: 32, attr1: 9, inlets: 0, outlets: 0}
      ])
    })

  })

  describe('#getSinks', function() {
    
    it('should get the sinks rightly', function() {
      var patch = new Patch({
        nodes: [ {id: 78, attr1: 90}, {id: 56, attr1: 88}, {id: 2, attr1: 5}, {id: 32, attr1: 9} ],
        connections: [
          {source: {id: 78, port: 2}, sink: {id: 56, port: 1}},
          {source: {id: 78, port: 2}, sink: {id: 56, port: 0}},
          {source: {id: 78, port: 1}, sink: {id: 2, port: 0}},
          {source: {id: 32, port: 0}, sink: {id: 78, port: 1}}
        ]
      })

      debugger;
      var sinks = patch.getSinks({id: 78})
      assert.equal(sinks.length, 2)
      assert.deepEqual(sinks[0], {id: 56, attr1: 88})
      assert.deepEqual(sinks[1], {id: 2, attr1: 5})

      var sinks = patch.getSinks({id: 2})
      assert.equal(sinks.length, 0)
    })
    
  })

  describe('#getSources', function() {

    it('should get the sources rightly', function() {
      var patch = new Patch({
        nodes: [ {id: 78, attr1: 90}, {id: 56, attr1: 88}, {id: 2, attr1: 5}, {id: 32, attr1: 9} ],
        connections: [
          {source: {id: 78, port: 2}, sink: {id: 56, port: 1}},
          {source: {id: 56, port: 1}, sink: {id: 2, port: 0}},
          {source: {id: 56, port: 0}, sink: {id: 2, port: 1}},
          {source: {id: 32, port: 0}, sink: {id: 2, port: 1}}
        ]
      })

      var sources = patch.getSources({id: 2})
      assert.equal(sources.length, 2)
      assert.deepEqual(sources[0], {id: 56, attr1: 88})
      assert.deepEqual(sources[1], {id: 32, attr1: 9})

      var sources = patch.getSources({id: 78})
      assert.equal(sources.length, 0)
    })

  })

})
