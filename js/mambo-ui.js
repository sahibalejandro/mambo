/* =============================================================================
 * Date object extension
 */
Date.prototype.fromYMDString = function (yyyy_mm_dd, separator)
{
  if (separator == undefined) {
    separator = '-';
  }
  
  var date_parts = yyyy_mm_dd.split(separator);
  this.setFullYear(date_parts[0], date_parts[1]-1, date_parts[2]);
  return this;
};

/* =============================================================================
 * Mambo namespace and settings
 */
var Mambo = {
  Settings: {
    day_width: 30,
    day_height: 20
  }
};

/* =============================================================================
 * Object that represents a calendar bar
 */
Mambo.CalendarBar = function (id_selector)
{
  /** Cache jQuery object */
  var $CalendarBar = $(id_selector);
  
  /** Set dates from HTML data properties */
  var DateStart = new Date().fromYMDString($CalendarBar.data('date-start'));
  var DateEnd   = new Date().fromYMDString($CalendarBar.data('date-end'));;
  
  var days_bars = [];
  
  /**
   * Set new dates for this calendar bar, you need to call "draw()" to
   * see changes.
   */
  this.setDates = function (NewDateStart, NewDateEnd)
  {
    DateStart = NewDateStart;
    DateEnd   = NewDateEnd;
  };
  
  /**
   * Draw the calendar bar, with his days bars.
   */
  this.draw = function ()
  {
    // Crear the calendar bar and add the days
    $CalendarBar.empty();
    for (var i = DateStart.getDate(); i <= DateEnd.getDate(); i++) {
      $CalendarBar.append(
        $('<div>').addClass('day').css({
          display: 'inline-block',
          width: Mambo.Settings.day_width + 'px',
          height: Mambo.Settings.day_height + 'px'
        })
      );
    }
    
    // Dray days bars in this calendar bar
    for (i in days_bars) {
      days_bars[i].draw();
    }
  };
  
  this.addDaysBars = function (days_bars_array)
  {
    days_bars = days_bars_array;
  }
  
  this.appendDaysBar = function (DaysBar)
  {
    days_bars.push(DaysBar);
  }
};

/* =============================================================================
 * Days bar object
 */
Mambo.DaysBar = function (Settings)
{
  this.draw = function ()
  {
    console.log('draw ', Settings.DateStart, Settings.DateEnd, Settings.color);
  }
};
