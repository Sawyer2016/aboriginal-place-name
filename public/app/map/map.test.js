describe('Map', function () {

  beforeEach(module('app'))

  let MapCtrl, scope

  beforeEach(inject(($controller, $rootScope) => {
    scope = $rootScope.$new()
    MapCtrl = $controller('MapCtrl', { $scope: scope })
  }))

  it('Example', function () {
    (123).should.equal(123)
  })
})