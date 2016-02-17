// Counting tests
describe('Reductio customjs', function() {
  var group;

  beforeEach(function() {
    var data = crossfilter([{
      foo: 'one'
    }, {
      foo: 'two'
    }, {
      foo: 'three'
    }, {
      foo: 'one'
    }, {
      foo: 'one'
    }, {
      foo: 'two'
    }, ]);

    var dim = data.dimension(function(d) {
      return d.foo;
    });
    group = dim.group();

    var jsCustomInitial = 'path(p).customjs = 0; return p';
    var jsCustomAdd     = 'path(p).customjs++; return p';
    var jsCustomRemove  = 'path(p).customjs--; return p';

    var reducer = reductio()
      .customjs(true, {
        jsCustomAdd: jsCustomAdd,
        jsCustomRemove: jsCustomRemove,
        jsCustomInitial: jsCustomInitial
      });

    reducer(group);
  });

  it('has three groups', function() {
    expect(group.top(Infinity).length).toEqual(3);
  });

  it('grouping have the right customjs', function() {
    var values = {};
    group.top(Infinity).forEach(function(d) {
      values[d.key] = d.value;
    });

    expect(values['one'].customjs).toEqual(3);
    expect(values['two'].customjs).toEqual(2);
    expect(values['three'].customjs).toEqual(1);
  });
});
