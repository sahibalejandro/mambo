$(document).on('ready', function (e)
{
  var CalendarBar = new Mambo.CalendarBar('#calendar_bar');
  
  CalendarBar.addDaysBars([
    new Mambo.DaysBar({
      color: '#0f0',
      DateStart: new Date().fromYMDString('2012-10-01'),
      DateEnd: new Date().fromYMDString('2012-10-05')
    }),
    new Mambo.DaysBar({
      color: '#0ff',
      DateStart: new Date().fromYMDString('2012-10-06'),
      DateEnd: new Date().fromYMDString('2012-10-10')
    }),
    new Mambo.DaysBar({
      color: '#f0f',
      DateStart: new Date().fromYMDString('2012-10-11'),
      DateEnd: new Date().fromYMDString('2012-10-21')
    })
  ]);
  
  CalendarBar.draw();
});
