/* =============================================================================
 * Date object extension
 */
 
/**
 * Set the date from a string in format YYYY-MM-DD
 */
Date.prototype.fromYMDString = function (yyyy_mm_dd, separator)
{
  if (!separator) {
    separator = '-';
  }
  
  var date_parts = yyyy_mm_dd.split(separator);
  this.setFullYear(date_parts[0], date_parts[1]-1, date_parts[2]);
  return this;
};

/**
 * Return a string with the date in format YYYY-MM-DD
 */
Date.prototype.toYMDString = function (separator)
{
  if (!separator) {
    separator = '-';
  }
  return [this.getFullYear(), this.getMonth() + 1, this.getDate()].join(separator);
}

/**
 * Clone this date object
 */
Date.prototype.clone = function ()
{
  return new Date(this.getTime());
}

/**
 * Increment one day
 */
Date.prototype.nextDay = function ()
{
  this.setDate(this.getDate() + 1);
}

/* =============================================================================
 * Mambo bootstrap
 */
$(document).on('ready', function (e)
{
  // Load stylesheet
  Mambo.Style.load();
  
  // By default mambo state is "normal"
  Mambo.State.setState('normal');
  
  // Attach event handlers  
  $(document).on('mousedown', '.calendar_bar',
    Mambo.events.CalendarBar.mousedown);
  $(document).on('mouseup', '.calendar_bar',
    Mambo.events.CalendarBar.mouseup);
  
  $(document).on('mousedown', '.calendar_bar .day',
    Mambo.events.CalendarBar.Day.mousedown);
  
  $(document).on('dblclick', '.calendar_bar .day',
    Mambo.events.CalendarBar.Day.dblclick);
  
  $(document).on('click',
    Mambo.events.Document.click);
});

/* =============================================================================
 * Mambo global methods and settings
 */
var Mambo = {
  /** Active DaysBar to drag */
  DaysBarActive: null
};

/* =============================================================================
 * Mambo CalendarBar: Represent a calendar bar where to draw DaysBars
 */
Mambo.CalendarBar = function (id_selector)
{
  /** Cache jQuery object */
  var $CalendarBar = $(id_selector);
  
  /** Set dates from HTML data properties */
  var DateStart = new Date().fromYMDString($CalendarBar.data('date-start'));
  var DateEnd   = new Date().fromYMDString($CalendarBar.data('date-end'));;
  
  /** Initialize days bars array */
  var days_bars = [];
  
  /**
   * Set new dates for this calendar bar, you need to call "draw()" to
   * see changes.
   */
  this.setDates = function (NewDateStart, NewDateEnd)
  {
    DateStart = NewDateStart;
    DateEnd   = NewDateEnd;
    return this;
  };
  
  /**
   * Draw the calendar bar, with his days bars.
   */
  this.draw = function ()
  {
    // Clone DateStart into DateCounter to iterate over it.
    var DateCounter = DateStart.clone();
    
    // Crear the calendar bar and add the days
    $CalendarBar.empty();
    for (DateCounter; DateCounter <= DateEnd; DateCounter.nextDay()) {
      // Create Day block and pointer, then append to calendar bar
      $CalendarBar.append($('<div>')
        .addClass('day')
        .attr('data-date', DateCounter.toYMDString())
        .append($('<div>').addClass('pointer'))
      );
    }
    
    // Draw days bars in this calendar bar
    for (var i in days_bars) {
      days_bars[i].draw();
    }
    return this;
  };
  
  /**
   * Set the days bars array, this overwrites all days bars previouly defined.
   */
  this.setDaysBars = function (days_bars_array)
  {
    // Clear de days_bars array
    days_bars = [];
    for(var i in days_bars_array) {
      this.appendDaysBar(days_bars_array[i]);
    }
    return this;
  }
  
  /**
   * Append a new days bar
   */
  this.appendDaysBar = function (DaysBar)
  {
    days_bars.push(DaysBar);
    
    // Populate DaysBar object
    DaysBar.setCalendarBar(this);
    return this;
  }
  
  this.getDaysBar = function (index)
  {
    return days_bars[index];
  }
};

/* =============================================================================
 * Mambo DaysBar: Represent a bar of days with a color
 */
Mambo.DaysBar = function (Settings)
{
  /* Reference to CalendarBar object which owns this DaysBar
   * this reference is attached with $().data() on draw() method to
   * each .day element that represents the entire DaysBar */
  var CalendarBar;
  
  /* ID of this DaysBar object, is attached as HTML data attribute to each .day
   * element that represents the entire DaysBar */
  var id = Math.round(Math.random() * 99999);
  
  /**
   * Paint the days into the asigned CalendarBar
   */
  this.draw = function ()
  {
    var DateCounter = Settings.DateStart.clone();
    
    // un-paint all days with the ID of this days bar, then re-paint the new days
    $('[data-days-bar-id=' + id + ']').css('background-color', '#ccc');
    for(DateCounter; DateCounter <= Settings.DateEnd; DateCounter.nextDay()) {
      $('div[data-date=' + DateCounter.toYMDString() + ']')
        .attr('data-days-bar-id', id)
        .data('CalendarBar', CalendarBar)
        .data('DaysBar', this)
        .css({
          backgroundColor: Settings.color
        });
    }
    return this;
  };
  
  /**
   * Set the index assigned in CalendarBar.appendDaysBar()
   */
  this.setIndex = function (new_index)
  {
    index = new_index;
  }
  
  /**
   * Change the dates that represent this DaysBar, to see changes in DOM you
   * need to call draw() method
   */
  this.setDates = function (NewDateStart, NewDateEnd)
  {
    Settings.DateStart = NewDateStart;
    Settings.DateEnd   = NewDateEnd;
    return this;
  }
  
  /**
   * Set the CalendarBar reference object to this DaysBar
   */
  this.setCalendarBar = function (NewCalendarBar)
  {
    CalendarBar = NewCalendarBar;
    return this;
  };
};

/* =============================================================================
 * Mambo States: Handle states of selection tools and stuff
 */
Mambo.State = new (function ()
{
  var state = null;
  
  this.setState = function (new_state)
  {
    switch (new_state) {
      case 'normal':
        break;
      default:
        $.error('Mambo.State.setState(): Invalid state "' + new_state + '"');
        break;
    }
    
    state = new_state;
    return this;
  };
  
  this.getState = function ()
  {
    return state;
  };
  
})();

/* =============================================================================
 * Mambo Style: Handle stylesheet
 */
Mambo.Style = new (function ()
{
  var StyleSheet = null;
  /**
   * Load the mambo stylesheet
   */
  this.load = function ()
  {
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets.item(i).href.match(/mambo\-ui\.css$/)) {
        StyleSheet = document.styleSheets[i];
        break;
      }
    }
    
    if (!StyleSheet) {
      $.error('Mambo.Style.load(): Unable to fund mambo-ui.css');
    }
    
    return this;
  };
  
  this.insertRule = function (rule)
  {
    StyleSheet.insertRule(rule, StyleSheet.cssRules.length);
    return this;
  }
  
})();

/* =============================================================================
 * Mambo Events: UI events handlers
 */
Mambo.events = {
  CalendarBar: {
    Day: {
      dblclick: function (e)
      {
        $(this).addClass('active');
      },
      mousedown: function (e)
      {
        Mambo.DaysBarActive = $(this).data().DaysBar;
        console.log(Mambo.DaysBarActive);
      },
    }, /* end of CalendarBar.Day */
    
    mousedown: function (e)
    {
      console.log('calendar_bar.mousedown');
    },
    
    mouseup: function (e)
    {
      Mambo.DaysBarActive = null;
      console.log(Mambo.DaysBarActive);
    }
  }, /* end of CalendarBar */
  
  Document: {
    click: function (e)
    {
      $('.calendar_bar .day.active').removeClass('active');
    }
  }
};
