$(function() {
  // single/double click event
  var clicker = $('button[data-clicker]').asEventStream('click')
                                         .bufferWithTime(300)
                                         .map(function(n) { return n.length; });

  clicker.onValue(function(n) {
    var note = (n >= 2) ? 'double click' : 'single click';
    $('span[data-clicker]').text(note)
                           .fadeIn('fast')
                           .delay(500)
                           .fadeOut('slow');
  });

  // ----------------------

  // double-only click event
  var dClicker = $('button[data-clicker2]').asEventStream('click')
                                           .bufferWithTimeOrCount(500, 2)
                                           .filter(function(n) { return n.length >= 2; });

  dClicker.onValue(function() {
     $('span[data-clicker2]').text('double clicked!')
                             .fadeIn('fast')
                             .delay(500)
                             .fadeOut('slow');
  });

  // ----------------------

  // plus/minus event streams
  var plus = $('button[data-plus]').asEventStream('click')
                                   .map(1);

  var minus = $('button[data-minus]').asEventStream('click')
                                     .map(-1);

  // merged plus/minus event streams
  var both = plus.merge(minus);

  // property
  var counter = both.scan(0, function(accum, value) { return accum + value; });

  // shenanigans
  counter.map(function(n) {
    if (n == 5) { return 'ahahahaha'; } else { return n; }
  }).onValue(function(n) {
    $('input[name="value"]').val(n);
  });

  // 1. this is equivalent:
  // counter.assign($('input[name="value"]'), 'val')

  // 2. to this:
  //counter.onValue(function(value) {
  //  $('input[name="value"]').val(value);
  //});

  // ----------------------

  $('[data-one],[data-two]').asEventStream('click').onValue(function(thing) {
    console.log('clicked', thing.target.tagName.toLowerCase());
  })
});