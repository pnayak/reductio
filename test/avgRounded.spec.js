// Counting tests
describe('Reductio avgRounded', function() {

  var avgRounded = {},
    noAvgRounded = {},
    accAvgRounded = {};

  beforeEach(function() {
    var data = crossfilter([
      { foo: 'one', bar: 1 },
      { foo: 'two', bar: 2 },
      { foo: 'three', bar: 3 },
      { foo: 'one', bar: 4 },
      { foo: 'one', bar: 5 },
      { foo: 'two', bar: 6 },
    ]);

    var dim = data.dimension(function(d) {
      return d.foo;
    });
    var group = dim.group();
    var groupNoAvgRounded = dim.group();
    var groupAccAvgRounded = dim.group();

    var reducer = reductio()
      .avgRounded(true)
      .count(true);

    // This doesn't work because no .sum(accessor) has been defined.
    // The resulting group only tracks counts.
    reducer(groupNoAvgRounded);

    reducer.count(false).sum(false);
    reducer.avgRounded(function(d) {
      return d.bar;
    });

    reducer(groupAccAvgRounded);

    reducer.sum(false);
    reducer.avgRounded(false);

    reducer.sum(function(d) {
        return d.bar;
      })
      .avgRounded(true);

    // Now it should track count, sum, and avg.
    reducer(group);

    avgRounded = group;
    noAvgRounded = groupNoAvgRounded;
    accAvgRounded = groupAccAvgRounded;
  });

  it('has three groups', function(topic) {
    expect(avgRounded.top(Infinity).length).toEqual(3);
  });

  it('grouping have the right rounded averages', function(topic) {
    var values = {};
    avgRounded.top(Infinity).forEach(function(d) {
      values[d.key] = d.value;
    });

    expect(values['one'].avgRounded).toEqual(Math.round(10 / 3));
    expect(values['two'].avgRounded).toEqual(Math.round(8 / 2));
    expect(values['three'].avgRounded).toEqual(Math.round(3 / 1));
  });

  it('grouping with .avgRounded() but no .sum() doesn\'t work', function(topic) {
    var values = {};
    noAvgRounded.top(Infinity).forEach(function(d) {
      values[d.key] = d.value;
    });

    // It has a count, as defined.
    expect(values['one'].count).toEqual(3);

    // But no sum.
    expect(values['one'].sum).toBeUndefined();

    // And no avg.
    expect(values['one'].avgRounded).toBeUndefined();

    // Also throws an error on the console, but that's more difficult to test.
  });

  it('grouping with .avgRounded(accessor) works', function(topic) {
    var values = {};
    accAvgRounded.top(Infinity).forEach(function(d) {
      values[d.key] = d.value;
    });

    expect(values['one'].avgRounded).toEqual(Math.round(10 / 3));
    expect(values['two'].avgRounded).toEqual(Math.round(8 / 2));
    expect(values['three'].avgRounded).toEqual(Math.round(3 / 1));
  });
});
